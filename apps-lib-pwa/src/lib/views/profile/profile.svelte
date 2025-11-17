<script lang="ts">
    import ButtonRoundNav from "$lib/components/buttons/button-round-nav.svelte";
    import FloatPage from "$lib/components/lib/float-page.svelte";
    import ImageUploadAddPhoto from "$lib/components/lib/image-upload-add-photo.svelte";
    import SelectMenu from "$lib/components/lib/select-menu.svelte";
    import NavigationTabs from "$lib/components/navigation/navigation-tabs.svelte";
    import type { IViewBasis } from "$lib/types/views";
    import {
        get_context,
        Glyph,
        idb_init_page,
        ImagePath,
        symbols,
        type IViewOnDestroy,
    } from "@radroots/apps-lib";
    import {
        handle_err,
        type CallbackPromise,
        type CallbackPromiseGeneric,
    } from "@radroots/utils";
    import { onDestroy, onMount } from "svelte";
    import type { IViewProfileData, ViewProfileEditFieldKey } from "./types";

    const { ls } = get_context(`lib`);

    let {
        basis,
        photo_path = $bindable(``),
    }: {
        basis: IViewBasis<{
            data?: IViewProfileData;
            loading_photo_upload: boolean;
            loading_photo_upload_open: boolean;
            on_handle_back: CallbackPromiseGeneric<{
                is_photo_existing: boolean;
            }>;
            on_handle_photo_options: CallbackPromise;
            on_handle_edit_profile_field: CallbackPromiseGeneric<{
                field: ViewProfileEditFieldKey;
            }>;
        }> &
            IViewOnDestroy<{ public_key: string }>;
        photo_path: string;
    } = $props();

    type ViewDisplay = `photos` | `following` | `followers`;
    let view_display: ViewDisplay = $state(`photos`);

    let val_sel_options_button = $state(``);

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    onDestroy(async () => {
        try {
            if (basis.data?.profile.public_key)
                await basis.on_destroy({
                    public_key: basis.data?.profile.public_key,
                });
        } catch (e) {
            handle_err(e, `on_destroy`);
        }
    });

    const photo_overlay_visible = $derived(
        !!(basis.data?.profile.picture || photo_path),
    );

    const classes_photo_overlay_glyph = $derived(
        photo_overlay_visible ? `text-white` : `text-ly0-gl`,
    );

    const classes_photo_overlay_glyph_opt = $derived(
        photo_overlay_visible ? `text-gray-300` : `text-ly0-gl`,
    );

    const classes_photo_overlay_glyph_opt_selected = $derived(
        photo_overlay_visible ? `text-white` : `text-ly1-gl_d`,
    );
</script>

{#if basis.data}
    <div
        class={`relative flex flex-col min-h-[525px] h-[525px] w-full justify-center items-center bg-ly2 fade-in`}
    >
        <FloatPage
            basis={{
                posx: `left`,
            }}
        >
            <ButtonRoundNav
                basis={{
                    glyph: `arrow-left`,
                    loading: basis.loading_photo_upload,
                    callback: async () => {
                        await basis.on_handle_back({
                            is_photo_existing: photo_overlay_visible,
                        });
                    },
                }}
            />
        </FloatPage>
        <FloatPage
            basis={{
                posx: `right`,
            }}
        >
            <SelectMenu
                bind:value={val_sel_options_button}
                basis={{
                    layer: 0,
                    options: [
                        {
                            entries: [
                                {
                                    value: `*add-new`,
                                    label: `Add new photo`,
                                },
                            ],
                        },
                    ],
                }}
            >
                <ButtonRoundNav
                    basis={{
                        glyph: `images-square`,
                        callback: basis.on_handle_photo_options,
                    }}
                />
            </SelectMenu>
        </FloatPage>
        {#if basis.data?.profile.picture || photo_path}
            {@const img_path = photo_path || basis.data?.profile.picture || ``}
            <ImagePath basis={{ path: img_path }} />
        {:else}
            <div
                class={`flex flex-row justify-start items-center -translate-y-8`}
            >
                <ImageUploadAddPhoto
                    bind:photo_path
                    basis={{
                        loading: basis.loading_photo_upload_open,
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
                <div
                    class={`flex flex-row h-10 w-full justify-start items-center`}
                >
                    <button
                        class={`group flex flex-row justify-center items-center`}
                        onclick={async () => {
                            await basis.on_handle_edit_profile_field({
                                field: `display_name`,
                            });
                        }}
                    >
                        <p
                            class={`font-sansd font-[600] text-[2rem] ${classes_photo_overlay_glyph} ${basis.data?.profile.name ? `` : `capitalize opacity-active`} el-re`}
                        >
                            {#if basis.data?.profile.display_name}
                                {`${basis.data?.profile.display_name}`}
                            {:else if basis.data?.profile.name}
                                {`${basis.data?.profile.display_name || basis.data?.profile.name || ``}`}
                            {:else}
                                {`+ ${`${$ls(`icu.add_*`, { value: `${$ls(`common.profile_name`)}` })}`}`}
                            {/if}
                        </p>
                    </button>
                </div>
                <div
                    class={`flex flex-row w-full gap-[6px] justify-start items-center`}
                >
                    <button
                        class={`group flex flex-row justify-center items-center`}
                        onclick={async () => {
                            await basis.on_handle_edit_profile_field({
                                field: `name`,
                            });
                        }}
                    >
                        <p
                            class={`font-sansd font-[600] text-[1.1rem] ${classes_photo_overlay_glyph} ${basis.data?.profile.name ? `` : `capitalize opacity-active`} el-re`}
                        >
                            {#if basis.data?.profile.name}
                                {`@${basis.data?.profile.name}`}
                            {:else}
                                {`+ ${`${$ls(`icu.add_*`, { value: `${$ls(`common.username`)}` })}`}`}
                            {/if}
                        </p>
                    </button>
                    <p
                        class={`font-sans font-[400] ${classes_photo_overlay_glyph}`}
                    >
                        {symbols.bullet}
                    </p>
                    <button
                        class={`flex flex-row justify-center items-center`}
                        onclick={async () => {
                            alert(`@todo!`);
                        }}
                    >
                        <Glyph
                            basis={{
                                classes: `${classes_photo_overlay_glyph}`,
                                dim: `xs`,

                                key: `link-simple`,
                            }}
                        />
                    </button>
                </div>
                <div class={`flex flex-row w-full justify-start items-center`}>
                    <button
                        class={`group flex flex-row justify-center items-center`}
                        onclick={async () => {
                            await basis.on_handle_edit_profile_field({
                                field: `about`,
                            });
                        }}
                    >
                        <p
                            class={`font-sansd font-[400] text-[1.1rem] ${classes_photo_overlay_glyph} ${basis.data?.profile.about ? `` : `capitalize opacity-active`}`}
                        >
                            {#if basis.data?.profile.about}
                                {`${basis.data?.profile.about}`}
                            {:else}
                                {`+ ${`${$ls(`icu.add_*`, { value: `${$ls(`common.bio`)}` })}`}`}
                            {/if}
                        </p>
                    </button>
                </div>
            </div>
            <div
                class={`flex flex-row w-full pt-2 pb-6 gap-2 justify-start items-center`}
            >
                <button
                    class={`flex flex-row justify-center items-center`}
                    onclick={async () => {
                        view_display = `photos`;
                    }}
                >
                    <p
                        class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `photos` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                    >
                        {`${$ls(`common.photos`)}`}
                    </p>
                </button>
                <button
                    class={`flex flex-row justify-center items-center`}
                    onclick={async () => {
                        view_display = `following`;
                    }}
                >
                    <p
                        class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `following` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                    >
                        {`${$ls(`common.following`)}`}
                    </p>
                </button>
                <button
                    class={`flex flex-row justify-center items-center`}
                    onclick={async () => {
                        view_display = `followers`;
                    }}
                >
                    <p
                        class={`font-sans text-[1.1rem] font-[600] capitalize ${view_display === `followers` ? classes_photo_overlay_glyph_opt_selected : classes_photo_overlay_glyph_opt} el-re`}
                    >
                        {`${$ls(`common.followers`)}`}
                    </p>
                </button>
            </div>
        </div>
    </div>
    <div
        class={`flex flex-col w-full min-h-[500px] justify-start items-center`}
    >
        {#if view_display === `photos`}
            <p class={`font-sans font-[400] text-ly0-gl`}>
                {view_display}
            </p>
        {:else if view_display === `following`}
            <p class={`font-sans font-[400] text-ly0-gl`}>
                {view_display}
            </p>
        {:else if view_display === `followers`}
            <p class={`font-sans font-[400] text-ly0-gl`}>
                {view_display}
            </p>
        {/if}
    </div>
    <NavigationTabs />
{/if}
