import { setRegion, showMap } from '@radroots/tauri-plugin-map-display';
import type { GeolocationCoordinatesPoint } from '@radroots/utils';
import type { IClientMap } from './types';

export class TauriClientMap implements IClientMap {
    public show_map = async (point: GeolocationCoordinatesPoint): Promise<boolean> => {
        try {
            const { lat: latitude, lng: longitude } = point;
            const res = await showMap({
                mapType: 'standard',
                region: {
                    latitude,
                    longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }
            });
            return res.success;
        } catch (e) {
            console.log(`e show_map`, e)
            return false;
        };
    };

    public set_region = async (point: GeolocationCoordinatesPoint): Promise<boolean> => {
        try {
            const { lat: latitude, lng: longitude } = point;
            const res = await setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            });
            return res.success;
        } catch (e) {
            console.log(`e set_region`, e)
            return false;
        };
    };
}
