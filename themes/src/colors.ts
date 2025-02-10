import type { HslTuple } from "./types";

export const theme_colors = {
	"layer-0-surface": "hsl(var(--layer-0-surface) / <alpha-value>)",
	"layer-0-surface_a": "hsl(var(--layer-0-surface_a) / <alpha-value>)",
	"layer-0-surface_w": "hsl(var(--layer-0-surface_w) / <alpha-value>)",
	"layer-0-surface-edge": "hsl(var(--layer-0-surface-edge) / <alpha-value>)",
	"layer-0-surface-blur": "hsl(var(--layer-0-surface-blur) / <alpha-value>)",
	"layer-1-surface": "hsl(var(--layer-1-surface) / <alpha-value>)",
	"layer-1-surface_a": "hsl(var(--layer-1-surface_a) / <alpha-value>)",
	"layer-1-surface-edge": "hsl(var(--layer-1-surface-edge) / <alpha-value>)",
	"layer-1-surface-err": "hsl(var(--layer-1-surface-err) / <alpha-value>)",
	"layer-1-surface-focus": "hsl(var(--layer-1-surface-focus) / <alpha-value>)",
	"layer-2-surface": "hsl(var(--layer-2-surface) / <alpha-value>)",
	"layer-2-surface_a": "hsl(var(--layer-2-surface_a) / <alpha-value>)",
	"layer-2-surface-edge": "hsl(var(--layer-2-surface-edge) / <alpha-value>)",
	"layer-0-glyph": "hsl(var(--layer-0-glyph) / <alpha-value>)",
	"layer-0-glyph_a": "hsl(var(--layer-0-glyph_a) / <alpha-value>)",
	"layer-0-glyph_pl": "hsl(var(--layer-0-glyph_pl) / <alpha-value>)",
	"layer-0-glyph-hl": "hsl(var(--layer-0-glyph-hl) / <alpha-value>)",
	"layer-0-glyph-hl_a": "hsl(var(--layer-0-glyph-hl_a) / <alpha-value>)",
	"layer-0-glyph-shade": "hsl(var(--layer-0-glyph-shade) / <alpha-value>)",
	"layer-0-glyph-label": "hsl(var(--layer-0-glyph-label) / <alpha-value>)",
	"layer-1-glyph": "hsl(var(--layer-1-glyph) / <alpha-value>)",
	"layer-1-glyph_a": "hsl(var(--layer-1-glyph_a) / <alpha-value>)",
	"layer-1-glyph_d": "hsl(var(--layer-1-glyph_d) / <alpha-value>)",
	"layer-1-glyph_pl": "hsl(var(--layer-1-glyph_pl) / <alpha-value>)",
	"layer-1-glyph-hl": "hsl(var(--layer-1-glyph-hl) / <alpha-value>)",
	"layer-1-glyph-hl_a": "hsl(var(--layer-1-glyph-hl_a) / <alpha-value>)",
	"layer-1-glyph-shade": "hsl(var(--layer-1-glyph-shade) / <alpha-value>)",
	"layer-1-glyph-label": "hsl(var(--layer-1-glyph-label) / <alpha-value>)",
	"layer-2-glyph": "hsl(var(--layer-2-glyph) / <alpha-value>)",
	"layer-2-glyph_a": "hsl(var(--layer-2-glyph_a) / <alpha-value>)",
	"layer-2-glyph_d": "hsl(var(--layer-2-glyph_d) / <alpha-value>)",
	"layer-2-glyph_pl": "hsl(var(--layer-2-glyph_pl) / <alpha-value>)",
	"layer-2-glyph-hl": "hsl(var(--layer-2-glyph-hl) / <alpha-value>)",
	"layer-2-glyph-hl_a": "hsl(var(--layer-2-glyph-hl_a) / <alpha-value>)",
	"layer-2-glyph-shade": "hsl(var(--layer-2-glyph-shade) / <alpha-value>)",
	"radroots-accent-focus": "hsl(var(--radroots-accent-focus) / <alpha-value>)",

};

export type ThemeLayer0 = {
	surface: {
		_: HslTuple;
		_a: HslTuple;
		_w: HslTuple;
		edge: HslTuple;
		blur: HslTuple;
	};
	glyphs: {
		_: HslTuple;
		_a: HslTuple;
		_pl: HslTuple;
		hl: HslTuple;
		hl_a: HslTuple;
		shade: HslTuple;
		label: HslTuple;
	};
};

export type ThemeLayer1 = {
	surface: {
		_: HslTuple;
		_a: HslTuple;
		edge: HslTuple;
		err: HslTuple;
		focus: HslTuple;
	};
	glyphs: {
		_: HslTuple;
		_a: HslTuple;
		_d: HslTuple;
		_pl: HslTuple;
		hl: HslTuple;
		hl_a: HslTuple;
		shade: HslTuple;
		label: HslTuple;
	};
};

export type ThemeLayer2 = {
	surface: {
		_: HslTuple;
		_a: HslTuple;
		edge: HslTuple;
	};
	glyphs: {
		_: HslTuple;
		_a: HslTuple;
		_d: HslTuple;
		_pl: HslTuple;
		hl: HslTuple;
		hl_a: HslTuple;
		shade: HslTuple;
	};
};
