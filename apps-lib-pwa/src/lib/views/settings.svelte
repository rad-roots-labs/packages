<script lang="ts">
    import LayoutTrellis from "$lib/components/layouts/layout-trellis.svelte";
    import LayoutView from "$lib/components/layouts/layout-view.svelte";
    import PageToolbar from "$lib/components/navigation/page-toolbar.svelte";
    import Trellis from "$lib/components/trellis/trellis.svelte";
    import type { ITrellisKind } from "$lib/types/components/trellis";
    import type { IViewBasis } from "$lib/types/views";
    import {
        get_context,
        idb_init_page,
        symbols,
        theme_mode,
    } from "@radroots/apps-lib";
    import { handle_err } from "@radroots/utils";
    import { onMount } from "svelte";

    const { ls, lc_color_mode } = get_context(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            trellis_2?: (ITrellisKind | undefined)[];
        }>;
    } = $props();

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_init_page();
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
                                                value: symbols.bullet,
                                                label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.color_mode`)}`.toLowerCase() })}`,
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
        <Trellis
            basis={{
                layer: 1,
                list: basis.trellis_2,
            }}
        />
    </LayoutTrellis>
</LayoutView>
