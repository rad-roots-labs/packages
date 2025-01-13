<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        Empty,
        Glyph,
        LogoCircleSm,
        PageHeader,
        type IBasisOpt,
        type IPageToolbar,
    } from "$lib";

    export let basis: IBasisOpt<IPageToolbar> = undefined;
</script>

<div class={`flex flex-row h-12 w-full px-6 justify-between items-center`}>
    <button
        class={`flex flex-row gap-2 justify-start items-center`}
        on:click={async () => {
            if (basis?.callback) await basis.callback();
            else await goto(`/`);
        }}
    >
        <LogoCircleSm />
        <p
            class={`font-sansd italic font-[700] text-[1.7rem] text-layer-0-glyph lowercase`}
        >
            {`radroots`}
        </p>
    </button>
    <button
        class={`flex flex-row justify-center items-center`}
        on:click={async () => {
            await goto(`/settings`);
        }}
    >
        <Glyph
            basis={{
                classes: `text-layer-0-glyph`,
                dim: `lg`,
                weight: `bold`,
                key: `gear`,
            }}
        ></Glyph>
    </button>
</div>
{#if basis?.header}
    <div class={`flex flex-row h-5 w-full justify-center items-center`}>
        <Empty></Empty>
    </div>
    <PageHeader basis={basis.header}>
        <div slot="header-option">
            <slot name="header-option" />
        </div>
    </PageHeader>
{/if}
