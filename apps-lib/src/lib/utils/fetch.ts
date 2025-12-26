export type HttpFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type FetchJsonErrorKind = "http" | "network" | "parse";

export type FetchJsonError = {
    ok: false;
    kind: FetchJsonErrorKind;
    url: string;
    message: string;
    status?: number;
    status_text?: string;
};

export type FetchJsonResult<T> = { ok: true; data: T } | FetchJsonError;

export async function fetch_json<T>(fetch_fn: HttpFetch, url: string): Promise<FetchJsonResult<T>> {
    let res: Response;
    try {
        res = await fetch_fn(url);
    } catch (error) {
        const message = error instanceof Error ? error.message : "network_error";
        return { ok: false, kind: "network", url, message };
    }

    if (!res.ok) {
        return {
            ok: false,
            kind: "http",
            url,
            message: res.statusText || "http_error",
            status: res.status,
            status_text: res.statusText
        };
    }

    try {
        const data: T = await res.json();
        return { ok: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : "parse_error";
        return { ok: false, kind: "parse", url, message };
    }
}
