import Notification from "../models/Notification.js";
interface NotificationPayload {
    recipient: string
    actor: string
    content: string
}
export async function createNotification({recipient, actor, content} : NotificationPayload) {
    await Notification.create({
        recipient,
        NotificationActor: actor,
        content
    })
}

