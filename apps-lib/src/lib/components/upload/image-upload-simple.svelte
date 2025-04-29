<script lang="ts">
    import {
        get_context,
        Glyph,
        ImagePath,
        ImageUploadButtonsAspect,
    } from "$root";
    import { list_assign } from "@radroots/util";

    const { ls, lc_photos_add } = get_context(`lib`);

    let {
        photo_paths = $bindable([]),
    }: {
        photo_paths: string[];
    } = $props();

    let img_path = $state(``);

    $effect(() => {
        console.log(`img_path `, img_path);
    });
</script>

<div class={`flex flex-col w-full gap-4 justify-center items-center`}>
    {#if img_path}
        <div
            class={`flex flex-row h-[20rem] w-full gap-2 justify-center items-center rounded-3xl bg-layer-1-surface/60 overflow-hidden`}
        >
            <ImagePath basis={{ path: img_path }} />
        </div>
    {:else}
        <button
            class={`flex flex-row w-full justify-center items-center`}
            onclick={async () => {
                const photo_paths_add = await lc_photos_add();
                if (photo_paths_add) {
                    photo_paths = list_assign(photo_paths, photo_paths_add);
                    img_path = photo_paths[0];
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
                    {`${$ls(`icu.upload_*`, { value: `${$ls(`common.image`)}` })}`}
                </p>
            </div>
        </button>
    {/if}
    <ImageUploadButtonsAspect
        basis={{
            callback: async (ratio) => {
                // @todo
            },
        }}
    />
</div>
