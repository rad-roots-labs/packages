<script lang="ts">
    import {
        Glyph,
        LogoCircleSm,
        ls,
        PageHeader,
        route,
        type CallbackPromiseReturn,
        type IPageHeader,
        type NavigationRoute,
    } from "$lib";

    export let basis: {
        callback_route?: CallbackPromiseReturn<NavigationRoute | undefined>;
        page_header?: IPageHeader;
    };
</script>

<div class={`flex flex-row h-12 w-full px-6 pb-6 justify-between items-center`}>
    <button
        class={`flex flex-row gap-2 justify-start items-center`}
        on:click={async () => {
            if (basis.callback_route) {
                const route_to = await basis.callback_route();
                if (!route_to) return;
                await route(route_to);
                return;
            }
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
{#if basis?.page_header}
    <PageHeader
        basis={{
            callback_route: basis.callback_route,
            ...basis?.page_header,
        }}
    >
        <div slot="option" class={`flex flex-row justify-start items-center`}>
            <slot name="page_header_option" />
        </div>
    </PageHeader>
{/if}
