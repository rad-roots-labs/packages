
import { LocationGcsSchema, LocationGcsUpdateSchema, MediaUploadSchema, MediaUploadUpdateSchema, NostrProfileSchema, NostrProfileUpdateSchema, NostrRelaySchema, NostrRelayUpdateSchema, TradeProductSchema, TradeProductUpdateSchema, parse_location_gcs, parse_location_gcs_form_fields, parse_location_gcs_get_composite_list, parse_location_gcs_list, parse_media_upload, parse_media_upload_form_fields, parse_media_upload_get_composite_list, parse_media_upload_list, parse_nostr_profile, parse_nostr_profile_form_fields, parse_nostr_profile_get_composite_list, parse_nostr_profile_list, parse_nostr_profile_relay_list, parse_nostr_relay, parse_nostr_relay_form_fields, parse_nostr_relay_get_composite_list, parse_nostr_relay_list, parse_trade_product, parse_trade_product_form_fields, parse_trade_product_get_composite_list, parse_trade_product_list, parse_trade_product_location_list, parse_trade_product_media_list, type ILocationGcsAdd, type ILocationGcsAddResolve, type ILocationGcsDelete, type ILocationGcsDeleteResolve, type ILocationGcsGet, type ILocationGcsGetOne, type ILocationGcsGetOneResolve, type ILocationGcsGetResolve, type ILocationGcsUpdate, type ILocationGcsUpdateResolve, type IMediaUploadAdd, type IMediaUploadAddResolve, type IMediaUploadDelete, type IMediaUploadDeleteResolve, type IMediaUploadGet, type IMediaUploadGetOne, type IMediaUploadGetOneResolve, type IMediaUploadGetResolve, type IMediaUploadUpdate, type IMediaUploadUpdateResolve, type IModelsQueryBindValueTuple, type IModelsQueryValue, type INostrProfileAdd, type INostrProfileAddResolve, type INostrProfileDelete, type INostrProfileDeleteResolve, type INostrProfileGet, type INostrProfileGetOne, type INostrProfileGetOneResolve, type INostrProfileGetResolve, type INostrProfileRelayRelation, type INostrProfileRelayRelationResolve, type INostrProfileRelayRelationResolveGetAll, type INostrProfileUpdate, type INostrProfileUpdateResolve, type INostrRelayAdd, type INostrRelayAddResolve, type INostrRelayDelete, type INostrRelayDeleteResolve, type INostrRelayGet, type INostrRelayGetOne, type INostrRelayGetOneResolve, type INostrRelayGetResolve, type INostrRelayUpdate, type INostrRelayUpdateResolve, type ITradeProductAdd, type ITradeProductAddResolve, type ITradeProductDelete, type ITradeProductDeleteResolve, type ITradeProductGet, type ITradeProductGetOne, type ITradeProductGetOneResolve, type ITradeProductGetResolve, type ITradeProductLocationRelation, type ITradeProductLocationRelationResolve, type ITradeProductLocationRelationResolveGetAll, type ITradeProductMediaRelation, type ITradeProductMediaRelationResolve, type ITradeProductMediaRelationResolveGetAll, type ITradeProductUpdate, type ITradeProductUpdateResolve, type LocationGcsFields, type LocationGcsFormFields, type MediaUploadFields, type MediaUploadFormFields, type NostrProfileFields, type NostrProfileFormFields, type NostrRelayFields, type NostrRelayFormFields, type TradeProductFields, type TradeProductFormFields } from "@radroots/models";
import { err_msg, type ErrorMessage } from "@radroots/utils";
import { invoke } from "@tauri-apps/api/core";
import type { IClientDatabase, IClientDatabaseMessage } from "./types";

export class TauriClientDatabase implements IClientDatabase {
    private append_logs(scope: string, opts: any, error: any): IClientDatabaseMessage {
        console.log("todo... append_logs");
        const error_msg = String(error);
        return error_msg;
    }
        
    private handle_errors(scope: string, opts: any, e: any): ErrorMessage<IClientDatabaseMessage> {
        const error = this.append_logs(scope, opts, e);
        if (error.includes("UNIQUE constraint failed: location_gcs.geohash")) return err_msg("*-location-gcs-geohash-unique");
        else if (error.includes("UNIQUE constraint failed: nostr_relay.url")) return err_msg("*-nostr-relay-url-unique");
        return err_msg(error);
    }

    private filter_bind_value_fields(fields: IModelsQueryBindValueTuple[]): IModelsQueryBindValueTuple[] {
        return fields.filter(([_, v]) => !!v);
    }
    
    private location_gcs_add_validate(fields: LocationGcsFormFields): LocationGcsFields | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_location_gcs_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = LocationGcsSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async location_gcs_add(opts: ILocationGcsAdd): Promise<ILocationGcsAddResolve<IClientDatabaseMessage>> {
        const err_s = this.location_gcs_add_validate(opts);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_location_gcs_add", { opts });
            if ("id" in response && typeof response.id === "string") return { id: response.id };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_add", opts, e);
        };
    }

    public async location_gcs_get(opts: ILocationGcsGet): Promise<ILocationGcsGetResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_location_gcs_get", { opts: "list" in opts ? { list: { of: parse_location_gcs_get_composite_list(opts.list), sort: opts.sort } } : { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_location_gcs_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_get", opts, e);
        };
    }

    public async location_gcs_get_one(opts: ILocationGcsGetOne): Promise<ILocationGcsGetOneResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_location_gcs_get", { opts: { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results) && response.results.length === 1) {
                const result = parse_location_gcs(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_get", opts, e);
        };
    }

    public async location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_location_gcs_delete", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_delete", opts, e);
        };
    }
    private location_gcs_update_validate(fields: Partial<LocationGcsFormFields>): Partial<LocationGcsFields> | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_location_gcs_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = LocationGcsUpdateSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve<IClientDatabaseMessage>> {
        const err_s = this.location_gcs_update_validate(opts.fields);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_location_gcs_update", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_location_gcs_update", opts, e);
        };
    }
    private trade_product_add_validate(fields: TradeProductFormFields): TradeProductFields | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_trade_product_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = TradeProductSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async trade_product_add(opts: ITradeProductAdd): Promise<ITradeProductAddResolve<IClientDatabaseMessage>> {
        const err_s = this.trade_product_add_validate(opts);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_trade_product_add", { opts });
            if ("id" in response && typeof response.id === "string") return { id: response.id };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_add", opts, e);
        };
    }

    public async trade_product_get(opts: ITradeProductGet): Promise<ITradeProductGetResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_get", { opts: "list" in opts ? { list: { of: parse_trade_product_get_composite_list(opts.list), sort: opts.sort } } : { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_trade_product_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_get", opts, e);
        };
    }

    public async trade_product_get_one(opts: ITradeProductGetOne): Promise<ITradeProductGetOneResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_get", { opts: { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results) && response.results.length === 1) {
                const result = parse_trade_product(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_get", opts, e);
        };
    }

    public async trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_delete", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_delete", opts, e);
        };
    }
    private trade_product_update_validate(fields: Partial<TradeProductFormFields>): Partial<TradeProductFields> | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_trade_product_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = TradeProductUpdateSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve<IClientDatabaseMessage>> {
        const err_s = this.trade_product_update_validate(opts.fields);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_trade_product_update", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_update", opts, e);
        };
    }
    private nostr_profile_add_validate(fields: NostrProfileFormFields): NostrProfileFields | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_nostr_profile_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = NostrProfileSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async nostr_profile_add(opts: INostrProfileAdd): Promise<INostrProfileAddResolve<IClientDatabaseMessage>> {
        const err_s = this.nostr_profile_add_validate(opts);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_nostr_profile_add", { opts });
            if ("id" in response && typeof response.id === "string") return { id: response.id };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_add", opts, e);
        };
    }

    public async nostr_profile_get(opts: INostrProfileGet): Promise<INostrProfileGetResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_get", { opts: "list" in opts ? { list: { of: parse_nostr_profile_get_composite_list(opts.list), sort: opts.sort } } : { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_nostr_profile_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_get", opts, e);
        };
    }

    public async nostr_profile_get_one(opts: INostrProfileGetOne): Promise<INostrProfileGetOneResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_get", { opts: { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results) && response.results.length === 1) {
                const result = parse_nostr_profile(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_get", opts, e);
        };
    }

    public async nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_delete", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_delete", opts, e);
        };
    }
    private nostr_profile_update_validate(fields: Partial<NostrProfileFormFields>): Partial<NostrProfileFields> | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_nostr_profile_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = NostrProfileUpdateSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve<IClientDatabaseMessage>> {
        const err_s = this.nostr_profile_update_validate(opts.fields);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_nostr_profile_update", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_update", opts, e);
        };
    }
    private nostr_relay_add_validate(fields: NostrRelayFormFields): NostrRelayFields | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_nostr_relay_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = NostrRelaySchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async nostr_relay_add(opts: INostrRelayAdd): Promise<INostrRelayAddResolve<IClientDatabaseMessage>> {
        const err_s = this.nostr_relay_add_validate(opts);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_nostr_relay_add", { opts });
            if ("id" in response && typeof response.id === "string") return { id: response.id };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_add", opts, e);
        };
    }

    public async nostr_relay_get(opts: INostrRelayGet): Promise<INostrRelayGetResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_relay_get", { opts: "list" in opts ? { list: { of: parse_nostr_relay_get_composite_list(opts.list), sort: opts.sort } } : { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_nostr_relay_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_get", opts, e);
        };
    }

    public async nostr_relay_get_one(opts: INostrRelayGetOne): Promise<INostrRelayGetOneResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_relay_get", { opts: { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results) && response.results.length === 1) {
                const result = parse_nostr_relay(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_get", opts, e);
        };
    }

    public async nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_relay_delete", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_delete", opts, e);
        };
    }
    private nostr_relay_update_validate(fields: Partial<NostrRelayFormFields>): Partial<NostrRelayFields> | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_nostr_relay_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = NostrRelayUpdateSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve<IClientDatabaseMessage>> {
        const err_s = this.nostr_relay_update_validate(opts.fields);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_nostr_relay_update", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_relay_update", opts, e);
        };
    }
    private media_upload_add_validate(fields: MediaUploadFormFields): MediaUploadFields | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_media_upload_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = MediaUploadSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async media_upload_add(opts: IMediaUploadAdd): Promise<IMediaUploadAddResolve<IClientDatabaseMessage>> {
        const err_s = this.media_upload_add_validate(opts);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_media_upload_add", { opts });
            if ("id" in response && typeof response.id === "string") return { id: response.id };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_upload_add", opts, e);
        };
    }

    public async media_upload_get(opts: IMediaUploadGet): Promise<IMediaUploadGetResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_media_upload_get", { opts: "list" in opts ? { list: { of: parse_media_upload_get_composite_list(opts.list), sort: opts.sort } } : { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_media_upload_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_upload_get", opts, e);
        };
    }

    public async media_upload_get_one(opts: IMediaUploadGetOne): Promise<IMediaUploadGetOneResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_media_upload_get", { opts: { on: opts } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results) && response.results.length === 1) {
                const result = parse_media_upload(response.results[0]);
                if (result) return { result };
            }
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_upload_get", opts, e);
        };
    }

    public async media_upload_delete(opts: IMediaUploadDelete): Promise<IMediaUploadDeleteResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_media_upload_delete", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_upload_delete", opts, e);
        };
    }
    private media_upload_update_validate(fields: Partial<MediaUploadFormFields>): Partial<MediaUploadFields> | string[] {
        const fields_r = Object.entries(fields).filter(([_, v]) => !!v).reduce((acc: Record<string, IModelsQueryValue>, i) => {
            const [key, val] = parse_media_upload_form_fields(i);
            acc[key] = val;
            return acc;
        }, {});
        const schema = MediaUploadUpdateSchema;
        const parsed_schema = schema.safeParse(fields_r);
        if (!parsed_schema.success) return parsed_schema.error.issues.map(i => i.message);
        else return {
            ...parsed_schema.data
        };
    }

    public async media_upload_update(opts: IMediaUploadUpdate): Promise<IMediaUploadUpdateResolve<IClientDatabaseMessage>> {
        const err_s = this.media_upload_update_validate(opts.fields);
        if (Array.isArray(err_s)) return { err_s };
        const fields = this.filter_bind_value_fields(Object.entries(err_s));
        if (!fields.length) return err_msg("*-fields");
        try {
            const response = await invoke<any>("model_media_upload_update", { opts });
            if (response === null) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_media_upload_update", opts, e);
        };
    }

    public async nostr_profile_relay_set(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_relay_set", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_relay_set", opts, e);
        };
    };    

    public async nostr_profile_relay_unset(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_relay_unset", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_relay_unset", opts, e);
        };
    };
    
    public async nostr_profile_relay_get_all(): Promise<INostrProfileRelayRelationResolveGetAll<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_nostr_profile_relay_get_all");
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_nostr_profile_relay_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_nostr_profile_relay_get_all", undefined, e);
        };
    };

    public async trade_product_location_set(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_location_set", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_location_set", opts, e);
        };
    };    

    public async trade_product_location_unset(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_location_unset", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_location_unset", opts, e);
        };
    };
    
    public async trade_product_location_get_all(): Promise<ITradeProductLocationRelationResolveGetAll<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_location_get_all");
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_trade_product_location_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_location_get_all", undefined, e);
        };
    };

    public async trade_product_media_set(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_media_set", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_media_set", opts, e);
        };
    };    

    public async trade_product_media_unset(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaRelationResolve<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_media_unset", { opts });
            if (response === true) return { pass: true };
            else if (typeof response === "string") return err_msg(response);
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_media_unset", opts, e);
        };
    };
    
    public async trade_product_media_get_all(): Promise<ITradeProductMediaRelationResolveGetAll<IClientDatabaseMessage>> {
        try {
            const response = await invoke<any>("model_trade_product_media_get_all");
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_trade_product_media_list(response.results) };
            return err_msg("*-result");
        } catch (e) {
            return this.handle_errors("model_trade_product_media_get_all", undefined, e);
        };
    };
}