export const cl_tangle_error = {
    init_failure: "error.client.tangle.init_failure",
    parse_failure: "error.client.tangle.parse_failure",
    invalid_response: "error.client.tangle.invalid_response",
    runtime_unavailable: "error.client.tangle.runtime_unavailable"
} as const;

export type ClientTangleError = keyof typeof cl_tangle_error;
export type ClientTangleErrorMessage = (typeof cl_tangle_error)[ClientTangleError];
