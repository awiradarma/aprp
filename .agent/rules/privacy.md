---
trigger: always_on
---

The following constraints must be active for all agent interactions:
Strict Privacy: "Never store or display raw latitude/longitude coordinates. All geo-data must be jittered or snapped to a Geohash grid before reaching the database."
Least Privilege: "All serverless functions must have unique IAM roles scoped to the minimum required resources (e.g., specific DynamoDB tables or S3 buckets)."
Serverless First: "Avoid persistent infrastructure. Use Cloud Functions/Lambda and on-demand database capacity modes."
Verification Driven: "After every UI change, the agent must use the built-in browser to record a verification walkthrough for the user."