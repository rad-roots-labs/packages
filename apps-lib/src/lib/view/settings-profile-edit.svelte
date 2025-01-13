<script
    lang="ts"
    generics="TModelNostrProfile extends ModelNostrProfile, TModelNostrProfileFieldsKey extends ModelNostrProfileFieldsKey"
>
    import {
        app_notify,
        fmt_id,
        Input,
        kv_init_page,
        LayoutView,
        lls,
        Nav,
        qp_nostr_pk,
        qp_rkey,
        TextArea,
        type CallbackPromise,
        type ISettingsNostrProfileEditLoadData,
        type ModelNostrProfile,
        type ModelNostrProfileFieldsKey,
        type ViewBasisLoadData,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    type LoadData = ISettingsNostrProfileEditLoadData<
        TModelNostrProfile,
        TModelNostrProfileFieldsKey
    >;

    export let basis: ViewBasisLoadData<
        {
            lc_submit: CallbackPromise;
        },
        LoadData
    >;
    let load_data: LoadData = undefined;

    let val_input_init = ``;
    let val_input = ``;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        if (!$qp_rkey || !$qp_nostr_pk)
            return void app_notify.set(
                `${$lls(`error.page.load.query_param`)}`,
            );
        load_data = await basis.lc_load_data();
        if (load_data?.field_val) {
            val_input = load_data.field_val;
            val_input_init = load_data.field_val;
        }
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });

    $: translated_field_key = load_data?.field_key
        ? `${$lls(`models.nostr_profile.fields.${load_data.field_key}.label`)}`
        : ``;
    $: val_input_delta = val_input_init !== val_input;
</script>

<LayoutView>
    {#if load_data}
        <div
            class={`flex flex-col w-full pt-4 px-4 gap-1 justify-start items-center fade-in`}
        >
            <div class={`flex flex-row w-full pl-2 justify-start items-center`}>
                <p
                    class={`font-sans text-trellis_ti text-layer-0-glyph-label uppercase`}
                >
                    {translated_field_key.replace(/profile /i, ``)}
                </p>
            </div>
            {#if load_data.field_key === `about`}
                <TextArea
                    bind:value={val_input}
                    basis={{
                        id: fmt_id(load_data.field_key),
                        classes: `min-h-[12rem] pl-4`,
                        sync: true,
                        layer: 1,
                        placeholder: `${$lls(`icu.enter_*`, { value: `${translated_field_key}`.toLowerCase() })}`,
                        /*field: {
                            charset:
                                nostr_profile_form_fields[load_data.field_key].charset,
                            validate:
                                nostr_profile_form_fields[load_data.field_key]
                                    .validation,
                            validate_keypress: true,
                        },*/
                        callback_keydown: async ({ key_s }) => {
                            if (key_s && val_input_delta)
                                await basis.lc_submit();
                        },
                    }}
                ></TextArea>
            {:else}
                <Input
                    bind:value={val_input}
                    basis={{
                        id: fmt_id(load_data.field_key),
                        classes: `rounded-touch pl-4`,
                        sync: true,
                        layer: 1,
                        placeholder: `${$lls(`icu.enter_*`, { value: `${translated_field_key}`.toLowerCase() })}`,
                        /*field: {
                            charset:
                                nostr_profile_form_fields[load_data.field_key].charset,
                            validate:
                                nostr_profile_form_fields[load_data.field_key]
                                    .validation,
                            validate_keypress: true,
                        },*/
                        callback_keydown: async ({ key_s }) => {
                            if (key_s && val_input_delta)
                                await basis.lc_submit();
                        },
                    }}
                ></Input>
            {/if}
        </div>
    {/if}
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `${$lls(`common.profile`)}`,
            route: `/settings/profile`,
            prevent_route: val_input_delta
                ? {
                      callback: async () => {
                          if (val_input_delta) await basis.lc_submit();
                      },
                  }
                : undefined,
        },
        title: {
            label: {
                classes: `capitalize`,
                value: `${$lls(`icu.edit_*`, { value: `${$lls(`common.profile`)}` })}`,
            },
        },
    }}
/>
