/** Mixed prose + TeX parser for question stems, options, hints, and solutions. */

export type LatexSegment =
    | { type: 'text'; value: string }
    | { type: 'math'; value: string; display: boolean };

const TOKEN_RE =
    /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\\ce\{[^{}]+\}|\{math:[^}]+\})/g;

export function containsLatex(input?: string | null): boolean {
    if (!input) return false;
    TOKEN_RE.lastIndex = 0;
    return TOKEN_RE.test(input);
}

function unwrapMath(token: string): LatexSegment {
    if (token.startsWith('$$') && token.endsWith('$$')) {
        return { type: 'math', value: token.slice(2, -2).trim(), display: true };
    }
    if (token.startsWith('\\[') && token.endsWith('\\]')) {
        return { type: 'math', value: token.slice(2, -2).trim(), display: true };
    }
    if (token.startsWith('\\(') && token.endsWith('\\)')) {
        return { type: 'math', value: token.slice(2, -2).trim(), display: false };
    }
    if (token.startsWith('$') && token.endsWith('$')) {
        return { type: 'math', value: token.slice(1, -1).trim(), display: false };
    }
    if (token.startsWith('\\ce{') && token.endsWith('}')) {
        return { type: 'math', value: token, display: false };
    }
    const chip = token.match(/^\{math:([^}]+)\}$/);
    if (chip) {
        return { type: 'math', value: chip[1].trim(), display: false };
    }
    return { type: 'text', value: token };
}

export function parseLatexSegments(input?: string | null): LatexSegment[] {
    const text = input ?? '';
    if (!text) return [];
    TOKEN_RE.lastIndex = 0;
    const segments: LatexSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = TOKEN_RE.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        segments.push(unwrapMath(match[0]));
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return segments.length ? segments : [{ type: 'text', value: text }];
}

export function hasTextContent(value?: string | null): boolean {
    return !!value && value.trim().length > 0;
}
