<script lang="ts">
    import { browser } from "$app/environment";
    import {
        Glyph,
        type ISelect,
        fmt_cl,
        idb,
        parse_layer,
    } from "@radroots/apps-lib";
    import { handle_err } from "@radroots/utils";
    import { onMount } from "svelte";

    let {
        basis,
        value = $bindable(``),
        el = $bindable(null),
    }: {
        basis: ISelect;
        value: string;
        el?: HTMLSelectElement | null;
    } = $props();

    const id = $derived(basis?.id ? basis.id : null);

    const layer = $derived(
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis.layer),
    );

    const classes_layer = $derived(
        typeof basis?.layer === `boolean`
            ? ``
            : !value
              ? `text-ly${layer}-gl/60`
              : `text-ly${layer}-gl_d`,
    );

    onMount(async () => {
        try {
            if (id && basis?.sync_init && browser) {
                const sync_val = await idb.get(id);
                await idb.set(id, sync_val || ``);
            }
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    $effect(() => {
        if (browser && id && basis?.sync) {
            (async () => {
                await idb.set(id, value);
            })();
        }
    });

    const handle_on_change = async (el: HTMLSelectElement): Promise<void> => {
        try {
            const opt = basis.options
                .map((i) => i.entries)
                .reduce((_, j) => j, [])
                .find((k) => k.value === el?.value);
            if (el) el.value = value;
            if (basis?.sync && id && browser) await idb.set(id, value);
            if (basis.callback && opt) await basis.callback(opt);
        } catch (e) {
            console.log(`(error) handle_on_change `, e);
        }
    };
</script>

{#if basis?.show_arrows === "l"}
    <div class={`flex flex-row pr-[2px] justify-center items-center`}>
        <Glyph
            basis={{
                key: `caret-up-down`,
                dim: `xs`,

                classes: `text-ly${layer}-gl translate-y-[1px]`,
            }}
        />
    </div>
{/if}
<select
    bind:this={el}
    bind:value
    onchange={async ({ currentTarget: el }) => {
        handle_on_change(el);
    }}
    {id}
    class={`${fmt_cl(basis.classes)} z-10 el-select ${classes_layer}`}
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
{#if basis?.show_arrows === "r"}
    <div class={`flex flex-row pl-[2px] justify-center items-center`}>
        <Glyph
            basis={{
                key: `caret-up-down`,
                dim: `xs`,
                classes: `text-ly${layer}-gl`,
            }}
        />
    </div>
{/if}
