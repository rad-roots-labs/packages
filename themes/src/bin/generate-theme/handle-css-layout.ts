import fs from "node:fs";
import path from "node:path";
import { build_layout_css_from_presets } from "../../generator/layout_css.js";
import type { LayoutArgs } from "./main.js";

export const handle_css_layout = async (args: LayoutArgs): Promise<void> => {
    const trimmed_dir = args.dir_out.trim();
    if (trimmed_dir.length === 0) {
        throw new Error("dir_out cannot be empty");
    }

    const output_dir = path.resolve(process.cwd(), trimmed_dir);
    fs.mkdirSync(output_dir, { recursive: true });

    const css = build_layout_css_from_presets(args.presets);
    const output_path = path.join(output_dir, "layout.css");

    fs.writeFileSync(output_path, css, { encoding: "utf8" });
};
