import { configure, COMMON_PACKAGES, texToSvg } from 'expo-mathjax/build/MathJaxConverter';

configure({ packages: [...COMMON_PACKAGES, 'mhchem'] });

const math = texToSvg('a^2+b^2=c^2', { display: false });
if (!math.svgString.includes('<svg')) throw new Error('math svg missing');

const chem = texToSvg('\\ce{H2SO4}', { display: false });
if (!chem.svgString.includes('<svg')) throw new Error('chem svg missing');

const frac = texToSvg('\\frac{1}{2}', { display: true });
if (!frac.svgString.includes('<svg')) throw new Error('frac svg missing');

console.log('mathjax smoke tests passed', {
    mathLen: math.svgString.length,
    chemLen: chem.svgString.length,
    fracLen: frac.svgString.length,
});
