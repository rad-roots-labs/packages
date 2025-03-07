<script lang="ts">
    import { LayoutView, NavigationTabs, PageToolbar } from "$root";
    import type { I18nTranslateFunction } from "@radroots/util";

    let notifications: any[] = [];

    let { basis, ls }: { basis: {}; ls: I18nTranslateFunction } = $props();
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$ls(`common.notifications`)} (${notifications.length})`,
            },
        }}
    />
    <div class={`flex flex-col w-full px-4 gap-6 justify-center items-center`}>
        {#if notifications.length}
            {#each notifications as li}
                <div class={`flex flex-row w-full justify-center items-center`}>
                    {li}
                </div>
            {/each}
        {:else}
            <div class={`flex flex-row w-full justify-center items-center`}>
                <p class={`font-sans font-[500] text-layer-0-glyph capitalize`}>
                    {`${$ls(`icu.no_*`, { value: `${$ls(`common.notifications`)}` })}`}
                </p>
            </div>
        {/if}
    </div>
</LayoutView>
<NavigationTabs />
