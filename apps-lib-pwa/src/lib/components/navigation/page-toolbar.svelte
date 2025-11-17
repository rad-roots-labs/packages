<script lang="ts">
    import { goto } from "$app/navigation";
    import { app_lo } from "$lib/stores/app";
    import type { IPageToolbar } from "$lib/types/components";
    import { type IBasisOpt, Glyph } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";
    import LogoCircleSm from "../lib/logo-circle-sm.svelte";
    import LogoLetters from "../lib/logo-letters.svelte";
    import PageHeader from "./page-header.svelte";

    let {
        basis = undefined,
        header_option,
    }: {
        basis?: IBasisOpt<IPageToolbar<string>>;
        header_option?: Snippet;
    } = $props();
</script>

<div
    class={`flex flex-row min-h-nav_page_toolbar_${$app_lo} h-nav_page_toolbar_${$app_lo} w-full px-6 justify-between items-end`}
>
    <div class={`flex flex-row w-full justify-between items-center`}>
        <button
            class={`flex flex-row gap-2 justify-start items-center`}
            onclick={async () => {
                if (basis?.callback) await basis.callback();
                else await goto(`/`);
            }}
        >
            <LogoCircleSm />
            <LogoLetters />
        </button>
        <button
            class={`flex flex-row justify-center items-center`}
            onclick={async () => {
                await goto(`/settings`);
            }}
        >
            <Glyph
                basis={{
                    classes: `text-ly0-gl`,
                    dim: `lg`,

                    key: `gear`,
                }}
            />
        </button>
    </div>
</div>
{#if basis?.header}
    <PageHeader basis={basis.header}>
        {#if header_option}
            {@render header_option()}
        {/if}
    </PageHeader>
{/if}
