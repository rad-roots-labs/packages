#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod";
import type { ThemeKey } from "../core/types.js";
import { build_layout_css_from_presets } from "../generator/layout_css.js";
import { build_styles_css_from_presets } from "../generator/styles_css.js";
import { build_themes_css_by_preset } from "../generator/themes_css.js";

const args_schema = z.object({
    presets: z.array(z.string()).optional()
});

type BuildArgs = z.infer<typeof args_schema>;


const script_dir = path.dirname(fileURLToPath(import.meta.url));
const package_root = path.resolve(script_dir, "..", "..");
const css_output_dir = path.resolve(package_root, "css");
const styles_output_path = path.resolve(css_output_dir, "styles.css");
const layout_output_path = path.resolve(css_output_dir, "layout.css");

const write_css = (file_path: string, css: string): void => {
    const directory = path.dirname(file_path);

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }

    fs.writeFileSync(file_path, css, { encoding: "utf8" });
};

const parse_cli_args = (): BuildArgs => {
    const argv = yargs(hideBin(process.argv))
        .option("presets", {
            type: "string",
            array: true,
            demandOption: false
        })
        .strict()
        .help()
        .parseSync();

    return args_schema.parse(argv);
};

const main = (): void => {
    try {
        const args = parse_cli_args();
        const presets = args.presets;

        const styles_css = build_styles_css_from_presets(presets);
        write_css(styles_output_path, styles_css);

        const layout_css = build_layout_css_from_presets(undefined);
        write_css(layout_output_path, layout_css);

        const themes_css_by_preset = build_themes_css_by_preset(presets);
        const theme_keys = Object.keys(themes_css_by_preset) as ThemeKey[];

        for (const theme_key of theme_keys) {
            const css = themes_css_by_preset[theme_key];
            const theme_output_path = path.resolve(
                css_output_dir,
                `theme_${theme_key}.css`
            );
            write_css(theme_output_path, css);
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "unexpected error";
        console.error(`Error: ${message}`);
        process.exit(1);
    }
};

main();
