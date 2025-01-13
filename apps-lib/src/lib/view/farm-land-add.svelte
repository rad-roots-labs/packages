<script lang="ts">
    import {
        Carousel,
        casl_dec,
        casl_inc,
        casl_index,
        FloatTabs,
        fmt_id,
        geol_lat_fmt,
        geol_lng_fmt,
        GlyphButtonSimple,
        GlyphTitleSelectLabel,
        handle_err,
        handle_view,
        Input,
        kv_init_page,
        LayoutView,
        lls,
        MapPointSelect,
        PageToolbar,
        SelectMenu,
        type CallbackPromiseReturn,
        type GeocoderReverseResult,
        type GeolocationPoint,
        type ILcGeocodeCallback,
        type ViewBasis,
    } from "$lib";
    import CarouselItem from "$lib/component/carousel/carousel-item.svelte";
    import View from "$lib/component/lib/view.svelte";
    import { onDestroy, onMount } from "svelte";

    const casl_rec: Record<View, { max_index: number }> = {
        map_init: {
            max_index: 2,
        },
        loc_form: {
            max_index: 1,
        },
    };

    type View = `map_init` | `loc_form`;
    let view: View = `map_init`;

    export let bv_map_geol_p: GeolocationPoint | undefined = undefined;
    export let bv_map_geoc_r: GeocoderReverseResult | undefined = undefined;

    let lgcs_label = ``;
    let lgcs_area = ``;
    let lgcs_area_unit = `ha`;
    let lgcs_elevation = ``;
    let lgcs_elevation_unit = `m`;
    let lgcs_climate = ``;

    export let basis: ViewBasis<{
        lc_geocode: ILcGeocodeCallback;
        lc_submit: CallbackPromiseReturn<{ id: string } | void>;
    }>;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        handle_view(view, casl_rec);
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });

    const handle_dec = async (): Promise<void> => {
        await casl_dec();
    };

    const handle_inc = async (): Promise<void> => {
        await casl_inc();
    };

    const submit = async (): Promise<void> => {
        try {
            const result = await basis.lc_submit();
            if (result) view = handle_view(`loc_form`, casl_rec);
        } catch (e) {
            await handle_err(e, `submit`);
        }
    };
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`icu.add_*`, { value: `${$lls(`common.farm_land`)}` })}`,
                callback_route: {
                    route: `/farm/land`,
                },
            },
        }}
    >
        <div
            slot="header-option"
            class={`flex flex-row gap-4 justify-start items-center`}
        >
            <div
                class={`${$casl_index > 0 ? `fade-in` : `hidden`} flex flex-row justify-start items-center`}
            >
                <GlyphButtonSimple
                    basis={{
                        classes: `gap-1`,
                        kind: `neutral`,
                        label: `${$lls(`common.map`)}`,
                        glyph: `arrow-left`,
                        callback: handle_dec,
                    }}
                />
            </div>
            <GlyphButtonSimple
                basis={{
                    label: `${$lls(`common.add`)}`,
                    callback: async () => {
                        if (view === `map_init` && $casl_index === 0) {
                            if (!(bv_map_geol_p && bv_map_geoc_r))
                                return void (await basis.lc_gui_alert(
                                    `Please select a location.`, //@todo
                                ));
                            return void (await handle_inc());
                        } else if (view === `map_init` && $casl_index === 1) {
                            if (bv_map_geol_p && bv_map_geoc_r)
                                return void (await submit());
                        }
                    },
                }}
            />
        </div>
    </PageToolbar>
    <View key={`map_init`}>
        <Carousel>
            <CarouselItem>
                <div
                    class={`flex flex-col w-full px-4 justify-center items-center`}
                >
                    <div
                        class={`relative flex flex-col w-full justify-start items-center rounded-[20px] overflow-hidden border-x-[3px] border-y-[5px] border-white/30 shadow-sm`}
                    >
                        <div
                            class={`flex flex-row h-[32rem] w-full justify-center items-center bg-base-100/60 overflow-hidden rounded-2xl`}
                        >
                            <MapPointSelect
                                bind:map_point={bv_map_geol_p}
                                bind:map_point_geoc_r={bv_map_geoc_r}
                                basis={{
                                    lc_geocode: basis.lc_geocode,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CarouselItem>
            <CarouselItem>
                <div
                    class={`flex flex-col w-full pt-4 px-4 gap-4 justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-full px-2 gap-4 justify-start items-center`}
                    >
                        {#if bv_map_geoc_r && bv_map_geol_p}
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-row w-full justify-start items-center`}
                                >
                                    <p
                                        class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                    >
                                        {`${$lls(`common.location`)}`}
                                    </p>
                                </div>
                                <div
                                    class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <p
                                        class={`font-sans font-[400] text-[1.1rem] text-layer-0-glyph`}
                                    >
                                        {`${bv_map_geoc_r.name}, ${bv_map_geoc_r.admin1_id}, ${bv_map_geoc_r.country_name}`}
                                    </p>
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <p
                                    class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                >
                                    {`${$lls(`common.coordinates`)}`}
                                </p>
                                <div
                                    class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <p
                                        class={`font-sans font-[400] text-[1.1rem] text-layer-0-glyph`}
                                    >
                                        {`${geol_lat_fmt(
                                            bv_map_geol_p.lat,
                                            `d`,
                                            4,
                                        )}, ${geol_lng_fmt(
                                            bv_map_geol_p.lng,
                                            `d`,
                                            4,
                                        )}`}
                                    </p>
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-row w-full justify-start items-center`}
                                >
                                    <p
                                        class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                    >
                                        {`${$lls(`common.farm`)}/${`${$lls(`common.estate`)}`}`}
                                    </p>
                                </div>
                                <div
                                    class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <Input
                                        bind:value={lgcs_label}
                                        basis={{
                                            id: fmt_id(`label`),
                                            sync: true,
                                            layer: 0,
                                            classes: `h-10 placeholder:text-[1.1rem]`,
                                            placeholder: `${$lls(`common.name_of_farm_or_estate`)}`,
                                            /*field: {
                                        charset:
                                            location_gcs_form_fields
                                                .label.charset,
                                        validate:
                                            location_gcs_form_fields
                                                .label.validation,
                                        validate_keypress: true,
                                    },*/
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-row w-full gap-1 justify-start items-center`}
                                >
                                    <p
                                        class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                    >
                                        {`${$lls(`common.area`)}`}
                                    </p>
                                    <SelectMenu
                                        bind:value={lgcs_area_unit}
                                        basis={{
                                            layer: 0,
                                            options: [
                                                {
                                                    entries: [
                                                        {
                                                            label: `${$lls(`measurement.area.ac`)}`,
                                                            value: `ac`,
                                                        },
                                                        {
                                                            label: `${$lls(`measurement.area.ha`)}`,
                                                            value: `ha`,
                                                        },
                                                        {
                                                            label: `${$lls(`measurement.area.m2`)}`,
                                                            value: `m2`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        }}
                                    >
                                        <svelte:fragment slot="element">
                                            <GlyphTitleSelectLabel
                                                basis={{
                                                    label: `${$lls(`measurement.area.${lgcs_area_unit}_ab`)}`,
                                                }}
                                            />
                                        </svelte:fragment>
                                    </SelectMenu>
                                </div>
                                <div
                                    class={`relative flex flex-row h-12 w-full justify-between items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <Input
                                        bind:value={lgcs_area}
                                        basis={{
                                            id: fmt_id(`area`),
                                            sync: true,
                                            layer: 0,
                                            classes: `h-10 placeholder:text-[1.1rem]`,
                                            placeholder: `${$lls(`common.land_area`)}`,
                                            /*field: {
                                        charset: regex.num,
                                        validate: regex.num,
                                        validate_keypress: true,
                                    },*/
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-row w-full gap-1 justify-start items-center`}
                                >
                                    <p
                                        class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                    >
                                        {`${$lls(`common.elevation`)}`}
                                    </p>
                                    <SelectMenu
                                        bind:value={lgcs_elevation_unit}
                                        basis={{
                                            layer: 0,
                                            options: [
                                                {
                                                    entries: [
                                                        {
                                                            label: `${$lls(`measurement.length.m`)}`,
                                                            value: `m`,
                                                        },
                                                        {
                                                            label: `${$lls(`measurement.length.ft`)}`,
                                                            value: `ft`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        }}
                                    >
                                        <svelte:fragment slot="element">
                                            <GlyphTitleSelectLabel
                                                basis={{
                                                    label: `${$lls(`measurement.length.${lgcs_elevation_unit}_ab`)}`,
                                                }}
                                            />
                                        </svelte:fragment>
                                    </SelectMenu>
                                </div>
                                <div
                                    class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <Input
                                        bind:value={lgcs_elevation}
                                        basis={{
                                            id: fmt_id(`elevation`),
                                            sync: true,
                                            layer: 0,
                                            classes: `h-10 placeholder:text-[1.1rem]`,
                                            placeholder: `${$lls(`common.elevation`)}`,
                                            /*field: {
                                        charset: regex.num,
                                        validate: regex.num,
                                        validate_keypress: true,
                                    },*/
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-1 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-row w-full justify-start items-center`}
                                >
                                    <p
                                        class={`font-sansd text-trellis_ti text-layer-0-glyph-label uppercase`}
                                    >
                                        {`${$lls(`common.climate`)}`}
                                    </p>
                                </div>
                                <div
                                    class={`flex flex-row h-12 w-full justify-start items-center border-y-line border-layer-0-surface-edge`}
                                >
                                    <Input
                                        bind:value={lgcs_climate}
                                        basis={{
                                            id: fmt_id(`climate`),
                                            sync: true,
                                            layer: 0,
                                            classes: `h-10 placeholder:text-[1.1rem]`,
                                            placeholder: `${$lls(`common.climate`)}`,
                                            /*field: {
                                        charset: regex.description,
                                        validate: regex.description_ch,
                                        validate_keypress: true,
                                    },*/
                                        }}
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
    </View>
    <View key={`loc_form`}>
        <button
            class={`flex flex-row justify-center items-center`}
            on:click={async () => {
                view = handle_view(`map_init`, casl_rec);
            }}
        >
            <p class={`font-sans font-[400] text-layer-0-glyph`}>{`two`}</p>
        </button>
    </View>
</LayoutView>
<FloatTabs />
