<script lang="ts">
    import { get_context, Glyph, LoadSymbol } from "$root";

    const { ls, lc_photos_add } = get_context(`lib`);

    let {
        basis,
        photo_path = $bindable(``),
    }: {
        basis: {
            loading?: boolean;
        };
        photo_path: string;
    } = $props();
</script>

<div class={`relative flex flex-row w-full justify-center items-center`}>
    <button
        class={`flex flex-row h-[5rem] w-[5rem] justify-center items-center bg-layer-1-surface/60 rounded-full`}
        onclick={async () => {
            const photo_paths_add = await lc_photos_add();
            if (photo_paths_add) photo_path = photo_paths_add[0];
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
