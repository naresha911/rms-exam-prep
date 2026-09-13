SET local check_function_bodies = off;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO PUBLIC;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "anon";

COMMENT ON SCHEMA "public" IS NULL;

CREATE SEQUENCE "public"."standards_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."streams_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."subjects_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."topics_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE TABLE "public"."attempt_answers" (
  "id"                 uuid         NOT NULL DEFAULT gen_random_uuid(),
  "attempt_id"         uuid,
  "question_id"        uuid,
  "selected_options"   text[],
  "text_answer"        text,
  "matching_answer"    jsonb,
  "is_correct"         boolean,
  "marks_awarded"      numeric(4,1),
  "time_spent_seconds" integer,
  CONSTRAINT "attempt_answers_attempt_id_question_id_key" UNIQUE (attempt_id, question_id),
  CONSTRAINT "attempt_answers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."attempt_answers"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."bookmarks" (
  "student_id"  uuid                     NOT NULL,
  "question_id" uuid                     NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now(),
  CONSTRAINT "bookmarks_pkey" PRIMARY KEY (student_id, question_id)
);

ALTER TABLE "public"."bookmarks"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."class_students" (
  "class_id"   uuid NOT NULL,
  "student_id" uuid NOT NULL,
  CONSTRAINT "class_students_pkey" PRIMARY KEY (class_id, student_id)
);

ALTER TABLE "public"."class_students"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."classes" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "school_id"     uuid,
  "standard_id"   integer,
  "stream_id"     integer,
  "name"          text,
  "academic_year" text,
  CONSTRAINT "classes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."classes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."group_questions" (
  "group_id"       uuid    NOT NULL,
  "question_id"    uuid    NOT NULL,
  "question_order" integer,
  "blank_number"   integer,
  CONSTRAINT "group_questions_pkey" PRIMARY KEY (group_id, question_id)
);

ALTER TABLE "public"."group_questions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."matching_items" (
  "id"              uuid    NOT NULL DEFAULT gen_random_uuid(),
  "question_id"     uuid,
  "side"            text    NOT NULL,
  "item_key"        text    NOT NULL,
  "item_text"       text,
  "item_image_path" text,
  "display_order"   integer,
  CONSTRAINT "matching_items_pkey" PRIMARY KEY (id),
  CONSTRAINT "matching_items_side_check" CHECK ((side = ANY (ARRAY['left'::text, 'right'::text])))
);

ALTER TABLE "public"."matching_items"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."matching_pairs" (
  "question_id"   uuid NOT NULL,
  "left_item_id"  uuid NOT NULL,
  "right_item_id" uuid NOT NULL,
  CONSTRAINT "matching_pairs_pkey" PRIMARY KEY (question_id, left_item_id, right_item_id)
);

ALTER TABLE "public"."matching_pairs"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."option_translations" (
  "id"                uuid NOT NULL DEFAULT gen_random_uuid(),
  "option_id"         uuid,
  "language_code"     text NOT NULL,
  "option_text"       text,
  "option_image_path" text,
  CONSTRAINT "option_has_content" CHECK (((option_text IS NOT NULL) OR (option_image_path IS NOT NULL))),
  CONSTRAINT "option_translations_option_id_language_code_key" UNIQUE (option_id, language_code),
  CONSTRAINT "option_translations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."option_translations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."paper_attempt_answers" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "attempt_id"         uuid                     NOT NULL,
  "question_id"        uuid                     NOT NULL,
  "selected_options"   text[],
  "text_answer"        text,
  "matching_answer"    jsonb,
  "is_correct"         boolean,
  "marks_awarded"      numeric(4,1),
  "time_spent_seconds" integer,
  "updated_at"         timestamp with time zone DEFAULT now(),
  CONSTRAINT "paper_attempt_answers_attempt_id_question_id_key" UNIQUE (attempt_id, question_id),
  CONSTRAINT "paper_attempt_answers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."paper_attempt_answers"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."paper_attempts" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "paper_id"           uuid                     NOT NULL,
  "student_id"         uuid                     NOT NULL,
  "attempt_number"     integer                  DEFAULT 1,
  "started_at"         timestamp with time zone DEFAULT now(),
  "submitted_at"       timestamp with time zone,
  "time_spent_seconds" integer,
  "is_paused"          boolean                  DEFAULT false,
  "pause_data"         jsonb,
  "total_score"        numeric(6,1),
  "max_score"          numeric(6,1),
  "status"             text                     DEFAULT 'in_progress'::text,
  CONSTRAINT "paper_attempts_pkey" PRIMARY KEY (id),
  CONSTRAINT "paper_attempts_status_check" CHECK ((status = ANY (ARRAY['in_progress'::text, 'submitted'::text, 'abandoned'::text])))
);

ALTER TABLE "public"."paper_attempts"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."paper_questions" (
  "paper_id"       uuid         NOT NULL,
  "question_id"    uuid         NOT NULL,
  "section"        text,
  "question_order" integer,
  "marks"          numeric(4,1),
  "negative_marks" numeric(4,1),
  CONSTRAINT "paper_questions_pkey" PRIMARY KEY (paper_id, question_id)
);

ALTER TABLE "public"."paper_questions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."papers" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"            text                     NOT NULL,
  "year"             integer                  NOT NULL,
  "standard_id"      integer,
  "stream_id"        integer,
  "total_marks"      numeric(6,1),
  "duration_minutes" integer,
  "pdf_path"         text,
  "is_published"     boolean                  DEFAULT false,
  "created_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "papers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."papers"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."parent_student" (
  "parent_id"  uuid NOT NULL,
  "student_id" uuid NOT NULL,
  CONSTRAINT "parent_student_pkey" PRIMARY KEY (parent_id, student_id)
);

ALTER TABLE "public"."parent_student"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "role"       text                     NOT NULL,
  "full_name"  text,
  "phone"      text,
  "avatar_url" text,
  "school_id"  uuid,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  "is_active"  boolean                  NOT NULL DEFAULT true,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'teacher'::text, 'student'::text, 'parent'::text])))
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_group_translations" (
  "id"            uuid NOT NULL DEFAULT gen_random_uuid(),
  "group_id"      uuid,
  "language_code" text NOT NULL,
  "shared_text"   text,
  CONSTRAINT "question_group_translations_group_id_language_code_key" UNIQUE (group_id, language_code),
  CONSTRAINT "question_group_translations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."question_group_translations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_groups" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "subject_id"        integer,
  "standard_id"       integer,
  "shared_image_path" text,
  "created_by"        uuid,
  "created_at"        timestamp with time zone DEFAULT now(),
  CONSTRAINT "question_groups_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."question_groups"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_history" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "question_id" uuid,
  "edited_by"   uuid,
  "diff"        jsonb,
  "edited_at"   timestamp with time zone DEFAULT now(),
  CONSTRAINT "question_history_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."question_history"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_options" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "question_id"   uuid,
  "option_key"    text    NOT NULL,
  "is_correct"    boolean DEFAULT false,
  "display_order" integer,
  CONSTRAINT "question_options_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."question_options"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_reports" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "question_id" uuid,
  "reported_by" uuid,
  "reason"      text,
  "comment"     text,
  "status"      text                     DEFAULT 'open'::text,
  "created_at"  timestamp with time zone DEFAULT now(),
  "resolved_at" timestamp with time zone,
  CONSTRAINT "question_reports_pkey" PRIMARY KEY (id),
  CONSTRAINT "question_reports_reason_check" CHECK ((reason = ANY (ARRAY['wrong_answer'::text, 'typo'::text, 'bad_image'::text, 'duplicate'::text, 'other'::text]))),
  CONSTRAINT "question_reports_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'reviewing'::text, 'resolved'::text, 'rejected'::text])))
);

ALTER TABLE "public"."question_reports"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_tags" (
  "question_id" uuid NOT NULL,
  "tag"         text NOT NULL,
  CONSTRAINT "question_tags_pkey" PRIMARY KEY (question_id, TAG)
);

ALTER TABLE "public"."question_tags"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."question_translations" (
  "id"                       uuid NOT NULL DEFAULT gen_random_uuid(),
  "question_id"              uuid,
  "language_code"            text NOT NULL,
  "question_text"            text,
  "explanation"              text,
  "explanation_diagram_path" text,
  CONSTRAINT "question_translations_pkey" PRIMARY KEY (id),
  CONSTRAINT "question_translations_question_id_language_code_key" UNIQUE (question_id, language_code)
);

ALTER TABLE "public"."question_translations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."questions" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "subject_id"     integer,
  "topic_id"       integer,
  "standard_id"    integer,
  "stream_id"      integer,
  "has_diagram"    boolean                  DEFAULT false,
  "diagram_path"   text,
  "marks"          numeric(4,1)             DEFAULT 1,
  "negative_marks" numeric(4,1)             DEFAULT 0,
  "year"           integer,
  "source"         text,
  "tags"           text[],
  "is_active"      boolean                  DEFAULT true,
  "created_by"     uuid,
  "created_at"     timestamp with time zone DEFAULT now(),
  "updated_at"     timestamp with time zone DEFAULT now(),
  CONSTRAINT "questions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."questions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."schools" (
  "id"      uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"    text NOT NULL,
  "code"    text,
  "address" text,
  CONSTRAINT "schools_code_key" UNIQUE (code),
  CONSTRAINT "schools_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."schools"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."standards" (
  "id"            integer NOT NULL DEFAULT nextval('public.standards_id_seq'::regclass),
  "name"          text    NOT NULL,
  "display_order" integer,
  CONSTRAINT "standards_name_key" UNIQUE (name),
  CONSTRAINT "standards_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."standards"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."streams" (
  "id"          integer NOT NULL DEFAULT nextval('public.streams_id_seq'::regclass),
  "name"        text    NOT NULL,
  "standard_id" integer,
  CONSTRAINT "streams_name_standard_id_key" UNIQUE (name, standard_id),
  CONSTRAINT "streams_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."streams"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."student_topic_stats" (
  "student_id"          uuid                     NOT NULL,
  "topic_id"            integer                  NOT NULL,
  "questions_attempted" integer                  DEFAULT 0,
  "questions_correct"   integer                  DEFAULT 0,
  "last_attempted_at"   timestamp with time zone,
  CONSTRAINT "student_topic_stats_pkey" PRIMARY KEY (student_id, topic_id)
);

ALTER TABLE "public"."student_topic_stats"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."subjects" (
  "id"   integer NOT NULL DEFAULT nextval('public.subjects_id_seq'::regclass),
  "name" text    NOT NULL,
  "code" text,
  CONSTRAINT "subjects_code_key" UNIQUE (code),
  CONSTRAINT "subjects_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."subjects"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."test_attempts" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "test_id"            uuid,
  "student_id"         uuid,
  "attempt_number"     integer                  DEFAULT 1,
  "started_at"         timestamp with time zone DEFAULT now(),
  "submitted_at"       timestamp with time zone,
  "time_spent_seconds" integer,
  "is_paused"          boolean                  DEFAULT false,
  "pause_data"         jsonb,
  "total_score"        numeric(6,1),
  "max_score"          numeric(6,1),
  "status"             text,
  CONSTRAINT "test_attempts_pkey" PRIMARY KEY (id),
  CONSTRAINT "test_attempts_status_check" CHECK ((status = ANY (ARRAY['in_progress'::text, 'submitted'::text, 'abandoned'::text])))
);

ALTER TABLE "public"."test_attempts"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."test_questions" (
  "test_id"        uuid         NOT NULL,
  "question_id"    uuid         NOT NULL,
  "section_id"     uuid,
  "question_order" integer,
  "marks"          numeric(4,1),
  "negative_marks" numeric(4,1),
  CONSTRAINT "test_questions_pkey" PRIMARY KEY (test_id, question_id)
);

ALTER TABLE "public"."test_questions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."test_rules" (
  "id"                   uuid         NOT NULL DEFAULT gen_random_uuid(),
  "test_id"              uuid,
  "section_id"           uuid,
  "subject_id"           integer,
  "topic_id"             integer,
  "question_count"       integer      NOT NULL,
  "marks_per_q"          numeric(4,1) DEFAULT 1,
  "negative_marks_per_q" numeric(4,1) DEFAULT 0,
  CONSTRAINT "test_rules_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."test_rules"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."test_sections" (
  "id"                     uuid         NOT NULL DEFAULT gen_random_uuid(),
  "test_id"                uuid,
  "name"                   text         NOT NULL,
  "section_order"          integer,
  "instructions"           text,
  "time_limit_seconds"     integer,
  "default_marks"          numeric(4,1) DEFAULT 1,
  "default_negative_marks" numeric(4,1) DEFAULT 0,
  CONSTRAINT "test_sections_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."test_sections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."tests" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"            text                     NOT NULL,
  "description"      text,
  "standard_id"      integer,
  "stream_id"        integer,
  "total_marks"      numeric(6,1),
  "duration_minutes" integer,
  "section_timing"   boolean                  DEFAULT false,
  "negative_marking" boolean                  DEFAULT true,
  "allow_pause"      boolean                  DEFAULT true,
  "max_attempts"     integer                  DEFAULT 1,
  "is_published"     boolean                  DEFAULT false,
  "created_by"       uuid,
  "created_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "tests_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."tests"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."topics" (
  "id"              integer NOT NULL DEFAULT nextval('public.topics_id_seq'::regclass),
  "subject_id"      integer,
  "name"            text    NOT NULL,
  "parent_topic_id" integer,
  CONSTRAINT "topics_pkey" PRIMARY KEY (id),
  CONSTRAINT "topics_subject_id_name_key" UNIQUE (subject_id, name)
);

ALTER TABLE "public"."topics"
  ENABLE ROW LEVEL SECURITY;

ALTER SEQUENCE "public"."standards_id_seq" OWNED BY "public"."standards"."id";

ALTER SEQUENCE "public"."streams_id_seq" OWNED BY "public"."streams"."id";

ALTER SEQUENCE "public"."subjects_id_seq" OWNED BY "public"."subjects"."id";

ALTER SEQUENCE "public"."topics_id_seq" OWNED BY "public"."topics"."id";

CREATE TYPE "public"."difficulty" AS ENUM (
  'easy',
  'medium',
  'hard'
);

ALTER TABLE "public"."papers"
  ADD COLUMN "difficulty" public.difficulty;

ALTER TABLE "public"."questions"
  ADD COLUMN "difficulty" public.difficulty DEFAULT 'medium'::public.difficulty;

ALTER TABLE "public"."test_rules"
  ADD COLUMN "difficulty" public.difficulty;

CREATE TYPE "public"."question_group_type" AS ENUM (
  'comprehension',
  'cloze',
  'data_interpretation',
  'puzzle',
  'shared_figure'
);

ALTER TABLE "public"."question_groups"
  ADD COLUMN "group_type" public.question_group_type NOT NULL;

CREATE TYPE "public"."question_type" AS ENUM (
  'mcq_single',
  'mcq_multi',
  'true_false',
  'fill_blank',
  'short_answer',
  'matching',
  'comprehension',
  'assertion_reason'
);

ALTER TABLE "public"."questions"
  ADD COLUMN "question_type" public.question_type NOT NULL;

CREATE TYPE "public"."review_status" AS ENUM (
  'not_visited',
  'answered',
  'not_answered',
  'marked_review',
  'answered_marked_review'
);

ALTER TABLE "public"."attempt_answers"
  ADD COLUMN "review_status" public.review_status DEFAULT 'not_visited'::public.review_status;

ALTER TABLE "public"."paper_attempt_answers"
  ADD COLUMN "review_status" public.review_status DEFAULT 'not_visited'::public.review_status;

CREATE TYPE "public"."test_creation_mode" AS ENUM (
  'rule_based',
  'random',
  'manual'
);

ALTER TABLE "public"."tests"
  ADD COLUMN "creation_mode" public.test_creation_mode NOT NULL;

CREATE OR REPLACE FUNCTION public.ensure_student_profile()
  RETURNS public.profiles
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_my_paper_attempt_summaries (
  p_standard_id integer DEFAULT NULL::integer
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_internal_user()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'teacher')
      and is_active
  );
$function$;

CREATE OR REPLACE FUNCTION public.log_question_edit()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  old_row jsonb := to_jsonb(old);
  new_row jsonb := to_jsonb(new);
  v_diff jsonb;
begin
  select coalesce(
    jsonb_object_agg(
      key,
      jsonb_build_object('old', old_row -> key, 'new', new_row -> key)
    ),
    '{}'::jsonb
  )
  into v_diff
  from jsonb_each(new_row)
  where old_row -> key is distinct from new_row -> key
    and key <> 'updated_at'; -- ignore touch-only updates

  if v_diff <> '{}'::jsonb then
    insert into public.question_history (question_id, edited_by, diff)
    values (new.id, auth.uid(), v_diff);
  end if;

  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.save_paper_answer (
  p_attempt_id         uuid,
  p_question_id        uuid,
  p_review_status      public.review_status DEFAULT 'answered'::public.review_status,
  p_selected_options   text[]               DEFAULT '{}'::text[],
  p_text_answer        text                 DEFAULT NULL::text,
  p_matching_answer    jsonb                DEFAULT NULL::jsonb,
  p_time_spent_seconds integer              DEFAULT NULL::integer,
  p_pause_data         jsonb                DEFAULT NULL::jsonb
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.start_paper_attempt (
  p_paper_id uuid
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.submit_paper_attempt (
  p_attempt_id uuid
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

ALTER TABLE "public"."class_students"
  ADD CONSTRAINT "class_students_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public.classes(id);

ALTER TABLE "public"."matching_pairs"
  ADD CONSTRAINT "matching_pairs_left_item_id_fkey" FOREIGN KEY (left_item_id) REFERENCES public.matching_items(id);

ALTER TABLE "public"."matching_pairs"
  ADD CONSTRAINT "matching_pairs_right_item_id_fkey" FOREIGN KEY (right_item_id) REFERENCES public.matching_items(id);

ALTER TABLE "public"."paper_attempt_answers"
  ADD CONSTRAINT "paper_attempt_answers_attempt_id_fkey" FOREIGN KEY (attempt_id) REFERENCES public.paper_attempts(id) ON DELETE CASCADE;

ALTER TABLE "public"."paper_attempts"
  ADD CONSTRAINT "paper_attempts_paper_id_fkey" FOREIGN KEY (paper_id) REFERENCES public.papers(id) ON DELETE CASCADE;

ALTER TABLE "public"."paper_questions"
  ADD CONSTRAINT "paper_questions_paper_id_fkey" FOREIGN KEY (paper_id) REFERENCES public.papers(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."bookmarks"
  ADD CONSTRAINT "bookmarks_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."class_students"
  ADD CONSTRAINT "class_students_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."paper_attempts"
  ADD CONSTRAINT "paper_attempts_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."parent_student"
  ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."parent_student"
  ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."question_groups"
  ADD CONSTRAINT "question_groups_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."group_questions"
  ADD CONSTRAINT "group_questions_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.question_groups(id) ON DELETE CASCADE;

ALTER TABLE "public"."question_group_translations"
  ADD CONSTRAINT "question_group_translations_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.question_groups(id) ON DELETE CASCADE;

ALTER TABLE "public"."question_history"
  ADD CONSTRAINT "question_history_edited_by_fkey" FOREIGN KEY (edited_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."option_translations"
  ADD CONSTRAINT "option_translations_option_id_fkey" FOREIGN KEY (option_id) REFERENCES public.question_options(id) ON DELETE CASCADE;

ALTER TABLE "public"."question_reports"
  ADD CONSTRAINT "question_reports_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."attempt_answers"
  ADD CONSTRAINT "attempt_answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."bookmarks"
  ADD CONSTRAINT "bookmarks_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."group_questions"
  ADD CONSTRAINT "group_questions_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."matching_items"
  ADD CONSTRAINT "matching_items_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."matching_pairs"
  ADD CONSTRAINT "matching_pairs_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."paper_attempt_answers"
  ADD CONSTRAINT "paper_attempt_answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."paper_questions"
  ADD CONSTRAINT "paper_questions_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."question_history"
  ADD CONSTRAINT "question_history_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."question_options"
  ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."question_reports"
  ADD CONSTRAINT "question_reports_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."question_tags"
  ADD CONSTRAINT "question_tags_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."question_translations"
  ADD CONSTRAINT "question_translations_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE "public"."classes"
  ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public.schools(id);

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public.schools(id);

ALTER TABLE "public"."classes"
  ADD CONSTRAINT "classes_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."papers"
  ADD CONSTRAINT "papers_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."question_groups"
  ADD CONSTRAINT "question_groups_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."classes"
  ADD CONSTRAINT "classes_stream_id_fkey" FOREIGN KEY (stream_id) REFERENCES public.streams(id);

ALTER TABLE "public"."papers"
  ADD CONSTRAINT "papers_stream_id_fkey" FOREIGN KEY (stream_id) REFERENCES public.streams(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_stream_id_fkey" FOREIGN KEY (stream_id) REFERENCES public.streams(id);

ALTER TABLE "public"."streams"
  ADD CONSTRAINT "streams_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."student_topic_stats"
  ADD CONSTRAINT "student_topic_stats_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."question_groups"
  ADD CONSTRAINT "question_groups_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE "public"."attempt_answers"
  ADD CONSTRAINT "attempt_answers_attempt_id_fkey" FOREIGN KEY (attempt_id) REFERENCES public.test_attempts(id) ON DELETE CASCADE;

ALTER TABLE "public"."test_attempts"
  ADD CONSTRAINT "test_attempts_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."test_questions"
  ADD CONSTRAINT "test_questions_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE "public"."test_rules"
  ADD CONSTRAINT "test_rules_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE "public"."test_questions"
  ADD CONSTRAINT "test_questions_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.test_sections(id);

ALTER TABLE "public"."test_rules"
  ADD CONSTRAINT "test_rules_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.test_sections(id);

ALTER TABLE "public"."tests"
  ADD CONSTRAINT "tests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."test_attempts"
  ADD CONSTRAINT "test_attempts_test_id_fkey" FOREIGN KEY (test_id) REFERENCES public.tests(id);

ALTER TABLE "public"."test_questions"
  ADD CONSTRAINT "test_questions_test_id_fkey" FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;

ALTER TABLE "public"."test_rules"
  ADD CONSTRAINT "test_rules_test_id_fkey" FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;

ALTER TABLE "public"."test_sections"
  ADD CONSTRAINT "test_sections_test_id_fkey" FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;

ALTER TABLE "public"."tests"
  ADD CONSTRAINT "tests_standard_id_fkey" FOREIGN KEY (standard_id) REFERENCES public.standards(id);

ALTER TABLE "public"."tests"
  ADD CONSTRAINT "tests_stream_id_fkey" FOREIGN KEY (stream_id) REFERENCES public.streams(id);

ALTER TABLE "public"."questions"
  ADD CONSTRAINT "questions_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE "public"."student_topic_stats"
  ADD CONSTRAINT "student_topic_stats_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE "public"."test_rules"
  ADD CONSTRAINT "test_rules_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public.topics(id);

ALTER TABLE "public"."topics"
  ADD CONSTRAINT "topics_parent_topic_id_fkey" FOREIGN KEY (parent_topic_id) REFERENCES public.topics(id);

ALTER TABLE "public"."topics"
  ADD CONSTRAINT "topics_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

CREATE VIEW "public"."paper_section_stats" AS  SELECT pq.paper_id,
    COALESCE(pq.section, 'General'::text) AS section,
    (count(*))::integer AS question_count,
    COALESCE(sum(COALESCE(pq.marks, q.marks, (1)::numeric)), (0)::numeric) AS section_marks
   FROM (public.paper_questions pq
     JOIN public.questions q ON ((q.id = pq.question_id)))
  GROUP BY pq.paper_id, COALESCE(pq.section, 'General'::text);

CREATE INDEX idx_attempt_answers_attempt ON public.attempt_answers USING btree (attempt_id);

CREATE INDEX idx_bookmarks_student ON public.bookmarks USING btree (student_id);

CREATE INDEX idx_group_questions_group ON public.group_questions USING btree (group_id);

CREATE INDEX idx_matching_items_question ON public.matching_items USING btree (question_id);

CREATE INDEX idx_paper_attempt_answers_attempt ON public.paper_attempt_answers USING btree (attempt_id);

CREATE INDEX idx_paper_attempts_paper_student ON public.paper_attempts USING btree (paper_id, student_id);

CREATE INDEX idx_paper_attempts_status ON public.paper_attempts USING btree (status);

CREATE INDEX idx_paper_attempts_student ON public.paper_attempts USING btree (student_id);

CREATE INDEX idx_paper_questions_paper ON public.paper_questions USING btree (paper_id);

CREATE INDEX idx_question_reports_status ON public.question_reports USING btree (status);

CREATE INDEX idx_question_tags_tag ON public.question_tags USING btree (TAG);

CREATE INDEX idx_questions_difficulty ON public.questions USING btree (difficulty);

CREATE INDEX idx_questions_standard_subject ON public.questions USING btree (standard_id, subject_id);

CREATE INDEX idx_questions_tags ON public.questions USING gin (tags);

CREATE INDEX idx_questions_year ON public.questions USING btree (year);

CREATE INDEX idx_test_attempts_student ON public.test_attempts USING btree (student_id);

CREATE UNIQUE INDEX paper_attempts_one_in_progress ON public.paper_attempts USING btree (paper_id, student_id)
  WHERE (status = 'in_progress'::text);

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TRIGGER trg_log_question_edit
  AFTER UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_question_edit();

CREATE POLICY "admin_full_access" ON "public"."group_questions"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."group_questions"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."group_questions"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."matching_items"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."matching_items"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."matching_items"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."matching_pairs"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."matching_pairs"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."matching_pairs"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."option_translations"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."option_translations"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."option_translations"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "paper_attempt_answers_insert_own" ON "public"."paper_attempt_answers"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.paper_attempts a
  WHERE ((a.id = paper_attempt_answers.attempt_id) AND (a.student_id = auth.uid()) AND (a.status = 'in_progress'::text)))));

CREATE POLICY "paper_attempt_answers_select_own" ON "public"."paper_attempt_answers"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.paper_attempts a
  WHERE ((a.id = paper_attempt_answers.attempt_id) AND (a.student_id = auth.uid())))));

CREATE POLICY "paper_attempt_answers_update_own" ON "public"."paper_attempt_answers"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.paper_attempts a
  WHERE ((a.id = paper_attempt_answers.attempt_id) AND (a.student_id = auth.uid()) AND (a.status = 'in_progress'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.paper_attempts a
  WHERE ((a.id = paper_attempt_answers.attempt_id) AND (a.student_id = auth.uid()) AND (a.status = 'in_progress'::text)))));

CREATE POLICY "paper_attempts_insert_own" ON "public"."paper_attempts"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((student_id = auth.uid()));

CREATE POLICY "paper_attempts_select_own" ON "public"."paper_attempts"
  FOR SELECT
  TO "authenticated"
  USING ((student_id = auth.uid()));

CREATE POLICY "paper_attempts_update_own" ON "public"."paper_attempts"
  FOR UPDATE
  TO "authenticated"
  USING ((student_id = auth.uid()))
  WITH CHECK ((student_id = auth.uid()));

CREATE POLICY "admin_full_access" ON "public"."paper_questions"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."paper_questions"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."paper_questions"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "paper_questions_select_published" ON "public"."paper_questions"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.papers p
  WHERE ((p.id = paper_questions.paper_id) AND (p.is_published = true)))));

CREATE POLICY "admin_full_access" ON "public"."papers"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."papers"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."papers"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "papers_select_published" ON "public"."papers"
  FOR SELECT
  TO "authenticated"
  USING ((is_published = true));

CREATE POLICY "admin_full_access" ON "public"."profiles"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "self_read" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = auth.uid()));

CREATE POLICY "admin_full_access" ON "public"."question_group_translations"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."question_group_translations"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."question_group_translations"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."question_groups"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."question_groups"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."question_groups"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "internal_read" ON "public"."question_history"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."question_options"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."question_options"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."question_options"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_update" ON "public"."question_reports"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_insert" ON "public"."question_reports"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_internal_user());

CREATE POLICY "internal_read" ON "public"."question_reports"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."question_tags"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."question_tags"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."question_tags"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."question_translations"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."question_translations"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."question_translations"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."questions"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."questions"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."questions"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."standards"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."standards"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."streams"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."streams"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."subjects"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."subjects"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."test_questions"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."test_questions"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."test_questions"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."test_rules"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."test_rules"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."test_rules"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."test_sections"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."test_sections"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."test_sections"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."tests"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."tests"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_update" ON "public"."tests"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_internal_user())
  WITH CHECK (public.is_internal_user());

CREATE POLICY "admin_full_access" ON "public"."topics"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "internal_read" ON "public"."topics"
  FOR SELECT
  TO "authenticated"
  USING (public.is_internal_user());

CREATE POLICY "internal_delete_content_buckets" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING
    (((bucket_id = ANY (ARRAY['question-diagrams'::text, 'option-diagrams'::text, 'explanation-diagrams'::text, 'group-diagrams'::text, 'past-paper-pdfs'::text, 'avatars'::text]))
    AND public.is_internal_user()));

CREATE POLICY "internal_insert_content_buckets" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    (((bucket_id = ANY (ARRAY['question-diagrams'::text, 'option-diagrams'::text, 'explanation-diagrams'::text, 'group-diagrams'::text, 'past-paper-pdfs'::text, 'avatars'::text]))
    AND public.is_internal_user() AND ((bucket_id = 'avatars'::text) OR (name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+$'::text))));

CREATE POLICY "internal_read_content_buckets" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING
    (((bucket_id = ANY (ARRAY['question-diagrams'::text, 'option-diagrams'::text, 'explanation-diagrams'::text, 'group-diagrams'::text, 'past-paper-pdfs'::text, 'avatars'::text]))
    AND public.is_internal_user()));

CREATE POLICY "internal_update_content_buckets" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING
    (((bucket_id = ANY (ARRAY['question-diagrams'::text, 'option-diagrams'::text, 'explanation-diagrams'::text, 'group-diagrams'::text, 'past-paper-pdfs'::text, 'avatars'::text]))
    AND public.is_internal_user()))
  WITH
    CHECK
    (((bucket_id = ANY (ARRAY['question-diagrams'::text, 'option-diagrams'::text, 'explanation-diagrams'::text, 'group-diagrams'::text, 'past-paper-pdfs'::text, 'avatars'::text]))
    AND public.is_internal_user() AND ((bucket_id = 'avatars'::text) OR (name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+$'::text))));

CREATE POLICY "past_paper_pdfs_select_authenticated" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'past-paper-pdfs'::text) AND (EXISTS ( SELECT 1
   FROM public.papers p
  WHERE ((p.is_published = true) AND ((p.pdf_path = objects.name) OR (p.pdf_path = ('past-paper-pdfs/'::text || objects.name)) OR (p.pdf_path ~~ ('%'::text || objects.name))))))));

REVOKE ALL ON FUNCTION "public"."ensure_student_profile"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."ensure_student_profile"() TO "authenticated", "postgres";

REVOKE ALL ON FUNCTION "public"."get_my_paper_attempt_summaries"(integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."get_my_paper_attempt_summaries"(integer) TO "authenticated", "postgres";

REVOKE ALL ON FUNCTION "public"."get_paper_session_questions"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."get_paper_session_questions"(uuid) TO "authenticated", "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user_profile"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "authenticated", "postgres";

REVOKE ALL ON FUNCTION "public"."is_internal_user"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_internal_user"() TO "authenticated", "postgres";

GRANT EXECUTE ON FUNCTION "public"."log_question_edit"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."save_paper_answer"(uuid, uuid, public.review_status, text[], text, jsonb, integer, jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."save_paper_answer"(uuid, uuid, public.review_status, text[], text, jsonb, integer, jsonb) TO "authenticated", "postgres";

REVOKE ALL ON FUNCTION "public"."start_paper_attempt"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."start_paper_attempt"(uuid) TO "authenticated", "postgres";

REVOKE ALL ON FUNCTION "public"."submit_paper_attempt"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."submit_paper_attempt"(uuid) TO "authenticated", "postgres";

REVOKE ALL ON SCHEMA "public" FROM PUBLIC;

GRANT CREATE, USAGE ON SCHEMA "public" TO PUBLIC;

REVOKE ALL ON SCHEMA "public" FROM "postgres";

GRANT CREATE, USAGE ON SCHEMA "public" TO "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."standards_id_seq" TO "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."streams_id_seq" TO "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."subjects_id_seq" TO "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."topics_id_seq" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."attempt_answers" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."attempt_answers" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."bookmarks" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmarks" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."class_students" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_students" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."classes" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."classes" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."group_questions" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."group_questions" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."matching_items" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."matching_items" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."matching_pairs" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."matching_pairs" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."option_translations" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."option_translations" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."paper_attempt_answers" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."paper_attempt_answers" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."paper_attempts" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."paper_attempts" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."paper_questions" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."paper_questions" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."papers" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."papers" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."parent_student" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."parent_student" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."profiles" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_group_translations" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_group_translations" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_groups" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_groups" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_history" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_history" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_options" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_options" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_reports" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_reports" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_tags" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_tags" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."question_translations" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."question_translations" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."questions" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."questions" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."schools" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."schools" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."standards" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."standards" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."streams" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."streams" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."student_topic_stats" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."student_topic_stats" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."subjects" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."subjects" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."test_attempts" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_attempts" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."test_questions" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_questions" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."test_rules" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_rules" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."test_sections" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_sections" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."tests" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."tests" TO "authenticated", "postgres", "service_role";

GRANT SELECT ON TABLE "public"."topics" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."topics" TO "authenticated", "postgres", "service_role";

GRANT USAGE ON TYPE "public"."difficulty" TO "postgres";

GRANT USAGE ON TYPE "public"."question_group_type" TO "postgres";

GRANT USAGE ON TYPE "public"."question_type" TO "postgres";

GRANT USAGE ON TYPE "public"."review_status" TO "postgres";

GRANT USAGE ON TYPE "public"."test_creation_mode" TO "postgres";

GRANT SELECT ON TABLE "public"."paper_section_stats" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."paper_section_stats" TO "authenticated", "postgres", "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES TO "anon";

