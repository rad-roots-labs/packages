<script>
    import {
        app_layout,
        app_tilt,
        app_toast,
        app_win,
        cfg_app,
        envelope_tilt,
        envelope_visible,
        LayoutOverlayBlur,
        LayoutOverlayLoading,
        LayoutOverlaySplash,
        LayoutStyles,
        Toast,
    } from "$lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_win.set({ h: window.innerHeight, w: window.innerWidth });
            app_toast.set(false);
        } catch (e) {
            console.log(`(layout mount) `, e);
        } finally {
        }
    });

    app_win.subscribe((_app_win) => {
        if (_app_win.h > cfg_app.layout.mobile_y.h) app_layout.set(`mobile_y`);
    });

    envelope_visible.subscribe(async (_envelope_visible) => {
        if (_envelope_visible && $envelope_tilt) app_tilt.set(true);
        else app_tilt.set(false);
    });
</script>

<div
    class={`relative flex flex-col h-[100vh] w-full overflow-x-hidden overflow-y-hidden bg-layer-0-surface ${$app_tilt ? `scale-y-[96%] translate-y-4 rounded-t-[3rem]` : ``} delay-75 duration-200 el-re`}
>
    <div class={`flex flex-col h-full w-full`}>
        <slot />
    </div>
    <slot name="overlay" />
    <LayoutOverlayBlur />
</div>
<LayoutOverlayLoading />
<LayoutOverlaySplash />
<LayoutStyles />
{#if $app_toast}
    <Toast basis={$app_toast} />
{/if}
