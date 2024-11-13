<script lang="ts">
    import {
        app_layout,
        app_tilt,
        app_toast,
        app_win,
        envelope_tilt,
        envelope_visible,
        Toast,
        wind,
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
        if (_app_win.h > wind.app.layout.mobile_y.h) app_layout.set(`mobile_y`);
    });

    envelope_visible.subscribe(async (_envelope_visible) => {
        if (_envelope_visible && $envelope_tilt) app_tilt.set(true);
        else app_tilt.set(false);
    });
</script>

{#if $app_toast}
    <Toast basis={$app_toast} />
{/if}
