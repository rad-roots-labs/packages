import { NDKEvent } from "@nostr-dev-kit/ndk";

export type IClientNostrEvents = {
    first_tag_value(event: NDKEvent, tag_name: string): string;
};

export type IClientNostrLibRelayConnectResponse = {
    url: string;
    connected: boolean;
};

export type IClientNostrLib = {
    relay_connect(url: string): Promise<IClientNostrLibRelayConnectResponse | undefined>;
    generate_key(): string;
    public_key(secret_key_hex: string | undefined): string;
    npub(public_key_hex: string | undefined): string;
    npub_decode(npub: string): string;
    nsec(secret_key_hex: string | undefined): string;
    nsec_decode(nsec: string): string | undefined;
    nprofile(public_key_hex: string, relays: string[]): string;
    nprofile_decode(nprofile: string): [string, string[]] | undefined;
};

export type IClientNostr = {
    ev: IClientNostrEvents;
    lib: IClientNostrLib
};
