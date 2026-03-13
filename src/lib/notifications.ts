import { adminDb } from "@/lib/firebase/server";
import { getMessaging } from "firebase-admin/messaging";

export async function sendPushNotification(userId: string, title: string, body: string) {
    try {
        const userDoc = await adminDb.collection("users").doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;

        if (!fcmToken) {
            console.log(`[Push] No FCM token found for user ${userId}`);
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            data: {
                title,
                body,
            },
            android: {
                notification: {
                    tag: "praynow-alert",
                },
            },
            apns: {
                headers: {
                    "apns-priority": "10",
                    "apns-push-type": "alert",
                    "apns-collapse-id": "praynow-alert",
                },
                payload: {
                    aps: {
                        badge: 1,
                        sound: "default",
                    },
                },
            },
            token: fcmToken,
        };

        const response = await getMessaging().send(message);
        console.log('[Push] Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('[Push] Error sending push notification:', error);
    }
}
