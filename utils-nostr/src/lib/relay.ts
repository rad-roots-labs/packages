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
