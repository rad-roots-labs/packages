<script lang="ts">
    import {
        app_thc,
        handle_err,
        idb_init_page,
        LayoutTrellis,
        LayoutView,
        PageToolbar,
        Trellis,
    } from "$root";
    import {
        ascii,
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type I18nTranslateFunction,
        type ISelectOption,
        type IViewBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        ls,
    }: {
        basis: IViewBasis<{
            lc_color_mode: CallbackPromiseGeneric<ISelectOption<string>>;
            lc_settings_nostr: CallbackPromise;
            lc_logout: CallbackPromise;
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
                list: [
                    {
                        hide_active: true,
                        touch: {
                            label: {
                                left: [
                                    {
                                        value: `${$ls(`common.logout`)}`,
                                        classes: `capitalize`,
                                    },
                                ],
                            },
                            end: {
                                glyph: {
                                    key: `caret-right`,
                                },
                            },
                            callback: async () => {
                                await basis.lc_logout();
                            },
                        },
                    },
                ],
            }}
        />
    </LayoutTrellis>
</LayoutView>
