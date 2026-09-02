// i18n — Internationalization stub with English default and Hindi structure
// Full i18n can be added using expo-localization + react-i18next when needed

type Language = 'en' | 'hi';

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Onboarding
        'onboarding.welcome.title': 'Your Sainik School journey starts here!',
        'onboarding.welcome.subtitle': 'Learn smarter. Practice every day. Get exam ready.',
        'onboarding.welcome.cta': 'Get Started',
        'onboarding.target.title': 'Which class are you preparing for?',
        'onboarding.goal.title': "What's your goal?",
        'onboarding.goal.crack': 'Crack AISSEE',
        'onboarding.goal.improve': 'Improve my score',
        'onboarding.goal.practice': 'Practice every day',
        'onboarding.goal.mock': 'Prepare for my first mock test',

        // Auth
        'auth.signup.title': 'Create your account',
        'auth.signin.title': 'Welcome back!',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.forgot': 'Forgot password?',
        'auth.google': 'Continue with Google',
        'auth.signout': 'Sign Out',

        // Home
        'home.greeting': 'Hello, {name}! 👋',
        'home.mission': "Ready for today's mission?",
        'home.dailyGoal': "Today's Goal",
        'home.remaining': '{n} questions remaining',
        'home.goalComplete': 'Goal achieved! 🎉',
        'home.continuePractice': 'Continue Practice',
        'home.todaysMission': "Today's Mission",
        'home.quickActions': 'Quick Actions',
        'home.yourProgress': 'Your Progress',

        // Practice
        'practice.title': 'Practice',
        'practice.quickPractice': 'Quick Practice',
        'practice.topicPractice': 'Topic Practice',
        'practice.weakAreas': 'Weak Areas',
        'practice.selectSubject': 'Select Subject',
        'practice.selectTopic': 'Select Topic',
        'practice.questionCount': 'How many questions?',
        'practice.difficulty': 'Difficulty',
        'practice.startPractice': 'Start Practice',
        'practice.correct': 'Excellent! 🎉',
        'practice.incorrect': 'Almost there! 💪',
        'practice.nextQuestion': 'Next Question →',

        // Tests
        'tests.title': 'Mock Tests',
        'tests.full': 'Full Mock Test',
        'tests.sectional': 'Sectional Test',
        'tests.speed': 'Speed Test',
        'tests.instructions': 'Read the instructions carefully',
        'tests.startTest': 'Start Test',
        'tests.submitTest': 'Submit Test',
        'tests.timeRemaining': 'Time Remaining',

        // Profile
        'profile.title': 'Profile',
        'profile.myLearning': 'My Learning',
        'profile.bookmarks': 'Bookmarks',
        'profile.mistakes': 'My Mistakes',
        'profile.achievements': 'Achievements',
        'profile.performance': 'Performance',
        'profile.settings': 'Settings',
        'profile.editProfile': 'Edit Profile',

        // Common
        'common.loading': 'Loading...',
        'common.error': 'Something went wrong',
        'common.retry': 'Try Again',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.back': '← Back',
        'common.done': 'Done',
        'common.next': 'Next →',
        'common.skip': 'Skip',
        'common.submit': 'Submit',
        'common.confirm': 'Confirm',
        'common.noData': 'No data available',
    },
    hi: {
        // Onboarding
        'onboarding.welcome.title': 'आपकी सैनिक स्कूल यात्रा यहाँ से शुरू होती है!',
        'onboarding.welcome.subtitle': 'स्मार्ट तरीके से सीखें। हर दिन अभ्यास करें। परीक्षा के लिए तैयार हों।',
        'onboarding.welcome.cta': 'शुरू करें',
        'onboarding.target.title': 'आप किस कक्षा की तैयारी कर रहे हैं?',
        'onboarding.goal.title': 'आपका लक्ष्य क्या है?',
        'onboarding.goal.crack': 'AISSEE पास करना',
        'onboarding.goal.improve': 'अपना स्कोर सुधारना',
        'onboarding.goal.practice': 'हर दिन अभ्यास करना',
        'onboarding.goal.mock': 'पहला मॉक टेस्ट देना',

        // Common
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'कुछ गलत हुआ',
        'common.retry': 'फिर कोशिश करें',
        'common.cancel': 'रद्द करें',
        'common.save': 'सहेजें',
        'common.back': '← वापस',
        'common.next': 'अगला →',
        'common.submit': 'जमा करें',
    },
};

// Default language
let currentLanguage: Language = 'en';

/**
 * Set the active language
 */
export const setLanguage = (lang: Language) => {
    currentLanguage = lang;
};

/**
 * Translate a key with optional variable interpolation
 * Usage: t('home.greeting', { name: 'Aarav' }) → 'Hello, Aarav! 👋'
 */
export const t = (key: string, vars?: Record<string, string | number>): string => {
    const translation =
        translations[currentLanguage]?.[key] ??
        translations['en']?.[key] ??
        key;

    if (!vars) return translation;

    return translation.replace(/\{(\w+)\}/g, (_, varName) =>
        vars[varName]?.toString() ?? `{${varName}}`
    );
};

export default { t, setLanguage };
