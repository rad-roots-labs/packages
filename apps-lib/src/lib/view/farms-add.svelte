<script lang="ts">
    import {
        ButtonLayoutPair,
        Carousel,
        casl_dec,
        casl_i,
        casl_inc,
        casl_init,
        FarmsAddCasliDetail,
        FarmsAddCasliMap,
        handle_err,
        LayoutView,
        liblocale,
        lls,
        PageToolbar,
    } from "$root";
    import {
        geol_lat_fmt,
        geol_lng_fmt,
        parse_float,
        parse_geocode_address,
        vs_view_farms_add_submission,
        type CallbackPromiseGeneric,
        type CallbackRoute,
        type GeocoderReverseResult,
        type GeolocationAddress,
        type GeolocationPoint,
        type IViewFarmsAddSubmission,
        type LcGeocodeCallback,
        type LcGeocodeCurrentCallback,
        type LcGuiAlertCallback,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
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
        map_geop ? geol_lat_fmt(map_geop.lat, `dms`, $liblocale, 3) : ``,
    );

    const farm_geop_lng = $derived(
        map_geop ? geol_lng_fmt(map_geop.lng, `dms`, $liblocale, 3) : ``,
    );

    const farm_geolocation_address: GeolocationAddress | undefined = $derived(
        parse_geocode_address(map_geoc),
    );

    const handle_continue_1 = async (): Promise<void> => {
        if (!map_geop) return; //@todo
        if (!farm_geolocation_address) return; //@todo

        const vp_obj_submit = vs_view_farms_add_submission.safeParse({
            farm_name: val_farmname,
            farm_area: parse_float(val_farmarea),
            farm_area_unit: val_farmarea_unit,
            farm_contact_name: val_farmcontact,
            geolocation_point: map_geop,
            geolocation_address: farm_geolocation_address,
        } satisfies IViewFarmsAddSubmission);

        if (!vp_obj_submit.success) {
            return void basis.lc_gui_alert(
                `Please correct the following errors: ${vp_obj_submit.error}`,
            );
        }
        loading = true;
        await basis.lc_submit({ data_s: vp_obj_submit.data });
        loading = false;
    };

    const handle_continue = async (): Promise<void> => {
        switch ($casl_i) {
            case 1:
                return handle_continue_1();
            default:
                return await casl_inc();
        }
    };

    const handle_back = async (): Promise<void> => {
        await casl_dec();
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
    />
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
        />
    </Carousel>
    <div
        class="absolute bottom-4 left-0 flex flex-row w-full gap-1 justify-center items-center"
    >
        <ButtonLayoutPair
            basis={{
                continue: {
                    label: `${$lls(`common.continue`)}`,
                    disabled: disabled_submit,
                    callback: handle_continue,
                },
                back: {
                    label: `${$lls(`common.back`)}`,
                    visible: $casl_i > 0,
                    callback: handle_back,
                },
            }}
        />
    </div>
</LayoutView>
