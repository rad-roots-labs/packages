<script lang="ts">
    import {
        geol_lat_fmt,
        geol_lng_fmt,
        Glyph,
        type GeocoderReverseResult,
        type GeolocationPoint,
        type IClOpt,
    } from "$lib";
    import Fade from "../lib/fade.svelte";

    export let basis: IClOpt & {
        point?: GeolocationPoint;
        geoc_r?: GeocoderReverseResult;
    };
</script>

<div
    class={`flex flex-col w-fit px-5 py-[0.7rem] justify-start items-start bg-layer-1-surface rounded-2xl shadow-lg`}
>
    <div class={`flex flex-col w-full gap-1 justify-start items-start`}>
        {#if basis.geoc_r}
            <Fade
                basis={{
                    classes: `flex-col w-full gap-1 justify-start items-start`,
                }}
            >
                <div class={`flex flex-row gap-1 justify-start items-center`}>
                    <p
                        class={`font-sans font-[500] text-[0.9rem] text-layer-2-glyph`}
                    >
                        {basis.geoc_r.name}
                    </p>
                    <Glyph
                        basis={{
                            classes: `text-layer-2-glyph -translate-y-[2px]`,
                            dim: `xs`,
                            weight: `bold`,
                            key: `map-pin-simple`,
                        }}
                    ></Glyph>
                </div>
                <div
                    class={`flex flex-row w-full gap-1 justify-start items-center`}
                >
                    <p
                        class={`font-sans font-[500] text-[0.9rem] tracking-tight text-layer-2-glyph`}
                    >
                        {`${basis.geoc_r.admin1_name},`}
                    </p>
                    <p
                        class={`font-sans font-[500] text-[0.9rem] tracking-tight text-layer-2-glyph`}
                    >
                        {`${basis.geoc_r.country_name}`}
                    </p>
                </div>
            </Fade>
        {/if}
        {#if basis.point}
            <div class={`flex flex-col w-full justify-start items-start`}>
                <p
                    class={`font-sans font-[400] text-[0.9rem] text-layer-0-glyph`}
                >
                    {`${geol_lat_fmt(basis.point.lat, `dms`)}`}
                </p>
                <p
                    class={`font-sans font-[400] text-[0.9rem] text-layer-0-glyph`}
                >
                    {`${geol_lng_fmt(basis.point.lng, `dms`)}`}
                </p>
            </div>
        {/if}
    </div>
</div>
