<script lang="ts">
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    const DELTA_X_THRESHOLD = 120;

    let {
        visible = $bindable(false),
        children,
    }: {
        visible: boolean;
        children: Snippet;
    } = $props();

    let swipe_start_x = $state<number | null>(null);
    let swipe_delta_x = $state<number>(0);

    const on_pointer_down = (event: PointerEvent): void => {
        swipe_start_x = event.clientX;
    };

    const on_pointer_move = (event: PointerEvent): void => {
        if (swipe_start_x !== null)
            swipe_delta_x = event.clientX - swipe_start_x;
    };

    const on_pointer_up = (): void => {
        if (Math.abs(swipe_delta_x) > DELTA_X_THRESHOLD) visible = false;
        swipe_start_x = null;
        swipe_delta_x = 0;
    };
</script>

{#if visible}
    <div
        out:fade={{ duration: 100 }}
        class={`flex flex-row w-full`}
        onpointerdown={on_pointer_down}
        onpointermove={on_pointer_move}
        onpointerup={on_pointer_up}
        style="transform: translateX({swipe_delta_x}px); transition: transform 0.2s ease;"
    >
        {@render children()}
    </div>
{/if}
