import { build_theme_layout_variables, with_prefix } from "../tokens.js";
import type {
    IosHeightTokenKey,
    IosWidthTokenKey,
    TailwindThemeConfig,
    ThemeLayoutEntry,
    ThemeLayoutParam
} from "../types.js";

const ios_height_tokens: Record<IosHeightTokenKey, string> = {
    nav_tabs_ios0: "80px",
    nav_tabs_ios1: "120px",
    nav_page_toolbar_ios0: "72px",
    nav_page_toolbar_ios1: "120px",
    nav_page_header_ios0: "62px",
    nav_page_header_ios1: "62px",
    lo_bottom_button_ios0: "90px",
    lo_bottom_button_ios1: "112px",
    lo_view_main_ios0: "22rem",
    lo_view_main_ios1: "28rem"
};

const ios_width_tokens: Record<IosWidthTokenKey, string> = {
    lo_ios0: "340px",
    lo_ios1: "345px",
    lo_textdesc_ios0: "312px",
    lo_textdesc_ios1: "312px",
    lo_line_entry_ios0: "349px",
    lo_line_entry_ios1: "378px"
};

const dimension_tokens: ThemeLayoutEntry = {
    ios0: "340px",
    ios1: "345px"
};

const base_spacing_tokens: ThemeLayoutEntry = {
    line: "1px",
    edge: "2px"
};

const height_scale: ThemeLayoutEntry = {
    ...ios_height_tokens,
    ...dimension_tokens,
    line: "46px",
    line_button: "3.25rem",
    touch_guide: "3.4rem",
    entry_line: "48px",
    bold_button: "4.25rem"
};

const width_scale: ThemeLayoutEntry = {
    ...ios_width_tokens,
    ...dimension_tokens,
    trellis_value: "180px",
    trellis_display: "286px"
};

const dimension_scale: ThemeLayoutEntry = {
    ...dimension_tokens
};

const min_height_scale: ThemeLayoutEntry = {
    ...height_scale
};

const max_height_scale: ThemeLayoutEntry = {
    ...height_scale
};

const min_width_scale: ThemeLayoutEntry = {
    ...width_scale
};

const max_width_scale: ThemeLayoutEntry = {
    ...width_scale
};

const padding_scale: ThemeLayoutEntry = {
    ...with_prefix("h_", height_scale),
    ...with_prefix("w_", width_scale),
    ...with_prefix("dim_", dimension_scale)
};

const translate_scale: ThemeLayoutEntry = {
    ...with_prefix("h_", height_scale),
    ...with_prefix("w_", width_scale)
};

const spacing_scale: ThemeLayoutEntry = {
    ...base_spacing_tokens,
    ...with_prefix("dim_", dimension_scale)
};

const app_theme_config: TailwindThemeConfig = {
    height: height_scale,
    width: width_scale,
    min_height: min_height_scale,
    max_height: max_height_scale,
    min_width: min_width_scale,
    max_width: max_width_scale,
    padding: padding_scale,
    translate: translate_scale,
    spacing: spacing_scale
};

export const theme_app_layout: ThemeLayoutParam = {
    variables: build_theme_layout_variables(app_theme_config)
};
