# Papers v1 — live Supabase verification checklist

Related docs: [`previous-papers.md`](previous-papers.md) · [`sql/papers_v1.sql`](sql/papers_v1.sql) · [`README.md`](README.md)

Run after pasting [`requirements/sql/papers_v1.sql`](sql/papers_v1.sql) into the Supabase SQL Editor.

## 1. Schema

- [ ] `papers.difficulty` column exists
- [ ] `paper_attempts` table exists
- [ ] `paper_attempt_answers` table exists with unique `(attempt_id, question_id)`
- [ ] `attempt_answers` has unique `(attempt_id, question_id)`
- [ ] Partial unique index `paper_attempts_one_in_progress` exists
- [ ] View `paper_section_stats` returns rows for published papers

## 2. Storage

- [ ] Bucket `past-paper-pdfs` exists and is **private**
- [ ] At least one published paper has a valid `pdf_path`
- [ ] Authenticated student can create a signed URL for that path
- [ ] Unauthenticated / wrong path fails

## 3. RPCs

As a signed-in student:

- [ ] `get_paper_session_questions(paper_id)` returns questions **without** `is_correct`
- [ ] `start_paper_attempt(paper_id)` creates attempt; second call resumes same `in_progress` id
- [ ] `save_paper_answer(...)` upserts; repeating does not duplicate rows
- [ ] `submit_paper_attempt(attempt_id)` sets status `submitted`, fills scores
- [ ] Second submit returns `already_submitted: true`
- [ ] `get_my_paper_attempt_summaries(standard_id)` returns latest per paper

## 4. RLS

- [ ] Student A cannot `select` student B’s `paper_attempts`
- [ ] Student cannot read unpublished `papers`
- [ ] Student cannot insert attempt for another `student_id`

## 5. App smoke (device / Expo)

- [ ] Papers list loads for Class 6 / 9 via `standards` lookup
- [ ] Detail shows Start / Resume correctly
- [ ] Session uses paper question order and timer
- [ ] Kill app mid-session → Resume restores answers/timer (online or offline cache)
- [ ] Submit → result screen from `attemptId` only
- [ ] PDF open works when `pdf_path` set
- [ ] Incomplete-paper local notification schedules after Exit (device permission)

## Notes

- If RPCs are missing, re-run `papers_v1.sql`.
- If `start_paper_attempt` fails with `paper_attempts_student_id_fkey`, run [`sql/ensure_student_profile.sql`](sql/ensure_student_profile.sql) (auth user has no `profiles` row).
- If standards lookup returns empty, seed `standards` with names containing `6` / `9` (e.g. `6th`, `9th`).
- Server-side scoring covers `mcq_single`, `true_false`, `assertion_reason` only in v1.
