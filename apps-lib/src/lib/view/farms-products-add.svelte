<script lang="ts">
    import {
        app_lo,
        ButtonHorizontalPairSlide,
        ButtonRound,
        Carousel,
        CarouselItem,
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
        handle_err,
        idb,
        ImageUploadSimple,
        LayoutBottomButton,
        LayoutView,
        lib_fmt_geometry_point_coords,
        lls,
        MapLocationSelectEnvelope,
        MarkerIndexedView,
        PageToolbar,
    } from "$root";
    import {
        el_id,
        fmt_geocode_address,
        fmt_geolocation_address,
        form_fields,
        obj_keys_maxnum,
        parse_float,
        parse_geocode_address,
        parse_geolocation_address,
        parse_geolocation_point,
        parse_geop_point,
        parse_int,
        parse_trade_key,
        sleep,
        str_trunc,
        trade,
        trade_keys,
        vs_view_farms_products_add_submission,
        type CallbackPromiseFull,
        type CallbackPromiseGeneric,
        type CallbackRoute,
        type GeocoderReverseResult,
        type GeolocationAddress,
        type GeolocationPoint,
        type ISelectOption,
        type IViewBasis,
        type IViewFarmsProductsAddSubmission,
        type LcGeocodeCallback,
        type LcGeocodeCurrentCallback,
        type LcGuiAlertCallback,
        type LcGuiConfirmCallback,
        type LcPhotoAddMultipleCallback,
        type ResolveFarmInfo,
        type ResolveGeolocationInfo,
    } from "@radroots/util";
    import { onMount } from "svelte";

    const casl_param: Record<
        "default",
        {
            index_map: Record<number, { label_desc: string }>;
        }
    > = {
        default: {
            index_map: {
                0: {
                    label_desc: `Add product information`,
                },
                1: {
                    label_desc: `Upload images`,
                },
                2: {
                    label_desc: `Product Price`,
                },
                3: {
                    label_desc: `Add Location`,
                },
                4: {
                    label_desc: `Review`,
                },
            },
        },
    };

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: ResolveFarmInfo;
            callback_route?: CallbackRoute<string>;
            lc_gui_alert: LcGuiAlertCallback;
            lc_gui_confirm: LcGuiConfirmCallback;
            lc_geocode: LcGeocodeCallback;
            lc_handle_farm_lot_add: CallbackPromiseGeneric<string>;
            lc_handle_photo_add: LcPhotoAddMultipleCallback;
            lc_handle_photo_envelope_edit: CallbackPromiseGeneric<number>;
            lc_img_bin: CallbackPromiseFull<string, Uint8Array | undefined>;
            lc_handle_tradepr_key_toggle: CallbackPromiseFull<boolean, string>;
            lc_geop_current: LcGeocodeCurrentCallback;
            lc_submit: CallbackPromiseGeneric<{
                data_s: IViewFarmsProductsAddSubmission;
                farm_id: string;
                farm_lot_id?: string;
                geolocation_id?: string;
            }>;
        }>;
    } = $props();

    let loading_submit = $state(false);

    let data_s: IViewFarmsProductsAddSubmission | undefined = $state(undefined);

    let photo_paths = $state([]);

    let toggle_opt_addexisting = $state(false);

    let product_key_sel = $state(`cacao`);
    let product_key_sel_input = $state(``);
    let product_key_sel_toggle = $state(false);

    let product_process_sel = $state(`raw`);
    let product_process_sel_input = $state(``);
    let product_process_sel_toggle = $state(false);

    let product_description_input = $state(`cool description`);

    let product_location_sel = $state(``);
    let product_location_map_toggle = $state(false);

    let product_price_cur_sel = $state(`usd`);
    let product_price_input = $state(`4.50`);
    let product_price_qty_unit_sel = $state(`lb`);

    let product_quantity_input = $state(`60`);
    let product_quantity_unit_sel = $state(`kg`);
    let product_quantity_label_sel = $state(`bag`);

    let tradepr_lgc_map_point: GeolocationPoint | undefined = $state(undefined);
    let tradepr_lgc_map_geoc: GeocoderReverseResult | undefined =
        $state(undefined);

    const tradepr_key_parsed = $derived(parse_trade_key(product_key_sel));

    const product_process_list = $derived(
        tradepr_key_parsed ? trade.key[tradepr_key_parsed].process : [],
    );

    const list_farm_geolocations: ResolveGeolocationInfo[] = $derived(
        [
            basis.data?.geolocation ? basis.data?.geolocation : undefined,
            ...(basis.data?.farm_lots?.length
                ? [...basis.data?.farm_lots.map((i) => i.geolocation)]
                : []),
        ].filter((i) => typeof i !== `undefined`),
    );

    const product_farm_lot_id: string | undefined = $derived(
        product_location_sel === `*map-location` ||
            !basis.data?.farm_lots?.length
            ? undefined
            : basis.data?.farm_lots.find(
                  (i) => i.geolocation.id === product_location_sel,
              )?.id || undefined,
    );

    const product_geolocation_id: string | undefined = $derived(
        product_location_sel === `*map-location`
            ? undefined
            : list_farm_geolocations.find((i) => i.id === product_location_sel)
                  ?.id || undefined,
    );

    const product_geolocation: ResolveGeolocationInfo | undefined = $derived(
        list_farm_geolocations.find((i) => i.id === product_location_sel) ||
            undefined,
    );

    const product_geolocation_point: GeolocationPoint | undefined = $derived(
        product_location_sel === `*map-location`
            ? tradepr_lgc_map_point
            : parse_geolocation_point(product_geolocation?.point) || undefined,
    );

    const product_geolocation_address: GeolocationAddress | undefined =
        $derived(
            product_location_sel === `*map-location`
                ? parse_geocode_address(tradepr_lgc_map_geoc)
                : parse_geolocation_address(product_geolocation?.address) ||
                      undefined,
        );

    const entries_farm_location: ISelectOption<string>[] = $derived(
        basis.data?.geolocation
            ? [
                  {
                      value: basis.data.geolocation.id,
                      label:
                          fmt_geolocation_address(
                              basis.data.geolocation.address,
                          ) ||
                          lib_fmt_geometry_point_coords(
                              basis.data.geolocation.point,
                          ) ||
                          ``,
                  },
              ]
            : [],
    );
    const entries_farm_lots_locations: ISelectOption<string>[] = $derived(
        basis.data?.farm_lots?.length
            ? basis.data.farm_lots
                  .filter(
                      (i) =>
                          i.geolocation.address &&
                          !entries_farm_location
                              .map((i) => i.value)
                              .includes(i.geolocation.id),
                  )
                  .map(({ geolocation }) => ({
                      value: geolocation.id,
                      label: `${geolocation.address.primary}, ${geolocation.address.admin}, ${geolocation.address.country}`,
                  }))
            : [],
    );

    onMount(async () => {
        try {
            casl_init(0, obj_keys_maxnum(casl_param.default.index_map));
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const handle_sel_key = async (value: string): Promise<void> => {
        el_id(fmt_id(`key_wrap`))?.classList.remove(`layer-1-ring-apply`);
        if (value === `*other`) {
            await handle_tradepr_key_toggle(true);
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
        if (value === `*choose-product`) {
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

    const handle_product_location_sel_map = async (
        value: string,
    ): Promise<void> => {
        el_id(fmt_id(`location_wrap`))?.classList.remove(`layer-1-ring-apply`);
        if (value === `*map`) {
            if (tradepr_lgc_map_point) tradepr_lgc_map_point = undefined;
            if (tradepr_lgc_map_geoc) tradepr_lgc_map_geoc = undefined;
            const geop = await basis.lc_geop_current();
            if (!geop) {
                return void (await basis.lc_gui_alert(
                    `${$lls(`icu.failure_*`, { value: `${$lls(`icu.reading_*`, { value: `${$lls(`common.geocode`)}`.toLowerCase() })}` })}`,
                ));
            }
            const geoc = await basis.lc_geocode(geop);
            if (geoc) tradepr_lgc_map_geoc = geoc;
            tradepr_lgc_map_point = parse_geop_point(geop);
            product_location_map_toggle = true;
            await sleep(1000);
            product_location_sel = ``;
        }
    };

    const continue_0 = async (): Promise<void> => {
        for (const kv_id of [`key`, `process`, `description`]) {
            const val = await idb.get(fmt_id(kv_id));
            if (!val)
                return void basis.lc_gui_alert(
                    `${$lls(`farm.product.validation.${kv_id}.required`)}`,
                );
        }
        await casl_inc();
    };

    const continue_1 = async (): Promise<void> => {
        if (!photo_paths.length)
            return void basis.lc_gui_alert(
                `Upload a product photo`, //@todo
            );
        await casl_inc();
    };

    const continue_2 = async (): Promise<void> => {
        await casl_inc();
    };

    const continue_3 = async (): Promise<void> => {
        if (!product_geolocation_point || !product_geolocation_address)
            return void (await basis.lc_gui_alert(
                `Select the product location`, //@todo
            ));
        const vp_data_s = vs_view_farms_products_add_submission.safeParse({
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
            geolocation_address: product_geolocation_address,
        } satisfies IViewFarmsProductsAddSubmission);
        if (!vp_data_s.success) {
            return void basis.lc_gui_alert(
                `Please correct the following errors: ${vp_data_s.error}`,
            );
        }
        data_s = vp_data_s.data;
        await casl_inc();
    };

    const continue_4 = async (): Promise<void> => {
        if (!data_s) return;
        loading_submit = true;
        await basis.lc_submit({
            data_s,
            farm_id: basis.data.id,
            farm_lot_id: product_farm_lot_id,
            geolocation_id: product_geolocation_id,
        });
        loading_submit = false;
    };

    const handle_continue = async (num_i?: number): Promise<void> => {
        try {
            const num = num_i ?? $casl_i;
            switch (num) {
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
</script>

<LayoutView basis={{ classes: `pb-h_lo_bottom_button_${$app_lo}` }}>
    <PageToolbar
        basis={{
            header: {
                label: `${`${$lls(`common.farm`)}`} / ${`${$lls(`common.product`)}`}`,
                callback_route: basis.callback_route || { route: `/farms` },
            },
        }}
    />
    <div class={`flex flex-col w-full pt-4 px-4 justify-center items-center`}>
        <div class={`flex flex-row w-full gap-2 justify-center items-center`}>
            <ButtonHorizontalPairSlide
                bind:toggle={toggle_opt_addexisting}
                basis={{
                    label_l: `${$lls(`common.create_product`)}`,
                    label_r: `${$lls(`common.add_from_existing`)}`,
                }}
            />
        </div>
    </div>
    {#if !toggle_opt_addexisting}
        <LayoutBottomButton>
            <ButtonRound
                basis={{
                    classes: `text-layer-0-glyph bg-layer-1-surface active:bg-layer-1-surface_a`,
                    loading: loading_submit,
                    label:
                        $casl_i === $casl_imax
                            ? `${$lls(`common.post`)}`
                            : `${$lls(`common.continue`)}`,
                    callback: async () => {
                        handle_continue();
                    },
                }}
            />
        </LayoutBottomButton>
        <div
            class={`flex flex-col w-full p-4 gap-4 justify-center items-center`}
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
                        entry_label: `${$lls(`common.product`)}`,
                        visible_input: product_key_sel_toggle,
                        input_placeholder: `${$lls(`icu.enter_the_*`, { value: `${$lls(`icu.*_name`, { value: `${$lls(`common.product`)}` })}`.toLowerCase() })}`,
                        input_field: form_fields.product_key,
                        callback_visible: handle_tradepr_key_toggle,
                        callback_select: async ({ value }) =>
                            await handle_sel_key(value),
                        select_entries: [
                            {
                                value: ``,
                                label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.product`)}`.toLowerCase() })}`,
                                disabled: true,
                            },
                            ...trade_keys.map((i) => ({
                                value: i,
                                label: `${$lls(`trade.product.key.${i}.name`)}`,
                            })),
                            {
                                value: `*other`,
                                label: `${$lls(`common.other`)}`,
                            },
                        ],
                    }}
                />
                <FormEntrySelectInput
                    bind:val_sel={product_process_sel}
                    bind:val_sel_input={product_process_sel_input}
                    basis={{
                        id: `process`,
                        entry_label: `${$lls(`common.process`)}`,
                        visible_input: product_process_sel_toggle,
                        input_placeholder: `${$lls(`icu.enter_the_*`, { value: `${$lls(`common.process`)}`.toLowerCase() })}`,
                        input_field: form_fields.product_process,
                        callback_visible: handle_product_process_toggle,
                        callback_select: async ({ value }) =>
                            await handle_sel_process(value),
                        select_entries: product_process_list.length
                            ? [
                                  {
                                      value: ``,
                                      label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.process`)}`.toLowerCase() })}`,
                                      disabled: true,
                                  },
                                  ...product_process_list.map((i) => ({
                                      value: i,
                                      label: `${$lls(`trade.product.key.${tradepr_key_parsed}.process.${i}`)}`,
                                  })),
                                  {
                                      value: `*other`,
                                      label: `${$lls(`common.other`)}`,
                                  },
                              ]
                            : [
                                  {
                                      value: ``,
                                      label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.process`)}`.toLowerCase() })}`,
                                      disabled: true,
                                  },
                                  {
                                      value: `*choose-product`,
                                      label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.product`)}`.toLowerCase() })}`,
                                  },
                              ].concat(
                                  product_key_sel === `*other`
                                      ? [
                                            ...trade.default.process.map(
                                                (i) => ({
                                                    value: i,
                                                    label: `${$lls(`trade.product.default.process.${i}`)}`,
                                                }),
                                            ),
                                            {
                                                value: `*other`,
                                                label: `${$lls(`common.other`)}`,
                                            },
                                        ]
                                      : [],
                              ),
                    }}
                />
                <FormEntryTextarea
                    bind:val={product_description_input}
                    basis={{
                        id: `description`,
                        entry_label: `${$lls(`common.description`)}`,
                        field: form_fields.product_description,
                        placeholder: `${$lls(`common.describe_your_product`)}`,
                    }}
                />
            </CarouselItem>
            <CarouselItem basis={{ classes: `px-4` }}>
                <ImageUploadSimple
                    bind:photo_paths
                    basis={{
                        lc_handle_photo_add: basis.lc_handle_photo_add,
                    }}
                />
            </CarouselItem>
            <CarouselItem basis={{ classes: `gap-4` }}>
                <FormEntryPrice
                    bind:val_input_price={product_price_input}
                    bind:val_sel_currency={product_price_cur_sel}
                    bind:val_sel_quantity_unit={product_price_qty_unit_sel}
                    basis={{
                        id: `price`,
                        entry_label: `price`,
                        input_placeholder: `Enter price`,
                    }}
                />
                <FormEntryQuantity
                    bind:val_input_quantity={product_quantity_input}
                    bind:val_sel_quantity_unit={product_quantity_unit_sel}
                    bind:val_sel_quantity_label={product_quantity_label_sel}
                    basis={{
                        id: `quantity`,
                        entry_label: `quantity`,
                        input_placeholder: `Enter quantity`,
                    }}
                />
            </CarouselItem>
            <CarouselItem>
                <FormEntrySelect
                    bind:val={product_location_sel}
                    basis={{
                        id: `location`,
                        entry_label: `${$lls(`common.location`)}`,
                        callback: async ({ value }) =>
                            await handle_product_location_sel_map(value),
                        entries: tradepr_lgc_map_geoc
                            ? [
                                  {
                                      value: ``,
                                      label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.location`)}`.toLowerCase() })}`,
                                      disabled: true,
                                  },
                                  {
                                      value: `*map`,
                                      label: `${$lls(`icu.choose_on_*`, { value: `${$lls(`common.map`)}`.toLowerCase() })}`,
                                  },
                                  {
                                      value: `*map-location`,
                                      label: `${str_trunc(fmt_geocode_address(tradepr_lgc_map_geoc))} (map)`,
                                  },
                                  ...entries_farm_location,
                                  ...entries_farm_lots_locations,
                              ]
                            : [
                                  {
                                      value: ``,
                                      label: `${$lls(`icu.choose_*`, { value: `${$lls(`common.location`)}`.toLowerCase() })}`,
                                      disabled: true,
                                  },
                                  ...entries_farm_location,
                                  ...entries_farm_lots_locations,
                                  {
                                      value: `*map`,
                                      label: `${$lls(`icu.choose_on_*`, { value: `${$lls(`common.map`)}`.toLowerCase() })}`,
                                  },
                              ],
                    }}
                />
            </CarouselItem>
            <CarouselItem>
                <div class={`flex flex-col w-full justify-center items-center`}>
                    <FarmsProductsReviewCard
                        basis={{
                            data: data_s,
                        }}
                    />
                </div>
            </CarouselItem>
        </Carousel>
    {:else}
        <p class={`font-sans font-[400] text-layer-0-glyph`}>
            {`Coming soon!`}
        </p>
    {/if}
</LayoutView>
<MapLocationSelectEnvelope
    bind:map_geop={tradepr_lgc_map_point}
    bind:map_geoc={tradepr_lgc_map_geoc}
    basis={{
        visible: product_location_map_toggle,
        farm_info: basis.data,
        lc_geocode: basis.lc_geocode,
        lc_submit: async ({ map_geoc, map_geop }) => {
            try {
                if (map_geoc && map_geop)
                    product_location_sel = `*map-location`;
                else product_location_sel = ``;
                product_location_map_toggle = false;
            } catch (e) {
                await handle_err(e, `lc_submit`);
            }
        },
    }}
/>
