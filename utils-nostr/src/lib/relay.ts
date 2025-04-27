export type NostrRelayInformationDocument = {
    id?: string;
    name?: string;
    description?: string;
    pubkey?: string;
    contact?: string;
    supported_nips?: number[];
    software?: string;
    version?: string;
    limitation_payment_required?: string;
    limitation_restricted_writes?: boolean;
}

export type NostrRelayInformationDocumentFields = { [K in keyof NostrRelayInformationDocument]: string; };

export const lib_nostr_relay_parse_information_document = (data: any): NostrRelayInformationDocument | undefined => {
    const obj = typeof data === `string` ? JSON.parse(data) : data;
    return {
        id: typeof obj.id === 'string' ? obj.id : undefined,
        name: typeof obj.name === 'string' ? obj.name : undefined,
        description: typeof obj.description === 'string' ? obj.description : undefined,
        pubkey: typeof obj.pubkey === 'string' ? obj.pubkey : undefined,
        contact: typeof obj.contact === 'string' ? obj.contact : undefined,
        supported_nips: Array.isArray(obj.supported_nips) && obj.supported_nips.every((nip: any) => typeof nip === 'number')
            ? obj.supported_nips
            : undefined,
        software: typeof obj.software === 'string' ? obj.software : undefined,
        version: typeof obj.version === 'string' ? obj.version : undefined,
        limitation_payment_required: obj.limitation && typeof obj.limitation === 'object' && typeof obj.limitation.payment_required === 'string' ? obj.limitation.payment_required : undefined,
        limitation_restricted_writes: obj.limitation && typeof obj.limitation === 'object' && typeof obj.limitation.restricted_writes === 'boolean' ? obj.limitation.restricted_writes : undefined,
    };
};

export const lib_nostr_relay_build_information_document = (data: any): NostrRelayInformationDocumentFields | undefined => {
    const doc = lib_nostr_relay_parse_information_document(data);
    if (!doc) return;
    const result: Partial<NostrRelayInformationDocumentFields> = {};
    Object.entries(doc).forEach(([key, value]) => {
        if (typeof value === 'boolean') result[key as keyof NostrRelayInformationDocument] = value ? '1' : '0';
        else if (Array.isArray(value)) result[key as keyof NostrRelayInformationDocument] = value.join(', ');
        else if (value === null || value === undefined) result[key as keyof NostrRelayInformationDocument] = '';
        else result[key as keyof NostrRelayInformationDocument] = String(value);
    });
    return result;
};