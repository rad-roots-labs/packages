<script lang="ts">
    import { Glyph, LogoCircleSm, ls, route } from "$lib";
</script>

<div class={`flex flex-row h-12 w-full px-6 justify-between items-center`}>
    <button
        class={`flex flex-row gap-2 justify-start items-center`}
        on:click={async () => {
            await route(`/`);
        }}
    >
        <LogoCircleSm />
        <p
            class={`font-sansd italic font-[700] text-[1.7rem] text-layer-0-glyph lowercase`}
        >
            {`${$ls(`app.name`)}`}
        </p>
    </button>
    <button
        class={`flex flex-row justify-center items-center`}
        on:click={async () => {
            await route(`/settings`);
        }}
    >
        <Glyph
            basis={{
                classes: `text-layer-0-glyph`,
                dim: `lg`,
                weight: `bold`,
                key: `gear`,
            }}
        />
    </button>
</div>
