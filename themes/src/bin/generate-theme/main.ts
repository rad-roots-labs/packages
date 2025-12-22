#!/usr/bin/env node

import yargs, { Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod";
import { handle_css_layout } from "./handle-css-layout.js";
import { handle_css_styles } from "./handle-css-styles.js";
import { handle_css_themes } from "./handle-css-themes.js";

const layout_args_schema = z.object({
    dir_out: z.string(),
    presets: z.array(z.string()).optional()
});

const styles_args_schema = z.object({
    dir_out: z.string(),
    presets: z.array(z.string()).optional()
});

const themes_args_schema = z.object({
    dir_out: z.string(),
    presets: z.array(z.string()).optional()
});

export type LayoutArgs = z.infer<typeof layout_args_schema>;
export type StylesArgs = z.infer<typeof styles_args_schema>;
export type ThemesArgs = z.infer<typeof themes_args_schema>;

export type CliArgs =
    | { command: "layout"; args: LayoutArgs }
    | { command: "styles"; args: StylesArgs }
    | { command: "themes"; args: ThemesArgs };

export const parse_args = (): CliArgs => {
    const argv = yargs(hideBin(process.argv))
        .command(
            "layout",
            "Generate CSS layout",
            (y): Argv<LayoutArgs> =>
                y
                    .option("dir_out", {
                        type: "string",
                        demandOption: false,
                        default: "styles"
                    })
                    .option("presets", {
                        type: "string",
                        array: true,
                        demandOption: false
                    })
        )
        .command(
            "styles",
            "Generate CSS styles",
            (y): Argv<StylesArgs> =>
                y
                    .option("dir_out", {
                        type: "string",
                        demandOption: false,
                        default: "styles"
                    })
                    .option("presets", {
                        type: "string",
                        array: true,
                        demandOption: false
                    })
        )
        .command(
            "themes",
            "Generate CSS themes",
            (y): Argv<ThemesArgs> =>
                y
                    .option("dir_out", {
                        type: "string",
                        demandOption: false,
                        default: "styles"
                    })
                    .option("presets", {
                        type: "string",
                        array: true,
                        demandOption: false
                    })
        )
        .strict()
        .help()
        .parseSync();

    const command = String(argv._[0]);

    switch (command) {
        case "layout":
            return {
                command,
                args: layout_args_schema.parse(argv)
            };
        case "styles":
            return {
                command,
                args: styles_args_schema.parse(argv)
            };
        case "themes":
            return {
                command,
                args: themes_args_schema.parse(argv)
            };
        default:
            throw new Error(`Unknown command: ${command}`);
    }
};

export const main = (): void => {
    try {
        const cli = parse_args();

        switch (cli.command) {
            case "layout":
                return void handle_css_layout(cli.args);
            case "styles":
                return void handle_css_styles(cli.args);
            case "themes":
                return void handle_css_themes(cli.args);
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unexpected error";
        console.error(`Error: ${message}`);
        process.exit(1);
    }
};

main();
