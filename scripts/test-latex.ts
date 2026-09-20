import { containsLatex, parseLatexSegments } from '../src/utils/latex';

function assert(cond: unknown, message: string) {
    if (!cond) throw new Error(message);
}

const mixed = 'If $a^2+b^2=c^2$ then $$\\frac{1}{2}$$ and \\ce{H2SO4}.';
assert(containsLatex(mixed), 'should detect latex');
const segs = parseLatexSegments(mixed);
assert(segs[0].type === 'text' && segs[0].value.startsWith('If'), 'leading prose');
assert(segs[1].type === 'math' && segs[1].value === 'a^2+b^2=c^2' && segs[1].display === false, 'inline math');
assert(segs.some((s) => s.type === 'math' && s.display === true && s.value.includes('frac')), 'display math');
assert(segs.some((s) => s.type === 'math' && s.value.includes('\\ce{H2SO4}')), 'bare mhchem');

const parens = 'Solve \\(x+1\\) then \\[y=2\\].';
const p = parseLatexSegments(parens);
assert(p.some((s) => s.type === 'math' && s.value === 'x+1' && !s.display), 'paren inline');
assert(p.some((s) => s.type === 'math' && s.value === 'y=2' && s.display), 'bracket display');

assert(!containsLatex('plain text only'), 'plain text has no latex');
assert(parseLatexSegments('hello')[0].type === 'text', 'plain segment');

console.log('latex parser tests passed');
