import type { ColorMode, HslTuple, ThemeDaisy, ThemeKey, ThemeLayers } from "./types";

export const hsl = (c: HslTuple): string => `${c[0]}deg ${c[1]}% ${c[2]}%`;

export const hsl_lighten = (c: HslTuple, amt: number = 25): string => hsl([c[0], c[1], c[2] + amt]);

export const hsl_darken = (c: HslTuple, amt: number = 25): string => hsl([c[0], c[1], c[2] - amt]);

export const hsl_css = (c: HslTuple): string => `hsl(${hsl(c)})`;

export const write_daisy = (obj_c: ThemeDaisy): Record<string, string> => Object.fromEntries(
	Object.entries(obj_c).map(([key, val]) => [key, hsl_css(val)])
);

export const parse_theme_key = (key?: string): ThemeKey => {
	switch (key) {
		case "os":
			return key;
		default:
			return "os";
	};
};

export const parse_color_mode = (color_mode?: string): ColorMode => {
	switch (color_mode) {
		case "light":
		case "dark":
			return color_mode;
		default:
			return "light";
	};
};

export const write_layers = ({ layer_0: { surface: l0_s, glyphs: l0_g }, layer_1: { surface: l1_s, glyphs: l1_g }, layer_2: { surface: l2_s, glyphs: l2_g }}: ThemeLayers): Record<string, string> => ({
	"--layer-0-surface": hsl(l0_s._),
	"--layer-0-surface_a": hsl(l0_s._a),
	"--layer-0-surface-edge": hsl(l0_s.edge),
	"--layer-0-surface-blur": hsl(l0_s.blur),
	"--layer-0-glyph": hsl(l0_g._),
	"--layer-0-glyph_a": hsl(l0_g._a),
	"--layer-0-glyph-hl": hsl(l0_g.hl),
	"--layer-0-glyph-hl_a": hsl(l0_g.hl_a),
	"--layer-0-glyph-shade": hsl(l0_g.shade),
	"--layer-0-glyph-label": hsl(l0_g.label),
	"--layer-1-surface": hsl(l1_s._),
	"--layer-1-surface_a": hsl(l1_s._a),
	"--layer-1-surface-edge": hsl(l1_s.edge),
	"--layer-1-glyph": hsl(l1_g._),
	"--layer-1-glyph_a": hsl(l1_g._a),
	"--layer-1-glyph-_pl": hsl(l1_g._pl),
	"--layer-1-glyph-hl": hsl(l1_g.hl),
	"--layer-1-glyph-hl_a": hsl(l1_g.hl_a),
	"--layer-1-glyph-shade": hsl(l1_g.shade),
	"--layer-1-glyph-label": hsl(l1_g.label),
	"--layer-2-surface": hsl(l2_s._),
	"--layer-2-surface_a": hsl(l2_s._a),
	"--layer-2-surface-edge": hsl(l2_s.edge),
	"--layer-2-glyph": hsl(l2_g._),
	"--layer-2-glyph_a": hsl(l2_g._a),
	"--layer-2-glyph-_pl": hsl(l2_g._pl),
	"--layer-2-glyph-hl": hsl(l2_g.hl),
	"--layer-2-glyph-hl_a": hsl(l2_g.hl_a),
	"--layer-2-glyph-shade": hsl(l2_g.shade),
});
