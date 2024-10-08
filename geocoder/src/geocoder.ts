import { err_msg, type ErrorMessage, type GeolocationCoordinatesPoint, type ResultsList } from "@radroots/utils";
import type { Database } from "sql.js";
import type { GeocoderDegreeOffset, GeocoderErrorMessage, GeocoderReverseResult } from "./types";
import { parse_geocode_reverse_result } from "./utils";

const KM_PER_DEGREE_LATITUDE = 111;

export class Geocoder {
    private _db: Database | null = null;
    private _database_name: string;

    constructor(database_name: string) {
        if (database_name.charAt(0) !== `/`) throw new Error(`Error: database name must be a valid path`);
        this._database_name = database_name;
    }

    public async connect(): Promise<true | ErrorMessage<GeocoderErrorMessage>> {
        try {
            const init_sqljs = await import("sql.js");
            const sql = await init_sqljs.default();
            const database_resposne = await fetch(this._database_name);
            const database_buffer = await database_resposne.arrayBuffer();
            this._db = new sql.Database(new Uint8Array(database_buffer));
            return true;
        } catch (e) {
            console.log(`Error: Geocoder connect `, e);
            return err_msg(`*`);
        };
    }



    public async reverse(opts: {
        point: GeolocationCoordinatesPoint;
        degree_offset?: GeocoderDegreeOffset;
        limit?: number | false;
    }): Promise<ResultsList<GeocoderReverseResult> | ErrorMessage<GeocoderErrorMessage>> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const limit = typeof opts.limit === `boolean` ? `` : opts.limit ? Math.round(opts.limit) : `1`;
            const deg_offset = opts.degree_offset || 0.5;
            const query = `SELECT * FROM geonames WHERE id IN (SELECT feature_id FROM coordinates WHERE latitude BETWEEN $lat - ${deg_offset} AND $lat + ${deg_offset} AND longitude BETWEEN $lng - ${deg_offset} AND $lng + ${deg_offset} ORDER BY (($lat - latitude) * ($lat - latitude) + ($lng - longitude) * ($lng - longitude) * $scale) ASC${limit ? ` LIMIT ${limit}` : ``});`
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const { lat: $lat, lng: $lng } = opts.point;
            const latScale = KM_PER_DEGREE_LATITUDE;
            const lngScale = KM_PER_DEGREE_LATITUDE * Math.cos($lat * (Math.PI / 180));
            const $scale = (latScale + lngScale) / 2;
            stmt.bind({ $lat, $lng, $scale });
            const results: GeocoderReverseResult[] = [];
            while (stmt.step()) {
                const result = parse_geocode_reverse_result(stmt.getAsObject());
                if (result) results.push(result);
            };
            return { results };
        } catch (e) {
            console.log(`Error: Geocoder reverse `, e);
            return err_msg(`*`);
        };
    }
}