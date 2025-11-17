import type { Farm } from "@radroots/tangle-schema-bindings";
import type { LocationBasis } from "@radroots/utils";

export type FarmExtended = {
    farm: Farm;
    location?: LocationBasis;
    lots?: FarmLotBasis[];
};


export type FarmLotBasis = {
    id: string;
    location?: LocationBasis;
};