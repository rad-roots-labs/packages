<script lang="ts">
    import { type ILoading, loading_style_map } from "$lib";

    export let basis: ILoading | undefined = undefined;
    $: basis = basis;

    $: styles = basis?.dim
        ? loading_style_map.get(basis?.dim)
        : loading_style_map.get("sm");
    $: num_blades = basis?.blades || 12;
</script>

<div
    class={`relative flex flex-row justify-center items-center h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] fade-in transition-all`}
>
    <div
        class={`${num_blades === 12 ? `spinner12 center` : `spinner6 center`} text-[${styles?.gl_2 || styles?.dim_1}px]`}
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
