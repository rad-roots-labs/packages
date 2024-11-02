<script lang="ts">
    import { fmt_cl, Glyph, kv, parse_layer, type ISelectElement } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLSelectElement | null = null;

    export let value: string;
    export let basis: ISelectElement;

    $: basis = basis;
    $: id = basis?.id ? basis?.id : null;
    $: layer =
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis.layer, 0);
    $: classes_layer =
        typeof basis?.layer === `boolean` ? `` : `text-layer-${layer}-glyph_d`;

    onMount(async () => {
        try {
            if (basis.id && basis.sync_init) {
                const sync_val = await kv.get(basis.id);
                await kv.set(basis.id, sync_val || ``);
            }
        } catch (e) {
        } finally {
        }
    });

    $: if (basis?.id && basis?.sync) {
        (async () => {
            try {
                await kv.set(basis?.id, value);
            } catch (e) {}
        })();
    }

    const handle_on_change = async (el: HTMLSelectElement): Promise<void> => {
        try {
            const opt = basis.options
                .map((i) => i.entries)
                .reduce((_, j) => j, [])
                .find((k) => k.value === el?.value);
            if (el) el.value = value;
            if (basis?.sync) await kv.set(basis?.id, value);
            if (basis.callback && opt) await basis.callback(opt);
        } catch (e) {
            console.log(`(error) handle_on_change `, e);
        }
    };
</script>

{#if basis?.show_arrows === "l"}
    <div class={`flex flex-row justify-center items-center`}>
        <Glyph
            basis={{
                key: `caret-up-down`,
                dim: `xs`,
                weight: `bold`,
                classes: `text-layer-${layer}-glyph translate-y-[1px]`,
            }}
        />
    </div>
{/if}
<select
    bind:this={el}
    bind:value
    on:change={async ({ currentTarget: el }) => {
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
    <div class={`flex flex-row justify-center items-center`}>
        <Glyph
            basis={{
                key: `caret-up-down`,
                dim: `xs`,
                weight: `bold`,
                classes: `text-layer-${layer}-glyph translate-y-[1px]`,
            }}
        />
    </div>
{/if}
