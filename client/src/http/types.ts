import type { IHttpImageResponse, IHttpOpts, IHttpResponse, ResolveError } from "@radroots/utils";

export interface IClientHttp {
    fetch(opts: IHttpOpts): Promise<ResolveError<IHttpResponse>>;
    fetch_image(url: string): Promise<ResolveError<IHttpImageResponse>>;
}

export type WebHttpConfig = {
    app_name?: string;
    app_version?: string;
    app_hash?: string;
};
