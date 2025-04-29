<script lang="ts">
    import {
        EntryWrap,
        fmt_id,
        get_context,
        Input,
        LayoutTrellisLine,
        lib_fmt_price,
        lib_parse_currency_marker,
        Select,
    } from "$root";
    import {
        fiat_currencies,
        mass_units,
        num_str,
        type ElementCallbackValue,
        type FormField,
    } from "@radroots/util";

    const { ls, locale } = get_context(`lib`);

    let {
        basis,
        val_input_price = $bindable(``),
        val_sel_currency = $bindable(``),
        val_sel_qty_unit = $bindable(``),
    }: {
        basis: {
            id?: string;
            input_field?: FormField;
            callback_input: ElementCallbackValue;
        };
        val_input_price: string;
        val_sel_currency: string;
        val_sel_qty_unit: string;
    } = $props();

    const id = $derived(basis.id ? basis.id : ``);
</script>

<LayoutTrellisLine
    basis={{
        label: {
            value: `${$ls(`icu.*_price`, { value: `${$ls(`common.product`)}` })} (${val_sel_currency}/${`${$ls(`units.mass.unit.${val_sel_qty_unit}_ab`)}`})`,
        },
    }}
>
    <EntryWrap
        basis={{
            id: id ? fmt_id(`${id}_wrap`) : undefined,
            layer: 1,
        }}
    >
        <div class={`flex flex-row justify-start pr-1 items-center`}>
            <Select
                bind:value={val_sel_currency}
                basis={{
                    id: id ? fmt_id(`${id}_sel_currency`) : undefined,
                    layer: 1,
                    sync: true,
                    classes: `w-fit font-sans font-[400] ${val_input_price ? `text-layer-1-glyph_d` : `text-layer-1-glyph_pl`} el-re`,
                    options: [
                        {
                            entries: fiat_currencies.map((i) => ({
                                value: `${i}`,
                                label: lib_parse_currency_marker($locale, i),
                            })),
                        },
                    ],
                }}
            />
        </div>
        <Input
            bind:value={val_input_price}
            basis={{
                id: id ? fmt_id(`${id}_input_price`) : undefined,
                layer: 1,
                sync: true,
                placeholder: `${$ls(`icu.enter_the_*`, { value: `${$ls(`common.price`)}`.toLowerCase() })}`,
                field: basis.input_field,
                callback: basis.callback_input,
                callback_blur: async ({ el }) => {
                    if (!el.value) return;
                    el.value = lib_fmt_price(
                        $locale,
                        el.value,
                        val_sel_currency,
                    ).slice(1);
                    //@todo fmt handles 'en' only
                },
            }}
        />
        <div class={`flex flex-row gap-2 justify-end items-center`}>
            <p class={`font-sans font-[400] text-layer-1-glyph_d lowercase`}>
                {num_str(1)}
            </p>
            <Select
                bind:value={val_sel_qty_unit}
                basis={{
                    id: id ? fmt_id(`${id}_sel_qty_unit`) : undefined,
                    sync: true,
                    layer: 1,
                    classes: `w-fit font-sans font-[400]`,
                    show_arrows: `r`,
                    options: [
                        {
                            entries: mass_units.map((i) => ({
                                value: i,
                                label: `${$ls(`units.mass.unit.${i}_ab`)}`.toLowerCase(),
                            })),
                        },
                    ],
                }}
            />
        </div>
    </EntryWrap>
</LayoutTrellisLine>
