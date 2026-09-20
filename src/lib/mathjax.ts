import { configure, COMMON_PACKAGES } from 'expo-mathjax';

let ready = false;

/** Enable AMS math plus mhchem so $\ce{H2SO4}$ renders in questions and solutions. */
export function initMathJax() {
    if (ready) return;
    configure({ packages: [...COMMON_PACKAGES, 'mhchem'] });
    ready = true;
}
