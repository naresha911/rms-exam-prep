---
name: Question Type UI Design Inventory
overview: Catalogue of shared theme tokens (light + dark-ready), presentation variants from Stitch HTML mocks, English comprehension (passage group + per-question marks), and type→variant mapping for reusable question UI across practice, mock tests, and previous papers.
todos:
  - id: design-inventory
    content: Document theme, chrome, variants, comprehension marks, resolution rules, mode matrix, gaps
    status: completed
isProject: false
---

# Question Type UI Design Inventory

## Scope

**This pass:** design inventory only — layouts, semantic tokens, states, comprehension group rules, and type→variant mapping.

**Out of scope:** React components, session rewiring, schema/`QuestionType` migrations, papers list work, implementing dark mode.

**Decision locked:** figure series, coding-decoding, diagrams, fractions, etc. are **presentation variants** of existing types (`mcq_single`, `assertion_reason`, `matching`, …), driven by content flags — not new enum values.

**Reuse target (later):** one set of variant renderers for practice sessions, full mock tests, subject mocks, and previous-year papers.

---

## 1. Shared theme (light today, dark-ready)

Tokens align with [`tailwind.config.js`](../tailwind.config.js) and [`src/constants/index.ts`](../src/constants/index.ts) (Cadet Quest / Stitch).

### 1.1 Light palette (current mocks)

| Role | Token | Light value |
|------|-------|-------------|
| Page background | `surface` / `background` | `#f9f9ff` (mocks also use `#f8f9ff`) |
| Card | `surface-container-lowest` | `#ffffff` |
| Stem / option well | `surface-container-low` | `#f0f3ff` |
| Chip / muted fill | `surface-container` | `#e7eeff` |
| Elevated chip | `surface-container-high` | `#dee8ff` |
| Highest surface | `surface-container-highest` | `#d8e3fb` |
| Primary | `primary` | `#4648d4` |
| Primary container | `primary-container` | `#6063ee` |
| Primary fixed | `primary-fixed` | `#e1e0ff` |
| Primary fixed dim | `primary-fixed-dim` | `#c0c1ff` |
| On primary | `on-primary` | `#ffffff` |
| On surface | `on-surface` | `#111c2d` |
| On surface variant | `on-surface-variant` | `#464554` |
| Outline | `outline` | `#767586` |
| Outline variant | `outline-variant` | `#c7c4d7` |
| Success | `success-green` | `#22C55E` |
| Warning | `warning-amber` | `#F59E0B` |
| Weakness / hard | `weakness-red` | `#EF4444` |
| Error | `error` | `#ba1a1a` |
| Error container | `error-container` | `#ffdad6` |
| Tertiary | `tertiary` | `#994100` |
| Tertiary fixed | `tertiary-fixed` | `#ffdbca` |
| Secondary fixed | `secondary-fixed` | `#d8e2ff` |

### 1.2 Typography, shape, spacing

| Concern | Spec |
|---------|------|
| Font | Plus Jakarta Sans (400–800) |
| Stem | ~15px, semibold, `on-surface`, snug line height |
| Body / options | 13–15px; labels 11–12px bold |
| Q badge | 12px bold; primary fill or `primary-fixed` |
| Card radius | `rounded-2xl` (16px) preferred; some intelligence cards use `rounded-xl` |
| Option radius | `rounded-xl` (12px) |
| Chips | `rounded-lg` or `rounded-full` |
| Page margin | 16px (`margin-mobile`) |
| Card padding | 16px |
| Option gap | 8px |
| Touch target | ≥48px where interactive |

### 1.3 Dark theme readiness (contract only — not implemented)

Every color in question UI must be a **semantic token**, never a one-off hex in layout copy or future components.

#### Light / dark token pairs (draft)

Dark values are provisional (navy-indigo ladder, not pure black). Refine when dark mode ships.

| Token | Light | Dark (draft) |
|-------|-------|--------------|
| `surface` | `#f9f9ff` | `#0f1420` |
| `surface-container-lowest` | `#ffffff` | `#161c2c` |
| `surface-container-low` | `#f0f3ff` | `#1c2436` |
| `surface-container` | `#e7eeff` | `#242c40` |
| `surface-container-high` | `#dee8ff` | `#2c354c` |
| `surface-container-highest` | `#d8e3fb` | `#353f58` |
| `on-surface` | `#111c2d` | `#e8edf8` |
| `on-surface-variant` | `#464554` | `#b0b6c8` |
| `primary` | `#4648d4` | `#c0c1ff` |
| `primary-container` | `#6063ee` | `#3d3fb8` |
| `primary-fixed` | `#e1e0ff` | `#2a2c6e` |
| `on-primary` | `#ffffff` | `#07006c` |
| `outline` | `#767586` | `#9090a3` |
| `outline-variant` | `#c7c4d7` | `#454555` |
| `success-green` | `#22C55E` | `#4ade80` |
| `success-container` | `#DCFCE7` | `#14532d` |
| `warning-amber` | `#F59E0B` | `#fbbf24` |
| `warning-container` | `#FEF3C7` | `#78350f` |
| `weakness-red` | `#EF4444` | `#f87171` |
| `error` | `#ba1a1a` | `#ffb4ab` |
| `error-container` | `#ffdad6` | `#93000a` |
| `tertiary` | `#994100` | `#ffb690` |
| `tertiary-fixed` | `#ffdbca` | `#5c2a00` |

#### Rules for future components

1. Bind styles to semantic tokens / NativeWind theme colors — not raw hex.
2. Prefer theme-safe borders (`border-outline-variant`), not light-only utilities (`border-slate-100`).
3. SVG/diagram strokes and fills use tokens (`primary`, `on-surface`), not hardcoded `#111c2d`.
4. [`ANSWER_STATES`](../src/constants/theme.ts) must gain dark counterparts when dark mode ships.
5. Emerald/red Tailwind utility shortcuts in mocks (`bg-emerald-50`, `text-emerald-700`) map to `success-container` / `success-green` (and dark pairs), not permanent hard-coded greens.

**This pass does not implement dark mode** — only documents the contract so variants stay theme-portable.

---

## 2. Shared question chrome

All leaf variants share this chrome. Reference **token names**, not hex.

| Piece | Behavior |
|-------|----------|
| **Card shell** | `surface-container-lowest`, light `shadow-sm`, border `outline-variant` / `surface-container`, padding 16px, column gap ~10–12px |
| **Header row** | Q# badge + difficulty pill (dot: `success-green` / `warning-amber` / `weakness-red`) + optional source/tag chips + bookmark |
| **Stem** | ~15px semibold `on-surface` |
| **Body slot** | Variant-specific (options, equation, diagram, A/R, figures, lists) |
| **Footer** | Status (Correct / Incorrect / Unattempted) + secondary CTA (Solution / Solve Now / Hint / Explain) |
| **Option states** | `default` \| `selected` \| `correct` \| `incorrect` \| `disabled` — align with `ANSWER_STATES` |

### Header chip recipes

| Chip | Tokens |
|------|--------|
| Q# (filled) | `bg-primary` + `on-primary`, or `bg-primary-fixed` + `primary` |
| Easy | Dot `success-green`; pill `surface-container` / `surface-container-high` |
| Medium | Dot `warning-amber`; may use `secondary-fixed` |
| Hard | Dot `weakness-red`; may use `error-container` |
| Source (e.g. AISSEE 2024) | `tertiary-fixed` + tertiary text, or muted `surface-container` |
| High Yield | `primary-fixed-dim` tint + bold `primary` |
| Bookmark on | Filled icon, `warning-amber` |
| Bookmark off | Outline icon, `outline-variant` |

### List-card compactness (browse / feed)

From Math Mock #01:

- **Solved • Correct:** may show 2×2 option preview with correct option highlighted.
- **Solved • Incorrect / Unattempted:** may **hide** options; show status + CTA only (`Review` / `Solve Now`).
- Full option rows appear when the card is the primary interaction surface (Math #02, Intelligence mocks).

### Responsive layout (phone + tablet)

- **Phone (< 768dp):** page padding 16, content capped at 640; question card + full-width option rows.
- **Tablet portrait (≥ 768dp):** page padding 24, content capped at 720; stem 19px, option text 17px, option row min height 64, letter badge 40.
- **Wide (≥ 1024dp):** two-pane exam layout — main column capped at ~760 with a 300px question-palette rail on the right (mock tests). Practice and papers keep the centered column.
- **Bottom bars:** always pad with `Math.max(insets.bottom, SPACING[4])` so Previous/Next/Submit clear the Android navigation bar.
- `app.json` remains portrait-locked; the two-pane rail activates from available width, not orientation.

### Footer status recipes

| Status | Visual |
|--------|--------|
| Solved • Correct (+marks) | `success-green` + `verified` / `done_all` |
| Solved • Incorrect | `weakness-red` / `error-container` + `cancel` |
| Unattempted | Muted pill `surface-container` + `on-surface-variant`, or outline-variant dot |

---

## 3. Presentation variants catalogue

### Summary

| Variant ID | Source mock | `QuestionType` | Trigger / content shape |
|------------|-------------|----------------|-------------------------|
| `mcq_text_grid` | Math list Q1 | `mcq_single`, `true_false` | Plain text options; 2×2 pills |
| `mcq_text_stack` | Intelligence Q2/Q4 | `mcq_single` | Longer text / codes; full-width radio rows |
| `mcq_equation` | Math #02 Q1 | `mcq_single` | Stem equation box; fraction option nodes |
| `mcq_inline_math` | Math #02 Q4 | `mcq_single` | Stem mono chips; 2×2 numeric options |
| `mcq_diagram` | Math #02 Q2 | `mcq_single` | `has_diagram` / `diagram_path`; 2×2 letter+text |
| `assertion_reason` | Math #02 Q3 | `assertion_reason` | A + R blocks; stacked long options |
| `figure_series` | Intelligence Q1 | `mcq_single` | Problem-figure strip + figure option grid |
| `matching_lists` | Intelligence Q3 | `matching` | List-I / List-II matrix; mapping-code options |
| `list_preview` | Math list Q2–Q5 | any | Browse/feed: stem + status footer; options optional |
| `comprehension_group` | Schema-backed (no HTML yet) | group + children | Sticky/shared passage + ordered child cards |

**Not covered this pass (no Stitch HTML):** leaf UIs for `mcq_multi`, `fill_blank`, `short_answer`. Comprehension is covered as a **group layout** below.

---

### 3.1 `mcq_text_grid`

**Purpose:** Classic AISSEE MCQ with short options.

**Anatomy:**

1. Shared chrome header + stem.
2. **Full-width stacked option rows** (one per line, 12px gap).
3. Footer status / CTA.

**Option styling:**

- Default: `surface-container-low` row, 1.5px `outline-variant` border, letter badge `surface-container-high`, text `on-surface`, trailing unchecked radio.
- Selected: `primary-fixed` row, `primary` border, filled `primary` letter badge, filled radio.
- Correct (review): `success-light` row + `success` border + `check_circle`.
- Incorrect (review): `error-light` row + `error` border + `cancel`; other options use the muted `disabled` state.
- Options render **outside** the question card, as sibling full-width rows.

**Maps to:** `mcq_single`, `true_false` (True/False as two keys).

---

### 3.2 `mcq_text_stack`

**Purpose:** Longer option text, coding-decoding strings, direction answers. After the shared row redesign this is visually identical to `mcq_text_grid`; the resolver keeps the distinction to flag code-like content.

**Anatomy:**

1. Stem (may bold/highlight codes with `primary` + wider tracking).
2. **Stacked full-width rows** (~touch-target height).
3. Leading letter badge + option text + trailing radio / check / cancel icon.
4. Options stay outside the question card.

**Option styling:**

- Default: `surface-container-low`, letter badge on `surface-container-high`.
- Selected: `primary-fixed` + primary border + filled letter badge + filled radio.
- Unselected radio: `radio_button_unchecked` in `outline`.
- As with 3.1: correct → `check_circle`, incorrect → `cancel`, other options muted.

**Maps to:** `mcq_single` when option text is long or code-like.

---

### 3.3 `mcq_equation`

**Purpose:** Fraction / arithmetic equation as the visual focus.

**Anatomy:**

1. Short stem (“Solve the given arithmetic equation:”).
2. **Equation display box** — `surface-container-low`, centered, bold; stacked numerator/denominator with primary rule; operators in `on-surface-variant`; `?` in tertiary.
3. **2×2 option cards** (min-height ~72px): letter top-left; fraction centered; correct shows `check_circle` + primary-tinted border.

**Content:** equation AST or structured fraction payload preferred over plain Unicode for reliable RN layout.

**Maps to:** `mcq_single` + equation/fraction stem format.

---

### 3.4 `mcq_inline_math`

**Purpose:** Word stem with embedded expressions.

**Anatomy:**

1. Stem with **mono chips**: `surface-container-high`, `primary`, rounded, e.g. `3x − 5 = 2(x + 4)`.
2. 2×2 numeric options (letter circles + bold values).

**Maps to:** `mcq_single` + inline math markers in stem.

---

### 3.5 `mcq_diagram`

**Purpose:** Geometry / figure questions with a shared diagram.

**Anatomy:**

1. Stem referencing the figure.
2. **Diagram well** — `surface-container-low`, rounded; image (`diagram_path`) or SVG; caption below.
3. 2×2 options: letter circle + unit text (e.g. `56 cm²`).
4. Selected: primary border + primary letter fill + small primary dot.

**SVG rules:** strokes/fills from theme tokens for dark readiness.

**Maps to:** `mcq_single` when `has_diagram` / `diagram_path` (or shared group figure).

---

### 3.6 `assertion_reason`

**Purpose:** Assertion (A) + Reason (R) with standard AISSEE choice set.

**Anatomy:**

1. Prompt well (`surface-container-low`):
   - **A** chip (`primary-container`) + “Assertion (A): …”
   - **R** chip (`tertiary-container`) + “Reason (R): …”
2. **Stacked** long options (not 2×2).
3. Review: wrong selection `error-container` + `close`; correct option success border + `check`.

**Maps to:** `question_type = assertion_reason` (always this presentation).

---

### 3.7 `figure_series`

**Purpose:** Non-verbal intelligence — complete the series.

**Anatomy:**

1. Stem.
2. **Problem figures** panel: label “Problem Figures”; **4-column** grid; cells with SVG/image; last cell often `(?)` help icon.
3. **2×2 option grid**: letter circle + figure thumbnail; selected/correct uses primary surface + `check_circle`.

**Maps to:** `mcq_single` + problem-figure assets / option images (presentation variant, not a new enum).

---

### 3.8 `matching_lists`

**Purpose:** Match List-I to List-II.

**Anatomy:**

1. Stem.
2. **Two-column matrix** in `surface-container-low`: List-I `(i)(ii)(iii)` and List-II `(P)(Q)(R)` as mini cards.
3. Stacked options whose text is mapping codes, e.g. `(i)-Q, (ii)-R, (iii)-P`.

**Answer model (future):** `matching_answer` and/or precomposed MCQ option keys — UI still looks like matching.

**Maps to:** `question_type = matching`.

---

### 3.9 `list_preview`

**Purpose:** Browse/feed density — not a stem format.

**Anatomy:** Shared chrome + stem; **options optional**; footer status + CTA.

**Maps to:** any leaf type in feed/browse context; wraps the resolved leaf presentation.

---

### 3.10 `comprehension_group`

**Purpose:** English (or other) passage shared by several questions. See §4.

**Anatomy:** Passage panel + ordered child cards (each child uses a leaf variant).

**Maps to:** `question_groups.group_type = comprehension` + `group_questions` children — not a scorable leaf alone.

---

## 4. English comprehension (passage + questions + marks)

No Stitch HTML yet. Rules follow the existing schema and AISSEE-style scoring.

### 4.1 Data model

From [`requirements/Initial_Migration.txt`](../requirements/Initial_Migration.txt):

- `question_groups` with `group_type = 'comprehension'` (also supports `cloze`, `data_interpretation`, `puzzle`, `shared_figure`).
- `question_group_translations.shared_text` → **passage**.
- Optional `shared_image_path` on the group.
- `group_questions` links children: `(group_id, question_id, question_order)`.

Rules:

- One group owns the passage; children are ordered by `question_order`.
- Children are usually `mcq_single` (sometimes `true_false` / later types); each keeps its own `question_type`, options, and marks.
- Do **not** score the passage as a `questions` row. Prefer **group + children** over leaf `QuestionType = comprehension` for scoring.

### 4.2 UI layout

| Region | Spec |
|--------|------|
| Passage panel | Label “Passage”; body `shared_text`; `surface-container-low`; long-form readable type; sticky in exam while answering children when possible |
| Child cards | Prefer `mcq_text_stack` for longer English options; else `mcq_text_grid`; Q numbers follow paper/section order |
| Browse/feed | Excerpt + “N questions” + Solve CTA |
| Session | Passage sticky + one-at-a-time child **or** scrollable stack |
| Review | Passage + each child’s result and marks |

Same group chrome can later wrap `shared_figure` / DI with a shared image instead of (or plus) text.

### 4.3 Marks awarding (locked)

| Rule | Decision |
|------|----------|
| Passage | **0 marks** — shared context only |
| Each child question | Scored **independently** via that question’s `marks` / `negative_marks` (or `paper_questions` overrides) |
| Group total | **Sum of child marks** (display only; no separate group score row required) |
| Partial credit at group level | **None** — wrong child does not affect siblings |
| Negative marking | **Per child**, same as standalone MCQs |
| Unattempted child | **0** for that child |
| Attempt storage | One answer row **per child `question_id`** (`attempt_answers` / `paper_attempt_answers`); **no** answer row for the group id |

---

## 5. Variant → renderer contract (design-only)

```ts
// Design contract only — not implemented in this pass
type QuestionPresentation =
  | 'mcq_text_grid'
  | 'mcq_text_stack'
  | 'mcq_equation'
  | 'mcq_inline_math'
  | 'mcq_diagram'
  | 'assertion_reason'
  | 'figure_series'
  | 'matching_lists'
  | 'list_preview'
  | 'comprehension_group'; // group chrome; children resolve to leaf presentations
```

### Resolution order

1. In a `comprehension` (or DI / `shared_figure`) group → wrap with `comprehension_group`; each child still resolves its own leaf presentation.
2. `assertion_reason` → `assertion_reason`.
3. `matching` → `matching_lists`.
4. `mcq_single` + problem figures / option images → `figure_series`.
5. `mcq_single` + `has_diagram` / `diagram_path` → `mcq_diagram`.
6. `mcq_single` + equation/fraction payload → `mcq_equation` or `mcq_inline_math`.
7. Else → `mcq_text_grid` or `mcq_text_stack` by option text length / code-like content.
8. Feed/browse context → may additionally wrap as `list_preview`.

---

## 6. Mode matrix

| Mode | Options | Correctness | Passage (group) | Primary CTA |
|------|---------|-------------|-----------------|-------------|
| **Browse / feed** | Optional / preview | Shown if already solved | Excerpt + child count | Solve Now / Solution |
| **Exam session** | Select only | Hidden until submit | Sticky while on children | Next / Submit choice |
| **Practice / review** | Interactive | Reveal correct / incorrect | Full passage + per-child marks | View solution / Explain |

Filters in mocks (All / Easy / Medium / Hard / Unattempted / Saved, or type chips) are **screen chrome**, not part of the question variant.

---

## 7. Gaps vs app today

| Area | Current state |
|------|----------------|
| Session UI | Practice, mock, and paper sessions use the shared `QuestionRenderer`; text MCQs render full-width rows via `AnswerCard` outside the question card. |
| Responsive sessions | Centered max-width column on tablets; mock tests add a question-palette rail from 1024dp; all bottom bars respect safe-area insets. |
| Paper support | [`src/lib/papers.ts`](../src/lib/papers.ts) allows `mcq_single` \| `true_false` \| `assertion_reason` but renders them identically |
| Fetch | Practice/mock fetch hard-filters `mcq_single` in [`src/lib/supabase.ts`](../src/lib/supabase.ts) |
| Matching / diagrams | Typed (`matching`, `has_diagram`, option images) but unused in live UI |
| Groups | `QuestionGroupType` exists; `question_groups` / comprehension not wired into sessions |
| Dark theme | Light-only tokens in constants/tailwind; no theme provider |
| Orphaned UI | Older `QuestionCard` / `OptionCard` / palette components exist but are not the session path |

---

## 8. Next pass (when ready)

1. Implement shared question shell + leaf variant renderers bound to **semantic tokens** only.
2. Add `comprehension_group` chrome (passage + children) and per-child scoring as in §4.3.
3. Wire variants into practice, mock, and paper sessions behind a presentation resolver (§5).
4. Optionally add dark token values + theme switch using the pairs in §1.3.

No React work in this pass.

---

## Source mocks

| Mock | Variants illustrated |
|------|----------------------|
| AISSEE Full Mock Test #01 (Math list/feed) | `mcq_text_grid`, `list_preview`, shared chrome, filters, docked Start Exam |
| AISSEE Mock Test #02 (Math rich cards) | `mcq_equation`, `mcq_diagram`, `assertion_reason`, `mcq_inline_math` |
| Intelligence: Pattern & Analogy | `figure_series`, `mcq_text_stack` (coding + spatial), `matching_lists` |
