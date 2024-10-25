<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        type IEntryOption,
        kv,
        Loading,
        parse_layer,
    } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLSelectElement | null;

    export let value: string;
    export let basis: IEntryOption;
    $: basis = basis;

    $: layer =
        typeof basis.layer === `boolean` ? false : parse_layer(basis.layer, 1);
    $: classes_layer =
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface px-4`;

    onMount(async () => {
        try {
            if (basis.sync && basis.id)
                await kv.set(basis.id, basis.options[0].value);
        } catch (e) {}
    });
</script>

<button
    id={basis.id_wrap || null}
    class={`${fmt_cl(basis.classes_wrap)} relative el-re entry-line-wrap ${classes_layer}`}
>
    {#if basis.loading}
        <div class={`flex flex-row w-full justify-center items-center`}>
            <Loading basis={{ dim: `sm`, blades: 8 }} />
        </div>
    {:else}
        <select
            bind:this={el}
            bind:value
            id={basis.id || null}
            class={`${fmt_cl(basis.classes)} z-10 el-select entry-line-fluid text-layer-${layer}-glyph`}
            on:change={async ({ currentTarget: el }) => {
                const val = el.value;
                if (basis.sync && basis.id) await kv.set(basis.id, val);
                if (basis.callback) await basis.callback(val);
            }}
        >
            {#each basis.options as opt}
                <option
                    value={opt.value}
                    disabled={!!opt.disabled}
                    selected={!!opt.selected}
                >
                    {opt.label || opt.value}
                </option>
            {/each}
        </select>
    {/if}
    {#if !basis.hide_arrows}
        <div
            class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center`}
        >
            <Glyph
                basis={{
                    key: `caret-up-down`,
                    dim: `xs`,
                    weight: `bold`,
                    classes: `text-layer-${layer}-glyph`,
                }}
            />
        </div>
    {/if}
</button>
