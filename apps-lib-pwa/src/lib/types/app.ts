import type { TangleDatabaseBackup } from "@radroots/client/tangle";
import type { IdbClientConfig } from "@radroots/utils";

export type AppConfigRole = `farmer` | `personal`

export type AppLayoutKeyIOS = `ios0` | `ios1`;
export type AppLayoutKeyWeb = `webm0` | `webm1`;
export type AppLayoutKey = AppLayoutKeyIOS | AppLayoutKeyWeb;

export type AppLayoutIOS<T extends string> = `${T}_${AppLayoutKeyIOS}`;
export type AppLayoutWeb<T extends string> = `${T}_${AppLayoutKeyWeb}`;

export type AppLayoutKeyHeight =
    | `lo_view_main`
    | `lo_bottom_button`
    | `nav_tabs`
    | `nav_page_header`
    | `nav_page_toolbar`;

export type AppLayoutKeyWidth =
    | `lo`
    | `lo_line_entry`
    | `lo_textdesc`;

export type AppHeightsResponsiveIOS = AppLayoutIOS<AppLayoutKeyHeight>;
export type AppHeightsResponsiveWeb = AppLayoutWeb<AppLayoutKeyHeight>;

export type AppWidthsResponsiveIOS = AppLayoutIOS<AppLayoutKeyWidth>;
export type AppWidthsResponsiveWeb = AppLayoutWeb<AppLayoutKeyWidth>;

export type LabelFieldKind = `link` | `on` | `shade`;

export type BackupVersions = {
    app: string;
    tangle_sql: string;
    backup_format: string;
};

export type ExportedAppState = {
    backup_version: string;
    exported_at: string;
    versions: BackupVersions;
    datastore: {
        config: IdbClientConfig;
        entries: Record<string, unknown>;
    };
    nostr_keystore: {
        config: IdbClientConfig;
        keys: {
            public_key: string;
            secret_key: string;
        }[];
    };
    database: {
        store_key: string;
        backup: TangleDatabaseBackup;
    };
};

export type ImportableAppState = ExportedAppState;
