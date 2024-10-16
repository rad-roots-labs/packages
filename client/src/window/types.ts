export type IClientWindow = {
    splash_hide(): Promise<void>;
    splash_show(showDuration?: number): Promise<void>;
    //status_hide(): Promise<void>;
    //status_show(): Promise<void>;
    //status_style(style: "light" | "dark"): Promise<void>;
};