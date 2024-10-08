export type AppLayoutKey = 'mobile_base' | 'mobile_y';

export type ClientWindow = {
    app: {
        layout: Record<AppLayoutKey, {
            h: number;
        }>;
    }
};