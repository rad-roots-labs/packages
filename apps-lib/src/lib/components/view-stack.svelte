<script lang="ts">
    import type { Snippet } from "svelte";
    import { set_context } from "$lib/utils/app";
    import {
        VIEW_CONTEXT_KEY,
        type ViewContext,
        type ViewMode,
        type ViewPointerEvents,
    } from "./view-context";

    const DEFAULT_TRANSITION_MS = 260;
    const DEFAULT_OPACITY_INACTIVE = 0;
    const DEFAULT_SCALE_INACTIVE = 0.98;
    const DEFAULT_OFFSET_X = "0px";
    const DEFAULT_OFFSET_Y = "12px";
    const DEFAULT_BLUR_INACTIVE_PX = 0;
    const DEFAULT_POINTER_EVENTS_INACTIVE: ViewPointerEvents = "none";
    const DEFAULT_Z_INDEX_ACTIVE = 2;
    const DEFAULT_Z_INDEX_INACTIVE = 1;

    type ViewStackBasis<T extends string> = {
        active_view: T;
        mode?: ViewMode;
        width?: string;
        height?: string;
        min_height?: string;
        padding?: string;
        gap?: string;
        direction?: string;
        align?: string;
        justify?: string;
        overflow?: string;
        background?: string;
        style?: string;
        fade?: boolean;
        transition_ms?: number;
        opacity_inactive?: number;
        scale_inactive?: number;
        offset_x?: string;
        offset_y?: string;
        blur_inactive_px?: number;
        pointer_events_inactive?: ViewPointerEvents;
        z_index_active?: number;
        z_index_inactive?: number;
    };

    let {
        basis,
        children,
    }: {
        basis: ViewStackBasis<string>;
        children: Snippet;
    } = $props();

    const view_context = $state<ViewContext<string>>({
        active_view: basis.active_view,
        mode: basis.mode ?? "stack",
        fade: basis.fade ?? true,
        transition_ms: basis.transition_ms ?? DEFAULT_TRANSITION_MS,
        opacity_inactive: basis.opacity_inactive ?? DEFAULT_OPACITY_INACTIVE,
        scale_inactive: basis.scale_inactive ?? DEFAULT_SCALE_INACTIVE,
        offset_x: basis.offset_x ?? DEFAULT_OFFSET_X,
        offset_y: basis.offset_y ?? DEFAULT_OFFSET_Y,
        blur_inactive_px: basis.blur_inactive_px ?? DEFAULT_BLUR_INACTIVE_PX,
        pointer_events_inactive:
            basis.pointer_events_inactive ?? DEFAULT_POINTER_EVENTS_INACTIVE,
        z_index_active: basis.z_index_active ?? DEFAULT_Z_INDEX_ACTIVE,
        z_index_inactive: basis.z_index_inactive ?? DEFAULT_Z_INDEX_INACTIVE,
    });

    set_context(VIEW_CONTEXT_KEY, view_context);

    $effect(() => {
        view_context.active_view = basis.active_view;
        view_context.mode = basis.mode ?? "stack";
        view_context.fade = basis.fade ?? true;
        view_context.transition_ms =
            basis.transition_ms ?? DEFAULT_TRANSITION_MS;
        view_context.opacity_inactive =
            basis.opacity_inactive ?? DEFAULT_OPACITY_INACTIVE;
        view_context.scale_inactive =
            basis.scale_inactive ?? DEFAULT_SCALE_INACTIVE;
        view_context.offset_x = basis.offset_x ?? DEFAULT_OFFSET_X;
        view_context.offset_y = basis.offset_y ?? DEFAULT_OFFSET_Y;
        view_context.blur_inactive_px =
            basis.blur_inactive_px ?? DEFAULT_BLUR_INACTIVE_PX;
        view_context.pointer_events_inactive =
            basis.pointer_events_inactive ?? DEFAULT_POINTER_EVENTS_INACTIVE;
        view_context.z_index_active =
            basis.z_index_active ?? DEFAULT_Z_INDEX_ACTIVE;
        view_context.z_index_inactive =
            basis.z_index_inactive ?? DEFAULT_Z_INDEX_INACTIVE;
    });

    const mode = $derived(basis.mode ?? "stack");
    const width = $derived(basis.width ?? "100%");
    const height = $derived(basis.height ?? "100%");
    const min_height = $derived(basis.min_height ?? "0px");
    const padding = $derived(basis.padding ?? "0px");
    const gap = $derived(basis.gap ?? "0px");
    const direction = $derived(basis.direction ?? "column");
    const align = $derived(basis.align ?? "stretch");
    const justify = $derived(basis.justify ?? "flex-start");
    const overflow = $derived(basis.overflow ?? "hidden");
    const background = $derived(basis.background ?? "transparent");
    const display = $derived(mode === "flow" ? "flex" : "block");

    const style = $derived(
        `position: relative; width: ${width}; height: ${height}; min-height: ${min_height}; padding: ${padding}; display: ${display}; flex-direction: ${direction}; align-items: ${align}; justify-content: ${justify}; gap: ${gap}; overflow: ${overflow}; background: ${background}; isolation: isolate; contain: layout paint style; ${basis.style ?? ""}`,
    );
</script>

<div style={style}>
    {@render children()}
</div>
