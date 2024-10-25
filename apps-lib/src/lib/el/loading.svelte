<script lang="ts">
    import { type ILoading, loading_style_map } from "$lib";

    export let basis: ILoading | undefined = undefined;
    $: basis = basis;

    $: styles = basis?.dim
        ? loading_style_map.get(basis?.dim)
        : loading_style_map.get("sm");
    $: num_blades = basis?.blades || 8;
</script>

<div
    class={`relative flex flex-row justify-center items-center h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] fade-in transition-all`}
>
    <div
        class={`${num_blades === 12 ? `spinner12 center` : `spinner8 center`} text-[${styles?.gl_2 || styles?.dim_1}px]`}
    >
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        />
        {#if num_blades === 12}
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            />
        {/if}
    </div>
</div>
