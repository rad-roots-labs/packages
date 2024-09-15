<script lang="ts">
    import { app_config, app_layout, app_thc, app_win } from "$lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_win.set([window.innerHeight, window.innerWidth]);

            const prefers_dark = window.matchMedia(
                `(prefers-color-scheme: dark)`,
            ).matches;

            if (prefers_dark) app_thc.set(`dark`);
            app_config.set(true);
        } catch (e) {
            console.log(`(layout mount) `, e);
        } finally {
        }
    });

    app_win.subscribe(([win_h, win_w]) => {
        if (win_h > 800) app_layout.set("lg");
    });
</script>
