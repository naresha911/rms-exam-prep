// Wrapper around react-native-css's Metro transformer.
//
// react-native-css v5 (RC) compiles *every* .css file it sees, including
// node_modules CSS Modules such as @expo/log-box's Overlay.module.css, and its
// lightningcss pass throws "failed to deserialize" on those. We only want it to
// process the project's own CSS (global.css), so anything under node_modules is
// delegated back to Expo's default transformer.
const path = require('path');
const { unstable_transformerPath } = require('@expo/metro-config');

// Resolve react-native-css's transformer by absolute path (its package `exports`
// map does not expose the deep dist path directly).
const rncssMetroDir = path.dirname(require.resolve('react-native-css/metro'));
const { transform: reactNativeCSSTransform } = require(path.join(rncssMetroDir, 'metro-transformer.js'));

const defaultTransformer = require(unstable_transformerPath);

const CSS_RE = /\.(s?css|sass)$/;

async function transform(config, projectRoot, filePath, data, options) {
    const isCss = options.type !== 'asset' && CSS_RE.test(filePath);
    const isNodeModules = filePath.includes('node_modules');

    if (isCss && !isNodeModules) {
        return reactNativeCSSTransform(config, projectRoot, filePath, data, options);
    }
    return defaultTransformer.transform(config, projectRoot, filePath, data, options);
}

module.exports = { transform };
