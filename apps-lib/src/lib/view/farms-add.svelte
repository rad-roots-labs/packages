<script lang="ts">
    import LayoutBottomButton from "$lib/components/layout/layout-bottom-button.svelte";
    import Fade from "$lib/components/lib/fade.svelte";
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

    let map_geop: GeolocationPoint = $state({ lat: 0, lng: 0 });
    let map_geoc: GeocoderReverseResult | undefined = $state(undefined);

    let val_farmname = $state(``);
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
        map_geop ? geol_lat_fmt(map_geop.lat, `dms`, $locale, 3) : ``,
    );

    const farm_geop_lng = $derived(
        map_geop ? geol_lng_fmt(map_geop.lng, `dms`, $locale, 3) : ``,
    );

    const farm_geolocation_address: GeolocationAddress | undefined = $derived(
        parse_geocode_address(map_geoc),
    );

    const handle_continue_0 = async (): Promise<void> => {
        await casl_inc();
    };

    const handle_continue_1 = async (): Promise<void> => {
        if (!map_geop)
            return void basis.lc_gui_alert(`No farm location provided.`); //@todo
        if (!farm_geolocation_address)
            return void basis.lc_gui_alert(`No farm address provided.`); //@todo
        const farms_add_submission = schema_view_farms_add_submission.safeParse(
            {
                farm_name: val_farmname,
                farm_area: parse_float(val_farmarea),
                farm_area_unit: val_farmarea_unit,
                farm_contact_name: val_farmcontact,
                geolocation_point: map_geop,
                geolocation_address: farm_geolocation_address,
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
            case 0:
                return await handle_continue_0();
            case 1:
                return await handle_continue_1();
        }
    };

    const handle_back = async (): Promise<void> => {
        switch ($casl_i) {
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
            {#if $casl_i > 0}
                <Fade>
                    <button
                        class={`flex flex-row pr-3 justify-center items-center`}
                        onclick={async () => {
                            await handle_back();
                        }}
                    >
                        <p
                            class={`font-sans font-[600] text-lg text-layer-0-glyph`}
                        >
                            {`${$ls(`common.back`)}`}
                        </p>
                    </button>
                </Fade>
            {/if}
            <button
                class={`flex flex-row justify-center items-center`}
                onclick={async () => {
                    await handle_continue();
                }}
            >
                <p class={`font-sans font-[600] text-lg text-layer-0-glyph-hl`}>
                    {`${$ls(`common.details`)}`}
                </p>
                <Glyph
                    basis={{
                        classes: `text-layer-0-glyph-hl`,
                        dim: `md`,
                        key: `caret-right`,
                    }}
                />
            </button>
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
