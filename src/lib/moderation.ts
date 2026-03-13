import { VertexAI } from "@google-cloud/vertexai";

export type ModerationResult = "ALLOW" | "REJECT" | "FLAG";

export interface ModerationResponse {
    decision: ModerationResult;
    reason?: string;
}

// Initialize Vertex AI with existing credentials
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let vertexAI: VertexAI | null = null;
let generativeModel: any = null;

if (projectId && clientEmail && privateKey) {
    try {
        vertexAI = new VertexAI({
            project: projectId,
            location: "us-central1",
            googleAuthOptions: {
                credentials: {
                    client_email: clientEmail,
                    private_key: privateKey,
                },
            },
        });
        generativeModel = vertexAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to initialize Vertex AI", error);
    }
}

/**
 * Modern AI-powered content moderation.
 * Uses a two-level approach:
 * 1. Fast Pass: Local keyword matching (Instant, Zero Cost)
 * 2. Deep Pass: Gemini 1.5 Flash (Semantic, Semantic context, Multi-language)
 */
export async function analyzePrayerContent(text: string): Promise<ModerationResponse> {
    const lowerText = text.toLowerCase();

    // --- LEVEL 1: FAST PASS (Local Keywords) ---

    // Definite Rejection (Obvious Spam/Commercial Ads)
    const rejectKeywords = [
        "viagra", "buy now", "click here", "limited offer", "discount",
        "casino", "betting", "crypto profit", "make money fast", "prize",
        "winner", "lottery", "ray-ban"
    ];

    if (rejectKeywords.some(kw => lowerText.includes(kw))) {
        return { decision: "REJECT", reason: "commercialContent" };
    }

    // Flagging Patterns (Links etc)
    if ((text.match(/https?:\/\//g) || []).length > 0) {
        return { decision: "FLAG", reason: "suspiciousLinks" };
    }

    // Modern "Fast Pass" for obvious commercial patterns
    const flagKeywords = [
        "invest", "opportunity", "contact me", "whatsapp", "telegram",
        "dm for", "service", "guaranteed", "google", "your website",
        "sales", "business", "company", "product", "software", "app",
        "search index", "search engine", "seo", "marketing", "promotion",
        "advertising", "search ranking", "website design", "online presence",
        "digital marketing", "web development", "app development", "software development"
    ];

    if (flagKeywords.some(kw => lowerText.includes(kw))) {
        return { decision: "FLAG", reason: "suspiciousPatterns" };
    }

    // --- LEVEL 2: DEEP PASS (Vertex AI / Gemini) ---

    if (!generativeModel) {
        // Fallback to allow if AI is not configured and no keywords matched
        return { decision: "ALLOW" };
    }

    try {
        const prompt = `
            Analyze the following prayer submission text for a community prayer platform.
            The platform is for spiritual support, intercession, and praises.

            DECISION CRITERIA:
            - "ALLOW": Genuine prayers, cries for help, spiritual reflections, or praises. Strange or intense emotional content is OK.
            - "REJECT": Obvious commercial ads, illegal services, or sexually explicit content.
            - "FLAG": Ambiguous commercial inquiries (e.g., "how much", "what is the price"), solicitation, suspicious contact info (WhatsApp/Telegram), or content that feels like a business inquiry rather than a prayer.

            Even if the language is not English, analyze the semantic intent.

            TEXT TO ANALYZE:
            "${text}"

            Return JSON exactly: { "decision": "ALLOW" | "REJECT" | "FLAG", "reason": "short explanation" }
        `;

        const result = await generativeModel.generateContent(prompt);
        const responseText = result.response.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(responseText);

        return {
            decision: parsed.decision || "FLAG",
            reason: parsed.reason || "aiAnalysis"
        };
    } catch (error: any) {
        console.error("Vertex AI moderation failed:", error.message);
        // On AI failure, we flag it as a safety precaution if it made it past keywords
        return {
            decision: "FLAG",
            reason: error.message?.includes("billing") ? "aiBillingRequirement" : "aiServiceUnavailable"
        };
    }
}
