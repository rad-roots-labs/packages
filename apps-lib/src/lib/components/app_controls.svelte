<script lang="ts">
    import { app_layout, app_toast, app_win, wind } from "$lib";
    import Toast from "$lib/ui/toast.svelte";
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
</script>

{#if $app_toast}
    <Toast basis={$app_toast} />
{/if}
