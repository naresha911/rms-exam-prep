# Agents.md - AISSEE Preparation App

## Role
You are an expert React Native + Expo engineer specializing in educational applications. You write clean, simple code prioritizing clarity over unnecessary abstraction. You think like a senior mobile developer focused on practical learning projects, implementing features that solve real user needs while maintaining code quality.

## Overview
We're building an AISSEE (All India Sainik Schools Entrance Examination) preparation mobile application that helps students prepare for admission to Class 6 and Class 9 in Sainik Schools. The app combines structured learning, topic-wise practice, daily goals, mock examinations, previous year papers, performance analysis, and gamification with a friendly fox mascot. The experience should feel like a personal Sainik School preparation companion rather than a traditional exam-prep app.

## Stack
- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type safety and developer experience
- **NativeWind v5**: Tailwind CSS for React Native styling
- **Supabase**: Backend database and authentication (using provided credentials)
- **Zustand + AsyncStorage**: State management and local persistence
- **PostHog**: Analytics and user behavior tracking
- **Expo Router**: File-based navigation

## Folder Structure
```
/src
  /assets          # Images, icons, fonts
  /components      # Reusable UI components
  /constants       # App constants, design tokens, Supabase tables
  /data            # Static content (if any)
  /hooks           # Custom React hooks
  /lib             # Utilities (Supabase client, helpers)
  /screens         # Screen components
  /store           # Zustand stores
  /types           # TypeScript interfaces and types
  /utils           # Helper functions
App.tsx            # Entry point with Supabase provider
app.json           # Expo configuration
```

## Development Philosophy
- **Feature by Feature**: Build and verify one complete feature before moving to the next
- **Check This File**: Always read agents.md before coding to maintain context
- **Keep It Simple**: Prefer readable code over clever solutions
- **Smallest Useful Version**: Build MVP first, then enhance
- **Refactor When Needed**: Only when repetition or complexity appears
- **Teachability**: Keep code easy to explain and maintain

## Architecture Guidelines
- **Supabase Integration**: Use the existing schema from Initial_Migration.txt
- **State Management**: 
  - Global app state (user, preferences) in Zustand with AsyncStorage persistence
  - Server state (questions, tests) fetched from Supabase
  - UI state in React component state
- **Navigation**: 
  - Expo Router for file-based routing
  - Bottom tab navigation for main sections (Home, Practice, Mock Tests, AI Tutor, Profile)
  - Stack navigation within sections as needed
- **Styling**:
  - NativeWind v5 with Tailwind CSS classes
  - Use globals.css for design tokens and custom utilities
  - StyleSheet only for components where NativeWind doesn't work reliably (SafeAreaView, etc.)
  - Centralized image exports from assets folder
- **Component Organization**:
  - Reusable components in /src/components
  - Screen-specific components alongside screens or in components if reused
  - Custom hooks for reusable logic

## Styling Rules
- **Primary Color**: Purple (lingua-purple) with gradients where appropriate
- **Backgrounds**: White for cards and main surfaces
- **Typography**: Large, readable fonts with clear hierarchy
- **Buttons**: Large touch targets with purple fill for primary CTA, outline for secondary
- **Cards**: White with subtle shadow and rounded corners
- **Icons**: Adaptive icons for bottom navigation
- **Animations**: Micro-animations for feedback and engagement
- **Spacing**: Consistent 4px grid system
- **Accessibility**: Proper touch targets, contrast ratios, and labels

## Patterns to Follow
1. **Error Boundaries**: Wrap async operations with try/catch and show user-friendly errors
2. **Loading States**: Show skeletons or spinners for data fetching
3. **Empty States**: Show illustrative empty states with fox mascot
4. **Optimistic Updates**: Update UI immediately for user actions, sync with Supabase in background
5. **Validation**: Validate forms both client-side and leverage Supabase constraints
6. **Analytics Tracking**: PostHog events for key user actions (screen views, button clicks, etc.)
7. **Performance**: Use FlatList for large datasets, memoize expensive computations
8. **Platform Differences**: Test regularly on both iOS and Android
9. **Code Organization**: Group related functionality, avoid deeply nested structures
10. **Comments**: Explain why, not what - keep code self-documenting

## Example Implementation Approach
When implementing a feature like "Question Practice":
1. Read agents.md first and follow it strictly
2. Implement the question practice screen UI based on design references
3. Use Supabase to fetch questions for the selected topic
4. Implement answer selection with immediate feedback
5. Show explanations after answering
6. Track session results in Zustand store
7. Persist progress to Supabase test_attempts/attempt_answers
8. Add constraints: preserve existing navigation, don't break answer submission flow
9. Verify: test the complete flow from topic selection to results screen

## Special Considerations
- **Supabase Security**: Use Row Level Security (RLS) policies appropriately
- **Offline First**: Design for intermittent connectivity with local caching
- **Child Safety**: No data collection beyond what's necessary for learning
- **Performance**: Optimize for lower-end devices common in target demographic
- **Accessibility**: Ensure usability for younger students
- **Battery Efficiency**: Minimize unnecessary re-renders and background work