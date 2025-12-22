export const cl_datastore_error = {
    idb_undefined: "error.client.datastore.idb_undefined",
    no_result: "error.client.datastore.no_result"
} as const;

export type ClientDatastoreError = keyof typeof cl_datastore_error;
export type ClientDatastoreErrorMessage = (typeof cl_datastore_error)[ClientDatastoreError];