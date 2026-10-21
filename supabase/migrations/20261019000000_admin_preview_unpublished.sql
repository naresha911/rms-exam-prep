-- Admin preview: allow admins to read/attempt unpublished tests and papers.

CREATE OR REPLACE FUNCTION public.get_test_session_questions(p_test_id uuid)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1 from tests where id = p_test_id and (is_published = true or public.is_admin())
  ) then
    raise exception 'Test not found or not published';
  end if;

  select jsonb_build_object(
    'test', to_jsonb(t.*),
    'questions', coalesce((
      select jsonb_agg(q_row order by (q_row->>'question_order')::int)
      from (
        select jsonb_build_object(
          'question_id', tq.question_id,
          'section', ts.name,
          'question_order', tq.question_order,
          'marks', coalesce(tq.marks, q.marks, 1),
          'negative_marks', coalesce(tq.negative_marks, q.negative_marks, 0),
          'question_type', q.question_type,
          'has_diagram', q.has_diagram,
          'diagram_path', q.diagram_path,
          'translations', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'language_code', qt.language_code,
              'question_text', qt.question_text,
              'explanation', qt.explanation
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
                'is_correct', qo.is_correct,
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
        from test_questions tq
        join questions q on q.id = tq.question_id
        left join test_sections ts on ts.id = tq.section_id
        where tq.test_id = p_test_id
          and q.is_active = true
        order by tq.question_order nulls last
      ) sub
    ), '[]'::jsonb)
  )
  into v_result
  from tests t
  where t.id = p_test_id;

  return v_result;
end;
$function$;




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
    select 1 from papers where id = p_paper_id and (is_published = true or public.is_admin())
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
    select 1 from papers where id = p_paper_id and (is_published = true or public.is_admin())
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
        and (p.is_published = true or public.is_admin())
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

