export const cl_geolocation_error = {
    permission_denied: "error.client.geolocation.permission_denied",
    location_unavailable: "error.client.geolocation.location_unavailable",
    position_unavailable: "error.client.geolocation.position_unavailable",
    timeout: "error.client.geolocation.timeout",
    blocked_by_permissions_policy: "error.client.geolocation.blocked_by_permissions_policy",
    unknown_error: "error.client.geolocation.unknown_error"
} as const;

export type ClientGeolocationError = keyof typeof cl_geolocation_error;
export type ClientGeolocationErrorMessage = (typeof cl_geolocation_error)[ClientGeolocationError];