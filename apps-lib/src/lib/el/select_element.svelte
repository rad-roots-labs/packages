<script lang="ts">
    import type { ISelectElement } from "$lib";

    export let basis: { args: ISelectElement };
    $: ({ args } = basis);

    const value = `~`;

    let el_wrap: HTMLDivElement | null = null;
    let el_select: HTMLSelectElement | null = null;
    let layer = args?.layer || 0;
</script>

<div
    class={`relative flex flex-row h-max w-auto justify-center items-center`}
    bind:this={el_wrap}
>
    <div
        class={`z-50 absolute top-0 left-0 flex flex-row h-full w-full justify-end items-center text-layer-${layer}-glyph`}
    >
        <select
            class={`select select-ghost h-full w-full bg-transparent focus:border-0 focus:outline-0 text-transparent focus:text-transparent`}
            bind:this={el_select}
            {value}
            on:change={async (e) => {
                const opt = args.options
                    .map((i) => i.entries)
                    .reduce((_, j) => j, [])
                    .find((k) => k.value === e.currentTarget?.value);
                if (args.callback && opt) await args.callback(opt);
                if (el_select) el_select.value = value;
            }}
        >
            {#each args.options as optg}
                {#if optg.group}
                    <optgroup>
                        {#each optg.entries as opt}
                            <option
                                label={optg.group === true
                                    ? `-`.repeat(21)
                                    : optg.group || ``}
                            >
                                {opt.label}
                            </option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each optg.entries as opt}
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
