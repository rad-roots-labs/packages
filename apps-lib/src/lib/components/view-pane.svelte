<script lang="ts">
    import type { Snippet } from "svelte";
    import { get_context } from "$lib/utils/app";
    import {
        VIEW_CONTEXT_KEY,
        type ViewContext,
        type ViewMode,
        type ViewPointerEvents,
    } from "./view-context";
    import { writable, type Writable } from "svelte/store";

    const DEFAULT_TRANSITION_MS = 260;
    const DEFAULT_OPACITY_INACTIVE = 0;
    const DEFAULT_SCALE_INACTIVE = 0.98;
    const DEFAULT_OFFSET_X = "0px";
    const DEFAULT_OFFSET_Y = "12px";
    const DEFAULT_BLUR_INACTIVE_PX = 0;
    const DEFAULT_POINTER_EVENTS_INACTIVE: ViewPointerEvents = "none";
    const DEFAULT_Z_INDEX_ACTIVE = 2;
    const DEFAULT_Z_INDEX_INACTIVE = 1;
    const DEFAULT_DISPLAY = "flex";
    const DEFAULT_DIRECTION = "column";
    const DEFAULT_ALIGN = "stretch";
    const DEFAULT_JUSTIFY = "flex-start";
    const DEFAULT_WIDTH = "100%";
    const DEFAULT_HEIGHT = "100%";
    const DEFAULT_MIN_HEIGHT = "0px";
    const DEFAULT_PADDING = "0px";
    const DEFAULT_GAP = "0px";
    const DEFAULT_OVERFLOW = "hidden";
    const DEFAULT_BACKGROUND = "transparent";
    const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

    type ViewPaneBasis<T extends string> = {
        view: T;
        active?: boolean;
        active_view?: T;
        mode?: ViewMode;
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
        display?: string;
        direction?: string;
        align?: string;
        justify?: string;
        width?: string;
        height?: string;
        min_height?: string;
        padding?: string;
        gap?: string;
        overflow?: string;
        background?: string;
        style?: string;
        style_active?: string;
        style_inactive?: string;
        role?: string;
        tabindex?: number;
        aria_label?: string;
    };

    let {
        basis,
        children,
    }: {
        basis: ViewPaneBasis<string>;
        children: Snippet;
    } = $props();

    const view_context_store =
        get_context<Writable<ViewContext<string>> | undefined>(
            VIEW_CONTEXT_KEY,
        ) ??
        writable<ViewContext<string>>({
            active_view: basis.active_view ?? basis.view,
            mode: basis.mode ?? "stack",
            fade: basis.fade ?? true,
            transition_ms: basis.transition_ms ?? DEFAULT_TRANSITION_MS,
            opacity_inactive: basis.opacity_inactive ?? DEFAULT_OPACITY_INACTIVE,
            scale_inactive: basis.scale_inactive ?? DEFAULT_SCALE_INACTIVE,
            offset_x: basis.offset_x ?? DEFAULT_OFFSET_X,
            offset_y: basis.offset_y ?? DEFAULT_OFFSET_Y,
            blur_inactive_px:
                basis.blur_inactive_px ?? DEFAULT_BLUR_INACTIVE_PX,
            pointer_events_inactive:
                basis.pointer_events_inactive ?? DEFAULT_POINTER_EVENTS_INACTIVE,
            z_index_active: basis.z_index_active ?? DEFAULT_Z_INDEX_ACTIVE,
            z_index_inactive: basis.z_index_inactive ?? DEFAULT_Z_INDEX_INACTIVE,
        });

    const view_context_value = $derived($view_context_store);

    const active_view = $derived(
        basis.active_view ?? view_context_value?.active_view,
    );
    const is_active = $derived(
        basis.active !== undefined
            ? basis.active
            : active_view
              ? basis.view === active_view
              : true,
    );
    const mode = $derived(basis.mode ?? view_context_value?.mode ?? "stack");
    const fade = $derived(basis.fade ?? view_context_value?.fade ?? true);
    const transition_ms = $derived(
        basis.transition_ms ??
            view_context_value?.transition_ms ??
            DEFAULT_TRANSITION_MS,
    );
    const opacity_inactive = $derived(
        basis.opacity_inactive ??
            view_context_value?.opacity_inactive ??
            DEFAULT_OPACITY_INACTIVE,
    );
    const scale_inactive = $derived(
        basis.scale_inactive ??
            view_context_value?.scale_inactive ??
            DEFAULT_SCALE_INACTIVE,
    );
    const offset_x = $derived(
        basis.offset_x ?? view_context_value?.offset_x ?? DEFAULT_OFFSET_X,
    );
    const offset_y = $derived(
        basis.offset_y ?? view_context_value?.offset_y ?? DEFAULT_OFFSET_Y,
    );
    const blur_inactive_px = $derived(
        basis.blur_inactive_px ??
            view_context_value?.blur_inactive_px ??
            DEFAULT_BLUR_INACTIVE_PX,
    );
    const pointer_events_inactive = $derived(
        basis.pointer_events_inactive ??
            view_context_value?.pointer_events_inactive ??
            DEFAULT_POINTER_EVENTS_INACTIVE,
    );
    const z_index_active = $derived(
        basis.z_index_active ??
            view_context_value?.z_index_active ??
            DEFAULT_Z_INDEX_ACTIVE,
    );
    const z_index_inactive = $derived(
        basis.z_index_inactive ??
            view_context_value?.z_index_inactive ??
            DEFAULT_Z_INDEX_INACTIVE,
    );
    const display = $derived(basis.display ?? DEFAULT_DISPLAY);
    const direction = $derived(basis.direction ?? DEFAULT_DIRECTION);
    const align = $derived(basis.align ?? DEFAULT_ALIGN);
    const justify = $derived(basis.justify ?? DEFAULT_JUSTIFY);
    const width = $derived(basis.width ?? DEFAULT_WIDTH);
    const height = $derived(basis.height ?? DEFAULT_HEIGHT);
    const min_height = $derived(basis.min_height ?? DEFAULT_MIN_HEIGHT);
    const padding = $derived(basis.padding ?? DEFAULT_PADDING);
    const gap = $derived(basis.gap ?? DEFAULT_GAP);
    const overflow = $derived(basis.overflow ?? DEFAULT_OVERFLOW);
    const background = $derived(basis.background ?? DEFAULT_BACKGROUND);

    const opacity = $derived(is_active ? 1 : opacity_inactive);
    const transform = $derived(
        `translate3d(${is_active ? "0px" : offset_x}, ${is_active ? "0px" : offset_y}, 0) scale(${is_active ? 1 : scale_inactive})`,
    );
    const blur_val = $derived(is_active ? 0 : blur_inactive_px);
    const filter = $derived(blur_val ? `blur(${blur_val}px)` : "none");
    const pointer_events = $derived(is_active ? "auto" : pointer_events_inactive);
    const z_index = $derived(is_active ? z_index_active : z_index_inactive);
    const transition = $derived(
        fade
            ? `opacity ${transition_ms}ms ${EASE_OUT}, transform ${transition_ms}ms ${EASE_OUT}, filter ${transition_ms}ms ${EASE_OUT}`
            : `transform ${transition_ms}ms ${EASE_OUT}, filter ${transition_ms}ms ${EASE_OUT}`,
    );
    const position = $derived(mode === "stack" ? "absolute" : "relative");
    const inset = $derived(mode === "stack" ? "0" : "auto");

    const style = $derived(
        `position: ${position}; inset: ${inset}; width: ${width}; height: ${height}; min-height: ${min_height}; display: ${display}; flex-direction: ${direction}; align-items: ${align}; justify-content: ${justify}; gap: ${gap}; padding: ${padding}; overflow: ${overflow}; background: ${background}; opacity: ${opacity}; transform: ${transform}; filter: ${filter}; transition: ${transition}; pointer-events: ${pointer_events}; z-index: ${z_index}; box-sizing: border-box; will-change: transform, opacity, filter; backface-visibility: hidden; transform-style: preserve-3d; ${basis.style ?? ""} ${is_active ? basis.style_active ?? "" : basis.style_inactive ?? ""}`,
    );
</script>

<div
    data-view={basis.view}
    style={style}
    role={basis.role ?? undefined}
    tabindex={basis.tabindex ?? undefined}
    aria-label={basis.aria_label ?? undefined}
    aria-hidden={!is_active}
>
    {@render children()}
</div>
