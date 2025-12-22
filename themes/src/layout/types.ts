export type ThemeLayoutKey = "app";

export interface ThemeLayoutParam {
    variables: ThemeVariable[];
}

export type ThemeLayoutEntry = Record<string, string>;

export interface ThemeVariable {
    namespace: TailwindThemeNamespace;
    name: string;
    value: string;
}

export type TailwindThemeNamespace =
    | "height"
    | "width"
    | "min-height"
    | "max-height"
    | "min-width"
    | "max-width"
    | "padding"
    | "translate"
    | "spacing";

export interface TailwindThemeConfig {
    height: ThemeLayoutEntry;
    width: ThemeLayoutEntry;
    min_height: ThemeLayoutEntry;
    max_height: ThemeLayoutEntry;
    min_width: ThemeLayoutEntry;
    max_width: ThemeLayoutEntry;
    padding: ThemeLayoutEntry;
    translate: ThemeLayoutEntry;
    spacing: ThemeLayoutEntry;
}

export type IosLayoutKey = "ios0" | "ios1";

export type IosResponsiveLayoutKey<TBase extends string> =
    `${TBase}_${IosLayoutKey}`;

export type LayoutHeightKey =
    | "lo_view_main"
    | "lo_bottom_button"
    | "nav_tabs"
    | "nav_page_header"
    | "nav_page_toolbar";

export type LayoutWidthKey = "lo" | "lo_line_entry" | "lo_textdesc";

export type IosHeightTokenKey = IosResponsiveLayoutKey<LayoutHeightKey>;

export type IosWidthTokenKey = IosResponsiveLayoutKey<LayoutWidthKey>;
