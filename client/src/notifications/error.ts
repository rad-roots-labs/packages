export const cl_notifications_error = {
    unavailable: "error.client.notifications.unavailable"
} as const;

export type ClientNotificationsError = keyof typeof cl_notifications_error;
export type ClientNotificationsErrorMessage = (typeof cl_notifications_error)[ClientNotificationsError];
