import { adminDb } from "./firebase/server";
import { getMessaging } from "firebase-admin/messaging";

export async function sendPushNotification(userId: string, title: string, body: string) {
    try {
        const userDoc = await adminDb.collection("users").doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;

        if (!fcmToken) {
            console.log(`No FCM token found for user ${userId}`);
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            apns: {
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
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}
