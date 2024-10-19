export type IClientWindow = {
    splash_hide(): Promise<void>;
    splash_show(showDuration?: number): Promise<void>;
};