import { err_msg, handle_error, parse_geol_coords, type ErrorMessage, type IClientGeolocation, type IClientGeolocationPosition, type IGeolocationErrorMessage } from '@radroots/util';
import {
    checkPermissions,
    getCurrentPosition,
    requestPermissions,
    type PermissionStatus,
    type Position
} from '@tauri-apps/plugin-geolocation';

export class TauriClientGeolocation implements IClientGeolocation {
    private parse_geolocation_position({ coords: geol_p }: Position): IClientGeolocationPosition {
        const position: IClientGeolocationPosition = {
            lat: parse_geol_coords(geol_p.latitude),
            lng: parse_geol_coords(geol_p.longitude),
            accuracy: geol_p.accuracy ?? undefined,
            altitude: geol_p.altitude ?? undefined,
            altitude_accuracy: geol_p.altitudeAccuracy ?? undefined
        };
        return position;
    }

    private async request_permissions(): Promise<PermissionStatus> {
        return await requestPermissions(['location']);
    }

    private async has_permissions(): Promise<boolean> {
        try {
            const permissions = await checkPermissions();
            if (permissions.location !== `granted`) {
                const permission = await this.request_permissions();
                if (permission.location !== `granted`) return false
            };
            return true;
        } catch (e) {
            console.log(`e has_permissions`, e);
            return false;
        }
    }

    public async current(): Promise<IClientGeolocationPosition | ErrorMessage<IGeolocationErrorMessage>> {
        try {
            if (!(await this.has_permissions())) return err_msg(`error.client.geolocation.permission_denied`);
            const position = await getCurrentPosition()
            return this.parse_geolocation_position(position);
        } catch (e) {
            console.log(`e current`, e)
            const { err } = handle_error(e);
            if (err.includes(`The operation couldn’t be completed`)) return err_msg(`error.client.geolocation.location_unavailable`);
            return err_msg(`*`);
        };
    }
}
