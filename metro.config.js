// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

// NativeWind v5 compiles CSS via this Metro transformer (no Babel step).
// The app styles through StyleSheet.create/useThemedStyles and uses zero `className`,
// so we keep globalClassNamePolyfill off: plain react-native primitives (Pressable,
// View, ...) are left untouched, which is what makes function-style `style` work again.
const config = withNativewind(getDefaultConfig(__dirname), {
    globalClassNamePolyfill: false,
});

// Only route the project's own CSS through react-native-css; node_modules CSS
// (e.g. @expo/log-box) is handled by Expo's default transformer. See the file.
config.transformerPath = require.resolve('./metro-css-transformer.js');

module.exports = config;
