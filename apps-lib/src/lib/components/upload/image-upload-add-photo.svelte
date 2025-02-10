<script lang="ts">
    import { Glyph, lls } from "$root";
    import type { LcPhotoAddCallback } from "@radroots/util";

    let {
        basis,
        photo_path = $bindable(``),
    }: {
        basis: {
            lc_handle_photo_add: LcPhotoAddCallback;
        };
        photo_path: string;
    } = $props();
</script>

<div class={`relative flex flex-row w-full justify-center items-center`}>
    <button
        class={`flex flex-row h-[5rem] w-[5rem] justify-center items-center bg-layer-1-surface/60 rounded-full`}
        onclick={async () => {
            const photo_path_add = await basis.lc_handle_photo_add();
            if (photo_path_add) photo_path = photo_path_add;
        }}
    >
        <Glyph
            basis={{
                classes: `text-[40px] text-layer-2-glyph`,
                dim: `sm`,
                key: `camera`,
            }}
        />
        <div
            class={`absolute -bottom-[1.8rem] flex flex-row justify-start items-center`}
        >
            <p
                class={`font-arch font-[600] text-sm text-layer-0-glyph capitalize`}
            >
                {`${$lls(`icu.add_*`, { value: `${$lls(`common.photo`)}` })}`}
            </p>
        </div>
    </button>
</div>
