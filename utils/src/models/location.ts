import { GeolocationAddress, GeolocationPoint } from "$root";

export type LocationBasis = {
    id: string;
    point: GeolocationPoint;
    address?: GeolocationAddress;
};