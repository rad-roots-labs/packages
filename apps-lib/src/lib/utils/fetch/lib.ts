export type HttpFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function fetch_json<T>(fetch_fn: HttpFetch, url: string): Promise<T> {
    const res = await fetch_fn(url);
    if (!res.ok) throw new Error(url);
    return res.json() as Promise<T>;
}