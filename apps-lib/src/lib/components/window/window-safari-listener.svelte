<script lang="ts">
    import { browser } from "$app/environment";
    import { lo_browser_safarinav } from "$lib/store/layout";
    import { handle_err } from "$root";
    import { onDestroy, onMount } from "svelte";

    const HEIGHT_THRESHOLD = 60;
    let h_prev = $state(0);

    onMount(async () => {
        try {
            handle_resize();
            if (browser) window.addEventListener(`resize`, handle_resize);
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    onDestroy(async () => {
        try {
            if (browser) window.removeEventListener(`resize`, handle_resize);
        } catch (e) {
            handle_err(e, `on_destroy`);
        }
    });

    const handle_resize = (): void => {
        if (!browser) return;
        const { innerHeight: h_curr } = window;
        if (h_prev !== undefined) {
            const h_del = Math.abs(h_curr - h_prev);
            if (h_del > HEIGHT_THRESHOLD) {
                lo_browser_safarinav.set(h_curr < h_prev);
            }
        }
        h_prev = h_curr;
    };
</script>
