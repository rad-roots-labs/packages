export const resolve_wasm_path = (wasm_path: string | undefined, wasm_file: string, default_wasm_path: string): string => {
    const resolved_wasm_path = wasm_path ?? default_wasm_path;
    if (resolved_wasm_path.endsWith(".wasm")) return resolved_wasm_path;
    const base_path = resolved_wasm_path.endsWith("/") ? resolved_wasm_path.slice(0, -1) : resolved_wasm_path;
    return `${base_path}/${wasm_file}`;
};
