
import { farm_parse, farm_parse_list, farm_parse_select_query, farm_parse_select_query_list, farm_parse_update_query, farm_validate_form_fields, farm_validate_update_form_fields, location_gcs_parse, location_gcs_parse_list, location_gcs_parse_select_query, location_gcs_parse_select_query_list, location_gcs_parse_update_query, location_gcs_validate_form_fields, location_gcs_validate_update_form_fields, log_error_parse, log_error_parse_list, log_error_parse_select_query, log_error_parse_select_query_list, log_error_parse_update_query, log_error_validate_form_fields, log_error_validate_update_form_fields, media_image_parse, media_image_parse_list, media_image_parse_select_query, media_image_parse_select_query_list, media_image_parse_update_query, media_image_validate_form_fields, media_image_validate_update_form_fields, nostr_profile_parse, nostr_profile_parse_list, nostr_profile_parse_select_query, nostr_profile_parse_select_query_list, nostr_profile_parse_update_query, nostr_profile_validate_form_fields, nostr_profile_validate_update_form_fields, nostr_relay_parse, nostr_relay_parse_list, nostr_relay_parse_select_query, nostr_relay_parse_select_query_list, nostr_relay_parse_update_query, nostr_relay_validate_form_fields, nostr_relay_validate_update_form_fields, trade_product_parse, trade_product_parse_list, trade_product_parse_select_query, trade_product_parse_select_query_list, trade_product_parse_update_query, trade_product_validate_form_fields, trade_product_validate_update_form_fields, type IFarmCreate, type IFarmCreateHandler, type IFarmCreateResolve, type IFarmDelete, type IFarmDeleteHandler, type IFarmDeleteResolve, type IFarmLocationRelation, type IFarmLocationResolve, type IFarmRead, type IFarmReadHandler, type IFarmReadList, type IFarmReadListHandler, type IFarmReadListResolve, type IFarmReadResolve, type IFarmUpdate, type IFarmUpdateHandler, type IFarmUpdateResolve, type ILocationGcsCreate, type ILocationGcsCreateHandler, type ILocationGcsCreateResolve, type ILocationGcsDelete, type ILocationGcsDeleteHandler, type ILocationGcsDeleteResolve, type ILocationGcsRead, type ILocationGcsReadHandler, type ILocationGcsReadList, type ILocationGcsReadListHandler, type ILocationGcsReadListResolve, type ILocationGcsReadResolve, type ILocationGcsUpdate, type ILocationGcsUpdateHandler, type ILocationGcsUpdateResolve, type ILogErrorCreate, type ILogErrorCreateHandler, type ILogErrorCreateResolve, type ILogErrorDelete, type ILogErrorDeleteHandler, type ILogErrorDeleteResolve, type ILogErrorRead, type ILogErrorReadHandler, type ILogErrorReadList, type ILogErrorReadListHandler, type ILogErrorReadListResolve, type ILogErrorReadResolve, type ILogErrorUpdate, type ILogErrorUpdateHandler, type ILogErrorUpdateResolve, type IMediaImageCreate, type IMediaImageCreateHandler, type IMediaImageCreateResolve, type IMediaImageDelete, type IMediaImageDeleteHandler, type IMediaImageDeleteResolve, type IMediaImageRead, type IMediaImageReadHandler, type IMediaImageReadList, type IMediaImageReadListHandler, type IMediaImageReadListResolve, type IMediaImageReadResolve, type IMediaImageUpdate, type IMediaImageUpdateHandler, type IMediaImageUpdateResolve, type INostrProfileCreate, type INostrProfileCreateHandler, type INostrProfileCreateResolve, type INostrProfileDelete, type INostrProfileDeleteHandler, type INostrProfileDeleteResolve, type INostrProfileRead, type INostrProfileReadHandler, type INostrProfileReadList, type INostrProfileReadListHandler, type INostrProfileReadListResolve, type INostrProfileReadResolve, type INostrProfileRelayRelation, type INostrProfileRelayResolve, type INostrProfileUpdate, type INostrProfileUpdateHandler, type INostrProfileUpdateResolve, type INostrRelayCreate, type INostrRelayCreateHandler, type INostrRelayCreateResolve, type INostrRelayDelete, type INostrRelayDeleteHandler, type INostrRelayDeleteResolve, type INostrRelayRead, type INostrRelayReadHandler, type INostrRelayReadList, type INostrRelayReadListHandler, type INostrRelayReadListResolve, type INostrRelayReadResolve, type INostrRelayUpdate, type INostrRelayUpdateHandler, type INostrRelayUpdateResolve, type ITradeProductCreate, type ITradeProductCreateHandler, type ITradeProductCreateResolve, type ITradeProductDelete, type ITradeProductDeleteHandler, type ITradeProductDeleteResolve, type ITradeProductLocationRelation, type ITradeProductLocationResolve, type ITradeProductMediaRelation, type ITradeProductMediaResolve, type ITradeProductRead, type ITradeProductReadHandler, type ITradeProductReadList, type ITradeProductReadListHandler, type ITradeProductReadListResolve, type ITradeProductReadResolve, type ITradeProductUpdate, type ITradeProductUpdateHandler, type ITradeProductUpdateResolve } from "@radroots/models";
import { err_msg, is_err_response, is_pass_response, is_result_response, is_results_response, type ErrorMessage } from "@radroots/util";
import { invoke } from "@tauri-apps/api/core";
import type { IClientTauriDatabase, IClientTauriDatabaseMessage } from "./types";

export class TauriClientDatabase implements IClientTauriDatabase {
    private append_logs(scope: string, opts: any, error: any): IClientTauriDatabaseMessage {
        console.log('[radroots] append_logs (scope, opts, error)');
        console.log(scope, opts, error);
        const error_msg = String(error);
        return `append_logs::${error_msg}`;
    }

    private handle_errors(scope: string, opts: any, e: any): ErrorMessage<IClientTauriDatabaseMessage> {
        const error = this.append_logs(scope, opts, e);
        if (error.includes("UNIQUE constraint failed: location_gcs.geohash")) return err_msg("*-location-gcs-geohash-unique");
        else if (error.includes("UNIQUE constraint failed: nostr_relay.url")) return err_msg("*-nostr-relay-url-unique");
        return err_msg(error);
    }

    public reset = async (): Promise<{ pass: true } | ErrorMessage<IClientTauriDatabaseMessage>> => {
        try {
            const response = await invoke<any>("model_tables_reset");
            return { pass: true };
        } catch (e) {
            return this.handle_errors("reset", undefined, e);
        };
    }

    public async location_gcs_create(opts: ILocationGcsCreate): Promise<ILocationGcsCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = location_gcs_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_location_gcs_create", { args } satisfies ILocationGcsCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_create", opts, e);
        };
    }

    public async location_gcs_read(opts: ILocationGcsRead): Promise<ILocationGcsReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = location_gcs_parse_select_query(opts);
            const response = await invoke<any>("model_location_gcs_read", { args } satisfies ILocationGcsReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = location_gcs_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_read", opts, e);
        };
    }

    public async location_gcs_read_list(opts?: ILocationGcsReadList): Promise<ILocationGcsReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = location_gcs_parse_select_query_list(opts);
            const response = await invoke<any>("model_location_gcs_read_list", { args } satisfies ILocationGcsReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = location_gcs_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_read_list", opts, e);
        };
    }

    public async location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = location_gcs_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = location_gcs_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_location_gcs_update", { args } satisfies ILocationGcsUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_update", opts, e);
        };
    }

    public async location_gcs_delete(args: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_location_gcs_delete", { args } satisfies ILocationGcsDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_delete", args, e);
        };
    }

    public async trade_product_create(opts: ITradeProductCreate): Promise<ITradeProductCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = trade_product_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_trade_product_create", { args } satisfies ITradeProductCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_create", opts, e);
        };
    }

    public async trade_product_read(opts: ITradeProductRead): Promise<ITradeProductReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = trade_product_parse_select_query(opts);
            const response = await invoke<any>("model_trade_product_read", { args } satisfies ITradeProductReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = trade_product_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_read", opts, e);
        };
    }

    public async trade_product_read_list(opts?: ITradeProductReadList): Promise<ITradeProductReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = trade_product_parse_select_query_list(opts);
            const response = await invoke<any>("model_trade_product_read_list", { args } satisfies ITradeProductReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = trade_product_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_read_list", opts, e);
        };
    }

    public async trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = trade_product_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = trade_product_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_trade_product_update", { args } satisfies ITradeProductUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_update", opts, e);
        };
    }

    public async trade_product_delete(args: ITradeProductDelete): Promise<ITradeProductDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_delete", { args } satisfies ITradeProductDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_delete", args, e);
        };
    }

    public async nostr_profile_create(opts: INostrProfileCreate): Promise<INostrProfileCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_profile_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_nostr_profile_create", { args } satisfies INostrProfileCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_create", opts, e);
        };
    }

    public async nostr_profile_read(opts: INostrProfileRead): Promise<INostrProfileReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_profile_parse_select_query(opts);
            const response = await invoke<any>("model_nostr_profile_read", { args } satisfies INostrProfileReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = nostr_profile_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_read", opts, e);
        };
    }

    public async nostr_profile_read_list(opts?: INostrProfileReadList): Promise<INostrProfileReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_profile_parse_select_query_list(opts);
            const response = await invoke<any>("model_nostr_profile_read_list", { args } satisfies INostrProfileReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = nostr_profile_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_read_list", opts, e);
        };
    }

    public async nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = nostr_profile_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = nostr_profile_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_nostr_profile_update", { args } satisfies INostrProfileUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_update", opts, e);
        };
    }

    public async nostr_profile_delete(args: INostrProfileDelete): Promise<INostrProfileDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_delete", { args } satisfies INostrProfileDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_delete", args, e);
        };
    }

    public async nostr_relay_create(opts: INostrRelayCreate): Promise<INostrRelayCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_relay_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_nostr_relay_create", { args } satisfies INostrRelayCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_create", opts, e);
        };
    }

    public async nostr_relay_read(opts: INostrRelayRead): Promise<INostrRelayReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_relay_parse_select_query(opts);
            const response = await invoke<any>("model_nostr_relay_read", { args } satisfies INostrRelayReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = nostr_relay_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_read", opts, e);
        };
    }

    public async nostr_relay_read_list(opts?: INostrRelayReadList): Promise<INostrRelayReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = nostr_relay_parse_select_query_list(opts);
            const response = await invoke<any>("model_nostr_relay_read_list", { args } satisfies INostrRelayReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = nostr_relay_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_read_list", opts, e);
        };
    }

    public async nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = nostr_relay_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = nostr_relay_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_nostr_relay_update", { args } satisfies INostrRelayUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_update", opts, e);
        };
    }

    public async nostr_relay_delete(args: INostrRelayDelete): Promise<INostrRelayDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_relay_delete", { args } satisfies INostrRelayDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_delete", args, e);
        };
    }

    public async media_image_create(opts: IMediaImageCreate): Promise<IMediaImageCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = media_image_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_media_image_create", { args } satisfies IMediaImageCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_image_create", opts, e);
        };
    }

    public async media_image_read(opts: IMediaImageRead): Promise<IMediaImageReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = media_image_parse_select_query(opts);
            const response = await invoke<any>("model_media_image_read", { args } satisfies IMediaImageReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = media_image_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_image_read", opts, e);
        };
    }

    public async media_image_read_list(opts?: IMediaImageReadList): Promise<IMediaImageReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = media_image_parse_select_query_list(opts);
            const response = await invoke<any>("model_media_image_read_list", { args } satisfies IMediaImageReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = media_image_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_image_read_list", opts, e);
        };
    }

    public async media_image_update(opts: IMediaImageUpdate): Promise<IMediaImageUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = media_image_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = media_image_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_media_image_update", { args } satisfies IMediaImageUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_image_update", opts, e);
        };
    }

    public async media_image_delete(args: IMediaImageDelete): Promise<IMediaImageDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_media_image_delete", { args } satisfies IMediaImageDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_image_delete", args, e);
        };
    }

    public async log_error_create(opts: ILogErrorCreate): Promise<ILogErrorCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = log_error_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_log_error_create", { args } satisfies ILogErrorCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_log_error_create", opts, e);
        };
    }

    public async log_error_read(opts: ILogErrorRead): Promise<ILogErrorReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = log_error_parse_select_query(opts);
            const response = await invoke<any>("model_log_error_read", { args } satisfies ILogErrorReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = log_error_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_log_error_read", opts, e);
        };
    }

    public async log_error_read_list(opts?: ILogErrorReadList): Promise<ILogErrorReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = log_error_parse_select_query_list(opts);
            const response = await invoke<any>("model_log_error_read_list", { args } satisfies ILogErrorReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = log_error_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_log_error_read_list", opts, e);
        };
    }

    public async log_error_update(opts: ILogErrorUpdate): Promise<ILogErrorUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = log_error_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = log_error_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_log_error_update", { args } satisfies ILogErrorUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_log_error_update", opts, e);
        };
    }

    public async log_error_delete(args: ILogErrorDelete): Promise<ILogErrorDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_log_error_delete", { args } satisfies ILogErrorDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_log_error_delete", args, e);
        };
    }

    public async farm_create(opts: IFarmCreate): Promise<IFarmCreateResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = farm_validate_form_fields(opts);
            if (Array.isArray(args)) return { err_s: args };
            const response = await invoke<any>("model_farm_create", { args } satisfies IFarmCreateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_result_response(response)) return { id: response.result };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_create", opts, e);
        };
    }

    public async farm_read(opts: IFarmRead): Promise<IFarmReadResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = farm_parse_select_query(opts);
            const response = await invoke<any>("model_farm_read", { args } satisfies IFarmReadHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const result = farm_parse(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_read", opts, e);
        };
    }

    public async farm_read_list(opts?: IFarmReadList): Promise<IFarmReadListResolve<IClientTauriDatabaseMessage>> {
        try {
            const args = farm_parse_select_query_list(opts);
            const response = await invoke<any>("model_farm_read_list", { args } satisfies IFarmReadListHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_results_response(response)) {
                const results = farm_parse_list(response.results);
                if (results.length) return { results };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_read_list", opts, e);
        };
    }

    public async farm_update(opts: IFarmUpdate): Promise<IFarmUpdateResolve<IClientTauriDatabaseMessage>> {
        try {
            const fields = farm_validate_update_form_fields(opts.fields);
            if (Array.isArray(fields)) return { err_s: fields };
            const args = farm_parse_update_query(opts.filter, fields);
            const response = await invoke<any>("model_farm_update", { args } satisfies IFarmUpdateHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_update", opts, e);
        };
    }

    public async farm_delete(args: IFarmDelete): Promise<IFarmDeleteResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_farm_delete", { args } satisfies IFarmDeleteHandler);
            if (is_err_response(response)) return err_msg(response.err);
            else if (is_pass_response(response)) return { pass: true };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_delete", args, e);
        };
    }

    public async nostr_profile_relay_set(args: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_relay_set", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_relay_set", args, e);
        };
    }

    public async nostr_profile_relay_unset(args: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_relay_unset", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_relay_unset", args, e);
        };
    }

    public async farm_location_set(args: IFarmLocationRelation): Promise<IFarmLocationResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_farm_location_set", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_location_set", args, e);
        };
    }

    public async farm_location_unset(args: IFarmLocationRelation): Promise<IFarmLocationResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_farm_location_unset", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_farm_location_unset", args, e);
        };
    }

    public async trade_product_location_set(args: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_location_set", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_location_set", args, e);
        };
    }

    public async trade_product_location_unset(args: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_location_unset", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_location_unset", args, e);
        };
    }

    public async trade_product_media_set(args: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_media_set", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_media_set", args, e);
        };
    }

    public async trade_product_media_unset(args: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve<IClientTauriDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_media_unset", { args });
            if (response?.pass === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_media_unset", args, e);
        };
    }
}