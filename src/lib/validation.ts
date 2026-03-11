/**
 * Basic validation for prayer content to prevent XSS, spam, and code-like content.
 */
/**
 * Basic validation for prayer content to prevent XSS, spam, and code-like content.
 */
export function validatePrayerText(text: string): string {
    if (!text || text.trim() === "") {
        throw new Error("required");
    }

    let sanitized = text.trim();

    // 1. Length Limits
    const minLength = 10;
    const maxLength = 2000;

    if (sanitized.length < minLength) {
        throw new Error("tooShort");
    }
    if (sanitized.length > maxLength) {
        throw new Error("tooLong");
    }

    // 2. Simple XSS Prevention: Strip HTML tags
    sanitized = sanitized.replace(/<[^>]*>?/gm, '');

    // 3. Simple "Legitimate Content" Checks
    // Check for excessive URLs (spam)
    const urlCount = (sanitized.match(/https?:\/\/[^\s]+/g) || []).length;
    if (urlCount > 2) {
        throw new Error("tooManyLinks");
    }

    // Check if it's just a URL
    if (sanitized.match(/^https?:\/\/[^\s]+$/)) {
        throw new Error("justUrl");
    }

    // Check for "code-like" patterns (very basic)
    const codeKeywords = ["import ", "function ", "const ", "let ", "var ", "export "];
    const hasCodeKeywords = codeKeywords.some(kw => sanitized.includes(kw));
    if (sanitized.includes("{") && sanitized.includes("}") && hasCodeKeywords) {
        throw new Error("invalidContent");
    }

    // Check for excessive repetitive characters (gibberish/spam)
    if (/(.)\1{15,}/.test(sanitized)) {
        throw new Error("repetition");
    }

    return sanitized;
}
