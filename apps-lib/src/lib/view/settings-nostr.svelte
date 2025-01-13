<script lang="ts">
    import {
        LayoutTrellis,
        LayoutView,
        PageToolbar,
        Trellis,
        ascii,
        handle_err,
        lls,
        type ISelectOption,
    } from "$lib";
    import { onMount } from "svelte";

    const page_param: {
        select_options: ISelectOption<string>[];
    } = {
        select_options: [
            {
                value: ascii.bullet,
                label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.photo_hosting`)}`.toLowerCase() })}`,
                disabled: true,
            },
            {
                value: `^radroots`,
                label: `https://radroots.market`,
            },
            {
                value: `*add`,
                label: `${$lls(`icu.add_*`, { value: `${$lls(`common.upload_url`)}`.toLowerCase() })}`,
            },
            {
                value: `*disable`,
                label: `${$lls(`common.disable_uploads`)}`,
            },
        ],
    };

    let nostr_photohosting_sel_val = ``;
    let nostr_photohosting_sel_label = ``;

    onMount(async () => {
        try {
            await init_page();
        } catch (e) {
        } finally {
        }
    });

    const init_page = async (): Promise<void> => {
        try {
            nostr_photohosting_sel_val = `^radroots`; //@todo
        } catch (e) {
            await handle_err(e, `init_page`);
        }
    };

    $: nostr_photohosting_sel_label = nostr_photohosting_sel_val
        ? page_param.select_options.filter(
              (i) => i.value === nostr_photohosting_sel_val,
          )?.[0].label
        : ``;

    const handle_select_option = async (
        option_value: string,
    ): Promise<void> => {
        try {
            if (!option_value.startsWith(`*`)) {
                nostr_photohosting_sel_val = option_value;
                return;
            }
            nostr_photohosting_sel_val = ``;
            alert(`@todo!`);
            nostr_photohosting_sel_val = `^radroots`;
        } catch (e) {
            await handle_err(e, `handle_select_option`);
        }
    };
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.nostr`)}`,
            },
        }}
    />
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    list: [
                        {
                            hide_active: true,
                            select: {
                                label: {
                                    left: [
                                        {
                                            value: `Photo Hosting`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                display: {
                                    loading: !nostr_photohosting_sel_val,
                                    label: {
                                        value: nostr_photohosting_sel_label,
                                    },
                                },
                                el: {
                                    value: nostr_photohosting_sel_val,
                                    options: [
                                        {
                                            entries: page_param.select_options,
                                        },
                                    ],
                                    callback: async ({ value }) => {
                                        await handle_select_option(value);
                                    },
                                },
                                end: {
                                    glyph: {
                                        key: `caret-right`,
                                    },
                                },
                            },
                        },
                    ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
