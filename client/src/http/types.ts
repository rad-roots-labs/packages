import type { ErrorMessage, IHttpImageResponse, IHttpOpts, IHttpResponse } from "@radroots/util";

export type IClientHttp = {
    fetch(opts: IHttpOpts): Promise<IHttpResponse | ErrorMessage<string>>;
    fetch_image(url: string): Promise<IHttpImageResponse | ErrorMessage<string>>;
};