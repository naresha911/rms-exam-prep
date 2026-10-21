-- ============================================================
-- Seed: reference data + sample questions
-- ============================================================
-- Loaded automatically by `supabase db reset` (see [db.seed] in
-- supabase/config.toml -> sql_paths = ["./seed.sql"]).
-- Safe to re-run: every insert is guarded with ON CONFLICT DO NOTHING.
--
-- REFERENCE-ID CHAIN (how a question is wired together)
-- -----------------------------------------------------
--   standards.id  <--  streams.standard_id
--   standards.id  <--  questions.standard_id
--   subjects.id   <--  topics.subject_id
--   topics.id     <--  questions.topic_id
--   subjects.id   <--  questions.subject_id
--   streams.id    <--  questions.stream_id            (nullable, optional)
--   profiles.id   <--  questions.created_by           (nullable)
--   questions.id  <--  question_translations.question_id
--   questions.id  <--  question_options.question_id
--   question_options.id <-- option_translations.option_id
--   questions.id  <--  question_tags.question_id
--   questions.id  <--  matching_items.question_id / matching_pairs.question_id
--   question_groups.id <-- group_questions.group_id
--   question_groups.id <-- question_group_translations.group_id
--
-- App contract (src/constants/index.ts):
--   standards:  id 5 = "Class 5"  -> AISSEE Class 6 entry
--               id 8 = "Class 8"  -> AISSEE Class 9 entry
--   subjects:   1 Mathematics (MAT)   2 Language (LNG)          3 Intelligence (INT)
--               4 General Knowledge (GK)  5 English (ENG)       6 General Science (GSC)
--               7 Social Science (SSC)
-- ============================================================


-- ============================================================
-- 1. STANDARDS  (becomes the target class on every question/test/paper)
-- ============================================================
INSERT INTO public.standards (id, name, display_order) VALUES
  (5, '5th', 1),
  (8, '8th', 2)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 2. STREAMS  (optional; questions.stream_id may stay NULL)
-- ============================================================
INSERT INTO public.streams (id, name, standard_id) VALUES
  (1, 'General', 5),
  (2, 'General', 8)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 3. SUBJECTS
-- ============================================================
INSERT INTO public.subjects (id, name, code) VALUES
  (1, 'Mathematics',       'MAT'),
  (2, 'Language',          'LNG'),
  (3, 'Intelligence',      'INT'),
  (4, 'General Knowledge', 'GK'),
  (5, 'English',           'ENG'),
  (6, 'General Science',   'GSC'),
  (7, 'Social Science',    'SSC')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 4. TOPICS  (parent_topic_id NULL = top-level; otherwise sub-topic)
-- ============================================================
INSERT INTO public.topics (id, subject_id, name, parent_topic_id) VALUES
  -- Mathematics (subject 1)
  (1,  1, 'Number System',          NULL),
  (2,  1, 'LCM and HCF',            1),
  (3,  1, 'Fractions and Decimals', NULL),
  (4,  1, 'Geometry',               NULL),
  (5,  1, 'Triangles',              4),
  -- English (subject 5)
  (20, 5, 'Reading Comprehension',  NULL),
  (21, 5, 'Grammar',                NULL),
  -- Intelligence (subject 3)
  (30, 3, 'Pattern Recognition',    NULL),
  (31, 3, 'Series Completion',      30),
  -- General Knowledge (subject 4)
  (40, 4, 'Indian History',         NULL),
  -- General Science (subject 6)
  (50, 6, 'Physics',                NULL),
  (51, 6, 'Motion',                 50),
  -- Social Science (subject 7)
  (60, 7, 'Geography',              NULL)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 5. QUESTIONS
-- ------------------------------------------------------------
-- Only reference ids + metadata live here. Human-readable text
-- lives in question_translations, answers in question_options.
-- ============================================================
INSERT INTO public.questions (
  id, question_type,
  subject_id, topic_id, standard_id, stream_id,
  difficulty, has_diagram, diagram_path,
  marks, negative_marks,
  year, source, tags, is_active, created_by
) VALUES
  -- Q1: CLASS 5 / Mathematics / LCM and HCF  (mcq_single, easy)
  ('11111111-1111-4111-8111-111111111111', 'mcq_single',
   1, 2, 5, NULL,
   'easy', false, NULL,
   1, 0, 2024, 'AISSEE 2024 Class 6',
   ARRAY['lcm', 'number-system'], true, NULL),

  -- Q2: CLASS 5 / Mathematics / Fractions  (mcq_single, medium, negative marking)
  ('22222222-2222-4222-8222-222222222222', 'mcq_single',
   1, 3, 5, NULL,
   'medium', false, NULL,
   2, 0.5, 2023, 'AISSEE 2023 Class 6',
   ARRAY['fractions'], true, NULL),

  -- Q3: CLASS 5 / General Knowledge / Indian History  (true_false)
  ('33333333-3333-4333-8333-333333333333', 'true_false',
   4, 40, 5, NULL,
   'easy', false, NULL,
   1, 0, 2022, 'Practice Set A',
   ARRAY['monuments'], true, NULL),

  -- Q4: CLASS 8 / General Science / Motion  (assertion_reason)
  ('44444444-4444-4444-8444-444444444444', 'assertion_reason',
   6, 51, 8, 2,
   'medium', false, NULL,
   2, 0.5, 2024, 'AISSEE 2024 Class 9',
   ARRAY['newton-laws', 'motion'], true, NULL),

  -- Q5: CLASS 8 / English / Reading Comprehension  (child 1 of comprehension group)
  ('55555555-5555-4555-8555-555555555555', 'mcq_single',
   5, 20, 8, NULL,
   'medium', false, NULL,
   2, 0.5, 2024, 'AISSEE 2024 Class 9',
   ARRAY['comprehension'], true, NULL),

  -- Q6: CLASS 8 / English / Reading Comprehension  (child 2 of comprehension group)
  ('66666666-6666-4666-8666-666666666666', 'mcq_single',
   5, 20, 8, NULL,
   'medium', false, NULL,
   2, 0.5, 2024, 'AISSEE 2024 Class 9',
   ARRAY['comprehension'], true, NULL),

  -- Q7: CLASS 8 / Intelligence / Pattern Recognition  (matching)
  ('77777777-7777-4777-8777-777777777777', 'matching',
   3, 30, 8, NULL,
   'medium', false, NULL,
   2, 0, 2024, 'AISSEE 2024 Class 9',
   ARRAY['matching', 'analogy'], true, NULL),

  -- Q8: CLASS 5 / Mathematics / Geometry  (mcq_single with shared diagram)
  ('88888888-8888-4888-8888-888888888888', 'mcq_single',
   1, 4, 5, NULL,
   'hard', true, 'diagrams/math/rectangle.png',
   2, 0, 2023, 'Practice Set B',
   ARRAY['geometry', 'area'], true, NULL)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 6. QUESTION TAGS  (separate rows; questions.tags[] is the compiled mirror)
-- ============================================================
INSERT INTO public.question_tags (question_id, tag) VALUES
  ('11111111-1111-4111-8111-111111111111', 'high-yield'),
  ('55555555-5555-4555-8555-555555555555', 'passage')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 7. QUESTION TRANSLATIONS  (localized stem + hint + solution)
-- ============================================================
INSERT INTO public.question_translations (
  question_id, language_code, question_text, hint, explanation, explanation_diagram_path
) VALUES
  ('11111111-1111-4111-8111-111111111111', 'en',
   'What is the LCM of 4 and 6?',
   'List the multiples of each number and find the first common one.',
   'Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12... The first common multiple is 12, so LCM = 12.',
   NULL),
  ('11111111-1111-4111-8111-111111111111', 'hi',
   '4 और 6 का लघुत्तम समापवर्त्य (LCM) क्या है?',
   'प्रत्येक संख्या के गुणज लिखें और पहला सामान्य गुणज खोजें।',
   '4 के गुणज: 4, 8, 12... 6 के गुणज: 6, 12... पहला सामान्य गुणज 12 है, अतः LCM = 12।',
   NULL),

  ('22222222-2222-4222-8222-222222222222', 'en',
   'Which of the following fractions is equivalent to 3/4?',
   'Multiply the numerator and denominator by the same number.',
   'Multiply 3/4 by 2/2 to get 6/8. Only 6/8 reduces back to 3/4.',
   NULL),

  ('33333333-3333-4333-8333-333333333333', 'en',
   'The Taj Mahal is located in Agra.',
   'Think about the city on the banks of the Yamuna famous for this monument.',
   'The Taj Mahal stands in Agra, Uttar Pradesh. So the statement is true.',
   NULL),

  ('44444444-4444-4444-8444-444444444444', 'en',
   'Assertion (A): A body at rest stays at rest unless an external force acts on it. Reason (R): This follows from Newton''s first law of motion.',
   'Recall what Newton''s first law states about objects and force.',
   'Both statements are true, and the first law (inertia) is exactly the reason the assertion holds.',
   NULL),

  ('55555555-5555-4555-8555-555555555555', 'en',
   'According to the passage, why did the village children gather near the river every evening?',
   'Re-read the sentence describing the children''s evening routine.',
   'The passage states the children met by the river each evening to watch the boats return.',
   NULL),

  ('66666666-6666-4666-8666-666666666666', 'en',
   'In the passage, the word "gleaming" most nearly means:',
   'Use the surrounding words about sunlight reflecting on the water.',
   '"Gleaming" describes something shining or reflecting light, closest to "shining".',
   NULL),

  ('77777777-7777-4777-8777-777777777777', 'en',
   'Match List-I (term) with List-II (description).',
   'Match each animal to the group it belongs to.',
   'Cat and dog are mammals; snake is a reptile; frog is an amphibian.',
   NULL),

  ('88888888-8888-4888-8888-888888888888', 'en',
   'The figure shows a rectangle 8 cm long and 5 cm wide. What is its area?',
   'Area of a rectangle = length x width.',
   'Area = 8 cm x 5 cm = 40 cm2.',
   'diagrams/math/rectangle-solution.png')
ON CONFLICT (question_id, language_code) DO NOTHING;


-- ============================================================
-- 8. QUESTION OPTIONS  (option_key is stored in attempt answers)
-- ============================================================
INSERT INTO public.question_options (id, question_id, option_key, is_correct, display_order) VALUES
  -- Q1 (LCM of 4 and 6)
  ('11111111-1111-4111-8111-000000000001', '11111111-1111-4111-8111-111111111111', 'A', false, 1),
  ('11111111-1111-4111-8111-000000000002', '11111111-1111-4111-8111-111111111111', 'B', true,  2),
  ('11111111-1111-4111-8111-000000000003', '11111111-1111-4111-8111-111111111111', 'C', false, 3),
  ('11111111-1111-4111-8111-000000000004', '11111111-1111-4111-8111-111111111111', 'D', false, 4),
  -- Q2 (equivalent fraction to 3/4)
  ('22222222-2222-4222-8222-000000000001', '22222222-2222-4222-8222-222222222222', 'A', true,  1),
  ('22222222-2222-4222-8222-000000000002', '22222222-2222-4222-8222-222222222222', 'B', false, 2),
  ('22222222-2222-4222-8222-000000000003', '22222222-2222-4222-8222-222222222222', 'C', false, 3),
  ('22222222-2222-4222-8222-000000000004', '22222222-2222-4222-8222-222222222222', 'D', false, 4),
  -- Q3 (true / false)
  ('33333333-3333-4333-8333-000000000001', '33333333-3333-4333-8333-333333333333', 'A', true,  1),
  ('33333333-3333-4333-8333-000000000002', '33333333-3333-4333-8333-333333333333', 'B', false, 2),
  -- Q4 (assertion-reason standard 4 choices)
  ('44444444-4444-4444-8444-000000000001', '44444444-4444-4444-8444-444444444444', 'A', true,  1),
  ('44444444-4444-4444-8444-000000000002', '44444444-4444-4444-8444-444444444444', 'B', false, 2),
  ('44444444-4444-4444-8444-000000000003', '44444444-4444-4444-8444-444444444444', 'C', false, 3),
  ('44444444-4444-4444-8444-000000000004', '44444444-4444-4444-8444-444444444444', 'D', false, 4),
  -- Q5 (comprehension child 1)
  ('55555555-5555-4555-8555-000000000001', '55555555-5555-4555-8555-555555555555', 'A', true,  1),
  ('55555555-5555-4555-8555-000000000002', '55555555-5555-4555-8555-555555555555', 'B', false, 2),
  ('55555555-5555-4555-8555-000000000003', '55555555-5555-4555-8555-555555555555', 'C', false, 3),
  ('55555555-5555-4555-8555-000000000004', '55555555-5555-4555-8555-555555555555', 'D', false, 4),
  -- Q6 (comprehension child 2)
  ('66666666-6666-4666-8666-000000000001', '66666666-6666-4666-8666-666666666666', 'A', false, 1),
  ('66666666-6666-4666-8666-000000000002', '66666666-6666-4666-8666-666666666666', 'B', true,  2),
  ('66666666-6666-4666-8666-000000000003', '66666666-6666-4666-8666-666666666666', 'C', false, 3),
  ('66666666-6666-4666-8666-000000000004', '66666666-6666-4666-8666-666666666666', 'D', false, 4),
  -- Q7 (matching -> answer is a mapping code, marked correct here)
  ('77777777-7777-4777-8777-000000000001', '77777777-7777-4777-8777-777777777777', 'A', true,  1),
  ('77777777-7777-4777-8777-000000000002', '77777777-7777-4777-8777-777777777777', 'B', false, 2),
  ('77777777-7777-4777-8777-000000000003', '77777777-7777-4777-8777-777777777777', 'C', false, 3),
  ('77777777-7777-4777-8777-000000000004', '77777777-7777-4777-8777-777777777777', 'D', false, 4),
  -- Q8 (area of rectangle)
  ('88888888-8888-4888-8888-000000000001', '88888888-8888-4888-8888-888888888888', 'A', false, 1),
  ('88888888-8888-4888-8888-000000000002', '88888888-8888-4888-8888-888888888888', 'B', false, 2),
  ('88888888-8888-4888-8888-000000000003', '88888888-8888-4888-8888-888888888888', 'C', true,  3),
  ('88888888-8888-4888-8888-000000000004', '88888888-8888-4888-8888-888888888888', 'D', false, 4)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 9. OPTION TRANSLATIONS  (localized option text / image per language)
-- ============================================================
INSERT INTO public.option_translations (option_id, language_code, option_text, option_image_path) VALUES
  -- Q1 en
  ('11111111-1111-4111-8111-000000000001', 'en', '8',  NULL),
  ('11111111-1111-4111-8111-000000000002', 'en', '12', NULL),
  ('11111111-1111-4111-8111-000000000003', 'en', '16', NULL),
  ('11111111-1111-4111-8111-000000000004', 'en', '24', NULL),
  -- Q1 hi
  ('11111111-1111-4111-8111-000000000001', 'hi', '8',  NULL),
  ('11111111-1111-4111-8111-000000000002', 'hi', '12', NULL),
  ('11111111-1111-4111-8111-000000000003', 'hi', '16', NULL),
  ('11111111-1111-4111-8111-000000000004', 'hi', '24', NULL),
  -- Q2 en
  ('22222222-2222-4222-8222-000000000001', 'en', '6/8',  NULL),
  ('22222222-2222-4222-8222-000000000002', 'en', '4/3',  NULL),
  ('22222222-2222-4222-8222-000000000003', 'en', '3/8',  NULL),
  ('22222222-2222-4222-8222-000000000004', 'en', '9/16', NULL),
  -- Q3 en
  ('33333333-3333-4333-8333-000000000001', 'en', 'True',  NULL),
  ('33333333-3333-4333-8333-000000000002', 'en', 'False', NULL),
  -- Q4 en
  ('44444444-4444-4444-8444-000000000001', 'en', 'Both A and R are true and R is the correct explanation of A', NULL),
  ('44444444-4444-4444-8444-000000000002', 'en', 'Both A and R are true but R is not the correct explanation of A', NULL),
  ('44444444-4444-4444-8444-000000000003', 'en', 'A is true but R is false', NULL),
  ('44444444-4444-4444-8444-000000000004', 'en', 'A is false but R is true', NULL),
  -- Q5 en
  ('55555555-5555-4555-8555-000000000001', 'en', 'To watch the boats return', NULL),
  ('55555555-5555-4555-8555-000000000002', 'en', 'To fetch drinking water',   NULL),
  ('55555555-5555-4555-8555-000000000003', 'en', 'To catch fish for dinner',  NULL),
  ('55555555-5555-4555-8555-000000000004', 'en', 'To collect firewood',       NULL),
  -- Q6 en
  ('66666666-6666-4666-8666-000000000001', 'en', 'Dull',    NULL),
  ('66666666-6666-4666-8666-000000000002', 'en', 'Shining', NULL),
  ('66666666-6666-4666-8666-000000000003', 'en', 'Rough',   NULL),
  ('66666666-6666-4666-8666-000000000004', 'en', 'Broken',  NULL),
  -- Q7 en (mapping codes)
  ('77777777-7777-4777-8777-000000000001', 'en', '(i)-Q, (ii)-P, (iii)-R', NULL),
  ('77777777-7777-4777-8777-000000000002', 'en', '(i)-P, (ii)-Q, (iii)-R', NULL),
  ('77777777-7777-4777-8777-000000000003', 'en', '(i)-R, (ii)-P, (iii)-Q', NULL),
  ('77777777-7777-4777-8777-000000000004', 'en', '(i)-Q, (ii)-R, (iii)-P', NULL),
  -- Q8 en
  ('88888888-8888-4888-8888-000000000001', 'en', '13 cm2', NULL),
  ('88888888-8888-4888-8888-000000000002', 'en', '26 cm2', NULL),
  ('88888888-8888-4888-8888-000000000003', 'en', '40 cm2', NULL),
  ('88888888-8888-4888-8888-000000000004', 'en', '80 cm2', NULL)
ON CONFLICT (option_id, language_code) DO NOTHING;


-- ============================================================
-- 10. MATCHING ITEMS + PAIRS  (only for question_type = 'matching')
-- ============================================================
INSERT INTO public.matching_items (id, question_id, side, item_key, item_text, item_image_path, display_order) VALUES
  ('77000000-0000-4000-8000-000000000001', '77777777-7777-4777-8777-777777777777', 'left',  'i',   'Cat',    NULL, 1),
  ('77000000-0000-4000-8000-000000000002', '77777777-7777-4777-8777-777777777777', 'left',  'ii',  'Snake',  NULL, 2),
  ('77000000-0000-4000-8000-000000000003', '77777777-7777-4777-8777-777777777777', 'left',  'iii', 'Frog',   NULL, 3),
  ('77000000-0000-4000-8000-000000000004', '77777777-7777-4777-8777-777777777777', 'right', 'P',   'Reptile',    NULL, 1),
  ('77000000-0000-4000-8000-000000000005', '77777777-7777-4777-8777-777777777777', 'right', 'Q',   'Mammal',     NULL, 2),
  ('77000000-0000-4000-8000-000000000006', '77777777-7777-4777-8777-777777777777', 'right', 'R',   'Amphibian',  NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.matching_pairs (question_id, left_item_id, right_item_id) VALUES
  ('77777777-7777-4777-8777-777777777777', '77000000-0000-4000-8000-000000000001', '77000000-0000-4000-8000-000000000005'),
  ('77777777-7777-4777-8777-777777777777', '77000000-0000-4000-8000-000000000002', '77000000-0000-4000-8000-000000000004'),
  ('77777777-7777-4777-8777-777777777777', '77000000-0000-4000-8000-000000000003', '77000000-0000-4000-8000-000000000006')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 11. COMPREHENSION GROUP  (passage shared by Q5 + Q6)
-- ------------------------------------------------------------
-- The group owns only the passage; each child is scored on its
-- own marks/negative_marks. Do NOT score the group row itself.
-- ============================================================
INSERT INTO public.question_groups (id, group_type, subject_id, standard_id, shared_image_path, created_by) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'comprehension', 5, 8, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_group_translations (group_id, language_code, shared_text) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'en',
   'Every evening the children of the village gathered by the river to watch the fishing boats return. The water, catching the last light of the sun, was gleaming like polished metal. They would count the boats aloud and cheer when the largest one appeared.')
ON CONFLICT (group_id, language_code) DO NOTHING;

INSERT INTO public.group_questions (group_id, question_id, question_order, blank_number) VALUES
  ('a0000000-0000-4000-8000-000000000001', '55555555-5555-4555-8555-555555555555', 1, NULL),
  ('a0000000-0000-4000-8000-000000000001', '66666666-6666-4666-8666-666666666666', 2, NULL)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 12. RESET SERIAL SEQUENCES
-- ------------------------------------------------------------
-- We inserted explicit ids above, so bump each sequence past the
-- max id to keep future serial inserts collision-free.
-- ============================================================
SELECT setval('public.standards_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.standards), true);
SELECT setval('public.streams_id_seq',   (SELECT COALESCE(MAX(id), 1) FROM public.streams),   true);
SELECT setval('public.subjects_id_seq',  (SELECT COALESCE(MAX(id), 1) FROM public.subjects),  true);
SELECT setval('public.topics_id_seq',    (SELECT COALESCE(MAX(id), 1) FROM public.topics),    true);
