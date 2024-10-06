import type { GeolocationCoordinatesPoint } from "@radroots/utils";
import type { Database } from "sql.js";
import type { GeocoderErrorMessage, GeocoderReverseResult } from "./types";
import { parse_geocode_reverse_result } from "./utils";

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
            console.log(`Error: Geocoder connect `, e);
            return `*`;
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
                const result = parse_geocode_reverse_result(row);
                if (result) results.push(result);
            };
            return { results };
        } catch (e) {
            console.log(`Error: Geocoder reverse `, e);
            return `*`;
        };
    }
}