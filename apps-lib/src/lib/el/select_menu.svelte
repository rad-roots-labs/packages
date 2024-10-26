<script lang="ts">
    import { fmt_cl, parse_layer, type ISelectElement } from "$lib";

    export let value: string;
    export let basis: ISelectElement;
    $: basis = basis;

    let el_wrap: HTMLDivElement | null = null;
    let el_select: HTMLSelectElement | null = null;
    $: layer =
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis.layer, 0);
    $: classes_layer =
        typeof basis?.layer === `boolean` ? `` : `text-layer-${layer}-glyph`;
</script>

<div
    class={`relative flex flex-row h-max w-auto justify-center items-center`}
    bind:this={el_wrap}
>
    <div
        class={`${fmt_cl(basis.classes)} z-10 absolute top-0 left-0 flex flex-row h-full w-full justify-end items-center ${classes_layer}`}
    >
        <select
            class={`select select-ghost h-full w-full bg-transparent focus:border-0 focus:outline-0 text-transparent focus:text-transparent`}
            bind:this={el_select}
            bind:value
            on:change={async (e) => {
                const opt = basis.options
                    .map((i) => i.entries)
                    .reduce((_, j) => j, [])
                    .find((k) => k.value === e.currentTarget?.value);
                if (basis.callback && opt) await basis.callback(opt);
                if (el_select) el_select.value = value;
            }}
        >
            {#each basis.options as opt_g}
                {#if opt_g.group}
                    <optgroup>
                        {#each opt_g.entries as opt}
                            <option
                                label={opt_g.group === true
                                    ? `-`.repeat(21)
                                    : opt_g.group || ``}
                            >
                                {opt.label}
                            </option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each opt_g.entries as opt}
                        <option value={opt.value} disabled={!!opt.disabled}>
                            {opt.label}
                        </option>
                    {/each}
                {/if}
            {/each}
        </select>
    </div>
    <div class={`z-10 flex flex-row h-full w-full`}>
        <slot name="element" />
    </div>
</div>
