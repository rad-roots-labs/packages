export type ModelTableBasis = {
    id: string;
    created_at: string;
    updated_at: string;
};

export type ModelLocationGcs = ModelTableBasis & ModelLocationGcsFields;

export type ModelLocationGcsFields = {
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
};
export type ModelLocationGcsFieldsKey = "lat" | "lng" | "geohash" | "kind" | "label" | "area" | "elevation" | "soil" | "climate" | "gc_id" | "gc_name" | "gc_admin1_id" | "gc_admin1_name" | "gc_country_id" | "gc_country_name";

export type ModelLocationGcsFormFields = Record<ModelLocationGcsFieldsKey, string>;

export type ModelLocationGcsEditFields = Partial<ModelLocationGcsFormFields>;

export type ModelTradeProduct = ModelTableBasis & ModelTradeProductFields;

export type ModelTradeProductFields = {
    key: string;
    category: string;
    title: string;
    summary: string;
    process: string;
    lot: string;
    profile: string;
    year: number;
    qty_amt: number;
    qty_unit: string;
    qty_label?: string;
    qty_avail?: number;
    price_amt: number;
    price_currency: string;
    price_qty_amt: number;
    price_qty_unit: string;
    notes?: string;
};
export type ModelTradeProductFieldsKey = "key" | "category" | "title" | "summary" | "process" | "lot" | "profile" | "year" | "qty_amt" | "qty_unit" | "qty_label" | "qty_avail" | "price_amt" | "price_currency" | "price_qty_amt" | "price_qty_unit" | "notes";

export type ModelTradeProductFormFields = Record<ModelTradeProductFieldsKey, string>;

export type ModelTradeProductEditFields = Partial<ModelTradeProductFormFields>;

export type ModelNostrProfile = ModelTableBasis & ModelNostrProfileFields;

export type ModelNostrProfileFields = {
    public_key: string;
    name?: string;
    display_name?: string;
    about?: string;
    website?: string;
    picture?: string;
    banner?: string;
    nip05?: string;
    lud06?: string;
    lud16?: string;
};
export type ModelNostrProfileFieldsKey = "public_key" | "name" | "display_name" | "about" | "website" | "picture" | "banner" | "nip05" | "lud06" | "lud16";

export type ModelNostrProfileFormFields = Record<ModelNostrProfileFieldsKey, string>;

export type ModelNostrProfileEditFields = Partial<ModelNostrProfileFormFields>;

export type ModelNostrRelay = ModelTableBasis & ModelNostrRelayFields;

export type ModelNostrRelayFields = {
    url: string;
    relay_id?: string;
    name?: string;
    description?: string;
    pubkey?: string;
    contact?: string;
    supported_nips?: string;
    software?: string;
    version?: string;
    data?: string;
};
export type ModelNostrRelayFieldsKey = "url" | "relay_id" | "name" | "description" | "pubkey" | "contact" | "supported_nips" | "software" | "version" | "data";

export type ModelNostrRelayFormFields = Record<ModelNostrRelayFieldsKey, string>;

export type ModelNostrRelayEditFields = Partial<ModelNostrRelayFormFields>;

export type ModelMediaImage = ModelTableBasis & ModelMediaImageFields;

export type ModelMediaImageFields = {
    file_path: string;
    mime_type: string;
    res_base: string;
    res_path: string;
    label?: string;
    description?: string;
};
export type ModelMediaImageFieldsKey = "file_path" | "mime_type" | "res_base" | "res_path" | "label" | "description";

export type ModelMediaImageFormFields = Record<ModelMediaImageFieldsKey, string>;

export type ModelMediaImageEditFields = Partial<ModelMediaImageFormFields>;

export type ModelLogError = ModelTableBasis & ModelLogErrorFields;

export type ModelLogErrorFields = {
    error: string;
    message: string;
    stack_trace?: string;
    cause?: string;
    app_system: string;
    app_version: string;
    nostr_pubkey: string;
    data?: string;
};
export type ModelLogErrorFieldsKey = "error" | "message" | "stack_trace" | "cause" | "app_system" | "app_version" | "nostr_pubkey" | "data";

export type ModelLogErrorFormFields = Record<ModelLogErrorFieldsKey, string>;

export type ModelLogErrorEditFields = Partial<ModelLogErrorFormFields>;