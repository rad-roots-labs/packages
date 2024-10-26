export type IClientFs = {
    exists(path: string): Promise<boolean>;
};