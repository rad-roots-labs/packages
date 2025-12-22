export const cl_radroots_error = {
    missing_base_url: "error.client.radroots.missing_base_url",
    account_registered: "error.client.radroots.account_registered",
    request_failure: "error.client.radroots.request_failure"
} as const;

export type ClientRadrootsError = keyof typeof cl_radroots_error;
export type ClientRadrootsErrorMessage = (typeof cl_radroots_error)[ClientRadrootsError];
