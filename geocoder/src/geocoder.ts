import type { GeolocationPoint } from "@radroots/geo";
import { err_msg, resolve_wasm_path } from "@radroots/utils";
import type { Database } from "sql.js";
import type { GeocoderConfig, GeocoderConnectConfig, GeocoderReverseResult, IGeocoder, IGeocoderConnectResolve, IGeocoderCountryCenter, IGeocoderCountryCenterResolve, IGeocoderCountryListResolve, IGeocoderCountryListResult, IGeocoderCountryResolve, IGeocoderReverseOpts, IGeocoderReverseResolve } from "./types.js";
import { parse_geocode_country_center_result, parse_geocode_country_list_result, parse_geocode_reverse_result, resolve_geocoder_database_path } from "./utils.js";

const KM_PER_DEGREE_LATITUDE = 111;
const DEFAULT_SQL_WASM_PATH = `/assets/sql-wasm.wasm`;

const normalize_geocoder_connect_config = (config?: GeocoderConnectConfig | string): GeocoderConnectConfig => {
    if (!config) return {};
    if (typeof config === `string`) return { wasm_path: config };
    return config;
};

export class Geocoder implements IGeocoder {
    private _db: Database | null = null;
    private _database_path: string;

    constructor(config?: GeocoderConfig | string) {
        const database_path = typeof config === `string` ? config : config?.database_path;
        this._database_path = resolve_geocoder_database_path(database_path);
    }

    public async connect(config?: GeocoderConnectConfig | string): Promise<IGeocoderConnectResolve> {
        try {
            const connect_config = normalize_geocoder_connect_config(config);
            const database_path = connect_config.database_path
                ? resolve_geocoder_database_path(connect_config.database_path)
                : this._database_path;
            const init_sqljs = await import(`sql.js`);
            const sql = await init_sqljs.default({
                locateFile: wasm_file => resolve_wasm_path(connect_config.wasm_path, wasm_file, DEFAULT_SQL_WASM_PATH)
            });
            const database_res = await fetch(database_path);
            const database_buffer = await database_res.arrayBuffer();
            this._db = new sql.Database(new Uint8Array(database_buffer));
            return true;
        } catch (e) {
            console.log(`Error: Geocoder connect `, e);
            return err_msg(`*`);
        };
    }

    public async reverse(point: GeolocationPoint, opts?: IGeocoderReverseOpts): Promise<IGeocoderReverseResolve> {
        try {
            if (!this._db) return err_msg(`*-db`);
            const limit = typeof opts?.limit === `boolean` ? `` : opts?.limit ? Math.round(opts.limit) : `1`;
            const deg_offset = opts?.degree_offset || 0.5;
            const query = `SELECT * FROM geonames WHERE id IN (SELECT feature_id FROM coordinates WHERE latitude BETWEEN $lat - ${deg_offset} AND $lat + ${deg_offset} AND longitude BETWEEN $lng - ${deg_offset} AND $lng + ${deg_offset} ORDER BY (($lat - latitude) * ($lat - latitude) + ($lng - longitude) * ($lng - longitude) * $scale) ASC${limit ? ` LIMIT ${limit}` : ``});`
            const stmt = this._db.prepare(query);
            if (!stmt) return err_msg(`*-statement`);
            const { lat: pt_lat, lng: pt_lng } = point;
            const lat_scale = KM_PER_DEGREE_LATITUDE;
            const lng_scale = KM_PER_DEGREE_LATITUDE * Math.cos(pt_lat * (Math.PI / 180));
            const scale = (lat_scale + lng_scale) / 2;
            stmt.bind({ $lat: pt_lat, $lng: pt_lng, $scale: scale });
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
            const { country_id } = opts;
            stmt.bind({ $id: country_id });
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
            const { country_id } = opts;
            stmt.bind({ $id: country_id });
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
