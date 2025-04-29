import type { LocationBasis } from "$root";

export type FarmExtended = {
    farm: FarmBasis;
    location?: LocationBasis;
    lots?: FarmLotBasis[];
};

export type FarmBasis = {
    id: string;
    name: string;
    area?: string;
    area_unit?: string;
};

export type FarmLotBasis = {
    id: string;
    location?: LocationBasis;
};

