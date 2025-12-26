<script lang="ts">
    import { LayoutView, PageToolbar } from "$lib";
    import LayoutTrellis from "$lib/components/layout/layout-trellis.svelte";
    import Trellis from "$lib/components/trellis/trellis.svelte";
    import type { LibContext } from "$lib/types/context";
    import type { ITrellisExtList } from "$lib/types/components/trellis";
    import type { IViewBasis } from "$lib/types/views";
    import { idb_kv_init_page } from "$lib/utils/keyval";
    import {
        get_context,
        SYMBOLS,
        theme_mode,
    } from "@radroots/apps-lib";
    import { handle_err } from "@radroots/utils";
    import { onMount } from "svelte";

    const { ls, lc_color_mode } = get_context<LibContext>(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            trellis_ext?: ITrellisExtList[];
        }>;
    } = $props();

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_kv_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$ls(`common.settings`)}`,
            },
        }}
    />
    <LayoutTrellis>
        <Trellis
            basis={{
                layer: 1,
                title: {
                    value: `Appearance`,
                },
                list: [
                    {
                        hide_active: true,
                        select: {
                            label: {
                                left: [
                                    {
                                        value: `${$ls(`common.color_mode`)}`,
                                        classes: `capitalize`,
                                    },
                                ],
                            },
                            display: {
                                label: {
                                    value: `${$theme_mode}`,
                                    classes: `capitalize`,
                                },
                            },
                            el: {
                                value: $theme_mode,
                                options: [
                                    {
                                        entries: [
                                            {
                                                value: SYMBOLS.bullet,
                                                label: `${$ls(`icu.choose_*`, {
                                                    value: `${$ls(
                                                        `common.color_mode`,
                                                    )}`.toLowerCase(),
                                                })}`,
                                                disabled: true,
                                            },
                                            {
                                                value: `light`,
                                                label: `${$ls(`common.light`)}`,
                                            },
                                            {
                                                value: `dark`,
                                                label: `${$ls(`common.dark`)}`,
                                            },
                                        ],
                                    },
                                ],
                                callback: lc_color_mode,
                            },
                            end: {
                                glyph: {
                                    key: `caret-right`,
                                },
                            },
                        },
                    },
                ],
            }}
        />
        {#if basis.trellis_ext?.length}
            {#each basis.trellis_ext as trellis_ext}
                <Trellis
                    basis={{
                        layer: 1,
                        list: trellis_ext.list,
                    }}
                />
            {/each}
        {/if}
    </LayoutTrellis>
</LayoutView>
