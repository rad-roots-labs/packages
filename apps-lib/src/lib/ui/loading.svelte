<script lang="ts">
    import { type ILoading, type ILoadingDimension } from "$lib";

    type StyleMap = { dim_1: number; gl_1: number };
    export const style_map: Map<ILoadingDimension, StyleMap> = new Map([
        ["glyph-send-button", { dim_1: 20, gl_1: 20 }],
        ["xs", { dim_1: 13, gl_1: 13 }],
        ["sm", { dim_1: 16, gl_1: 16 }],
        ["md", { dim_1: 20, gl_1: 20 }],
        ["lg", { dim_1: 28, gl_1: 28 }],
        ["xl", { dim_1: 36, gl_1: 36 }],
    ]);

    export let basis: ILoading | undefined = undefined;
    $: basis = basis;

    $: styles = basis?.dim ? style_map.get(basis?.dim) : style_map.get("sm");
    $: num_blades = basis?.blades || 12;
</script>

<div
    class={`relative flex flex-row justify-center items-center h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] fade-in transition-all`}
>
    <div
        class={`${num_blades === 12 ? `spinner12 center` : `spinner6 center`} text-[${styles?.gl_1 || styles?.dim_1}px]`}
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
