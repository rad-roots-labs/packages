<script lang="ts">
    import { Glyph, LoadSymbol, type LcPhotoAddCallback } from "$root";
    import { type I18nTranslateFunction } from "@radroots/util";

    let {
        basis,
        ls,
        photo_path = $bindable(``),
    }: {
        basis: {
            loading?: boolean;
            lc_handle_photo_add: LcPhotoAddCallback;
        };
        ls: I18nTranslateFunction;
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
        {#if basis.loading}
            <LoadSymbol basis={{ dim: `md` }} />
        {:else}
            <Glyph
                basis={{
                    classes: `text-[40px] text-layer-2-glyph`,
                    dim: `sm`,
                    key: `camera`,
                }}
            />
        {/if}

        <div
            class={`absolute -bottom-[1.8rem] flex flex-row justify-start items-center`}
        >
            <p
                class={`font-arch font-[600] text-sm text-layer-0-glyph capitalize`}
            >
                {`${$ls(`icu.add_*`, { value: `${$ls(`common.photo`)}` })}`}
            </p>
        </div>
    </button>
</div>
