<script lang="ts">
    import {
        FloatTabs,
        kv_init_page,
        LayoutView,
        lls,
        PageToolbar,
        type CallbackPromise,
        type ViewBasis,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: ViewBasis<{
        lc_handle_farm: CallbackPromise;
    }>;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.general`)}`,
            },
        }}
    />
    <div class={`flex flex-col w-full px-4 gap-4 justify-center items-center`}>
        <div class={`flex flex-col w-full gap-5 justify-center items-center`}>
            <button
                class={`group flex flex-row h-[3.5rem] w-full justify-center items-center rounded-touch bg-layer-1-surface layer-1-active-surface layer-1-active-ring`}
                on:click={basis.lc_handle_farm}
            >
                <p
                    class={`font-sans font-[700] text-xl text-layer-0-glyph capitalize tracking-wider opacity-active`}
                >
                    {`${$lls(`common.farm_land`)}`}
                </p>
            </button>
        </div>
    </div>
</LayoutView>
<FloatTabs />
