<script lang="ts">
    import { fmt_cl, kv, parse_layer, type ISelectElement } from "$lib";
    import { onMount } from "svelte";

    export let value: string;
    export let basis: ISelectElement;
    $: basis = basis;

    let el: HTMLSelectElement | null = null;
    $: layer =
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis.layer, 0);
    $: classes_layer =
        typeof basis?.layer === `boolean` ? `` : `text-layer-${layer}-glyph`;

    onMount(async () => {
        try {
            await kv_init();
        } catch (e) {
            console.log(`e select mount`, e);
        }
    });
    const kv_init = async (): Promise<void> => {
        try {
            if (basis?.id) {
                if (basis?.sync_init)
                    await kv.set(
                        basis?.id,
                        typeof basis?.sync_init === `string`
                            ? basis?.sync_init
                            : ``,
                    );
                if (basis?.sync) {
                    const kv_val = await kv.get(basis?.id);
                    if (kv_val && el) el.value = kv_val;
                    else await kv.set(basis?.id, ``);
                }
            }
        } catch (e) {
            console.log(`(error) kv_init `, e);
        }
    };

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

<select
    class={`${fmt_cl(basis.classes)} z-10 el-select ${classes_layer}`}
    bind:this={el}
    bind:value
    on:change={async ({ currentTarget: el }) => {
        handle_on_change(el);
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
