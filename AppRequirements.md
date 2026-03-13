## Project: Global Intercessory Infrastructure (GII)


This document serves as the master AppRequirements.md for building a serverless, anonymous prayer request platform. It is designed to be parsed by Google Antigravity agents to plan, execute, and verify the engineering tasks defined below.

1. Project Intent and Core Pillars
The goal is to create a dynamic spiritual ecosystem that facilitates communal engagement across geographical boundaries using a "Vibe Coding" approach—high-level natural language intent translated into autonomous implementation.
Trust: Contextual feedback via Antigravity Artifacts (walkthroughs, recordings).
Autonomy: Agent-driven development across Editor, Terminal, and Browser.
Anonymity: Identity management via "Stub Users" and recovery codes.
Presence: Real-time global mapping to visualize intercessory impact.

2. Technical Stack Specification
Frontend: React with react-i18next for multi-language support.
Database: GCP Firestore (Source of Truth) for real-time listeners and offline-first capabilities.
Mapping: AWS Location Service for cost-effective tile rendering and geocoding.
Deployment Region: us-east-1 (AWS) or us-central1 (GCP) for optimal cost-efficiency.
Communication: Firebase Cloud Messaging (FCM) for push, with AWS SES for optional email fallback.

3. Phase-Based Implementation Plan (Task List)
The agent should execute these phases sequentially, generating an Implementation Plan Artifact for review before each step.

Phase 1: Core Anonymous Loop
[x] Initialize React frontend and scaffold Firestore connection.
[x] Implement anonymous "Stub User" creation using UUIDs in Secure, HttpOnly cookies.
[x] Create prayer submission form with text-only fields.
[x] Generate unique, cryptographically secure URLs for each request.
[x] Verification: Use the Antigravity Browser Agent to verify cookie persistence and URL access.

Phase 2: Recovery and Intercessor Tracking
[x] Implement 12-character alphanumeric "Recovery Codes" for cross-device request management.
[x] Build the "I Prayed" interaction with atomic counters in Firestore.
[x] Implement the user_intercessions collection to track followed requests for anonymous users.
[x] Create an optional registration workflow that merges anonymous stub data into permanent profiles.

Phase 3: Discovery and Global Mapping
[x] Implement Geohashing (Level 6) for proximity discovery search.
[x] Integrate AWS Location Service for the interactive map component.
[x] Develop coordinate jittering logic (0.01^\circ precision) to preserve requester privacy.
[ ] Build heatmap and marker clustering for global visualization.

Phase 4: Notifications and Multi-Language
[ ] Set up FCM Service Worker for web push notifications.
[ ] Implement optional email collection for "Magic Link" recovery and update alerts.
[x] Integrate react-i18next for UI translations stored as JSON artifacts.
[ ] Add AI-powered dynamic content translation for requests.

Phase 5: Automated Moderation (Shadow Ban)
[x] Integrate AWS Bedrock Guardrails or GCP Natural Language API for content filtering.
[x] Implement offensive content detection for all visibility levels (Public, Unlisted) to block or shadow-ban inappropriate requests.
[x] Implement "Shadow Ban" logic: flagged content is hidden from global discovery but remains visible to the requester.
[x] **Privacy Fix**: Preserve `requestedVisibility` during flagging to prevent accidental "Public" leakage upon approval.
[x] **Admin UX**: Display intended visibility in Admin Shield to inform moderator decisions.

Phase 6: Support & Community
[x] Implement a support contact mechanism (contact form or dedicated support link).
[x] Update FAQ with "How to contact us" and comprehensive "Usage Guidelines" for the community.

Phase 7: Personal Prayer Journaling
[ ] Implement "Follow-up Notes" for prayers to track the journey from request to answer.
[ ] Add personal categories/tags for prayers (#Family, #Health, etc.) to allow filtering.
[ ] Build a "Prayer Insights" dashboard in the My Prayers section showing answered rates and consistency streaks.
[ ] Implement an "Export My Journal" feature (JSON/PDF) for anonymous data sovereignty.

Phase 8: Progressive Web App & Offline Experience
[ ] Scaffolding: Implement `manifest.json` and basic Service Worker for installability.
[ ] Offline Ready: Configure Firestore persistence and offline caching for the My Prayers section to allow journaling without connectivity.
[ ] Home Screen Integration: Optimized icons and splash screens for premium iOS/Android feel.
[ ] Push Notifications: Connect FCM to the Service Worker for daily intercession reminders and status updates.

4. Agent Behavioral Rules (.agent/rules/*.md)
The following constraints must be active for all agent interactions:
Strict Privacy: "Never store or display raw latitude/longitude coordinates. All geo-data must be jittered or snapped to a Geohash grid before reaching the database."
Least Privilege: "All serverless functions must have unique IAM roles scoped to the minimum required resources (e.g., specific DynamoDB tables or S3 buckets)."
Serverless First: "Avoid persistent infrastructure. Use Cloud Functions/Lambda and on-demand database capacity modes."
Verification Driven: "After every UI change, the agent must use the built-in browser to record a verification walkthrough for the user."

5. Strategic Background (Contextual Knowledge)
Market Gap: Current ChMS (Faith Teams, ChMeetings) focus on member management. There is an unmet need for global, anonymous, geo-proximity-based discovery.
Clinical Viability: Digital prayer apps (e.g., Pray.com) show feasibility in improving mental health and reducing stress symptoms.
Presence Efficacy: Visual representation of global intercessors mitigates "digital distance" and increases self-reported transcendence.

6. Future Enhancements Roadmap
These items are out of scope for the MVP but should be considered in the architectural design:
Crisis Detection: AI-driven NLP to identify markers of self-harm and trigger immediate resource triage.
Scripture Engine: Contextual Bible verse recommendations based on request sentiment.
Gamification: Prayer streaks and milestone badges to encourage consistent intercession.
Accessibility: Voice-to-prayer dictation and audio playback for on-the-go intercession.
Peer Support: Anonymous topic-based "Support Rooms" for matched peer interaction.
Community Governance: Decentralized reporting and moderation system for long-term platform health.

Works cited
1. Anonymous Users - FusionAuth, https://fusionauth.io/docs/lifecycle/register-users/anonymous-user 2. How to Set Up an Anonymous User Flow | by FusionAuth - Medium, https://fusionauth.medium.com/how-to-set-up-an-anonymous-user-flow-5b6122357097 3. DynamoDB vs Firestore: Comparing AWS and Google Cloud NoSQL Databases - Dynomate, https://dynomate.io/blog/dynamodb-vs-firestore/ 4. DynamoDB vs Google Firestore - The Ultimate Comparison - Dynobase, https://dynobase.dev/dynamodb-vs-google-firestore/ 5. Google Firestore vs AWS DynamoDB comparison for serverless apps in Firestore - Examples & AI Generator - SQL Query Builder & Generator - AI Powered Database Assistant - AI2sql, https://ai2sql.io/compare/google-firestore-vs-aws-dynamodb-comparison-for-serverless-apps 6. Get started with Firebase Cloud Messaging in Web apps - Google, https://firebase.google.com/docs/cloud-messaging/js/client
