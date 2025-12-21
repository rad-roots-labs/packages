export const cl_notifications_error = {
    unavailable: "error.client.notifications.unavailable",
    read_failure: "error.client.notifications.read_failure"
} as const;

export type ClientNotificationsError = keyof typeof cl_notifications_error;
export type ClientNotificationsErrorMessage = (typeof cl_notifications_error)[ClientNotificationsError];
