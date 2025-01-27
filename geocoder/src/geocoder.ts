import { err_msg, type GeolocationCoordinatesPoint } from "@radroots/utils";
import type { Database } from "sql.js";
import type { GeocoderReverseResult, IGeocoder, IGeocoderConnectResolve, IGeocoderCountryCenter, IGeocoderCountryCenterResolve, IGeocoderCountryListResolve, IGeocoderCountryListResult, IGeocoderCountryResolve, IGeocoderReverseOpts, IGeocoderReverseResolve } from "./types";
import { parse_geocode_country_center_result, parse_geocode_country_list_result, parse_geocode_reverse_result } from "./utils";

const KM_PER_DEGREE_LATITUDE = 111;

export class Geocoder implements IGeocoder {
    private _db: Database | null = null;
    private _database_name: string;

    constructor(database_name?: string) {
        if (database_name && database_name.charAt(0) !== `/`) throw new Error(`Error: database name must be a valid path`);
        this._database_name = database_name || `/geonames/geonames.db`;
    }

    public async connect(wasm_dir: `/assets`): Promise<IGeocoderConnectResolve> {
        try {
            const init_sqljs = await import(`sql.js`);
            const sql = await init_sqljs.default({
                locateFile: wasm_file => `${wasm_dir}/${wasm_file}`
            });
            const database_res = await fetch(this._database_name);
            const database_buffer = await database_res.arrayBuffer();
            this._db = new sql.Database(new Uint8Array(database_buffer));
            return true;
        } catch (e) {
            console.log(`Error: Geocoder connect `, e);
            return err_msg(`*`);
        };
    }

    public async reverse(point: GeolocationCoordinatesPoint, opts?: IGeocoderReverseOpts): Promise<IGeocoderReverseResolve> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const limit = typeof opts?.limit === `boolean` ? `` : opts?.limit ? Math.round(opts.limit) : `1`;
            const deg_offset = opts?.degree_offset || 0.5;
            const query = `SELECT * FROM geonames WHERE id IN (SELECT feature_id FROM coordinates WHERE latitude BETWEEN $lat - ${deg_offset} AND $lat + ${deg_offset} AND longitude BETWEEN $lng - ${deg_offset} AND $lng + ${deg_offset} ORDER BY (($lat - latitude) * ($lat - latitude) + ($lng - longitude) * ($lng - longitude) * $scale) ASC${limit ? ` LIMIT ${limit}` : ``});`
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const { lat: $lat, lng: $lng } = point;
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

    public async country(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryResolve> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const query = `SELECT * FROM geonames WHERE country_id = $id;`
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const $id = opts.country_id
            stmt.bind({ $id });
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

    public async country_list(): Promise<IGeocoderCountryListResolve> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const query = `SELECT country_id, country_name, AVG(latitude) AS latitude_c, AVG(longitude) AS longitude_c FROM geonames GROUP BY country_id;`
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const results: IGeocoderCountryListResult[] = [];
            while (stmt.step()) {
                const result = parse_geocode_country_list_result(stmt.getAsObject());
                if (result) results.push(result);
            };
            return { results };
        } catch (e) {
            console.log(`Error: Geocoder reverse `, e);
            return err_msg(`*`);
        };
    }


    public async country_center(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryCenterResolve> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const query = `SELECT AVG(latitude) AS latitude_c, AVG(longitude) AS longitude_c FROM geonames WHERE country_id = $id;`;
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const $id = opts.country_id
            stmt.bind({ $id });
            while (stmt.step()) {
                const result = parse_geocode_country_center_result(stmt.getAsObject());
                if (result) return { result };
            };
            return err_msg(`*-result`);
        } catch (e) {
            console.log(`Error: Geocoder reverse `, e);
            return err_msg(`*`);
        };
    }
}

