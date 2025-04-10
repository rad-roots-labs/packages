import { lib_nostr_relay_parse_information_document, type INostrRelayService, type NostrRelayInformationDocument, type NostrRelayInformationDocumentFields } from "$root";

export class NostrRelayService implements INostrRelayService {
    public parse_information_document = (data: any): NostrRelayInformationDocumentFields | undefined => {
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
}