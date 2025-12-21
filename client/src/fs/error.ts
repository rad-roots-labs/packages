export const cl_fs_error = {

} as const;

export type ClientFsError = keyof typeof cl_fs_error;
export type ClientFsErrorMessage = (typeof cl_fs_error)[ClientFsError];
