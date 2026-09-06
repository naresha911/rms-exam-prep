# Previous Year Papers — Product & Tech Spec (v1)

**Status:** Implemented in app code. Deploy schema via [`sql/papers_v1.sql`](sql/papers_v1.sql) and verify with [`papers-verification.md`](papers-verification.md).  
**Tracker:** [`papers-sprints.md`](papers-sprints.md)  
**Canonical schema:** [`Initial_Migration.txt`](Initial_Migration.txt) (papers section + attempts)

This document describes what the codebase does today, not the original short draft in `requirements.txt` §34.

---

## 1. Product goals

- Browse published AISSEE previous-year papers for the student’s target class (6 or 9).
- Attempt papers under timed conditions with official question order and paper-specific marks.
- Persist attempts and answers in Supabase; resume in-progress attempts.
- Show data-backed list status (unattempted / in progress / score).
- Open optional official PDF from private Storage (monetization/entitlements deferred).
- Work offline for an in-progress or previously cached session (answers sync when online).

---

## 2. Student flows

```text
Papers list  →  Paper detail  →  Session  →  Result
   /papers       /papers/:id     .../session   .../result?attemptId=
```

| Screen | Route | Role |
|--------|-------|------|
| List | `/papers` | Catalogue, filters, status chips, pagination, header (avatar/name/class) |
| Detail | `/papers/[paperId]` | Metadata, sections, Start / Resume / Re-attempt, PDF, last result |
| Session | `/papers/[paperId]/session` | Timed attempt; **not** `/test/session` |
| Result | `/papers/[paperId]/result` | Server-scored result from `attemptId` only |

Mock tests continue to use `/test/session` and `/test/result` until a later port of this engine.

---

## 3. Data model

### Tables / view

| Object | Notes |
|--------|--------|
| `papers` | Title, year, `standard_id`, stream, marks, duration, `pdf_path`, **`difficulty`**, `is_published` |
| `paper_questions` | Ordered questions; section; paper-level marks / negative_marks |
| `paper_attempts` | Per student; status `in_progress` \| `submitted` \| `abandoned`; scores; `pause_data` |
| `paper_attempt_answers` | Answers; unique `(attempt_id, question_id)`; review flags; marks after submit |
| `paper_section_stats` | View: section → question_count, section_marks |
| `attempt_answers` | Also unique `(attempt_id, question_id)` (mock tests) |

One **in_progress** attempt per `(paper_id, student_id)` (partial unique index).

### Storage

- Private bucket: **`past-paper-pdfs`**
- `papers.pdf_path` points at the object path
- App uses short-lived **signed URLs** (not a public bucket)
- Questions remain in Postgres; the bucket is only for the official PDF file

### RPCs (SECURITY DEFINER + `auth.uid()`)

| RPC | Purpose |
|-----|---------|
| `get_paper_session_questions(paper_id)` | Session payload **without** `is_correct` |
| `start_paper_attempt(paper_id)` | Create or resume in-progress attempt + saved answers |
| `save_paper_answer(...)` | Upsert answer + optional `pause_data` |
| `submit_paper_attempt(attempt_id)` | Server-side scoring; mark submitted |
| `get_my_paper_attempt_summaries(standard_id?)` | Latest attempt summary per paper for list/detail |

---

## 4. Scoring & question types (v1)

**Authoritative score:** `submit_paper_attempt` only.

**Supported in session + scoring:**

- `mcq_single`
- `true_false`
- `assertion_reason`

Other schema types (`mcq_multi`, matching, comprehension, fill/short, etc.) are skipped or shown as unsupported until a later sprint.

Negative marks use `paper_questions.negative_marks` (fallback to question defaults).

---

## 5. Client modules

| Path | Role |
|------|------|
| `src/lib/papers.ts` | API helpers, validation, catalogue/session cache, offline queue |
| `src/lib/paperNotifications.ts` | Local reminder after leaving an incomplete attempt |
| `src/lib/analytics.ts` | Paper-specific events (`paper_opened`, `paper_started`, …) |
| `src/lib/i18n.ts` | Paper UI strings (en / hi) |
| `src/app/papers/*` | Screens |

Standards: resolve Class 6/9 via `standards` table (fallback IDs 1/2 only if lookup fails).

---

## 6. Offline (papers v1)

- Cache paper catalogue and session question payload (no correctness).
- Persist timer, current index, answers, flags locally.
- Queue failed `save_paper_answer` calls; flush when online.
- Conflict: if attempt already **submitted** on server, local in-progress is discarded; otherwise last-write-wins by timestamp for resume state.

---

## 7. Notifications (papers v1)

- **Local** incomplete-paper reminder after exit (Expo Notifications).
- Push for “new paper published” is **out of scope** for v1 (needs push tokens + Edge Function).

---

## 8. Entitlements / Pro

Not enforced in v1. PDF and paper start are available to signed-in students with RLS. Monetization can gate signed-URL / start RPCs later in admin.

---

## 9. Out of scope / later

- Porting persist/resume engine to mock tests
- Remaining question types and complex scoring
- Pro/PDF paywall
- Expo push for new papers
- Formal a11y audit / pixel-perfect web CSS parity
- Subject filter on list (section chips from `paper_section_stats` are present; full subject taxonomy filter may follow)

---

## 10. Deploy & verify

1. Run [`sql/papers_v1.sql`](sql/papers_v1.sql) in Supabase SQL Editor.
2. Ensure private bucket `past-paper-pdfs` exists.
3. Seed/publish papers + `paper_questions` as needed.
4. Complete [`papers-verification.md`](papers-verification.md).
