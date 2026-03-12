
export type ModerationResult = "ALLOW" | "REJECT" | "FLAG";

export interface ModerationResponse {
    decision: ModerationResult;
    reason?: string;
}

/**
 * Modern AI-powered content moderation.
 * In a real production environment, this would call Google Cloud Natural Language API,
 * AWS Bedrock Guardrails, or Vertex AI.
 */
export async function analyzePrayerContent(text: string): Promise<ModerationResponse> {
    const lowerText = text.toLowerCase();

    // 1. Definite Rejection (Obvious Spam/Commercial Ads)
    const rejectKeywords = [
        "viagra", "buy now", "click here", "limited offer", "discount",
        "casino", "betting", "crypto profit", "make money fast", "prize",
        "winner", "lottery", "ray-ban"
    ];

    if (rejectKeywords.some(kw => lowerText.includes(kw))) {
        return { decision: "REJECT", reason: "commercialContent" };
    }

    // 2. Flagging (Ambiguous or suspicious content that needs review)
    const flagKeywords = [
        "invest", "opportunity", "contact me", "whatsapp", "telegram",
        "dm for", "service", "guaranteed", "google", "your website", "your app", "your project",
        "sales", "business", "company", "product", "service", "software", "app", "website", "project",
        "search index", "search engine", "seo", "marketing", "promotion", "advertising", "promotion",
        "search result", "search ranking", "search engine optimization", "search engine marketing", "search engine promotion", "search engine advertising", "search engine promotion",
        "website design", "online presence", "digital marketing", "web development", "app development", "software development"
    ];

    if (flagKeywords.some(kw => lowerText.includes(kw)) || (text.match(/https?:\/\//g) || []).length > 0) {
        return { decision: "FLAG", reason: "suspiciousPatterns" };
    }

    // 3. Allowance (Legitimate appearing content)
    return { decision: "ALLOW" };
}
