# Previous Papers — Sprint Tracker

**Last left off:** All sprints 0–9 implemented in code. Awaiting live Supabase SQL run + device smoke tests (see `requirements/papers-verification.md`).

**How to resume:** Read this file first. Implement only the next incomplete sprint. Check off items when done. Update **Last left off**.

---

## Sprint 0 — Tracker

- [x] Add this tracker file with checkboxes
- [x] Set Last left off after Sprint 0

## Sprint 1 — Schema, RLS, RPCs, storage policies

- [x] Add `papers.difficulty`
- [x] Add `paper_attempts` table
- [x] Add `paper_attempt_answers` table
- [x] Unique `(attempt_id, question_id)` on paper answers and `attempt_answers`
- [x] Indexes for student + paper + status
- [x] RLS policies for papers / attempts / answers
- [x] Storage policies for `past-paper-pdfs`
- [x] RPCs: `start_paper_attempt`, `save_paper_answer`, `submit_paper_attempt`, `get_paper_session_questions`
- [x] View `paper_section_stats`
- [x] Update `Initial_Migration.txt` + `requirements/sql/papers_v1.sql`
- [x] Types in `src/types/index.ts` if needed

## Sprint 2 — Dedicated paper session

- [x] Route `src/app/papers/[paperId]/session.tsx`
- [x] Load ordered paper questions without `is_correct`
- [x] Keep section, order, marks, negative_marks, question_type
- [x] Single-select renderers: mcq_single, true_false, assertion_reason
- [x] Timer from `duration_minutes`
- [x] Preferred language translations
- [x] Pre-start validation
- [x] Wire Start from paper detail
- [x] Analytics: `paper_opened`, `paper_started`

## Sprint 3 — Persist / resume

- [x] `start_paper_attempt` reuse in-progress
- [x] Partial unique index for one in-progress attempt
- [x] Upsert answers on select/flag
- [x] Resume restores index, answers, flags, time
- [x] List/detail Start vs Resume

## Sprint 4 — Result + list status

- [x] Route `src/app/papers/[paperId]/result.tsx`
- [x] Submit via RPC; navigate with `attemptId` only
- [x] Paper-specific result UI
- [x] List cards: status, score, date, time spent
- [x] Events: completed, result viewed, reattempted

## Sprint 5 — Offline

- [x] Cache paper metadata + questions (no correctness)
- [x] Queue answer upserts; flush on reconnect
- [x] Persist timer + current index locally
- [x] Conflict: server wins if submitted
- [x] Offline open/start if cache exists

## Sprint 6 — PDF

- [x] Signed URL from `pdf_path`
- [x] Download progress, open viewer, cache file
- [x] Error handling for private bucket
- [x] Events: pdf opened / download failed

## Sprint 7 — Listing polish

- [x] Pagination
- [x] Catalogue cache (stale-while-revalidate)
- [x] Standards lookup (no hard-coded 1/2)
- [x] Difficulty from DB
- [x] Section/subject chips
- [x] Header: avatar, name, target class
- [x] i18n paper keys en/hi
- [x] Analytics: list viewed, filter selected

## Sprint 8 — Notifications

- [x] Local incomplete-paper reminder
- [x] (Optional) Expo push for new papers — deferred unless requested

## Sprint 9 — Live verification

- [x] Document SQL run steps / verification checklist (`requirements/papers-verification.md`)
- [ ] Run `papers_v1.sql` on live project (manual — you)
- [ ] Device / RLS smoke per checklist (manual — you)

## Later (out of series)

- [ ] Port engine to mock tests
- [ ] Remaining question types
- [ ] PDF entitlement / monetization
- [ ] Expo push for new papers
