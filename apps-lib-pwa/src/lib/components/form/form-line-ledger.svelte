<script lang="ts">
    import {
        type ElementCallbackValueKeydown,
        type IIdOpt,
        type ISelectOption,
        fmt_id,
    } from "@radroots/apps-lib";
    import { type FormField } from "@radroots/utils";
    import InputPwa from "../lib/input-pwa.svelte";
    import SelectMenu from "../lib/select-menu.svelte";
    import FormLineLedgerLabelSelectLabel from "./form-line-ledger-label-select-label.svelte";

    let {
        basis,
        value = $bindable(``),
        value_label_sel = $bindable(``),
    }: {
        basis: IIdOpt & {
            display_value?: string;
            label?: string;
            label_select?: {
                label: string;
                entries: ISelectOption<string>[];
            };
            input?: {
                placeholder?: string;
                field?: FormField;
                callback_keydown?:
                    | ElementCallbackValueKeydown<HTMLInputElement>
                    | undefined;
            };
        };
        value?: string;
        value_label_sel?: string;
    } = $props();

    const id = $derived(basis.id || ``);
</script>

<div class={`flex flex-col w-full gap-2 justify-start items-start`}>
    {#if basis.label}
        <div class={`flex flex-row w-full justify-start gap-1 items-center`}>
            <p class={`font-sansd text-trellis_ti text-ly0-gl-label uppercase`}>
                {basis.label}
            </p>
            {#if basis.label_select}
                <SelectMenu
                    bind:value={value_label_sel}
                    basis={{
                        layer: 0,
                        options: [
                            {
                                entries: basis.label_select.entries,
                            },
                        ],
                    }}
                >
                    <FormLineLedgerLabelSelectLabel
                        basis={{
                            label: basis.label_select.label,
                        }}
                    />
                </SelectMenu>
            {/if}
        </div>
    {/if}
    <div
        class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-ly0-edge`}
    >
        {#if basis.display_value}
            <p class={`font-sans font-[400] text-ly1-gl text-form_base`}>
                {basis.display_value}
            </p>
        {:else if basis.input}
            <InputPwa
                bind:value
                basis={{
                    id: id ? fmt_id(id) : undefined,
                    layer: 0,
                    classes: `h-10 placeholder:text-[1.1rem]`,
                    field: basis.input?.field || undefined,
                    placeholder: basis.input?.placeholder || ``,
                    callback_keydown: basis.input?.callback_keydown,
                }}
            />
        {/if}
    </div>
</div>
