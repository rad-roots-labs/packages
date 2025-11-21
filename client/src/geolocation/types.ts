import type { IClientGeolocationPosition, ResolveErrorMsg } from "@radroots/utils";

export type ClientGeolocationError =
    | "error.client.geolocation.permission_denied"
    | "error.client.geolocation.location_unavailable"
    | "error.client.geolocation.position_unavailable"
    | "error.client.geolocation.timeout"
    | "error.client.geolocation.blocked_by_permissions_policy"
    | "error.client.geolocation.unknown_error"
    | "*";

export type IGeolocationIError = ClientGeolocationError;

export interface IClientGeolocation {
    current(): Promise<ResolveErrorMsg<IClientGeolocationPosition, ClientGeolocationError>>;
}
