<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        type IEntrySelect,
        kv,
        Loading,
        parse_layer,
    } from "$lib";
    import { onMount } from "svelte";
    import EntryWrap from "./entry_wrap.svelte";

    let el: HTMLSelectElement | null;

    export let value: string;
    export let basis: IEntrySelect;
    $: basis = basis;

    $: layer =
        typeof basis?.wrap.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.wrap.layer, 1);

    onMount(async () => {
        try {
            if (basis?.el.sync && basis?.el.id)
                await kv.set(basis?.el.id, basis?.el.options[0].value);
        } catch (e) {}
    });
</script>

<EntryWrap basis={basis?.wrap}>
    {#if basis?.loading}
        <div class={`flex flex-row w-full justify-center items-center`}>
            <Loading basis={{ dim: `sm`, blades: 8 }} />
        </div>
    {:else}
        <select
            bind:this={el}
            bind:value
            id={basis?.el.id || null}
            class={`${fmt_cl(basis?.el.classes)} z-10 el-select entry-line-fluid text-layer-${layer}-glyph`}
            on:change={async ({ currentTarget: el }) => {
                const val = el.value;
                if (basis?.el.sync && basis?.el.id)
                    await kv.set(basis?.el.id, val);
                if (basis?.el.callback) await basis?.el.callback(val);
            }}
        >
            {#each basis?.el.options as opt}
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
    {#if !basis?.el.hide_arrows}
        <div
            class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-4 justify-end items-center`}
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
</EntryWrap>
