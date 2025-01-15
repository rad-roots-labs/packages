export type ModelNostrProfile = {
    id: string;
    name?: string;
    display_name?: string;
    about?: string;
    picture?: string;
}

export type ModelNostrRelay = {
    id: string;
}

export type ModelLocationGcs = {
    id: string;
    lat: number;
    lng: number;
    geohash: string;
    kind: string;
    label?: string;
    area?: number;
    elevation?: number;
    soil?: string;
    climate?: string;
    gc_id?: string;
    gc_name?: string;
    gc_admin1_id?: string;
    gc_admin1_name?: string;
    gc_country_id?: string;
    gc_country_name?: string;
}

export type ModelTradeProduct = {
    id: string;
}