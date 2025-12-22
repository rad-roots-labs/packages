import type { IClientGeolocationPosition } from "@radroots/geo";
import type { ResolveErrorMsg } from "@radroots/utils";
import { type ClientGeolocationErrorMessage } from "./error.js";

export interface IClientGeolocation {
    current(): Promise<ResolveErrorMsg<IClientGeolocationPosition, ClientGeolocationErrorMessage>>;
}
