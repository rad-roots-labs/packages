import type { GeolocationCoordinatesPoint } from "@radroots/utils";
import type { Database, ParamsObject } from "sql.js";
import type { GeocoderErrorMessage, GeocoderReverseResult } from "./types";

export class Geocoder {
    private _db: Database | null = null;
    private _database_name: string;

    constructor(database_name: string) {
        if (database_name.charAt(0) !== `/`) throw new Error(`Error: database name must be a valid path`);
        this._database_name = database_name;
    }

    public async connect(): Promise<true | GeocoderErrorMessage> {
        try {
            const init_sqljs = await import("sql.js");
            const sql = await init_sqljs.default();
            const database_resposne = await fetch(this._database_name);
            const database_buffer = await database_resposne.arrayBuffer();
            this._db = new sql.Database(new Uint8Array(database_buffer));
            return true;
        } catch (e) {
            console.log(`Error: Geocoder.connect() `, e);
            return `*`;
        };
    }

    private parse_geocode_result(obj: ParamsObject): GeocoderReverseResult | undefined {
        if (typeof obj !== 'object' || !obj) return undefined;
        const { id, name, admin1_id, admin1_name, country_id, country_name, latitude, longitude } = obj;
        if (typeof id !== "number" ||
            typeof name !== "string" || !name ||
            typeof admin1_id !== "number" ||
            typeof admin1_name !== "string" || !admin1_name ||
            typeof country_id !== "string" || !country_id ||
            typeof country_name !== "string" || !country_name ||
            typeof latitude !== "number" ||
            typeof longitude !== "number") {
            return undefined;
        }
        return {
            id,
            name,
            admin1_id,
            admin1_name,
            country_id,
            country_name,
            latitude,
            longitude
        };
    }

    public async reverse(opts: {
        point: GeolocationCoordinatesPoint;
    }): Promise<{ results: GeocoderReverseResult[] } | GeocoderErrorMessage> {
        try {
            const stmt = this._db?.prepare(`SELECT * FROM geonames WHERE id IN (SELECT feature_id FROM coordinates WHERE latitude BETWEEN $lat - 1.5 AND $lat + 1.5 AND longitude BETWEEN $lng - 1.5 AND $lng + 1.5 ORDER BY (($lat - latitude) * ($lat - latitude) + ($lng - longitude) * ($lng - longitude) * $scale) ASC LIMIT 1)`);
            if (!stmt) return `*-statement`;
            const { lat: $lat, lng: $lng } = opts.point;
            stmt.bind({ $lat, $lng, $scale: Math.pow(Math.cos($lat * Math.PI / 180), 2) });
            const results: GeocoderReverseResult[] = [];
            while (stmt.step()) {
                const row = stmt.getAsObject();
                const result = this.parse_geocode_result(row);
                if (result) results.push(result);
            };
            return { results };
        } catch (e) {
            console.log(`Error: Geocoder.reverse() `, e);
            return `*`;
        };
    }
}