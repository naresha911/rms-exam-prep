# Cadet Quest Design System

A friendly, motivating, and disciplined design language built for AISSEE (All India Sainik Schools Entrance Examination) preparation. The system balances playful engagement for students with professional trust for parents.

## Core Brand Principles

- **Friendly & Motivating**: Encouraging students through every step of their "mission."
- **Disciplined & Smart**: Reflecting the aspirational nature of the Indian Army and Sainik Schools.
- **Low Cognitive Load**: High contrast, minimal clutter, and large touch targets for young learners.
- **Mascot-Driven**: Cadet Vijay acts as the guide, friend, and motivator throughout the experience.

---

## Visual Language

### Colors

#### Primary Palette (Cadet Purple)
- **Primary**: `#6366f1` (The core brand color, used for main CTAs and active states)
- **Primary Container**: `#e0e7ff` (Used for background of active navigation or soft highlights)
- **On-Primary**: `#ffffff`

#### Secondary Palette (Action Orange)
- **Secondary**: `#f59e0b` (Used for streaks, goals, and attention-grabbing elements)
- **Secondary Container**: `#fef3c7`
- **On-Secondary**: `#ffffff`

#### Semantic Colors
- **Success**: `#22c55e` (Correct answers, goal completion)
- **Warning**: `#f97316` (Needs attention, streaks at risk)
- **Error**: `#ef4444` (Incorrect answers, missing fields)
- **Surface**: `#f9f9ff` (Default background)
- **Surface Variant**: `#f0f3ff` (Card backgrounds, subtle separation)

### Typography
- **Primary Font**: `Plus Jakarta Sans`
- **Headlines**: Semi-bold to Bold. Used for main headings and character dialogue.
- **Body**: Regular. Used for question text and descriptions.
- **Labels**: Medium. Used for navigation and buttons.

### Imagery & Mascot
- **Mascot**: Cadet Vijay (3D rendered character in Indian Army Olive Green).
- **Expressions**: Happy, Thinking, Celebrating, Encouraging, Surprised, Victory, Studying.
- **Backgrounds**: Transparent PNGs placed within purple/blue gradient containers or white cards.

---

## Components

### 1. Top Bar (Student)
- **Height**: 64px
- **Branding**: "AISSEE **Cadet**" (Cadet in Primary Purple).
- **Trailing Items**: Streak indicator (Flame icon + XP) and Notifications.

### 2. Bottom Navigation (Mobile)
- **Height**: 72px
- **Destinations**: Home, Practice, Mock Tests, AI Tutor, Profile.
- **Active State**: Primary Purple icon and label with rounded background.

### 3. Navigation Sidebar (Tablet)
- **Width**: 280px
- **Structure**: Mascot profile header, main navigation links, and "Start Mission" primary CTA at the bottom.

### 4. Interactive Cards
- **Border Radius**: 16px to 24px.
- **Elevation**: Subtle shadow (`0px 4px 6px -1px rgb(0 0 0 / 0.1)`).
- **Background**: Solid White or subtle Surface Variant.

### 5. Buttons
- **Primary**: Large, rounded-full, Primary Purple background, white text. High tactile feel.
- **Secondary**: Outlined or White with Purple text.
- **Quiz Options**: Large cards with A/B/C/D labels. Active state highlighted with Purple border and background.

---

## Layout Systems

### Mobile
- **Margin**: 16px (gutter)
- **Stacking**: Vertical stack with generous whitespace (gap-4 to gap-6).

### Tablet
- **Grid**: Multi-column layouts (Main content area + Side widgets for analytics/readiness).
- **Split View**: Used in practice sessions to show the Question and Question Palette side-by-side.
