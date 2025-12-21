import { handle_err } from "@radroots/utils";
import type { IClientFs } from "./types.js";

export class WebFs implements IClientFs {
    public async exists(path: string) {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            return res.ok;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async open(path: string) {
        return { path };
    }

    public async info(path: string) {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            const size_header = res.headers.get('Content-Length');
            const size = size_header ? Number(size_header) : 0;
            return { size, isFile: true, isDirectory: false };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async read_bin(path: string) {
        try {
            const res = await fetch(path);
            const buf = await res.arrayBuffer();
            return new Uint8Array(buf);
        } catch (e) {
            return handle_err(e);
        }
    }
}
