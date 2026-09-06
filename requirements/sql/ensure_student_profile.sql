-- ============================================================
-- Ensure student profile exists for authenticated users
-- Paste into Supabase SQL Editor (safe to re-run).
-- Fixes: paper_attempts_student_id_fkey (auth user missing from profiles)
-- ============================================================

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

-- Harden start_paper_attempt to create the profile before insert
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

-- Optional: auto-create profile on every new auth user
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    'student',
    nullif(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- Backfill existing auth users missing a profile
insert into public.profiles (id, role, full_name)
select
  u.id,
  'student',
  nullif(u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
