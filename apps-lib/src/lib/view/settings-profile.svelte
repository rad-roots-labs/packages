<script lang="ts">
    import {
        ascii,
        FloatPageButton,
        FloatTabs,
        Glyph,
        ImageBlob,
        ImagePath,
        ImageUploadAddPhoto,
        kv_init_page,
        lls,
        type CallbackPromise,
        type CallbackPromiseFull,
        type CallbackPromiseReturn,
        type ISettingsNostrProfileLoadData,
        type ViewBasisLoadData,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let bv_photo_path_opt = ``;

    type LoadData = ISettingsNostrProfileLoadData;

    export let basis: ViewBasisLoadData<
        {
            lc_handle_photo_add: CallbackPromiseReturn<string | undefined>;
            lc_handle_photo_options: CallbackPromise;
            lc_fs_read_bin: CallbackPromiseFull<string, Uint8Array | undefined>;
            lc_handle_edit_profile_name: CallbackPromise;
            lc_handle_edit_profile_name_confirm: CallbackPromiseReturn<boolean>;
            lc_handle_edit_profile_display_name: CallbackPromise;
            lc_handle_edit_profile_about: CallbackPromise;
        },
        LoadData
    >;
    let load_data: LoadData = undefined;

    let loading_photo_upload = false;
    type ViewDisplay = `photos` | `following` | `followers`;
    let view_display: ViewDisplay = `photos`;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        load_data = await basis.lc_load_data();
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });

    $: photo_overlay_visible =
        load_data?.nostr_profile?.picture || bv_photo_path_opt;
    $: classes_photo_overlay_glyph = photo_overlay_visible
        ? `text-white`
        : `text-layer-0-glyph`;
    $: classes_photo_overlay_glyph_opt = photo_overlay_visible
        ? `text-gray-300`
        : `text-layer-0-glyph`;
    $: classes_photo_overlay_glyph_opt_selected = photo_overlay_visible
        ? `text-white`
        : `text-layer-1-glyph`;
</script>

<div
    class={`relative flex flex-col min-h-[525px] h-[525px] w-full justify-center items-center bg-layer-2-surface fade-in`}
>
    <FloatPageButton
        basis={{
            posx: `left`,
            glyph: `arrow-left`,
            loading: loading_photo_upload,
            callback: basis.lc_handle_back,
        }}
    />
    <FloatPageButton
        basis={{
            posx: `right`,
            glyph: `images-square`,
            loading: loading_photo_upload,
            callback: basis.lc_handle_photo_options,
        }}
    />
    {#if load_data?.nostr_profile?.picture}
        <ImagePath
            basis={{
                path: load_data.nostr_profile.picture,
            }}
        />
    {:else if bv_photo_path_opt}
        {#await basis.lc_fs_read_bin(bv_photo_path_opt) then file_data}
            <ImageBlob
                basis={{
                    data: file_data,
                }}
            />
        {/await}
    {:else}
        <div class={`flex flex-row justify-start items-center -translate-y-8`}>
            <ImageUploadAddPhoto
                bind:bv_photo_path={bv_photo_path_opt}
                basis={{
                    lc_handle_photo_add: basis.lc_handle_photo_add,
                }}
            />
        </div>
    {/if}
    <div
        class={`absolute bottom-0 left-0 flex flex-col h-[calc(100%-100%/1.618)] w-full px-6 gap-2 justify-end items-center`}
    >
        <div
            class={`flex flex-col w-full gap-[2px] justify-center items-center`}
        >
            <div class={`flex flex-row h-10 w-full justify-start items-center`}>
                <button
                    class={`group flex flex-row justify-center items-center`}
                    on:click={basis.lc_handle_edit_profile_display_name}
                >
                    <p
                        class={`font-sansd font-[600] text-[2rem] ${classes_photo_overlay_glyph} ${load_data?.nostr_profile.display_name ? `` : `capitalize opacity-active`} el-re`}
                    >
                        {load_data?.nostr_profile.display_name
                            ? load_data.nostr_profile.display_name
                            : `+ ${`${$lls(`icu.add_*`, { value: `${$lls(`common.profile_name`)}` })}`}`}
                    </p>
                </button>
            </div>
            <div
                class={`flex flex-row w-full gap-[6px] justify-start items-center`}
            >
                <button
                    class={`group flex flex-row justify-center items-center`}
                    on:click={async () => {
                        if (load_data?.nostr_profile.name) {
                            const confirm =
                                basis.lc_handle_edit_profile_name_confirm();
                            if (!confirm) return;
                        }
                        await basis.lc_handle_edit_profile_name();
                    }}
                >
                    <p
                        class={`font-sansd font-[600] text-[1.1rem] ${classes_photo_overlay_glyph} ${load_data?.nostr_profile.name ? `` : `capitalize opacity-active`} el-re`}
                    >
                        {load_data?.nostr_profile.name
                            ? `@${load_data.nostr_profile.name}`
                            : `+ ${`${$lls(`icu.add_*`, { value: `${$lls(`common.username`)}` })}`}`}
                    </p>
                </button>
                <p
                    class={`font-sans font-[400] ${classes_photo_overlay_glyph}`}
                >
                    {ascii.bullet}
                </p>
                <button
                    class={`flex flex-row justify-center items-center`}
                    on:click={async () => {
                        alert(`@todo!`);
                    }}
                >
                    <Glyph
                        basis={{
                            classes: `${classes_photo_overlay_glyph}`,
                            dim: `xs`,
                            weight: `bold`,
                            key: `link-simple`,
                        }}
                    />
                </button>
            </div>
            <div class={`flex flex-row w-full justify-start items-center`}>
                <button
                    class={`group flex flex-row justify-center items-center`}
                    on:click={basis.lc_handle_edit_profile_about}
                >
                    <p
                        class={`font-sansd font-[400] text-[1.1rem] ${classes_photo_overlay_glyph} ${load_data?.nostr_profile.about ? `` : `capitalize opacity-active`}`}
                    >
                        {load_data?.nostr_profile.about
                            ? `@${load_data.nostr_profile.about}`
                            : `+ ${`${$lls(`icu.add_*`, { value: `${$lls(`common.bio`)}` })}`}`}
                    </p>
                </button>
            </div>
        </div>
        <div
            class={`flex flex-row w-full pt-2 pb-6 gap-2 justify-start items-center`}
        >
            <button
                class={`flex flex-row justify-center items-center`}
                on:click={async () => {
                    view_display = `photos`;
                }}
            >
                <p
                    class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `photos` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                >
                    {`photos`}
                </p>
            </button>
            <button
                class={`flex flex-row justify-center items-center`}
                on:click={async () => {
                    view_display = `following`;
                }}
            >
                <p
                    class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `following` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                >
                    {`following`}
                </p>
            </button>
            <button
                class={`flex flex-row justify-center items-center`}
                on:click={async () => {
                    view_display = `followers`;
                }}
            >
                <p
                    class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `followers` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                >
                    {`followers`}
                </p>
            </button>
        </div>
    </div>
</div>
<div class={`flex flex-col w-full justify-start items-center`}>
    {#if view_display === `photos`}
        <p class={`font-sans font-[400] text-layer-0-glyph`}>
            {view_display}
        </p>
    {:else if view_display === `following`}
        <p class={`font-sans font-[400] text-layer-0-glyph`}>
            {view_display}
        </p>
    {:else if view_display === `followers`}
        <p class={`font-sans font-[400] text-layer-0-glyph`}>
            {view_display}
        </p>
    {/if}
</div>
<FloatTabs />
