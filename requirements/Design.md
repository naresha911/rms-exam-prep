---
name: Cadet Quest
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464554'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#994100'
  on-tertiary: '#ffffff'
  tertiary-container: '#c05400'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
  success-green: '#22C55E'
  warning-amber: '#F59E0B'
  weakness-red: '#EF4444'
  surface-muted: '#F8FAFC'
  gradient-start: '#6366F1'
  gradient-end: '#A855F7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 16px
  margin-desktop: 32px
  gutter: 16px
  touch-target: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is built on a **playful-yet-disciplined** narrative, tailored for students preparing for the AISSEE. It balances the rigor of military school entrance exams with the high engagement of gamified learning. The visual style is **Tactile & Vibrant**, characterized by "squishy" physical-inspired buttons, generous rounded corners, and a rhythmic use of purple-to-blue gradients.

The emotional goal is to make the student feel like a "Cadet in Training"—every quiz is a mission, every streak is a medal, and the Fox mascot acts as their Commanding Officer/Mentor. The UI avoids clinical academic layouts in favor of high-contrast cards and large touch targets that reduce cognitive load and encourage exploration.

## Colors

The palette is anchored by a vibrant **Electric Indigo** primary, used for high-intent actions and branding. Gradients transitioning from purple to blue or light purple provide a sense of depth and energy on hero cards and progress backgrounds.

- **Primary & Secondary:** Used for "Cadet" identity and main navigation.
- **Tertiary (Orange):** Specifically reserved for the Fox mascot, streaks, and "Urgent" gamification elements like XP or limited-time challenges.
- **Semantic Feedback:**
    - **Green:** High mastery (80%+).
    - **Amber:** Developing mastery (60-79%).
    - **Red:** Weak areas (<60%) and incorrect answers.
- **Backgrounds:** Pure white surfaces for clarity, with `#F8FAFC` for secondary container fills to distinguish different "mission" modules.

## Typography

This design system uses **Plus Jakarta Sans** across all levels for its modern, friendly, and geometric proportions. The high x-height ensures readability for younger students on small screens.

- **Headlines:** Use Bold (700) or ExtraBold (800) weights to create a strong hierarchy. Display styles are reserved for victory screens and scoreboards.
- **Body:** Content-heavy areas (question text) use the `body-lg` style to ensure clarity and reduce eye strain during long study sessions.
- **Interactive:** Labels use SemiBold weights and slightly tighter tracking to fit comfortably within touch-friendly buttons.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a "Roomy" philosophy. 

- **Grid:** On mobile, a single-column stack is preferred for focus. On tablets/desktops, a 12-column grid is used with content centered in a 1024px max-width container.
- **Touch Ergonomics:** All interactive elements (answer choices, navigation) must maintain a minimum height of `touch-target` (48px) to accommodate younger users.
- **Margins:** A standard 16px safety margin on mobile ensures content doesn't feel cramped. Vertical spacing between different "Mission Cards" is set to 24px (`stack-lg`) to provide clear visual separation.

## Elevation & Depth

This design system uses **Tactile Tonal Layers** rather than traditional photorealistic shadows.

- **The "3D" Button Effect:** Primary buttons use a bottom border (2-4px) that is a darker shade of the primary color to simulate a physical button that can be "pressed."
- **Soft Cards:** Dashboard modules use a white surface with a very soft, high-diffusion shadow (8% opacity) and a subtle 1px border in a muted neutral shade to define edges without adding visual noise.
- **Active States:** When an answer card is selected, it swaps its soft shadow for a thick, colored border (2px) and a subtle inner-glow in the primary color.

## Shapes

The shape language is **Rounded and Friendly**. 

- **Standard Elements:** Buttons and Input fields use a 0.5rem (8px) radius.
- **Large Containers:** Content cards and onboarding modules use `rounded-lg` (1rem / 16px) or `rounded-xl` (1.5rem / 24px) to emphasize the soft, "app-like" feel.
- **Status Pills:** XP badges and Mastery labels use pill-shaped (fully rounded) corners to differentiate them from functional containers.

## Components

### Buttons
- **Primary:** Purple background with a darker bottom-edge "shadow." Bold white text.
- **Secondary:** White background with a 2px purple border and purple text.
- **Ghost:** No background/border, used for "Skip" or secondary navigation.

### Answer Cards (MCQs)
- Large, blocky cards with 16px padding.
- **Default:** White background, light gray border.
- **Selected:** Light purple background, Indigo border.
- **Correct:** Light green background, Green border.
- **Incorrect:** Light red background, Red border.

### Progress Bars
- Thick, rounded tracks (12px height).
- Background track is a light gray or muted purple; the fill is a vibrant purple-to-blue gradient.
- Optional "Fox" icon that slides along the track as progress increases.

### Dashboard Cards
- Modules for "Today's Mission" or "Mock Tests" should be large with 24px internal padding. 
- Include an icon or illustration (e.g., a book or a robot) on the right side of the card to create visual interest.

### The Mascot (The Cadet VIJAY)
- The Cadet Vijay should appear in the top corner of quiz screens or in the center of empty states.
- Speech bubbles from the Cadet Vijay use `body-md` text and a 12px corner radius.