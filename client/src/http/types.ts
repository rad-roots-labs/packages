import type { ErrorMessage } from "@radroots/utils";

export type IClientHttpOpts = {
    url: string;
    method?: `get` | `post`;
    params?: {
        [key: string]: string | string[];
    };
    data?: Record<string, string | number | boolean>;
    headers?: {
        [key: string]: string;
    };
    connect_timeout?: number;
};

export type IClientHttpResponse = {
    status: number;
    data: any;
    headers: {
        [key: string]: string;
    };
    url: string;
};

export type IClientHttp = {
    fetch(opts: IClientHttpOpts): Promise<IClientHttpResponse | ErrorMessage<string>>;
};