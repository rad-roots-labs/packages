<script lang="ts" context="module">
    const toast_ms = 1500;

    export const init_toast = (): void => {
        app_toast.set(false);
    };

    export const show_toast = async (opts: {
        args: IToast | string;
        callback?: CallbackPromise;
    }): Promise<void> => {
        try {
            const basis: IToast =
                typeof opts.args === `string`
                    ? {
                          layer: 1,
                          label: {
                              value: opts.args,
                          },
                      }
                    : opts.args;
            app_toast.set(basis);
            await sleep(toast_ms);
            init_toast();
            if (opts.callback) await opts.callback();
        } catch (e) {
            console.log(`(error) show_toast `, e);
        }
    };
</script>

<script lang="ts">
    import {
        app_config,
        app_layout,
        app_toast,
        app_win,
        sleep,
        type CallbackPromise,
        type IToast,
    } from "$lib";
    import Toast from "$lib/ui/toast.svelte";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_win.set([window.innerHeight, window.innerWidth]);
            app_config.set(true);
            app_toast.set(false);
        } catch (e) {
            console.log(`(layout mount) `, e);
        } finally {
        }
    });

    app_win.subscribe(([win_h, win_w]) => {
        if (win_h > 800) app_layout.set("lg");
    });
</script>

{#if $app_toast}
    <Toast basis={$app_toast} />
{/if}
