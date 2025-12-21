export const cl_fs_error = {
    not_found: "error.client.fs.not_found",
    request_failure: "error.client.fs.request_failure"
} as const;

export type ClientFsError = keyof typeof cl_fs_error;
export type ClientFsErrorMessage = (typeof cl_fs_error)[ClientFsError];
