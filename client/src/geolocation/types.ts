import type { ErrorMessage } from "@radroots/utils";
import {
    type PermissionStatus
} from '@tauri-apps/plugin-geolocation';

export type IClientGeolocationPermission = PermissionStatus;
export type IGeolocationErrorMessage = `*-permissions` | `*`;

export type IClientGeolocationPosition = {
    lat: number;
    lng: number;
    accuracy: number | undefined;
    altitude: number | undefined;
    altitude_accuracy: number | undefined;
};

export type IClientGeolocationWatchOpts = {
    timeout: number;
    max_age: number;
};

export type IClientGeolocationWatchCallback = (pos: IClientGeolocationPosition | null) => Promise<void>;

export type IClientGeolocation = {
    current(): Promise<IClientGeolocationPosition | ErrorMessage<IGeolocationErrorMessage>>;
    watch(opts: IClientGeolocationWatchOpts | undefined, callback: IClientGeolocationWatchCallback): Promise<number | ErrorMessage<IGeolocationErrorMessage>>
};