export type ViewMode = "stack" | "flow";
export type ViewPointerEvents = "none" | "auto";

export type ViewContext<T extends string> = {
    active_view: T;
    mode: ViewMode;
    fade: boolean;
    transition_ms: number;
    opacity_inactive: number;
    scale_inactive: number;
    offset_x: string;
    offset_y: string;
    blur_inactive_px: number;
    pointer_events_inactive: ViewPointerEvents;
    z_index_active: number;
    z_index_inactive: number;
};

export const VIEW_CONTEXT_KEY = "radroots:view";
