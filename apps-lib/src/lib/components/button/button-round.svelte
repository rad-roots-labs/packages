<script lang="ts">
    import { LoadSymbol, type IButtonRound } from "$root";
    import { fmt_cl } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IButtonRound;
    } = $props();
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row h-touch_guide w-full justify-center items-center rounded-full el-re`}
    onclick={async () => {
        await basis.callback();
    }}
>
    {#if basis.loading}
        <LoadSymbol basis={{ dim: `md` }} />
    {:else}
        <p class={`font-sans font-[500] text-[16px]`}>
            {basis.label}
        </p>
    {/if}
</button>
