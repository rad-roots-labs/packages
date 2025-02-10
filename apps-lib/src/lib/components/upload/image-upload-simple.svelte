<script lang="ts">
    import { Glyph, ImagePath, ImageUploadButtonsAspect } from "$root";
    import {
        list_assign,
        type LcPhotoAddMultipleCallback,
    } from "@radroots/util";

    let {
        basis,
        photo_paths = $bindable([]),
    }: {
        basis: {
            lc_handle_photo_add: LcPhotoAddMultipleCallback;
        };
        photo_paths: string[];
    } = $props();

    let img_data = $state(``);
</script>

<div class={`flex flex-col w-full gap-4 justify-center items-center`}>
    {#if img_data}
        <div
            class={`flex flex-row h-[20rem] w-full gap-2 justify-center items-center rounded-3xl bg-layer-1-surface/60 overflow-hidden`}
        >
            <ImagePath basis={{ path: img_data }} />
        </div>
    {:else}
        <button
            class={`flex flex-row w-full justify-center items-center`}
            onclick={async () => {
                const photo_paths_add = await basis.lc_handle_photo_add();
                if (photo_paths_add) {
                    photo_paths = list_assign(photo_paths, photo_paths_add);
                    img_data = photo_paths[0];
                }
            }}
        >
            <div
                class={`flex flex-row h-[20rem] w-full gap-2 justify-center items-center border-line border-layer-0-glyph/20 border-[3px] border-dashed rounded-3xl bg-layer-1-surface/60`}
            >
                <Glyph
                    basis={{
                        classes: `text-layer-0-glyph/80`,
                        dim: `sm`,

                        key: `upload-simple`,
                    }}
                />
                <p
                    class={`font-sans font-[400] text-layer-0-glyph/80 capitalize`}
                >
                    {`Upload image`}
                </p>
            </div>
        </button>
    {/if}
    <ImageUploadButtonsAspect
        basis={{
            callback: async (ratio) => {
                console.log(`ratio `, ratio);
            },
        }}
    />
</div>
