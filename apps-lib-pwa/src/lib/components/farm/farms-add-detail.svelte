<script lang="ts">
    import FormLineLedger from "$lib/components/form/form-line-ledger.svelte";
    import { get_context } from "@radroots/apps-lib";
    import { area_units, form_fields } from "@radroots/utils";

    const { ls } = get_context(`lib`);

    let {
        val_farmname = $bindable(``),
        val_farmaddress = $bindable(``),
        val_farmarea = $bindable(``),
        val_farmarea_unit = $bindable(``),
        val_farmcontact = $bindable(``),
        farm_geop_lat,
        farm_geop_lng,
    }: {
        val_farmname: string;
        val_farmaddress: string;
        val_farmarea: string;
        val_farmarea_unit: string;
        val_farmcontact: string;
        farm_geop_lat: string;
        farm_geop_lng: string;
    } = $props();
</script>

<div
    class={`flex flex-col h-[100vh] w-full px-6 pt-2 gap-4 justify-start items-center`}
>
    <FormLineLedger
        bind:value={val_farmaddress}
        basis={{
            id: `farm_location`,
            label: `${$ls(`common.farm_location`)}`,
            input: {
                placeholder: `${$ls(`icu.enter_*`, {
                    value: `${$ls(`common.farm_location`)}`.toLowerCase(),
                })}`,
            },
        }}
    />

    <FormLineLedger
        basis={{
            id: `farm_coordinates`,
            label: `${$ls(`common.farm_coordinates`)}`,
            display_value:
                farm_geop_lat && farm_geop_lng
                    ? `${farm_geop_lat}, ${farm_geop_lng}`
                    : undefined,
            input:
                farm_geop_lat && farm_geop_lng
                    ? undefined
                    : {
                          placeholder: `${$ls(`icu.enter_*`, {
                              value: `${$ls(
                                  `common.farm_coordinates`,
                              )}`.toLowerCase(),
                          })}`,
                      },
        }}
    />
    <FormLineLedger
        bind:value={val_farmname}
        basis={{
            id: `farm_name`,
            label: `${$ls(`common.farm_name`)}`,
            input: {
                placeholder: `${$ls(`icu.enter_*`, {
                    value: `${$ls(`common.farm_name`)}`.toLowerCase(),
                })}`,
            },
        }}
    />
    <FormLineLedger
        bind:value={val_farmarea}
        bind:value_label_sel={val_farmarea_unit}
        basis={{
            id: `farm_size`,
            label: `${$ls(`common.farm_size`)}`,
            label_select: {
                label: `${$ls(`units.area.${val_farmarea_unit}_ab`)}`,
                entries: area_units.map((i) => ({
                    value: i,
                    label: `${$ls(`units.area.${i}`)}`,
                })),
            },
            input: {
                placeholder: `${`${$ls(`icu.enter_*`, {
                    value: `${$ls(`common.farm_size`)}`.toLowerCase(),
                })}`} ${`${$ls(`units.area.${val_farmarea_unit}_pl`)}`.toLowerCase()}`,
                field: form_fields.farm_size,
            },
        }}
    />
    <FormLineLedger
        bind:value={val_farmcontact}
        basis={{
            id: `farm_contact`,
            label: `${$ls(`common.farm_contact`)}`,
            input: {
                placeholder: `${$ls(`icu.enter_*`, {
                    value: `${$ls(`common.contact_name`)}`.toLowerCase(),
                })}`,
            },
        }}
    />
</div>
