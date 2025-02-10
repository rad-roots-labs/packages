<script lang="ts">
    import {
        app_thc,
        handle_err,
        kv_init_page,
        LayoutTrellis,
        LayoutView,
        lls,
        PageToolbar,
        Trellis,
    } from "$root";
    import {
        ascii,
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type ISelectOption,
        type IViewBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            lc_color_mode: CallbackPromiseGeneric<ISelectOption<string>>;
            lc_settings_nostr: CallbackPromise;
            lc_logout: CallbackPromise;
        }>;
    } = $props();

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await kv_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.settings`)}`,
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
                                        value: `${$lls(`common.color_mode`)}`,
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
                                                label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.color_mode`)}`.toLowerCase() })}`,
                                                disabled: true,
                                            },
                                            {
                                                value: `light`,
                                                label: `${$lls(`common.light`)}`,
                                            },
                                            {
                                                value: `dark`,
                                                label: `${$lls(`common.dark`)}`,
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
            basis={{
                layer: 1,
                list: [
                    {
                        hide_active: true,
                        touch: {
                            label: {
                                left: [
                                    {
                                        value: `${$lls(`common.logout`)}`,
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
