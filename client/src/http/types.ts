import type { IHttpImageResponse, IHttpOpts, IHttpResponse, ResolveError } from "@radroots/utils";

export type IClientHttp = {
    fetch(opts: IHttpOpts): Promise<ResolveError<IHttpResponse>>;
    fetch_image(url: string): Promise<ResolveError<IHttpImageResponse>>;
};
