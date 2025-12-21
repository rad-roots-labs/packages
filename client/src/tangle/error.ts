export const cl_tangle_error = {
    parse_failure: "error.client.tangle.parse_failure",
    invalid_response: "error.client.tangle.invalid_response"
} as const;

export type ClientTangleError = keyof typeof cl_tangle_error;
export type ClientTangleErrorMessage = (typeof cl_tangle_error)[ClientTangleError];
