export const cl_tangle_error = {
} as const;

export type ClientTangleError = keyof typeof cl_tangle_error;
export type ClientTangleErrorMessage = (typeof cl_tangle_error)[ClientTangleError];
