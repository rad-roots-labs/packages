
import { LocationGcsSchema, LocationGcsUpdateSchema, NostrProfileSchema, NostrProfileUpdateSchema, NostrRelaySchema, NostrRelayUpdateSchema, TradeProductSchema, TradeProductUpdateSchema, parse_location_gcs_form_fields, parse_location_gcs_list, parse_nostr_profile_form_fields, parse_nostr_profile_list, parse_nostr_relay_form_fields, parse_nostr_relay_list, parse_trade_product_form_fields, parse_trade_product_list, type ILocationGcsAdd, type ILocationGcsAddResolve, type ILocationGcsDelete, type ILocationGcsDeleteResolve, type ILocationGcsGet, type ILocationGcsGetResolve, type ILocationGcsUpdate, type ILocationGcsUpdateResolve, type IModelsQueryBindValueTuple, type IModelsQueryValue, type INostrProfileAdd, type INostrProfileAddResolve, type INostrProfileDelete, type INostrProfileDeleteResolve, type INostrProfileGet, type INostrProfileGetResolve, type INostrProfileRelayRelation, type INostrProfileRelayRelationResolve, type INostrProfileUpdate, type INostrProfileUpdateResolve, type INostrRelayAdd, type INostrRelayAddResolve, type INostrRelayDelete, type INostrRelayDeleteResolve, type INostrRelayGet, type INostrRelayGetResolve, type INostrRelayUpdate, type INostrRelayUpdateResolve, type ITradeProductAdd, type ITradeProductAddResolve, type ITradeProductDelete, type ITradeProductDeleteResolve, type ITradeProductGet, type ITradeProductGetResolve, type ITradeProductUpdate, type ITradeProductUpdateResolve, type LocationGcsFields, type LocationGcsFormFields, type NostrProfileFields, type NostrProfileFormFields, type NostrRelayFields, type NostrRelayFormFields, type TradeProductFields, type TradeProductFormFields } from "@radroots/models";
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
            const response = await invoke<any>("model_location_gcs_get", { opts: "list" in opts ? { list: { of: opts.list, sort: opts.sort } } : { on: { ...opts } } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_location_gcs_list(response.results) };
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
            const response = await invoke<any>("model_trade_product_get", { opts: "list" in opts ? { list: { of: opts.list, sort: opts.sort } } : { on: { ...opts } } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_trade_product_list(response.results) };
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
            const response = await invoke<any>("model_nostr_profile_get", { opts: "list" in opts ? { list: { of: opts.list, sort: opts.sort } } : { on: { ...opts } } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_nostr_profile_list(response.results) };
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
            const response = await invoke<any>("model_nostr_relay_get", { opts: "list" in opts ? { list: { of: opts.list, sort: opts.sort } } : { on: { ...opts } } });
            if (typeof response === "string") return err_msg(response);
            else if ("results" in response && Array.isArray(response.results)) return { results: parse_nostr_relay_list(response.results) };
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
}