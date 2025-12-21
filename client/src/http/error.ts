export const cl_http_error = {
    init_failure: "error.client.http.init_failure",
    fetch_failure: "error.client.http.fetch_failure",
    fetch_image_failure: "error.client.http.fetch_image_failure"
} as const;

export type ClientHttpError = keyof typeof cl_http_error;
export type ClientHttpErrorMessage = (typeof cl_http_error)[ClientHttpError];
