<script lang="ts">
    import { FloatTabs, LayoutView, lls, PageToolbar } from "$lib";

    let notifications: any[] = [];
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.notifications`)} (${notifications.length})`,
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
                    {`${$lls(`icu.no_*`, { value: `${$lls(`common.notifications`)}` })}`}
                </p>
            </div>
        {/if}
    </div>
</LayoutView>
<FloatTabs />
