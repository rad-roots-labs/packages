<script lang="ts">
    import {
        app_thc,
        handle_err,
        idb_init_page,
        LayoutTrellis,
        LayoutView,
        PageToolbar,
        Trellis,
        type ISelectOption,
        type ITrellisKind,
    } from "$root";
    import {
        ascii,
        type CallbackPromiseGeneric,
        type I18nTranslateFunction,
        type IViewBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        ls,
    }: {
        basis: IViewBasis<{
            trellis_2?: (ITrellisKind | undefined)[];
            lc_color_mode: CallbackPromiseGeneric<ISelectOption<string>>;
        }>;
        ls: I18nTranslateFunction;
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
            {ls}
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
                                    value: `${$app_thc}`,
                                    classes: `capitalize`,
                                },
                            },
                            el: {
                                value: $app_thc,
                                options: [
                                    {
                                        entries: [
                                            {
                                                value: ascii.bullet,
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
                                callback: basis.lc_color_mode,
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
            {ls}
            basis={{
                layer: 1,
                list: basis.trellis_2,
            }}
        />
    </LayoutTrellis>
</LayoutView>
