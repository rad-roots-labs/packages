import type { IClientGeolocationPosition, ResolveErrorMsg } from "@radroots/utils";

export type IGeolocationIError =
    | `error.client.geolocation.permission_denied`
    | `error.client.geolocation.location_unavailable`
    | `error.client.geolocation.timeout`
    | `*`;

export type IClientGeolocation = {
    current(): Promise<ResolveErrorMsg<IClientGeolocationPosition, IGeolocationIError>>;
};