import fs from "node:fs";
import path from "node:path";
import { build_themes_css_by_preset } from "../../generator/themes_css.js";
import type { ThemesArgs } from "./main.js";

export const handle_css_themes = async (args: ThemesArgs): Promise<void> => {
    const trimmed_dir = args.dir_out.trim();
    if (trimmed_dir.length === 0) {
        throw new Error("dir_out cannot be empty");
    }

    const output_dir = path.resolve(process.cwd(), trimmed_dir);
    fs.mkdirSync(output_dir, { recursive: true });

    const css_by_preset = build_themes_css_by_preset(args.presets);
    const css = Object.values(css_by_preset).join("\n");
    const output_path = path.join(output_dir, "themes.css");

    fs.writeFileSync(output_path, css, { encoding: "utf8" });
};
