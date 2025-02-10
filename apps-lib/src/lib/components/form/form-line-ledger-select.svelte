<script lang="ts">
    import { fmt_id, Input, Select } from "$root";
    import {
        type ElementCallbackSelect,
        type ElementCallbackValueKeydown,
        type IIdOpt,
        type ISelectOption,
    } from "@radroots/util";

    let {
        basis,
        value_input = $bindable(``),
        value_sel = $bindable(``),
    }: {
        basis: IIdOpt & {
            display_value?: string;
            label?: string;
            input: {
                placeholder?: string;
                callback_keydown?:
                    | ElementCallbackValueKeydown<HTMLInputElement>
                    | undefined;
            };
            select: {
                entries: ISelectOption<string>[];
                callback?: ElementCallbackSelect;
            };
        };
        value_input?: string;
        value_sel?: string;
    } = $props();

    const id = $derived(basis.id || ``);
</script>

<div class={`flex flex-col w-full gap-2 justify-start items-start`}>
    {#if basis.label}
        <div class={`flex flex-row w-full justify-start items-center`}>
            <p
                class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
            >
                {basis.label}
            </p>
        </div>
    {/if}
    <div
        class={`relative flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
    >
        {#if basis.display_value}
            <p class={`font-sans font-[400] text-layer-0-glyph text-form_base`}>
                {basis.display_value}
            </p>
        {:else}
            <Input
                bind:value={value_input}
                basis={{
                    id: id ? fmt_id(`${id}_input`) : undefined,
                    layer: 0,
                    classes: `h-10 placeholder:text-[1.1rem]`,
                    placeholder: basis.input.placeholder || ``,
                    callback_keydown: basis.input.callback_keydown,
                }}
            />
            <div
                class={`absolute right-0 flex flex-row justify-center items-center`}
            >
                <Select
                    bind:value={value_sel}
                    basis={{
                        classes: `w-fit text-layer-1-glyph`,
                        id: id ? fmt_id(`${id}_sel`) : undefined,
                        sync: true,
                        layer: 1,
                        show_arrows: `r`,
                        options: [
                            {
                                entries: basis.select.entries,
                            },
                        ],
                        callback: basis.select.callback,
                    }}
                />
            </div>
        {/if}
    </div>
</div>
