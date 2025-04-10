import { type NostrRelayInformationDocumentFields } from "$root";

export type INostrRelayService = {
    parse_information_document: (data: any) => NostrRelayInformationDocumentFields | undefined;
};

