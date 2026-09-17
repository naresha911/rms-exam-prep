-- Student-facing access for published full mock tests.
-- Mirrors papers_select_published so the catalogue and exam session work for cadets.

CREATE POLICY "tests_select_published" ON "public"."tests"
  FOR SELECT
  TO "authenticated"
  USING (is_published = true);

CREATE POLICY "test_sections_select_published" ON "public"."test_sections"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS (
    SELECT 1 FROM public.tests t
    WHERE t.id = test_sections.test_id AND t.is_published = true
  )));

CREATE POLICY "test_questions_select_published" ON "public"."test_questions"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS (
    SELECT 1 FROM public.tests t
    WHERE t.id = test_questions.test_id AND t.is_published = true
  )));

CREATE POLICY "test_attempts_select_own" ON "public"."test_attempts"
  FOR SELECT
  TO "authenticated"
  USING (student_id = auth.uid());

CREATE POLICY "test_attempts_insert_own" ON "public"."test_attempts"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "test_attempts_update_own" ON "public"."test_attempts"
  FOR UPDATE
  TO "authenticated"
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "attempt_answers_select_own" ON "public"."attempt_answers"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS (
    SELECT 1 FROM public.test_attempts a
    WHERE a.id = attempt_answers.attempt_id AND a.student_id = auth.uid()
  )));

CREATE POLICY "attempt_answers_insert_own" ON "public"."attempt_answers"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((EXISTS (
    SELECT 1 FROM public.test_attempts a
    WHERE a.id = attempt_answers.attempt_id
      AND a.student_id = auth.uid()
      AND a.status = 'in_progress'
  )));

CREATE POLICY "attempt_answers_update_own" ON "public"."attempt_answers"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS (
    SELECT 1 FROM public.test_attempts a
    WHERE a.id = attempt_answers.attempt_id
      AND a.student_id = auth.uid()
      AND a.status = 'in_progress'
  )))
  WITH CHECK ((EXISTS (
    SELECT 1 FROM public.test_attempts a
    WHERE a.id = attempt_answers.attempt_id
      AND a.student_id = auth.uid()
      AND a.status = 'in_progress'
  )));

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
    select 1 from tests where id = p_test_id and is_published = true
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

REVOKE ALL ON FUNCTION public.get_test_session_questions(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_test_session_questions(uuid) TO authenticated, postgres;
