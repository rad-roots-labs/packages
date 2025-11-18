import fs from "node:fs";
import path from "node:path";
import { build_styles_css_from_presets } from "../../generator/styles_css.js";
import type { StylesArgs } from "./main.js";

export const handle_css_styles = async (args: StylesArgs): Promise<void> => {
    const trimmed_dir = args.dir_out.trim();
    if (trimmed_dir.length === 0) {
        throw new Error("dir_out cannot be empty");
    }

    const output_dir = path.resolve(process.cwd(), trimmed_dir);
    fs.mkdirSync(output_dir, { recursive: true });

    const css = build_styles_css_from_presets(args.presets);
    const target = path.join(output_dir, "styles.css");

    fs.writeFileSync(target, css, { encoding: "utf8" });
};
