export type RoutePathParts = {
    path: string;
    query: string;
    hash: string;
};

export const parse_route_path = (route_path: string): RoutePathParts => {
    const query_idx = route_path.indexOf("?");
    const hash_idx = route_path.indexOf("#");
    let path_end = route_path.length;
    if (query_idx >= 0 && hash_idx >= 0) path_end = Math.min(query_idx, hash_idx);
    else if (query_idx >= 0) path_end = query_idx;
    else if (hash_idx >= 0) path_end = hash_idx;
    const path = route_path.slice(0, path_end);
    const query = query_idx >= 0
        ? route_path.slice(query_idx, hash_idx >= 0 ? hash_idx : undefined)
        : "";
    const hash = hash_idx >= 0 ? route_path.slice(hash_idx) : "";
    return { path, query, hash };
};

const has_file_extension = (route_path: string, file_exts: readonly string[]): boolean => {
    const lower_path = route_path.toLowerCase();
    return file_exts.some((ext) => lower_path.endsWith(ext));
};

export const resolve_route_path = (
    route_path: string | undefined,
    file_name: string,
    default_route_path: string,
    file_exts: readonly string[]
): string => {
    const resolved_route_path = route_path ?? default_route_path;
    const { path, query, hash } = parse_route_path(resolved_route_path);
    const normalized_path = path.endsWith("/") ? path.slice(0, -1) : path;
    if (!normalized_path) return resolved_route_path;
    if (
        normalized_path === file_name
        || normalized_path.endsWith(`/${file_name}`)
        || has_file_extension(normalized_path, file_exts)
    ) return `${normalized_path}${query}${hash}`;
    return `${normalized_path}/${file_name}${query}${hash}`;
};

export const resolve_wasm_path = (wasm_path: string | undefined, wasm_file: string, default_wasm_path: string): string =>
    resolve_route_path(wasm_path, wasm_file, default_wasm_path, [".wasm"]);
