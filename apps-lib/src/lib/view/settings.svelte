<script lang="ts">
    import {
        app_thc,
        ascii,
        kv_init_page,
        LayoutTrellis,
        LayoutView,
        lls,
        PageToolbar,
        Trellis,
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type ISelectOption,
        type ViewBasis,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: ViewBasis<{
        lc_color_mode: CallbackPromiseGeneric<ISelectOption<string>>;
        lc_settings_nostr: CallbackPromise;
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
                label: `${$lls(`common.settings`)}`,
            },
        }}
    />
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
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
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Nostr Keys`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Nostr Key (public)`,
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
                                    alert(`@todo!`);
                                    /*const public_key = await keystore.get(
                                        ks.keys.nostr_publickey,
                                    );
                                    if (`err` in public_key) return;
                                    await dialog.alert(
                                        `Hi! This is your nostr public key ${public_key.result}`,
                                    );*/
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Nostr Key (secret)`,
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
                                    alert(`@todo!`);
                                    /*const public_key = await keystore.get(
                                        ks.keys.nostr_publickey,
                                    );
                                    if (`err` in public_key) return;
                                    const secret_key = await keystore.get(
                                        ks.keys.nostr_secretkey(
                                            public_key.result,
                                        ),
                                    );
                                    if (`err` in secret_key) return;
                                    await dialog.alert(
                                        `Hi! This is your nostr secret key ${secret_key.result}`,
                                    );*/
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Configuration`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Nostr Settings`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    glyph: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: basis.lc_settings_nostr,
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Reset Device`,
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
                                    alert(`@todo!`);
                                    /*const confirm = await dialog.confirm(
                                        `Hi! This will delete your saved keys.`,
                                    );
                                    if (confirm === true) await reset_device();*/
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Location`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Geolocation Current`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    alert(`@todo!`);
                                    /*const pos = await geol.current();
                                    await dialog.alert(JSON.stringify(pos));*/
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Web`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Radroots.Org (Open Homepage)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    //const url = `https://radroots.org`;
                                    //await browser.open(url);
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Radroots.Org (Share Homepage)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    //await share.open({
                                    //    title: `Radroots Home Page`,
                                    //    text: `Find farmers around the world.`,
                                    //    url: `https://radroots.org`,
                                    //    dialog_title: `This is the dialog title`,
                                    //});
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Primal.Net (Open Profile)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    //const public_key = await keystore.get(
                                    //    ks.keys.nostr_publickey,
                                    //);
                                    //const npub = nostr.lib.npub(public_key);
                                    //const url = `https://primal.net/p/${npub}`;
                                    //await browser.open(url);
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Device`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Device (Info)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    //const data = await device.info();
                                    //await dialog.alert(JSON.stringify(data));
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Device (Battery)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    //const data = await device.battery();
                                    //await dialog.alert(JSON.stringify(data));
                                },
                            },
                        },
                    ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
