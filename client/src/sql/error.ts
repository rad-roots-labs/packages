export const cl_sql_error = {
} as const;

export type ClientSqlError = keyof typeof cl_sql_error;
export type ClientSqlErrorMessage = (typeof cl_sql_error)[ClientSqlError];
