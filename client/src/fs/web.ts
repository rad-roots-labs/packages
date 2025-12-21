import { err_msg, handle_err, type ResolveError } from "@radroots/utils";
import { cl_fs_error } from "./error.js";
import type { IClientFs, IClientFsFileInfo, IClientFsOpenResult, IClientFsReadBinResolve } from "./types.js";

export interface IWebFs extends IClientFs {}

export class WebFs implements IWebFs {
    public async exists(path: string): Promise<ResolveError<boolean>> {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            return res.ok;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async open(path: string): Promise<ResolveError<IClientFsOpenResult>> {
        return { path };
    }

    public async info(path: string): Promise<ResolveError<IClientFsFileInfo>> {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            if (!res.ok) return err_msg(res.status === 404 ? cl_fs_error.not_found : cl_fs_error.request_failure);
            const size_header = res.headers.get('Content-Length');
            const size = size_header ? Number(size_header) : 0;
            return { size, isFile: true, isDirectory: false };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async read_bin(path: string): Promise<IClientFsReadBinResolve> {
        try {
            const res = await fetch(path);
            if (!res.ok) return err_msg(res.status === 404 ? cl_fs_error.not_found : cl_fs_error.request_failure);
            const buf = await res.arrayBuffer();
            return new Uint8Array(buf);
        } catch (e) {
            return handle_err(e);
        }
    }
}
