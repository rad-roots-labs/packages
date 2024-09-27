<script lang="ts">
    import { fmt_cl, type ILoading, type ILoadingDimension } from "$lib";

    export const lm: Map<ILoadingDimension, [string, string]> = new Map([
        [`xl`, [`h-[36px] w-[36px]`, `text-[22px]`]],
        [`lg`, [`h-[32px] w-[32px]`, `text-[18px]`]],
        [`md`, [`h-[32px] w-[32px]`, `text-[18px]`]],
        [`sm`, [`h-[32px] w-[32px]`, `text-[18px]`]],
        [`xs`, [`h-[20px] w-[20px]`, `text-[16px]`]],
        [`glyph-send-button`, [`h-[20px] w-[20px]`, `text-[18px]`]],
    ]);

    export let basis: ILoading | undefined = undefined;
    $: basis = basis;

    $: dim = lm.get(basis?.dim || "sm");
    $: num_blades = basis?.blades || 12;
</script>

<div
    class={`relative flex flex-row justify-center items-center ${fmt_cl(dim?.[0])} fade-in transition-all`}
>
    <div
        class={`${num_blades === 12 ? `spinner12 center` : `spinner6 center`} ${fmt_cl(dim?.[1])}`}
    >
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
        />
        {#if num_blades === 12}
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner6-blade`}`}
            />
        {/if}
    </div>
</div>
