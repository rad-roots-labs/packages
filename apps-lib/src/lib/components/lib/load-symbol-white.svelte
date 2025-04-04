<script lang="ts">
    import { loading_style_map, type ILoadSymbol } from "$root";

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
        class={`${num_blades === 12 ? `spinner12-white center` : `spinner8-white center`} text-[${styles?.gl_2 || styles?.dim_1}px]`}
    >
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        <div
            class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
        ></div>
        {#if num_blades === 12}
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
            <div
                class={`${num_blades === 12 ? `spinner12-blade-white` : `spinner8-blade-white`}`}
            ></div>
        {/if}
    </div>
</div>
