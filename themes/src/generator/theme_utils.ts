import type { ThemeKey, ThemeMode } from "../core/types.js";
import { parse_theme_key } from "../core/utils.js";
import { theme_layouts } from "../layout/index.js";
import type { ThemeLayoutKey, ThemeVariable } from "../layout/types.js";
import { theme_presets } from "../presets/index.js";
import type { HslTuple, OsThemePreset } from "../presets/types.js";

export const theme_modes: ThemeMode[] = ["dark", "light"];

const theme_layer_order: Array<keyof OsThemePreset> = ["ly0", "ly1", "ly2"];

export interface ThemeColorEntry {
  layer_key: keyof OsThemePreset;
  category: "surfaces" | "glyphs";
  token_key: string;
}

export const tabs = (n: number): string => "    ".repeat(n);

export const format_hsl = (tuple: HslTuple): string => {
  const [h, s, l] = tuple;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const to_css_name_suffix = (key: string): string => {
  const trimmed_key = key.replace(/^_+/, "");
  if (trimmed_key.length === 0) {
    return "";
  }
  return `-${trimmed_key.replace(/_/g, "-")}`;
};

export const collect_theme_color_entries = (
  theme: OsThemePreset
): ThemeColorEntry[] => {
  const entries: ThemeColorEntry[] = [];

  for (const layer_key of theme_layer_order) {
    const layer = theme[layer_key];

    const surface_keys = Object.keys(
      layer.surfaces
    ) as Array<keyof typeof layer.surfaces>;
    for (const surface_key of surface_keys) {
      entries.push({
        layer_key,
        category: "surfaces",
        token_key: String(surface_key)
      });
    }

    const glyph_keys = Object.keys(
      layer.glyphs
    ) as Array<keyof typeof layer.glyphs>;
    for (const glyph_key of glyph_keys) {
      entries.push({
        layer_key,
        category: "glyphs",
        token_key: String(glyph_key)
      });
    }
  }

  return entries;
};

export const select_theme_presets_keys = (
  presets: string[] | undefined
): ThemeKey[] => {
  const all_keys = Object.keys(theme_presets);
  if (!presets || presets.length === 0) {
    return all_keys.map(parse_theme_key);
  }

  const trimmed_presets = presets
    .map(preset => preset.trim())
    .filter(preset => preset.length > 0);

  if (trimmed_presets.length === 0) {
    return all_keys.map(parse_theme_key);
  }

  const unknown_presets = trimmed_presets.filter(
    preset => !all_keys.includes(preset)
  );
  if (unknown_presets.length > 0) {
    throw new Error(
      `Unknown theme preset(s): ${unknown_presets.join(", ")}`
    );
  }

  return all_keys
    .filter(key => trimmed_presets.includes(key))
    .map(parse_theme_key);
};

export const select_theme_layout_keys = (
  presets: string[] | undefined
): ThemeLayoutKey[] => {
  const all_keys = Object.keys(theme_layouts) as ThemeLayoutKey[];

  if (!presets || presets.length === 0) {
    return all_keys;
  }

  const trimmed_presets = presets
    .map(preset => preset.trim())
    .filter(preset => preset.length > 0);

  if (trimmed_presets.length === 0) {
    return all_keys;
  }

  const unknown_presets = trimmed_presets.filter(
    preset => !all_keys.includes(preset as ThemeLayoutKey)
  );

  if (unknown_presets.length > 0) {
    throw new Error(
      `Unknown layout preset(s): ${unknown_presets.join(", ")}`
    );
  }

  return all_keys.filter(key => trimmed_presets.includes(key));
};

export const collect_layout_variables = (
  keys: ThemeLayoutKey[]
): ThemeVariable[] => {
  const variables: ThemeVariable[] = [];

  for (const key of keys) {
    const layout = theme_layouts[key];
    variables.push(...layout.variables);
  }

  return variables;
};
