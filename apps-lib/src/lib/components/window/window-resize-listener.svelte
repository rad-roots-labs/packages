<script lang="ts">
    import { browser } from "$app/environment";
    import { handle_err, win_h, win_w } from "$root";
    import { onDestroy, onMount } from "svelte";

    let last_h = $state(0);
    let last_w = $state(0);

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
        const { innerHeight: h, innerWidth: w } = window;
        if (Math.abs(h - last_h) > 4) {
            last_h = h;
            win_h.set(h);
        }
        if (Math.abs(w - last_w) > 4) {
            last_w = w;
            win_w.set(w);
        }
    };
</script>
