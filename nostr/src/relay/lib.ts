import {
    NostrRelayInformationDocument,
    NostrRelayInformationDocumentFields,
} from "../types/lib.js";

type NostrRelayInformationDocumentInput = Record<string, unknown> | string | null | undefined;

const is_record = (value: unknown): value is Record<string, unknown> => {
    if (!value) return false;
    if (typeof value !== "object") return false;
    if (Array.isArray(value)) return false;
    return true;
};

const parse_supported_nips = (value: unknown): number[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    const nips = value.filter((nip): nip is number => typeof nip === "number");
    if (nips.length !== value.length) return undefined;
    return nips;
};

const parse_limitation = (
    limitation: Record<string, unknown> | undefined,
): Pick<NostrRelayInformationDocument, "limitation_payment_required" | "limitation_restricted_writes"> => {
    const payment_required =
        limitation && typeof limitation.payment_required === "string"
            ? limitation.payment_required
            : undefined;
    const restricted_writes =
        limitation && typeof limitation.restricted_writes === "boolean"
            ? limitation.restricted_writes
            : undefined;
    return {
        limitation_payment_required: payment_required,
        limitation_restricted_writes: restricted_writes,
    };
};

export const nostr_relay_information_document_parse = (
    data: NostrRelayInformationDocumentInput,
): NostrRelayInformationDocument | undefined => {
    const obj = typeof data === "string" ? JSON.parse(data) : data;
    if (!is_record(obj)) return undefined;

    const limitation = is_record(obj.limitation) ? obj.limitation : undefined;
    const parsed_limitation = parse_limitation(limitation);

    return {
        id: typeof obj.id === "string" ? obj.id : undefined,
        name: typeof obj.name === "string" ? obj.name : undefined,
        description: typeof obj.description === "string" ? obj.description : undefined,
        pubkey: typeof obj.pubkey === "string" ? obj.pubkey : undefined,
        contact: typeof obj.contact === "string" ? obj.contact : undefined,
        supported_nips: parse_supported_nips(obj.supported_nips),
        software: typeof obj.software === "string" ? obj.software : undefined,
        version: typeof obj.version === "string" ? obj.version : undefined,
        limitation_payment_required: parsed_limitation.limitation_payment_required,
        limitation_restricted_writes: parsed_limitation.limitation_restricted_writes,
    };
};

export const nostr_relay_information_document_build = (
    data: NostrRelayInformationDocumentInput,
): NostrRelayInformationDocumentFields | undefined => {
    const doc = nostr_relay_information_document_parse(data);
    if (!doc) return undefined;
    const result: Partial<NostrRelayInformationDocumentFields> = {};
    for (const [key, value] of Object.entries(doc)) {
        if (typeof value === "boolean") result[key as keyof NostrRelayInformationDocument] = value ? "1" : "0";
        else if (Array.isArray(value)) result[key as keyof NostrRelayInformationDocument] = value.join(", ");
        else if (value === null || value === undefined) result[key as keyof NostrRelayInformationDocument] = "";
        else result[key as keyof NostrRelayInformationDocument] = String(value);
    }
    return result as NostrRelayInformationDocumentFields;
};
