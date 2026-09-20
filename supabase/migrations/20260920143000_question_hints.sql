-- Localized hint on each question translation, plus hint/solution fields
-- on session RPCs so practice, mocks, and papers can show help after answering.

ALTER TABLE public.question_translations
  ADD COLUMN IF NOT EXISTS hint text;

COMMENT ON COLUMN public.question_translations.hint IS
  'Optional localized hint shown before the student answers. Solution remains explanation.';

CREATE OR REPLACE FUNCTION public.get_paper_session_questions (
  p_paper_id uuid
)
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
              'question_text', qt.question_text,
              'hint', qt.hint,
              'explanation', qt.explanation,
              'explanation_diagram_path', qt.explanation_diagram_path
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
$function$;

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
              'hint', qt.hint,
              'explanation', qt.explanation,
              'explanation_diagram_path', qt.explanation_diagram_path
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
