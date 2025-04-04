export type ThemeLayer = 0 | 1 | 2;

export type AppConfigType = `farmer` | `personal`

export type AppLayoutKeyIOS = `ios0` | `ios1`;
export type AppLayoutKeyWeb = `webm0` | `webm1`;
export type AppLayoutKey = AppLayoutKeyIOS | AppLayoutKeyWeb;

export type AppLayoutIOS<T extends string> = `${T}_${AppLayoutKeyIOS}`;
export type AppLayoutWeb<T extends string> = `${T}_${AppLayoutKeyWeb}`;

export type AppLayoutKeyHeight =
    | `lo_bottom_button`
    | `nav_tabs`
    | `nav_page_header`
    | `nav_page_toolbar`;

export type AppLayoutKeyWidth =
    | `lo`
    | `lo_textdesc`;

export type AppHeightsResponsiveIOS = AppLayoutIOS<AppLayoutKeyHeight>;
export type AppHeightsResponsiveWeb = AppLayoutWeb<AppLayoutKeyHeight>;

export type AppWidthsResponsiveIOS = AppLayoutIOS<AppLayoutKeyWidth>;
export type AppWidthsResponsiveWeb = AppLayoutWeb<AppLayoutKeyWidth>;
