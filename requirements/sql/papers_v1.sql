-- ============================================================
-- Papers v1 — incremental schema for existing Supabase projects
-- Paste into Supabase SQL Editor and run once.
-- Safe to re-run where possible (IF NOT EXISTS / DROP IF EXISTS).
-- ============================================================

-- 1. papers.difficulty
alter table papers
  add column if not exists difficulty difficulty;

-- 2. Unique constraint on existing attempt_answers
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'attempt_answers_attempt_id_question_id_key'
  ) then
    -- Deduplicate keeping newest row if any duplicates exist
    delete from attempt_answers a
    using attempt_answers b
    where a.attempt_id = b.attempt_id
      and a.question_id = b.question_id
      and a.id < b.id;

    alter table attempt_answers
      add constraint attempt_answers_attempt_id_question_id_key
      unique (attempt_id, question_id);
  end if;
end $$;

-- 3. paper_attempts
create table if not exists paper_attempts (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references papers(id) on delete cascade,
  student_id uuid not null references profiles(id),
  attempt_number int default 1,
  started_at timestamptz default now(),
  submitted_at timestamptz,
  time_spent_seconds int,
  is_paused boolean default false,
  pause_data jsonb,
  total_score numeric(6,1),
  max_score numeric(6,1),
  status text check (status in ('in_progress', 'submitted', 'abandoned')) default 'in_progress'
);

create unique index if not exists paper_attempts_one_in_progress
  on paper_attempts (paper_id, student_id)
  where status = 'in_progress';

create index if not exists idx_paper_attempts_student on paper_attempts(student_id);
create index if not exists idx_paper_attempts_paper_student on paper_attempts(paper_id, student_id);
create index if not exists idx_paper_attempts_status on paper_attempts(status);

-- 4. paper_attempt_answers
create table if not exists paper_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references paper_attempts(id) on delete cascade,
  question_id uuid not null references questions(id),
  review_status review_status default 'not_visited',
  selected_options text[],
  text_answer text,
  matching_answer jsonb,
  is_correct boolean,
  marks_awarded numeric(4,1),
  time_spent_seconds int,
  updated_at timestamptz default now(),
  unique (attempt_id, question_id)
);

create index if not exists idx_paper_attempt_answers_attempt
  on paper_attempt_answers(attempt_id);

-- 5. Section stats view
create or replace view paper_section_stats as
select
  pq.paper_id,
  coalesce(pq.section, 'General') as section,
  count(*)::int as question_count,
  coalesce(sum(coalesce(pq.marks, q.marks, 1)), 0) as section_marks
from paper_questions pq
join questions q on q.id = pq.question_id
group by pq.paper_id, coalesce(pq.section, 'General');

-- ============================================================
-- 6. RLS
-- ============================================================
alter table papers enable row level security;
alter table paper_questions enable row level security;
alter table paper_attempts enable row level security;
alter table paper_attempt_answers enable row level security;

drop policy if exists papers_select_published on papers;
create policy papers_select_published on papers
  for select to authenticated
  using (is_published = true);

drop policy if exists paper_questions_select_published on paper_questions;
create policy paper_questions_select_published on paper_questions
  for select to authenticated
  using (
    exists (
      select 1 from papers p
      where p.id = paper_questions.paper_id
        and p.is_published = true
    )
  );

drop policy if exists paper_attempts_select_own on paper_attempts;
create policy paper_attempts_select_own on paper_attempts
  for select to authenticated
  using (student_id = auth.uid());

drop policy if exists paper_attempts_insert_own on paper_attempts;
create policy paper_attempts_insert_own on paper_attempts
  for insert to authenticated
  with check (student_id = auth.uid());

drop policy if exists paper_attempts_update_own on paper_attempts;
create policy paper_attempts_update_own on paper_attempts
  for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

drop policy if exists paper_attempt_answers_select_own on paper_attempt_answers;
create policy paper_attempt_answers_select_own on paper_attempt_answers
  for select to authenticated
  using (
    exists (
      select 1 from paper_attempts a
      where a.id = paper_attempt_answers.attempt_id
        and a.student_id = auth.uid()
    )
  );

drop policy if exists paper_attempt_answers_insert_own on paper_attempt_answers;
create policy paper_attempt_answers_insert_own on paper_attempt_answers
  for insert to authenticated
  with check (
    exists (
      select 1 from paper_attempts a
      where a.id = paper_attempt_answers.attempt_id
        and a.student_id = auth.uid()
        and a.status = 'in_progress'
    )
  );

drop policy if exists paper_attempt_answers_update_own on paper_attempt_answers;
create policy paper_attempt_answers_update_own on paper_attempt_answers
  for update to authenticated
  using (
    exists (
      select 1 from paper_attempts a
      where a.id = paper_attempt_answers.attempt_id
        and a.student_id = auth.uid()
        and a.status = 'in_progress'
    )
  )
  with check (
    exists (
      select 1 from paper_attempts a
      where a.id = paper_attempt_answers.attempt_id
        and a.student_id = auth.uid()
        and a.status = 'in_progress'
    )
  );

-- Students must not read correctness via direct option queries during sessions.
-- Prefer get_paper_session_questions RPC. Keep option RLS restrictive if enabled elsewhere.

-- ============================================================
-- 7. Storage — private past-paper-pdfs bucket policies
-- ============================================================
-- Create bucket in Dashboard if missing: name=past-paper-pdfs, public=false
insert into storage.buckets (id, name, public)
values ('past-paper-pdfs', 'past-paper-pdfs', false)
on conflict (id) do update set public = false;

drop policy if exists past_paper_pdfs_select_authenticated on storage.objects;
create policy past_paper_pdfs_select_authenticated on storage.objects
  for select to authenticated
  using (
    bucket_id = 'past-paper-pdfs'
    and exists (
      select 1 from papers p
      where p.is_published = true
        and (
          p.pdf_path = name
          or p.pdf_path = ('past-paper-pdfs/' || name)
          or p.pdf_path like ('%' || name)
        )
    )
  );

-- No direct insert/update/delete for students (admins use service role / dashboard)

-- ============================================================
-- 8. RPCs
-- ============================================================

-- Session questions WITHOUT is_correct / explanations until submit
create or replace function get_paper_session_questions(p_paper_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1 from papers where id = p_paper_id and is_published = true
  ) then
    raise exception 'Paper not found or not published';
  end if;

  select jsonb_build_object(
    'paper', to_jsonb(p.*) - 'pdf_path',
    'questions', coalesce((
      select jsonb_agg(q_row order by q_row->>'question_order')
      from (
        select jsonb_build_object(
          'question_id', pq.question_id,
          'section', pq.section,
          'question_order', pq.question_order,
          'marks', coalesce(pq.marks, q.marks, 1),
          'negative_marks', coalesce(pq.negative_marks, q.negative_marks, 0),
          'question_type', q.question_type,
          'has_diagram', q.has_diagram,
          'diagram_path', q.diagram_path,
          'translations', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'language_code', qt.language_code,
              'question_text', qt.question_text
            )), '[]'::jsonb)
            from question_translations qt
            where qt.question_id = q.id
          ),
          'options', (
            select coalesce(jsonb_agg(
              jsonb_build_object(
                'id', qo.id,
                'option_key', qo.option_key,
                'display_order', qo.display_order,
                'translations', (
                  select coalesce(jsonb_agg(jsonb_build_object(
                    'language_code', ot.language_code,
                    'option_text', ot.option_text,
                    'option_image_path', ot.option_image_path
                  )), '[]'::jsonb)
                  from option_translations ot
                  where ot.option_id = qo.id
                )
              )
              order by qo.display_order nulls last, qo.option_key
            ), '[]'::jsonb)
            from question_options qo
            where qo.question_id = q.id
          )
        ) as q_row
        from paper_questions pq
        join questions q on q.id = pq.question_id
        where pq.paper_id = p_paper_id
          and q.is_active = true
        order by pq.question_order nulls last
      ) sub
    ), '[]'::jsonb)
  )
  into v_result
  from papers p
  where p.id = p_paper_id;

  return v_result;
end;
$$;

revoke all on function get_paper_session_questions(uuid) from public;
grant execute on function get_paper_session_questions(uuid) to authenticated;

-- Ensure auth.users always has a matching profiles row (paper_attempts FK).
create or replace function ensure_student_profile()
returns profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row profiles%rowtype;
  v_name text;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_row from profiles where id = v_uid;
  if found then
    return v_row;
  end if;

  select nullif(raw_user_meta_data->>'full_name', '')
  into v_name
  from auth.users
  where id = v_uid;

  insert into profiles (id, role, full_name)
  values (v_uid, 'student', v_name)
  on conflict (id) do update
    set updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function ensure_student_profile() from public;
grant execute on function ensure_student_profile() to authenticated;

-- Start or resume in-progress attempt
create or replace function start_paper_attempt(p_paper_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_existing paper_attempts%rowtype;
  v_next_num int;
  v_created paper_attempts%rowtype;
  v_answers jsonb;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- paper_attempts.student_id references profiles(id)
  perform ensure_student_profile();

  if not exists (
    select 1 from papers where id = p_paper_id and is_published = true
  ) then
    raise exception 'Paper not found or not published';
  end if;

  select * into v_existing
  from paper_attempts
  where paper_id = p_paper_id
    and student_id = v_uid
    and status = 'in_progress'
  limit 1;

  if found then
    select coalesce(jsonb_agg(to_jsonb(a.*) order by a.updated_at), '[]'::jsonb)
    into v_answers
    from paper_attempt_answers a
    where a.attempt_id = v_existing.id;

    return jsonb_build_object(
      'attempt', to_jsonb(v_existing),
      'answers', v_answers,
      'resumed', true
    );
  end if;

  select coalesce(max(attempt_number), 0) + 1
  into v_next_num
  from paper_attempts
  where paper_id = p_paper_id and student_id = v_uid;

  insert into paper_attempts (paper_id, student_id, attempt_number, status)
  values (p_paper_id, v_uid, v_next_num, 'in_progress')
  returning * into v_created;

  return jsonb_build_object(
    'attempt', to_jsonb(v_created),
    'answers', '[]'::jsonb,
    'resumed', false
  );
end;
$$;

revoke all on function start_paper_attempt(uuid) from public;
grant execute on function start_paper_attempt(uuid) to authenticated;

-- Upsert one answer (no scoring)
create or replace function save_paper_answer(
  p_attempt_id uuid,
  p_question_id uuid,
  p_review_status review_status default 'answered',
  p_selected_options text[] default '{}',
  p_text_answer text default null,
  p_matching_answer jsonb default null,
  p_time_spent_seconds int default null,
  p_pause_data jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_attempt paper_attempts%rowtype;
  v_row paper_attempt_answers%rowtype;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_attempt
  from paper_attempts
  where id = p_attempt_id;

  if not found or v_attempt.student_id <> v_uid then
    raise exception 'Attempt not found';
  end if;

  if v_attempt.status <> 'in_progress' then
    raise exception 'Attempt is not in progress';
  end if;

  insert into paper_attempt_answers as paa (
    attempt_id, question_id, review_status, selected_options,
    text_answer, matching_answer, time_spent_seconds, updated_at
  ) values (
    p_attempt_id, p_question_id, p_review_status, coalesce(p_selected_options, '{}'),
    p_text_answer, p_matching_answer, p_time_spent_seconds, now()
  )
  on conflict (attempt_id, question_id) do update set
    review_status = excluded.review_status,
    selected_options = excluded.selected_options,
    text_answer = excluded.text_answer,
    matching_answer = excluded.matching_answer,
    time_spent_seconds = coalesce(excluded.time_spent_seconds, paa.time_spent_seconds),
    updated_at = now()
  returning * into v_row;

  if p_pause_data is not null then
    update paper_attempts
    set pause_data = coalesce(pause_data, '{}'::jsonb) || p_pause_data,
        is_paused = true
    where id = p_attempt_id;
  end if;

  return to_jsonb(v_row);
end;
$$;

revoke all on function save_paper_answer(uuid, uuid, review_status, text[], text, jsonb, int, jsonb) from public;
grant execute on function save_paper_answer(uuid, uuid, review_status, text[], text, jsonb, int, jsonb) to authenticated;

-- Server-side scoring for single-select family
create or replace function submit_paper_attempt(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_attempt paper_attempts%rowtype;
  v_total numeric(6,1) := 0;
  v_max numeric(6,1) := 0;
  v_q record;
  v_selected text[];
  v_correct_keys text[];
  v_is_correct boolean;
  v_marks numeric(4,1);
  v_neg numeric(4,1);
  v_awarded numeric(4,1);
  v_breakdown jsonb := '[]'::jsonb;
  v_answers jsonb;
  v_time int;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_attempt
  from paper_attempts
  where id = p_attempt_id;

  if not found or v_attempt.student_id <> v_uid then
    raise exception 'Attempt not found';
  end if;

  if v_attempt.status = 'submitted' then
    select coalesce(jsonb_agg(to_jsonb(a.*)), '[]'::jsonb)
    into v_answers
    from paper_attempt_answers a
    where a.attempt_id = p_attempt_id;

    return jsonb_build_object(
      'attempt', to_jsonb(v_attempt),
      'answers', v_answers,
      'already_submitted', true
    );
  end if;

  if v_attempt.status <> 'in_progress' then
    raise exception 'Attempt cannot be submitted';
  end if;

  for v_q in
    select
      pq.question_id,
      pq.section,
      pq.question_order,
      coalesce(pq.marks, q.marks, 1) as marks,
      coalesce(pq.negative_marks, q.negative_marks, 0) as negative_marks,
      q.question_type
    from paper_questions pq
    join questions q on q.id = pq.question_id
    where pq.paper_id = v_attempt.paper_id
    order by pq.question_order nulls last
  loop
    v_max := v_max + v_q.marks;
    v_marks := v_q.marks;
    v_neg := v_q.negative_marks;

    select paa.selected_options into v_selected
    from paper_attempt_answers paa
    where paa.attempt_id = p_attempt_id
      and paa.question_id = v_q.question_id;

    if v_selected is null then
      v_selected := '{}';
    end if;

    -- Correct option keys for single-select family
    select coalesce(array_agg(qo.option_key order by qo.option_key), '{}')
    into v_correct_keys
    from question_options qo
    where qo.question_id = v_q.question_id
      and qo.is_correct = true;

    v_is_correct := false;
    v_awarded := 0;

    if cardinality(v_selected) > 0
       and v_q.question_type in ('mcq_single', 'true_false', 'assertion_reason')
    then
      -- selected_options stores option ids; compare via option_key or id
      if exists (
        select 1
        from question_options qo
        where qo.question_id = v_q.question_id
          and qo.is_correct = true
          and (
            qo.id::text = any(v_selected)
            or qo.option_key = any(v_selected)
          )
        )
        and (
          select count(*) from unnest(v_selected) s
        ) = 1
        and (
          select count(*) from question_options qo
          where qo.question_id = v_q.question_id and qo.is_correct = true
        ) = 1
      then
        v_is_correct := true;
        v_awarded := v_marks;
      else
        v_is_correct := false;
        v_awarded := -v_neg;
      end if;
    elsif cardinality(v_selected) = 0 then
      v_is_correct := null;
      v_awarded := 0;
    else
      -- Unsupported / multi types: no marks until implemented
      v_is_correct := false;
      v_awarded := 0;
    end if;

    v_total := v_total + coalesce(v_awarded, 0);

    insert into paper_attempt_answers as paa (
      attempt_id, question_id, review_status, selected_options,
      is_correct, marks_awarded, updated_at
    ) values (
      p_attempt_id, v_q.question_id,
      case when cardinality(v_selected) > 0 then 'answered'::review_status else 'not_answered'::review_status end,
      v_selected, v_is_correct, v_awarded, now()
    )
    on conflict (attempt_id, question_id) do update set
      is_correct = excluded.is_correct,
      marks_awarded = excluded.marks_awarded,
      updated_at = now();

    v_breakdown := v_breakdown || jsonb_build_array(jsonb_build_object(
      'question_id', v_q.question_id,
      'section', v_q.section,
      'question_order', v_q.question_order,
      'is_correct', v_is_correct,
      'marks_awarded', v_awarded,
      'marks', v_marks,
      'negative_marks', v_neg,
      'correct_option_keys', to_jsonb(v_correct_keys)
    ));
  end loop;

  v_time := coalesce(
    (v_attempt.pause_data->>'time_spent_seconds')::int,
    extract(epoch from (now() - v_attempt.started_at))::int
  );

  update paper_attempts
  set
    status = 'submitted',
    submitted_at = now(),
    total_score = v_total,
    max_score = v_max,
    time_spent_seconds = v_time,
    is_paused = false
  where id = p_attempt_id
  returning * into v_attempt;

  select coalesce(jsonb_agg(to_jsonb(a.*)), '[]'::jsonb)
  into v_answers
  from paper_attempt_answers a
  where a.attempt_id = p_attempt_id;

  return jsonb_build_object(
    'attempt', to_jsonb(v_attempt),
    'answers', v_answers,
    'breakdown', v_breakdown,
    'already_submitted', false
  );
end;
$$;

revoke all on function submit_paper_attempt(uuid) from public;
grant execute on function submit_paper_attempt(uuid) to authenticated;

-- Helper: fetch latest attempt summary per paper for current user
create or replace function get_my_paper_attempt_summaries(p_standard_id int default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(t)::jsonb)
    from (
      select distinct on (pa.paper_id)
        pa.paper_id,
        pa.id as attempt_id,
        pa.status,
        pa.total_score,
        pa.max_score,
        pa.attempt_number,
        pa.started_at,
        pa.submitted_at,
        pa.time_spent_seconds,
        pa.is_paused,
        pa.pause_data
      from paper_attempts pa
      join papers p on p.id = pa.paper_id
      where pa.student_id = v_uid
        and p.is_published = true
        and (p_standard_id is null or p.standard_id = p_standard_id)
      order by pa.paper_id,
        case when pa.status = 'in_progress' then 0 else 1 end,
        pa.started_at desc
    ) t
  ), '[]'::jsonb);
end;
$$;

revoke all on function get_my_paper_attempt_summaries(int) from public;
grant execute on function get_my_paper_attempt_summaries(int) to authenticated;
