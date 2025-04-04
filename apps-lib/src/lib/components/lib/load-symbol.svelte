<script lang="ts">
    import { type ILoadSymbol, loading_style_map } from "$root";

    let {
        basis = undefined,
    }: {
        basis?: ILoadSymbol;
    } = $props();

    const styles = $derived(
        basis?.dim
            ? loading_style_map.get(basis?.dim)
            : loading_style_map.get("sm"),
    );

    const num_blades = $derived(basis?.blades || 8);
</script>

<div
    class={`relative flex flex-row justify-center items-center h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] fade-in el-re`}
>
    <div
        class={`${num_blades === 12 ? `spinner12 center` : `spinner8 center`} text-[${styles?.gl_2 || styles?.dim_1}px]`}
    >
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
        ></div>
        {#if num_blades === 12}
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade` : `spinner8-blade`}`}
            ></div>
        {/if}
    </div>
</div>
