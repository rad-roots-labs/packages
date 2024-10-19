import type { ErrorMessage, FieldRecord } from "@radroots/utils";

export type IClientHttpOpts = {
    url: string;
    method?: `get` | `post`;
    params?: {
        [key: string]: string | string[];
    };
    data?: Record<string, string | number | boolean>;
    authorization?: string;
    headers?: FieldRecord;
    connect_timeout?: number;
};

export type IClientHttpResponse = {
    status: number;
    data: any;
    headers: FieldRecord;
    url: string;
};

export type IClientHttp = {
    fetch(opts: IClientHttpOpts): Promise<IClientHttpResponse | ErrorMessage<string>>;
};