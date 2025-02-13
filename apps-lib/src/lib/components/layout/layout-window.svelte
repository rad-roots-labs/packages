<script lang="ts">
    import {
        app_lo,
        app_tilt,
        envelope_tilt,
        envelope_visible,
        handle_err,
        window_set,
    } from "$root";
    import { onMount } from "svelte";

    let { children } = $props();

    onMount(async () => {
        try {
            window_set();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    envelope_visible.subscribe(async (_envelope_visible) => {
        if (_envelope_visible && $envelope_tilt) app_tilt.set(true);
        else app_tilt.set(false);
    });
</script>

<div
    class={`relative lg:hidden flex flex-col h-[100vh] w-full bg-layer-0-surface ${$app_tilt ? `scale-y-[96%] translate-y-4 rounded-t-[3rem]` : ``} overflow-x-hidden overflow-y-scroll scroll-hide delay-75 duration-200 el-re`}
>
    {#if $app_lo}
        <div class={`flex flex-col h-full w-full`}>
            {@render children()}
        </div>
    {/if}
</div>
