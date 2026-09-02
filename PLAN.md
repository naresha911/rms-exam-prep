# AISSEE Student Preparation App - Implementation Plan

## Project Overview
A React Native + Expo mobile app for AISSEE (All India Sainik Schools Entrance Examination) preparation, targeting Class 5 students (Class 6 target) and Class 8 students (Class 9 target). Built feature-by-feature following the agents.md workflow.

---

## Architecture

### Tech Stack
- **Framework**: React Native + Expo SDK 50
- **Language**: TypeScript
- **Styling**: NativeWind v5 (Tailwind CSS for React Native)
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand + AsyncStorage
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Analytics**: PostHog

### Folder Structure
```
/src
  /app                    # Expo Router pages
    /(onboarding)         # Onboarding flow
    /(auth)               # Authentication
    /(tabs)               # Bottom tab navigation
      /home
      /practice
      /tests
      /ai
      /profile
  /assets
    /images               # Fox mascot, illustrations
    /icons                # Tab icons, UI icons
    /fonts                # Custom fonts
  /components
    /ui                   # Button, Card, Input, etc.
    /practice             # QuestionCard, OptionCard, etc.
    /test                 # Timer, Palette, etc.
    /shared               # Shared components
  /constants              # Design tokens, table names
  /data                   # Static content
  /hooks                  # Custom hooks
  /lib                    # Supabase client, helpers
  /screens                # Screen components (used by app/)
  /store                  # Zustand stores
  /types                  # TypeScript interfaces
  /utils                  # Helper functions
```

### Data Flow
1. **Auth State**: Supabase session + Zustand for user profile
2. **Question Fetching**: Supabase queries with caching in Zustand
3. **Practice Sessions**: In-memory in Zustand, synced to Supabase on completion
4. **Progress Tracking**: Real-time updates to Zustand, debounced sync to Supabase

---

## Feature Breakdown (Priority Order)

### Phase 0: Foundation (P0)
- [ ] Install all npm dependencies
- [ ] Configure NativeWind v5 with Tailwind
- [ ] Set up Expo Router file structure
- [ ] Configure TypeScript with proper paths
- [ ] Set up environment variables (.env) for Supabase credentials
- [ ] Create base UI components (Button, Card, Input, ProgressBar, Avatar)
- [ ] Set up error boundary component
- [ ] Set up PostHog analytics provider

### Phase 1: Onboarding & Auth (P0)
- [ ] **Welcome Screen** with fox mascot, "Get Started" CTA
- [ ] **Target Class Screen** (Class 6 / Class 9 selection)
- [ ] **Current Class Screen** (Class 5 / Class 8 / Other)
- [ ] **Goal Screen** (Crack AISSEE / Improve Score / Practice Daily / Mock Test)
- [ ] **Sign Up Screen** (email, password, Google, Apple)
- [ ] **Sign In Screen** (email, password, Google, Apple)
- [ ] **Forgot Password Screen**

### Phase 2: Home Dashboard (P0)
- [ ] Header with greeting, streak, XP, notifications
- [ ] **Daily Goal Card** (15/20 questions, progress bar, continue CTA)
- [ ] **Continue Learning Card** (last topic with progress)
- [ ] **Today's Mission** (3-5 recommended activities)
- [ ] **Quick Stats** (questions solved, accuracy, tests completed)
- [ ] **Achievement Teaser** (recent badges)

### Phase 3: Practice Module (P0)
- [ ] **Practice Hub Screen** (Quick/Topic/Subject/Weak Area options)
- [ ] **Subject List Screen** (fetched from Supabase)
- [ ] **Topic List Screen** (hierarchical, with sub-topics)
- [ ] **Practice Config Screen** (question count, difficulty)
- [ ] **Question Practice Screen** (MCQ, True/False, image-based)
- [ ] **Question Result Overlay** (correct/incorrect feedback, explanation)
- [ ] **Practice Result Screen** (score, accuracy, time, XP earned)
- [ ] **Bookmark & Report actions** on questions

### Phase 4: Mock Tests (P0)
- [ ] **Mock Test List Screen** (Class 6 / Class 9 tests)
- [ ] **Test Instructions Screen** (rules, duration, marks)
- [ ] **Test Interface** (timer, question palette, navigation)
- [ ] **Mark for Review** functionality
- [ ] **Submit Confirmation** modal
- [ ] **Test Result Screen** (score, accuracy, time, subject breakdown)
- [ ] **Test Analysis Screen** (topic-wise performance)

### Phase 5: Previous Year Papers (P0)
- [ ] **Papers List Screen** (filter by class, year, subject)
- [ ] **Paper Details Screen** (instructions, start CTA)
- [ ] **Paper Attempt Screen** (similar to mock test)
- [ ] **Paper Solutions Screen** (review all questions with answers)

### Phase 6: Performance & Progress (P0)
- [ ] **Overall Performance Screen** (score, accuracy, questions solved)
- [ ] **Subject Performance Screen** (per-subject breakdown)
- [ ] **Topic Mastery Screen** (per-topic accuracy with color coding)
- [ ] **Progress Charts** (using react-native-svg)

### Phase 7: Gamification (P1)
- [ ] **XP System** (earn on correct answers, goals, tests)
- [ ] **Level System** (Recruit → Junior Cadet → Cadet → ... → Sage)
- [ ] **Streak Tracking** (consecutive days)
- [ ] **Badges** (First Question, 7-Day Streak, 100 Questions, etc.)
- [ ] **Achievements Screen** (grid of badges with unlock status)

### Phase 8: Profile & Settings (P0)
- [ ] **Profile Screen** (avatar, name, target class, stats)
- [ ] **My Bookmarks Screen** (saved questions)
- [ ] **My Mistakes Screen** (incorrectly answered questions)
- [ ] **Settings Screen** (language, notifications, sound, logout)
- [ ] **Edit Profile Screen**

### Phase 9: AI Tutor Placeholder (P3)
- [ ] **AI Tutor Screen** with "Coming Soon" state
- [ ] Friendly fox mascot with welcome message

---

## Design System

### Colors (from agents.md + Lingua theme)
- **Primary**: `#7C3AED` (purple)
- **Primary Light**: `#A78BFA`
- **Secondary**: `#3B82F6` (blue)
- **Gradient**: Purple → Blue
- **Success**: `#10B981` (green)
- **Warning**: `#F59E0B` (amber)
- **Error**: `#EF4444` (red)
- **Background**: `#FFFFFF` / `#F8FAFC`

### Typography
- **Headings**: 24-36px, bold
- **Body**: 16-18px, regular
- **Captions**: 12-14px, medium

### Components
- **Buttons**: Large rounded, purple primary, outlined secondary
- **Cards**: White, rounded-2xl, subtle shadow
- **Inputs**: Rounded, gray border, large padding
- **Progress Bars**: Purple fill, gray track, rounded

### Mascot
- Orange fox with multiple expressions
- Used in: onboarding, empty states, success feedback, encouragement

---

## Database Integration (Supabase)

### Tables to Read
- `profiles` - User data
- `standards` - Class 6, Class 9
- `subjects` - All subjects
- `topics` - Hierarchical topics
- `questions` + `question_translations` - Question content
- `question_options` + `option_translations` - Answer options
- `tests` + `test_sections` + `test_questions` - Mock tests
- `test_attempts` + `attempt_answers` - Test attempts
- `papers` + `paper_questions` - Previous papers
- `bookmarks` - User bookmarks
- `student_topic_stats` - Per-topic performance
- `question_reports` - User reports

### Tables to Write
- `profiles` (create on signup, update on profile edit)
- `test_attempts` (create on test start, update on submit)
- `attempt_answers` (upsert during test)
- `bookmarks` (toggle)
- `question_reports` (insert on report)
- `student_topic_stats` (upsert on answer)

---

## Navigation Map

```
Splash
  ├── (no auth) → Onboarding → Sign Up → Home
  └── (auth) → Home
      ├── Practice Tab
      │   ├── Practice Hub
      │   │   ├── Quick Practice
      │   │   ├── Topic Practice
      │   │   │   ├── Subject List
      │   │   │   ├── Topic List
      │   │   │   └── Practice Config
      │   │   ├── Subject Practice
      │   │   └── Weak Area Practice
      │   ├── Practice Session
      │   └── Practice Result
      ├── Mock Tests Tab
      │   ├── Test List
      │   ├── Test Instructions
      │   ├── Test Interface
      │   ├── Test Result
      │   └── Test Analysis
      ├── AI Tutor Tab (Coming Soon)
      └── Profile Tab
          ├── Profile Home
          ├── Bookmarks
          ├── Mistakes
          ├── Achievements
          └── Settings
```

---

## Implementation Milestones

### Milestone 1: Working MVP Loop (First Deliverable)
Onboarding → Select Class → Home → Select Subject → Select Topic → 10-Question Practice → Answer + Explanation → Practice Result → Performance → Continue Learning

### Milestone 2: Complete Practice Experience
Full practice module with all modes, bookmarks, reports, explanations

### Milestone 3: Mock Tests
Complete mock test experience with timer, palette, result, analysis

### Milestone 4: Previous Papers
Browse, attempt, and review previous year papers

### Milestone 5: Progress & Gamification
Performance dashboards, XP/levels/streaks/badges

### Milestone 6: Polish & Analytics
PostHog events, error handling, loading states, micro-animations

---

## Key Technical Decisions

1. **Single Source of Truth**: Zustand store for all client-side state, Supabase as backend
2. **Optimistic Updates**: Update UI immediately, sync in background
3. **Offline-First**: Cache questions and attempts locally, sync on reconnect
4. **Question Fetching**: Fetch in batches, paginate for long tests
5. **Timer State**: Use a singleton timer hook for mock tests (persists across re-renders)
6. **Image Handling**: Use Supabase Storage URLs with proper caching
7. **Error Handling**: Try/catch on all async ops, user-friendly error toasts
8. **Performance**: FlatList for all lists, memoize expensive components

---

## Files to Create (Initial Batch)

```
# Configuration
package.json (update with NativeWind v5)
tailwind.config.js (update for v5)
babel.config.js (update for NativeWind v5)
metro.config.js (create)
tsconfig.json (verify paths)
global.css (create)
.env (create with Supabase creds)

# App entry
App.tsx (create)
app.json (update with plugins)

# Routes
src/app/_layout.tsx
src/app/index.tsx
src/app/(onboarding)/_layout.tsx
src/app/(onboarding)/welcome.tsx
src/app/(onboarding)/target-class.tsx
src/app/(onboarding)/current-class.tsx
src/app/(onboarding)/goal.tsx
src/app/(auth)/_layout.tsx
src/app/(auth)/sign-in.tsx
src/app/(auth)/sign-up.tsx
src/app/(auth)/forgot-password.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx (Home)
src/app/(tabs)/practice.tsx
src/app/(tabs)/tests.tsx
src/app/(tabs)/ai.tsx
src/app/(tabs)/profile.tsx
src/app/practice/[subjectId].tsx
src/app/practice/topic/[topicId].tsx
src/app/practice/session.tsx
src/app/practice/result.tsx
src/app/test/[testId]/instructions.tsx
src/app/test/[testId]/session.tsx
src/app/test/[testId]/result.tsx
src/app/test/[testId]/analysis.tsx
src/app/profile/bookmarks.tsx
src/app/profile/mistakes.tsx
src/app/profile/achievements.tsx
src/app/profile/settings.tsx
src/app/profile/edit.tsx

# Components
src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/Input.tsx
src/components/ui/ProgressBar.tsx
src/components/ui/Avatar.tsx
src/components/ui/LoadingSpinner.tsx
src/components/ui/EmptyState.tsx
src/components/ui/ErrorBoundary.tsx
src/components/practice/QuestionCard.tsx
src/components/practice/OptionCard.tsx
src/components/practice/ExplanationCard.tsx
src/components/practice/PracticeResult.tsx
src/components/test/TimerDisplay.tsx
src/components/test/QuestionPalette.tsx
src/components/test/TestInstructions.tsx
src/components/shared/MascotDisplay.tsx
src/components/shared/StreakDisplay.tsx
src/components/shared/XpDisplay.tsx

# Hooks
src/hooks/useAuth.ts
src/hooks/useQuestions.ts
src/hooks/useTimer.ts
src/hooks/useDailyProgress.ts
src/hooks/useTopicStats.ts

# Utils
src/utils/format.ts
src/utils/score.ts
src/utils/storage.ts
src/utils/analytics.ts

# Types (extend existing)
src/types/index.ts (add remaining types)

# Lib
src/lib/supabase.ts (already created, verify)
src/lib/analytics.ts
src/lib/i18n.ts
```

---

## Verification Plan

After each feature:
1. Run `npx tsc --noEmit` to verify TypeScript
2. Run `npx expo start` to test in development
3. Test the complete user flow manually
4. Verify data persists in Supabase
5. Verify PostHog events are tracked
6. Test on both Android (priority) and iOS

---

## Next Steps

1. **Set up project foundation**: Install dependencies, configure NativeWind v5, set up Expo Router
2. **Configure Supabase**: Add credentials, verify schema connectivity
3. **Build Milestone 1**: Onboarding → Practice Loop (the first clickable journey)
4. **Iterate**: Add features one-by-one, verifying each before moving on
