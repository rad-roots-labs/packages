import { err_msg, handle_error, type ErrorMessage } from '@radroots/utils';
import {
    checkPermissions,
    getCurrentPosition,
    requestPermissions,
    watchPosition,
    type Position
} from '@tauri-apps/plugin-geolocation';
import { fmt_location_coords } from '../utils';
import type { IClientGeolocation, IClientGeolocationPermission, IClientGeolocationPosition, IClientGeolocationWatchCallback, IClientGeolocationWatchOpts, IGeolocationErrorMessage } from './types';

export class TauriClientGeolocation implements IClientGeolocation {
    private parse_geolocation_position({ coords: pos_coords }: Position): IClientGeolocationPosition {
        const position: IClientGeolocationPosition = {
            lat: fmt_location_coords(pos_coords.latitude),
            lng: fmt_location_coords(pos_coords.longitude),
            accuracy: pos_coords.accuracy || undefined,
            altitude: pos_coords.altitude || undefined,
            altitude_accuracy: pos_coords.altitudeAccuracy || undefined
        };
        return position;
    }

    private async request_permissions(): Promise<IClientGeolocationPermission> {
        return await requestPermissions(['location']);
    }

    private async has_permissions(): Promise<boolean> {
        try {
            const permissions = await checkPermissions();
            if (permissions.location !== `granted`) {
                const permission = await this.request_permissions();
                if (permission.location !== `granted`) return false
            };
            return true
        } catch (e) {
            console.log(`e has_permissions`, e);
            return false;
        }
    }


    public async current(): Promise<IClientGeolocationPosition | ErrorMessage<IGeolocationErrorMessage>> {
        try {
            if (!(await this.has_permissions())) return err_msg(`*-permissions`);
            const position = await getCurrentPosition()
            return this.parse_geolocation_position(position);
        } catch (e) {
            const { error } = handle_error(e);
            if (error.includes(`The operation couldn’t be completed`)) return err_msg(`*-permissions`);
            return err_msg(`*`);
        };
    }

    public async watch(opts: IClientGeolocationWatchOpts = {
        timeout: 10000,
        max_age: 0
    }, callback: IClientGeolocationWatchCallback): Promise<number | ErrorMessage<IGeolocationErrorMessage>> {
        try {
            if (!(await this.has_permissions())) return err_msg(`*-permissions`);
            const position_w = await watchPosition(
                { enableHighAccuracy: true, timeout: opts.timeout, maximumAge: opts.max_age },
                async (pos) => pos ? await callback(this.parse_geolocation_position(pos)) : null
            )
            return position_w;
        } catch (e) {
            const { error } = handle_error(e);
            if (error.includes(`The operation couldn’t be completed`)) err_msg(`*-permissions`);
            return err_msg(`*`);
        };
    }
}
