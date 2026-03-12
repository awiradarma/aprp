import "server-only";
import * as admin from "firebase-admin";

let customInitApp = null;

if (!admin.apps.length) {
    try {
        if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
            customInitApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                }),
            });
        }
    } catch (error) {
        console.error("Firebase admin initialization error", error);
    }
} else {
    customInitApp = admin.app();
}

// Global variable for mock DB across Next.js HMR.
let globalMockDbData = (global as any).__mockDbData;
if (!globalMockDbData) {
    globalMockDbData = {
        prayers: {},
        users: {},
        user_intercessions: {}
    };
    (global as any).__mockDbData = globalMockDbData;
}

const mockDb = {
    collection: (colName: string) => ({
        doc: (docId: string) => ({
            set: async (data: any, options?: any) => {
                if (!globalMockDbData[colName]) globalMockDbData[colName] = {};
                if (options?.merge) {
                    globalMockDbData[colName][docId] = { ...globalMockDbData[colName][docId], ...data };
                } else {
                    globalMockDbData[colName][docId] = data;
                }
                console.log(`[Mock DB] Saved to ${colName}/${docId}`);
            },
            get: async () => {
                const data = globalMockDbData[colName]?.[docId];
                return {
                    exists: !!data,
                    data: () => data
                };
            },
            update: async (data: any) => {
                const existing = globalMockDbData[colName]?.[docId] || {};

                // Handle FieldValue.increment mock
                const updatedData = { ...existing };
                for (const key of Object.keys(data)) {
                    if (data[key] && data[key]._isIncrement) {
                        updatedData[key] = (updatedData[key] || 0) + data[key].value;
                    } else {
                        updatedData[key] = data[key];
                    }
                }

                if (!globalMockDbData[colName]) globalMockDbData[colName] = {};
                globalMockDbData[colName][docId] = updatedData;
                console.log(`[Mock DB] Updated ${colName}/${docId}`);
            }
        }),
        where: (field: string, op: string, value: any) => {
            const chainable = {
                get: async () => {
                    const colData = globalMockDbData[colName] || {};
                    const results: any[] = [];
                    for (const docId of Object.keys(colData)) {
                        const docData = colData[docId];

                        // Handle nested field lookup (e.g. "moderation.status")
                        let actualValue;
                        if (field.includes('.')) {
                            const parts = field.split('.');
                            let current = docData;
                            for (const part of parts) {
                                current = current?.[part];
                            }
                            actualValue = current;
                        } else {
                            actualValue = docData[field];
                        }

                        if (op === "==" && actualValue === value) {
                            results.push({ id: docId, data: () => docData });
                        }
                    }
                    return {
                        empty: results.length === 0,
                        docs: results
                    };
                },
                orderBy: () => chainable,
                limit: () => chainable,
                startAfter: () => chainable,
            };
            return chainable;
        },
        get: async () => {
            const colData = globalMockDbData[colName] || {};
            const results = Object.keys(colData).map((docId) => ({
                id: docId,
                data: () => colData[docId]
            }));
            return {
                empty: results.length === 0,
                docs: results
            };
        },
        orderBy: function () { return this; },
        limit: function () { return this; },
        startAfter: function () { return this; },
    })
};

export const adminDb = customInitApp ? customInitApp.firestore() : mockDb;
export const FieldValue = customInitApp ? admin.firestore.FieldValue : {
    increment: (n: number) => ({ _isIncrement: true, value: n })
};
