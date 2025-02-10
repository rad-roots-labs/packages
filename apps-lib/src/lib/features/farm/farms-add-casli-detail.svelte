<script lang="ts">
    import { CarouselItem, FormLineLedger, lls } from "$root";
    import { area_units, form_fields } from "@radroots/util";

    let {
        val_farmname = $bindable(``),
        val_farmarea = $bindable(``),
        val_farmarea_unit = $bindable(``),
        val_farmcontact = $bindable(``),
        farm_geop_lat,
        farm_geop_lng,
    }: {
        val_farmname: string;
        val_farmarea: string;
        val_farmarea_unit: string;
        val_farmcontact: string;
        farm_geop_lat: string;
        farm_geop_lng: string;
    } = $props();
</script>

<CarouselItem>
    <div
        class={`flex flex-col h-[100vh] w-full px-6 gap-4 justify-start items-center`}
    >
        <FormLineLedger
            basis={{
                id: `farm_location`,
                label: `${$lls(`common.farm_location`)}`,
                display_value: `${farm_geop_lat}, ${farm_geop_lng}`,
            }}
        />
        <FormLineLedger
            bind:value={val_farmname}
            basis={{
                id: `farm_name`,
                label: `${$lls(`common.farm_name`)}`,
                input: {
                    placeholder: `${$lls(`icu.enter_*`, { value: `${$lls(`common.farm_name`)}`.toLowerCase() })}`,
                },
            }}
        />
        <FormLineLedger
            bind:value={val_farmarea}
            bind:value_label_sel={val_farmarea_unit}
            basis={{
                id: `farm_size`,
                label: `${$lls(`common.farm_size`)}`,
                label_select: {
                    label: `${$lls(`measurement.area.${val_farmarea_unit}_ab`)}`,
                    entries: area_units.map((i) => ({
                        value: i,
                        label: `${$lls(`measurement.area.${i}`)}`,
                    })),
                },
                input: {
                    placeholder: `${`${$lls(`icu.enter_*`, { value: `${$lls(`common.farm_size`)}`.toLowerCase() })}`} ${`${$lls(`measurement.area.${val_farmarea_unit}_pl`)}`.toLowerCase()}`,
                    field: form_fields.farm_size,
                },
            }}
        />
        <FormLineLedger
            bind:value={val_farmcontact}
            basis={{
                id: `farm_contact`,
                label: `${$lls(`common.farm_contact`)}`,
                input: {
                    placeholder: `${$lls(`icu.enter_*`, { value: `${$lls(`common.contact_name`)}`.toLowerCase() })}`,
                },
            }}
        />
    </div>
</CarouselItem>
