import Link from "next/link";

const faqs = [
    {
        q: "Is this truly anonymous?",
        a: "Yes. We never ask for your name, email, or any personal information. There is no account to create. When you first visit, your browser is assigned a random ID (like a temporary nickname for your device) — that's it. Even we cannot tell who you are.",
    },
    {
        q: "Why can I see my prayers on 'My Prayers'? Does that mean someone is tracking me?",
        a: "Not at all. 'My Prayers' works like a private notepad that only your browser can open. Your device remembers a random ID, and when you visit 'My Prayers', it only shows prayers tied to that ID. No one — not us, not anyone else — can look up your prayers by your name, location, or identity. If you clear your browser cookies, even we cannot recover your history.",
    },
    {
        q: "What is a Prayer Key and why do I need it?",
        a: "Your Prayer Key is your only connection to your prayers. Think of it like a physical key to a safety deposit box — we don't know who owns the box, only that the right key opens it. If you want to access your prayers from a new device or after clearing your browser, enter your Prayer Key at the 'Restore Session' page and your prayers will reappear.",
    },
    {
        q: "What personal data do you store?",
        a: "Only three things: (1) your prayer request text, (2) a random anonymous ID that your browser generated locally, and (3) optionally, a rough geographic region if you chose to share your location — never your exact coordinates. We do not store your name, email, IP address, or any identifying information.",
    },
    {
        q: "What happens to my location if I share it?",
        a: "Location is always optional. If you do share it (e.g. 'Chicago, IL'), we immediately apply two layers of privacy protection before saving anything: we slightly randomize the coordinates (±1km) and convert them to a geographic grid cell (Geohash). This means we never know exactly where you are — only a general region. Your raw coordinates are never stored.",
    },
    {
        q: "Can other people see who submitted a prayer request?",
        a: "No. Prayer requests are displayed without any author information. All anyone can see is the prayer text, the rough region (if you shared one), and how many people have prayed for it. There is no way to connect a prayer request back to a person.",
    },
    {
        q: "Can I edit or delete my prayer after submitting?",
        a: "Yes. On your prayer's page, you'll see options to edit the text or mark it as answered — but only on the device that submitted it (or after restoring your session with your Prayer Key).",
    },
    {
        q: "What happens if I clear my browser history or cookies?",
        a: "Your prayer requests remain in the database and are still visible globally, but you will lose the ability to manage them from that device. That's why we give you a Prayer Key — write it down or save it somewhere safe before clearing your browser if you want to keep access.",
    },
    {
        q: "Who runs this?",
        a: "This is a personal ministry project built to connect believers in prayer across geographical boundaries, with no commercial agenda. There are no ads, no data sales, and no monetization.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <main className="max-w-2xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
                    <h1 className="text-3xl font-bold text-gray-900">Privacy & FAQ</h1>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        How anonymity works, what we store, and why you can trust this space.
                    </p>
                </header>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details
                            key={i}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-gray-800 hover:text-blue-700 transition-colors">
                                <span>{faq.q}</span>
                                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                            </summary>
                            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <footer className="text-center text-xs text-gray-400 pt-4 space-y-1">
                    <p>Still have a question? Your privacy is our top priority.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/discover" className="hover:text-blue-600 transition-colors">Discover</Link>
                        <Link href="/my-prayers" className="hover:text-blue-600 transition-colors">My Prayers</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
