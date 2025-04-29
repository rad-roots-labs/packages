<script lang="ts">
    import {
        app_lo,
        ButtonLayoutPair,
        Carousel,
        CarouselItem,
        casl_dec,
        casl_i,
        casl_imax,
        casl_inc,
        casl_init,
        FarmsProductsReviewCard,
        fmt_id,
        FormEntryPrice,
        FormEntryQuantity,
        FormEntrySelect,
        FormEntrySelectInput,
        FormEntryTextarea,
        get_context,
        handle_err,
        idb,
        ImageUploadSimple,
        LayoutBottomButton,
        LayoutView,
        loc_fmt_geo_point_coords,
        MapLocationSelectEnvelope,
        MarkerIndexedView,
        PageToolbar,
        schema_view_farms_products_add_submission,
        type CallbackRoute,
        type ISelectOption,
        type IViewFarmsProductsAddData,
        type IViewFarmsProductsAddSubmitPayload,
    } from "$root";
    import {
        el_id,
        fmt_geocode_address,
        fmt_geolocation_address,
        form_fields,
        location_basis_to_geo_point,
        obj_keys_maxnum,
        parse_float,
        parse_geop_point,
        parse_int,
        parse_trade_key,
        sleep,
        str_trunc,
        trade,
        trade_keys,
        type CallbackPromiseFull,
        type CallbackPromiseGeneric,
        type GeocoderReverseResult,
        type GeolocationPoint,
        type IViewBasis,
        type LocationBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    const { ls, locale, lc_geocode, lc_gui_alert, lc_geop_current } =
        get_context(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: IViewFarmsProductsAddData;
            callback_route?: CallbackRoute<string>;
            on_handle_farm_lot_add: CallbackPromiseGeneric<string>;
            on_handle_photo_envelope_edit: CallbackPromiseGeneric<number>;
            on_handle_tradepr_key_toggle: CallbackPromiseFull<boolean, string>;
            on_submit: CallbackPromiseGeneric<{
                payload: IViewFarmsProductsAddSubmitPayload;
                farm_id: string;
                geolocation_id?: string;
            }>;
        }>;
    } = $props();

    const casl_param: Record<
        "default",
        {
            index_map: Record<number, { label_desc: string }>;
        }
    > = {
        default: {
            index_map: {
                0: {
                    label_desc: `${$ls(`icu.add_*`, { value: `${$ls(`icu.*_information`, { value: `${$ls(`common.product`)}` })}` })}`,
                },
                1: {
                    label_desc: `${$ls(`icu.upload_*`, { value: `${$ls(`common.images`)}` })}`,
                },
                2: {
                    label_desc: `${$ls(`icu.*_price`, { value: `${$ls(`common.product`)}` })}`,
                },
                3: {
                    label_desc: `${$ls(`icu.add_*`, { value: `${$ls(`common.location`)}` })}`,
                },
                4: {
                    label_desc: `${$ls(`common.review`)}`,
                },
            },
        },
    };

    let choose_location_map_geop: GeolocationPoint | undefined =
        $state(undefined);
    let choose_location_map_geoc: GeocoderReverseResult | undefined =
        $state(undefined);

    let loading_submit = $state(false);
    let payload_submit: IViewFarmsProductsAddSubmitPayload | undefined =
        $state(undefined);

    let photo_paths = $state([]);

    let product_key_sel = $state(`cacao`);
    let product_key_sel_input = $state(``);
    let product_key_sel_toggle = $state(false);

    let product_process_sel = $state(`raw`);
    let product_process_sel_input = $state(``);
    let product_process_sel_toggle = $state(false);

    let product_description_input = $state(`Cool Description`);

    let product_location_sel = $state(``);
    let product_location_map_toggle = $state(false);
    let product_location_sel_geoc: GeocoderReverseResult | undefined =
        $state(undefined);

    let product_price_cur_sel = $state(`usd`);
    let product_price_input = $state(`4.50`);
    let product_price_qty_unit_sel = $state(`lb`);

    let product_quantity_input = $state(`60`);
    let product_quantity_unit_sel = $state(`kg`);
    let product_quantity_label_sel = $state(`bag`);

    const tradepr_key_parsed = $derived(parse_trade_key(product_key_sel));

    const product_process_list = $derived(
        tradepr_key_parsed ? trade.key[tradepr_key_parsed].process : [],
    );

    const list_farm_geolocations: LocationBasis[] = $derived(
        [
            basis.data?.location ? basis.data?.location : undefined,
            ...(basis.data?.lots?.length
                ? [...basis.data?.lots.map((i) => i.location)]
                : []),
        ].filter((i) => typeof i !== `undefined`),
    );

    const find_location_by_id = (id: string): LocationBasis | undefined => {
        return list_farm_geolocations.find((i) => i.id === id) || undefined;
    };

    const product_geolocation_id: string | undefined = $derived(
        product_location_sel === `*map-current`
            ? undefined
            : find_location_by_id(product_location_sel)?.id,
    );

    const product_location: LocationBasis | undefined = $derived(
        product_location_sel
            ? find_location_by_id(product_location_sel)
            : undefined,
    );

    $effect(() => {
        console.log(`choose_location_map_geoc `, choose_location_map_geoc);
    });

    $effect(() => {
        console.log(`product_location_sel_geoc `, product_location_sel_geoc);
    });

    const product_geolocation_point: GeolocationPoint | undefined = $derived(
        product_location_sel === `*map-current`
            ? choose_location_map_geop
            : location_basis_to_geo_point(product_location) || undefined,
    );

    const product_geocode_reverse: GeocoderReverseResult | undefined = $derived(
        product_location_sel === `*map-current`
            ? choose_location_map_geoc
            : product_location_sel_geoc,
    );

    const entries_farm_location: ISelectOption<string>[] = $derived(
        basis.data?.location
            ? [
                  {
                      value: basis.data.location.id,
                      label: basis.data.location.address
                          ? fmt_geolocation_address(basis.data.location.address)
                          : basis.data.location.point
                            ? loc_fmt_geo_point_coords(
                                  $locale,
                                  basis.data.location.point,
                              )
                            : ``,
                  },
              ]
            : [],
    );
    const entries_farm_lots_locations: ISelectOption<string>[] = $derived(
        basis.data?.lots?.length
            ? basis.data.lots
                  .filter(
                      (i) =>
                          i.location &&
                          i.location?.address &&
                          !entries_farm_location
                              .map((i) => i.value)
                              .includes(i.location.id),
                  )
                  .map(({ location }) =>
                      location && location.address
                          ? {
                                value: location.id,
                                label: `${location.address.primary}, ${location.address.admin}, ${location.address.country}`,
                            }
                          : undefined,
                  )
                  .filter((i) => typeof i !== `undefined`)
            : [],
    );

    $effect(() => {
        if (product_key_sel === ``) product_process_sel = ``;
    });

    onMount(async () => {
        try {
            casl_init(0, obj_keys_maxnum(casl_param.default.index_map));
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const handle_sel_key = async (value: string): Promise<void> => {
        if (value in trade.key) product_process_sel = ``;
        el_id(fmt_id(`key_wrap`))?.classList.remove(`layer-1-ring-apply`);
        if (value === `*other`) {
            await handle_tradepr_key_toggle(true);
            product_process_sel = ``;
        }
    };

    const handle_tradepr_key_toggle = async (
        input_visible: boolean,
    ): Promise<void> => {
        product_key_sel_toggle = input_visible;
        if (input_visible) {
            product_key_sel_input = ``;
        } else {
            product_key_sel = ``;
            product_key_sel_input = ``;
        }
    };

    const handle_sel_process = async (value: string): Promise<void> => {
        el_id(fmt_id(`process_wrap`))?.classList.remove(`layer-1-ring-apply`);
        if (value === `*other`) handle_product_process_toggle(true);
        else if (value === `*choose-product`) {
            product_process_sel = ``;
            el_id(fmt_id(`key_wrap`))?.classList.add(`layer-1-ring-apply`);
            await sleep(1000);
            el_id(fmt_id(`key_wrap`))?.classList.remove(`layer-1-ring-apply`);
        }
    };

    const handle_product_process_toggle = async (
        input_visible: boolean,
    ): Promise<void> => {
        product_process_sel_toggle = input_visible;
        if (input_visible) {
            product_process_sel = ``;
            product_process_sel_input = ``;
        }
    };

    const handle_product_location_sel = async (
        value: string,
    ): Promise<void> => {
        console.log(`value `, value);
        el_id(fmt_id(`location_wrap`))?.classList.remove(`layer-1-ring-apply`);
        if (value === `*map`) {
            product_location_sel_geoc = undefined;
            if (choose_location_map_geop) choose_location_map_geop = undefined;
            if (choose_location_map_geoc) choose_location_map_geoc = undefined;
            const geop = await lc_geop_current();
            if (!geop) {
                return void (await lc_gui_alert(
                    `${$ls(`icu.failure_*`, { value: `${$ls(`icu.reading_*`, { value: `${$ls(`common.location`)}`.toLowerCase() })}` })}`,
                ));
            }
            const geoc = await lc_geocode(geop);
            if (!geoc) return; //@todo
            choose_location_map_geoc = geoc;
            choose_location_map_geop = parse_geop_point(geop);
            product_location_map_toggle = true;
            await sleep(1000);
            product_location_sel = ``;
        } else if (value) {
            const value_product_location = find_location_by_id(value);
            if (!value_product_location) return; //@todo
            const geoc = await lc_geocode(value_product_location.point);
            if (geoc) product_location_sel_geoc = geoc;
        }
    };

    const continue_0 = async (): Promise<void> => {
        for (const kv_id of [`key`, `process`, `description`]) {
            const val = await idb.get(fmt_id(kv_id));
            if (!val)
                return void (await lc_gui_alert(
                    `${$ls(`farm.product.validation.${kv_id}.required`)}`,
                ));
        }
        await casl_inc();
    };

    const continue_1 = async (): Promise<void> => {
        if (!photo_paths.length)
            return void (await lc_gui_alert(
                `Upload a product photo`, //@todo
            ));
        await casl_inc();
    };

    const continue_2 = async (): Promise<void> => {
        await casl_inc();
    };

    const continue_3 = async (): Promise<void> => {
        if (!product_geolocation_point || !product_geocode_reverse)
            return void (await lc_gui_alert(`Product location not provided`));
        const vp_payload_submit =
            schema_view_farms_products_add_submission.safeParse({
                product: product_key_sel_input || product_key_sel,
                process: product_process_sel_input || product_process_sel,
                description: product_description_input,
                price_amount: parse_float(product_price_input, 1.0),
                price_currency: product_price_cur_sel,
                price_quantity_unit: product_price_qty_unit_sel,
                quantity_amount: parse_int(product_quantity_input, 1),
                quantity_unit: product_quantity_unit_sel,
                quantity_label: product_quantity_label_sel,
                photos: photo_paths,
                geolocation_point: product_geolocation_point,
                geocode_result: product_geocode_reverse,
            } satisfies IViewFarmsProductsAddSubmitPayload);
        if (!vp_payload_submit.success)
            return void (await lc_gui_alert(
                `Errors: ${vp_payload_submit.error}`,
            ));
        payload_submit = vp_payload_submit.data;
        await casl_inc();
    };

    const continue_4 = async (): Promise<void> => {
        if (!payload_submit)
            return void (await lc_gui_alert(`${$ls(`error.default.failure`)}`));
        loading_submit = true;
        try {
            await basis.on_submit({
                payload: payload_submit,
                farm_id: basis.data.farm.id,
                geolocation_id: product_geolocation_id,
            });
        } catch {
        } finally {
            loading_submit = false;
        }
    };

    const handle_continue = async (): Promise<void> => {
        try {
            switch ($casl_i) {
                case 0:
                    return await continue_0();
                case 1:
                    return await continue_1();
                case 2:
                    return await continue_2();
                case 3:
                    return await continue_3();
                case 4:
                    return await continue_4();
            }
        } catch (e) {
            await handle_err(e, `handle_continue`);
        }
    };

    const handle_back = async (): Promise<void> => {
        try {
            switch ($casl_i) {
                default:
                    return await casl_dec();
            }
        } catch (e) {
            await handle_err(e, `handle_back`);
        }
    };
</script>

<LayoutView basis={{ classes: `` }}>
    <PageToolbar
        basis={{
            header: {
                label: `${`${$ls(`common.farm`)}`} / ${`${$ls(`common.product`)}`}`,
                callback_route: basis.callback_route || { route: `/farms` },
            },
        }}
    />
    <LayoutBottomButton>
        <ButtonLayoutPair
            basis={{
                continue: {
                    label:
                        $casl_i === $casl_imax
                            ? `${$ls(`common.post`)}`
                            : `${$ls(`common.continue`)}`,
                    disabled: false,
                    loading: loading_submit,
                    callback: handle_continue,
                },
                back: {
                    label: `${$ls(`common.back`)}`,
                    visible: $casl_i > 0,
                    callback: handle_back,
                },
            }}
        />
    </LayoutBottomButton>
    <div
        class={`flex flex-col w-lo_line_entry_${$app_lo} pt-4 pb-6 px-1 gap-4 justify-center items-center`}
    >
        <div class={`flex flex-row h-2 w-full justify-start items-center`}>
            <p
                class={`font-sans font-[500] text-sm text-layer-0-glyph/60 capitalize`}
            >
                {casl_param.default.index_map[$casl_i]?.label_desc}
            </p>
        </div>
        <MarkerIndexedView
            basis={{
                index_max: $casl_imax + 1,
                index_curr: $casl_i,
                callback_index: async (index) => {
                    casl_i.set(index);
                },
            }}
        />
    </div>
    <Carousel>
        <CarouselItem basis={{ classes: `gap-4` }}>
            <FormEntrySelectInput
                bind:val_sel={product_key_sel}
                bind:val_sel_input={product_key_sel_input}
                basis={{
                    id: `key`,
                    entry_label: `${$ls(`common.product`)}`,
                    visible_input: product_key_sel_toggle,
                    input_placeholder: `${$ls(`icu.enter_the_*`, { value: `${$ls(`icu.*_name`, { value: `${$ls(`common.product`)}` })}`.toLowerCase() })}`,
                    input_field: form_fields.product_key,
                    callback_visible: handle_tradepr_key_toggle,
                    callback_select: async ({ value }) => {
                        await handle_sel_key(value);
                    },
                    select_entries: [
                        {
                            value: ``,
                            label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.product`)}`.toLowerCase() })}`,
                            disabled: true,
                        },
                        ...trade_keys.map((i) => ({
                            value: i,
                            label: `${$ls(`products.product.key.${i}.name`)}`,
                        })),
                        {
                            value: `*other`,
                            label:
                                product_key_sel === `*other`
                                    ? ``
                                    : `${$ls(`common.other`)}`,
                        },
                    ],
                }}
            />
            <FormEntrySelectInput
                bind:val_sel={product_process_sel}
                bind:val_sel_input={product_process_sel_input}
                basis={{
                    id: `process`,
                    entry_label: `${$ls(`common.process`)}`,
                    visible_input: product_process_sel_toggle,
                    input_placeholder: `${$ls(`icu.enter_the_*`, { value: `${$ls(`common.process`)}`.toLowerCase() })}`,
                    input_field: form_fields.product_process,
                    callback_visible: handle_product_process_toggle,
                    callback_select: async ({ value }) =>
                        await handle_sel_process(value),
                    select_entries: product_process_list.length
                        ? [
                              {
                                  value: ``,
                                  label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.process`)}`.toLowerCase() })}`,
                                  disabled: true,
                              },
                              ...product_process_list.map((i) => ({
                                  value: i,
                                  label: `${$ls(`products.product.key.${tradepr_key_parsed}.process.${i}`)}`,
                              })),
                              {
                                  value: `*other`,
                                  label:
                                      product_key_sel === `*other`
                                          ? ``
                                          : `${$ls(`common.other`)}`,
                              },
                          ]
                        : [
                              {
                                  value: ``,
                                  label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.process`)}`.toLowerCase() })}`,
                                  disabled: true,
                              },
                              {
                                  value: `*choose-product`,
                                  label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.product`)}`.toLowerCase() })}`,
                              },
                          ]
                              .concat(
                                  product_key_sel === `*other`
                                      ? [
                                            ...trade.default.process.map(
                                                (i) => ({
                                                    value: i,
                                                    label: `${$ls(`products.product.default.process.${i}`)}`,
                                                }),
                                            ),
                                            {
                                                value: `*other`,
                                                label: `${$ls(`common.other`)}`,
                                            },
                                        ]
                                      : [],
                              )
                              .filter((i) =>
                                  product_key_sel
                                      ? i.value !== `*choose-product`
                                      : true,
                              ),
                }}
            />
            <FormEntryTextarea
                bind:val={product_description_input}
                basis={{
                    id: `description`,
                    entry_label: `${$ls(`common.description`)}`,
                    field: form_fields.product_description,
                    placeholder: `${$ls(`common.describe_your_product`)}`,
                }}
            />
        </CarouselItem>
        <CarouselItem basis={{ classes: `px-4` }}>
            <ImageUploadSimple bind:photo_paths />
        </CarouselItem>
        <CarouselItem basis={{ classes: `gap-4` }}>
            <FormEntryPrice
                bind:val_input_price={product_price_input}
                bind:val_sel_currency={product_price_cur_sel}
                bind:val_sel_quantity_unit={product_price_qty_unit_sel}
                basis={{
                    id: `price`,
                    entry_label: `price`,
                    input_placeholder: `${$ls(`icu.enter_*`, { value: `${$ls(`common.price`)}` })}`,
                }}
            />
            <FormEntryQuantity
                bind:val_input_quantity={product_quantity_input}
                bind:val_sel_quantity_unit={product_quantity_unit_sel}
                bind:val_sel_quantity_label={product_quantity_label_sel}
                basis={{
                    id: `quantity`,
                    entry_label: `quantity`,
                    input_placeholder: `${$ls(`icu.enter_*`, { value: `${$ls(`common.quantity`)}` })}`,
                }}
            />
        </CarouselItem>
        <CarouselItem>
            <FormEntrySelect
                bind:val={product_location_sel}
                basis={{
                    id: `location`,
                    entry_label: `${$ls(`common.location`)}`,
                    callback: async ({ value }) =>
                        await handle_product_location_sel(value),
                    entries: choose_location_map_geoc
                        ? [
                              {
                                  value: ``,
                                  label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.location`)}`.toLowerCase() })}`,
                                  disabled: true,
                              },
                              {
                                  value: `*map`,
                                  label: `${$ls(`common.choose_on_map`)}`,
                              },
                              {
                                  value: `*map-current`,
                                  label: `${str_trunc(fmt_geocode_address(choose_location_map_geoc))} (map)`,
                              },
                              ...entries_farm_location,
                              ...entries_farm_lots_locations,
                          ]
                        : [
                              {
                                  value: ``,
                                  label: `${$ls(`icu.choose_*`, { value: `${$ls(`common.location`)}`.toLowerCase() })}`,
                                  disabled: true,
                              },
                              ...entries_farm_location,
                              ...entries_farm_lots_locations,
                              {
                                  value: `*map`,
                                  label: `${$ls(`common.choose_on_map`)}`,
                              },
                          ],
                }}
            />
        </CarouselItem>
        <CarouselItem>
            <div class={`flex flex-col w-full justify-center items-center`}>
                <FarmsProductsReviewCard
                    basis={{
                        data: payload_submit,
                    }}
                />
            </div>
        </CarouselItem>
    </Carousel>
</LayoutView>
<MapLocationSelectEnvelope
    bind:map_geop={choose_location_map_geop}
    bind:map_geoc={choose_location_map_geoc}
    basis={{
        visible: product_location_map_toggle,
        on_submit: async (params) => {
            try {
                if (!params) {
                    choose_location_map_geoc = undefined;
                    return;
                }
                const { map_geoc, map_geop } = params;
                if (map_geoc && map_geop) product_location_sel = `*map-current`;
                else product_location_sel = ``;
            } catch (e) {
                await handle_err(e, `on_submit`);
            } finally {
                product_location_map_toggle = false;
            }
        },
    }}
/>
