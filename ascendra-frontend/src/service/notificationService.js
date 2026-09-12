import { authApi } from "./authService";

const NOTIFICATIONS_API = "/api/notifications";

export const getUserNotifications = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const response = await authApi.get(
        `${NOTIFICATIONS_API}/user/${userId}`
    );

    return response.data;
};

export const getUnreadNotifications = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const response = await authApi.get(
        `${NOTIFICATIONS_API}/user/${userId}/unread`
    );

    return response.data;
};

export const getUnreadNotificationCount = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const response = await authApi.get(
        `${NOTIFICATIONS_API}/user/${userId}/unread/count`
    );

    return response.data;
};

export const markNotificationAsRead = async (
    notificationId
) => {
    if (!notificationId) {
        throw new Error("Notification ID is required");
    }

    const response = await authApi.patch(
        `${NOTIFICATIONS_API}/${notificationId}/read`
    );

    return response.data;
};

export const markAllNotificationsAsRead = async (
    userId
) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const response = await authApi.patch(
        `${NOTIFICATIONS_API}/user/${userId}/read-all`
    );

    return response.data;
};