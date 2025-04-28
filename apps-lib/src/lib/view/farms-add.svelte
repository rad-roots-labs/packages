<script lang="ts">
    import LayoutBottomButton from "$lib/components/layout/layout-bottom-button.svelte";
    import { schema_view_farms_add_submission } from "$lib/util/validation/farm";
    import {
        app_platform,
        ButtonLayoutPair,
        Carousel,
        casl_dec,
        casl_i,
        casl_inc,
        casl_init,
        FarmsAddCasliDetail,
        FarmsAddCasliMap,
        fmt_id,
        focus_map_marker,
        geop_init,
        geop_is_valid,
        Glyph,
        handle_err,
        LayoutView,
        PageToolbar,
        type CallbackRoute,
        type IViewFarmsAddSubmission,
        type LcGeocodeCallback,
        type LcGeocodeCurrentCallback,
        type LcGuiAlertCallback,
    } from "$root";
    import {
        el_id,
        geol_lat_fmt,
        geol_lng_fmt,
        parse_float,
        parse_geocode_address,
        type CallbackPromiseGeneric,
        type GeocoderReverseResult,
        type GeolocationAddress,
        type GeolocationPoint,
        type I18nTranslateFunction,
        type I18nTranslateLocale,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        ls,
        locale,
    }: {
        basis: {
            callback_route?: CallbackRoute<string>;
            lc_gui_alert: LcGuiAlertCallback;
            lc_geop_current: LcGeocodeCurrentCallback;
            lc_geocode: LcGeocodeCallback;
            lc_submit: CallbackPromiseGeneric<{
                data_s: IViewFarmsAddSubmission;
            }>;
        };
        ls: I18nTranslateFunction;
        locale: I18nTranslateLocale;
    } = $props();

    let loading = $state(false);

    let map_geop: GeolocationPoint = $state(geop_init());
    let map_geoc: GeocoderReverseResult | undefined = $state(undefined);

    let val_farmname = $state(``);
    let val_farmaddress = $state(``);
    let val_farmcontact = $state(``);
    let val_farmarea = $state(``);
    let val_farmarea_unit = $state(`ac`);

    const disabled_submit = $derived($casl_i === 1 && !val_farmname);

    onMount(async () => {
        try {
            casl_init(0, 2);
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const farm_geop_lat = $derived(
        geop_is_valid(map_geop)
            ? geol_lat_fmt(map_geop.lat, `dms`, $locale, 3)
            : ``,
    );

    const farm_geop_lng = $derived(
        geop_is_valid(map_geop)
            ? geol_lng_fmt(map_geop.lng, `dms`, $locale, 3)
            : ``,
    );

    const farm_geolocation_address: GeolocationAddress | undefined = $derived(
        parse_geocode_address(map_geoc),
    );

    $effect(() => {
        if (farm_geolocation_address)
            val_farmaddress = `${farm_geolocation_address.primary}, ${farm_geolocation_address.admin}, ${farm_geolocation_address.country}`;
    });

    const handle_enter_location = async (): Promise<void> => {
        map_geoc = undefined;
        map_geop = geop_init();
        val_farmaddress = ``;
        await handle_continue();
        el_id(fmt_id(`farm_location`))?.focus();
    };

    const handle_continue_1 = async (): Promise<void> => {
        if (!map_geop || !map_geoc)
            return void basis.lc_gui_alert(`No farm location provided.`); //@todo
        const farms_add_submission = schema_view_farms_add_submission.safeParse(
            {
                farm_name: val_farmname,
                farm_area: val_farmarea ? parse_float(val_farmarea) : undefined,
                farm_area_unit:
                    val_farmarea && val_farmarea_unit
                        ? val_farmarea_unit
                        : undefined,
                farm_contact_name: val_farmcontact
                    ? val_farmcontact
                    : undefined,
                geolocation_point: map_geop,
                geocode_result: map_geoc,
            } satisfies IViewFarmsAddSubmission,
        );

        if (!farms_add_submission.success) {
            return void basis.lc_gui_alert(
                `Request invalid: ${farms_add_submission.error}`,
            ); //@todo
        }
        loading = true;
        await basis.lc_submit({ data_s: farms_add_submission.data });
        loading = false;
    };

    const handle_continue = async (): Promise<void> => {
        switch ($casl_i) {
            case 1:
                return await handle_continue_1();
            default:
                await casl_inc();
        }
    };

    const handle_back = async (): Promise<void> => {
        switch ($casl_i) {
            case 1: {
                if (!geop_is_valid(map_geop)) {
                    const geop_cur = await basis.lc_geop_current();
                    if (geop_cur) {
                        map_geop = geop_cur;
                        const geoc_cur = await basis.lc_geocode(geop_cur);
                        if (geoc_cur) map_geoc = geoc_cur;
                        focus_map_marker();
                    }
                }
            }
            default:
                return await casl_dec();
        }
    };
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `Farm / Add`,
                callback_route: basis.callback_route,
            },
        }}
    >
        {#snippet header_option()}
            {#if $casl_i === 0}
                <button
                    class={`flex flex-row justify-center items-center`}
                    onclick={async () => {
                        await handle_enter_location();
                    }}
                >
                    <p
                        class={`font-sans font-[600] text-[18px] text-layer-0-glyph-hl`}
                    >
                        {`${$ls(`common.enter_location`)}`}
                    </p>
                    <Glyph
                        basis={{
                            classes: `text-layer-0-glyph-hl`,
                            dim: `md`,
                            key: `caret-right`,
                        }}
                    />
                </button>
            {/if}
        {/snippet}
    </PageToolbar>
    <Carousel>
        <FarmsAddCasliMap
            bind:map_geop
            bind:map_geoc
            {farm_geop_lat}
            {farm_geop_lng}
            basis={{
                lc_geocode: basis.lc_geocode,
                lc_geop_current: basis.lc_geop_current,
            }}
        />
        <FarmsAddCasliDetail
            bind:val_farmname
            bind:val_farmaddress
            bind:val_farmcontact
            bind:val_farmarea
            bind:val_farmarea_unit
            {farm_geop_lat}
            {farm_geop_lng}
            {ls}
        />
    </Carousel>
</LayoutView>
{#if $app_platform?.browser !== `safari`}
    <LayoutBottomButton>
        <ButtonLayoutPair
            basis={{
                continue: {
                    label: `${$ls(`common.continue`)}`,
                    disabled: disabled_submit,
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
{/if}
