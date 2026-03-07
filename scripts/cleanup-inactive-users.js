/**
 * cleanup-inactive-users.js
 *
 * Deletes anonymous user stubs from Firestore that:
 *   1. Have not visited the dashboard in more than DAYS_INACTIVE days
 *   2. Have zero prayer requests attached to them
 *
 * Usage:
 *   node scripts/cleanup-inactive-users.js
 *   node scripts/cleanup-inactive-users.js --days 180   (default: 365)
 *   node scripts/cleanup-inactive-users.js --dry-run    (preview only, no deletions)
 *
 * Requirements:
 *   - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// --- Config ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const daysArg = args.find((a) => a.startsWith("--days"));
const DAYS_INACTIVE = daysArg ? parseInt(daysArg.split("=")[1] || args[args.indexOf(daysArg) + 1]) : 365;

const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - DAYS_INACTIVE);

// --- Firebase Init ---
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const db = getFirestore();

async function main() {
    console.log(`\n🔍 Looking for user stubs inactive since: ${cutoff.toDateString()}`);
    console.log(`   Mode: ${DRY_RUN ? "DRY RUN (no deletions)" : "LIVE"}\n`);

    // 1. Find users not seen since the cutoff
    const usersSnapshot = await db
        .collection("users")
        .where("lastSeenAt", "<", cutoff)
        .get();

    if (usersSnapshot.empty) {
        console.log("✅ No inactive users found. Nothing to clean up.");
        return;
    }

    console.log(`Found ${usersSnapshot.size} user(s) inactive for >${DAYS_INACTIVE} days.\n`);

    let deleted = 0;
    let skipped = 0;

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const data = userDoc.data();
        const lastSeen = data.lastSeenAt?.toDate?.()?.toDateString() ?? "unknown";

        // 2. Check if this user has any prayer requests
        const prayersSnapshot = await db
            .collection("prayers")
            .where("requesterId", "==", userId)
            .limit(1)
            .get();

        if (!prayersSnapshot.empty) {
            console.log(`  ⏭️  Skipping ${userId} (last seen: ${lastSeen}) — has prayer requests.`);
            skipped++;
            continue;
        }

        // 3. Also check intercessions
        const intercessionSnapshot = await db
            .collection("user_intercessions")
            .where("userId", "==", userId)
            .limit(1)
            .get();

        if (!intercessionSnapshot.empty) {
            console.log(`  ⏭️  Skipping ${userId} (last seen: ${lastSeen}) — has intercessions.`);
            skipped++;
            continue;
        }

        // 4. Safe to delete
        console.log(`  🗑️  ${DRY_RUN ? "[DRY RUN] Would delete" : "Deleting"} ${userId} (last seen: ${lastSeen})`);

        if (!DRY_RUN) {
            await db.collection("users").doc(userId).delete();
        }
        deleted++;
    }

    console.log(`\n--- Summary ---`);
    console.log(`  ${DRY_RUN ? "Would delete" : "Deleted"}:  ${deleted} stub(s)`);
    console.log(`  Skipped: ${skipped} stub(s) (have prayer data)`);
    if (DRY_RUN) {
        console.log(`\n  Run without --dry-run to apply deletions.`);
    }
    console.log();
}

main().catch((err) => {
    console.error("Error during cleanup:", err);
    process.exit(1);
});
