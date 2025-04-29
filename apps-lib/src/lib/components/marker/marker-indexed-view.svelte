<script lang="ts">
    import { Empty } from "$root";
    import { type CallbackPromiseGeneric } from "@radroots/util";

    let {
        basis,
    }: {
        basis: {
            index_curr: number;
            index_max: number;
            callback_index: CallbackPromiseGeneric<number>;
        };
    } = $props();
</script>

<div class={`flex flex-row w-full justify-start items-center`}>
    <div
        class={`flex flex-row h-[5px] w-full gap-[6px] justify-start items-center`}
    >
        {#each Array(basis.index_max).fill(0) as _, index}
            <button
                class={`flex flex-row flex-grow h-full justify-start items-center ${basis.index_curr >= index ? `bg-layer-0-glyph` : `bg-layer-2-surface`} rounded-full el-re`}
                onclick={async () => {
                    await basis.callback_index(index);
                }}
            >
                <Empty />
            </button>
        {/each}
    </div>
</div>
