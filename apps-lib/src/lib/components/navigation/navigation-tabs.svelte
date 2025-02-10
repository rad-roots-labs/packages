<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { app_lo, Empty, Glyph } from "$root";
</script>

<div
    class={`fixed bottom-0 left-0 h-nav_tabs_${$app_lo} flex flex-row w-full pt-2 justify-center items-start`}
>
    <div class={`flex flex-row justify-between gap-10 items-center`}>
        <div
            class={`grid grid-cols-4 flex flex-row h-[3.1rem] px-6 gap-6 justify-start items-center bg-layer-1-surface rounded-full backdrop-blur-lg`}
        >
            <button
                class={`col-span-1 flex flex-row justify-center items-center`}
                onclick={async () => {
                    await goto(`/`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[26px] text-layer-0-glyph/80 rotate-90`,
                        key: `columns`,
                        weight: page.url.pathname === `/` ? `fill` : `bold`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                onclick={async () => {
                    await goto(`/search`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        key: `magnifying-glass`,
                        weight: page.url.pathname.includes(`search`)
                            ? `fill`
                            : `bold`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                onclick={async () => {
                    goto(`/profile`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        key: `user`,
                        weight: page.url.pathname.includes(`profile`)
                            ? `fill`
                            : `bold`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row h-full justify-center items-center`}
                onclick={async () => {
                    await goto(`/notifications`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        key: `bell`,
                        weight: page.url.pathname.includes(`notifications`)
                            ? `fill`
                            : `bold`,
                    }}
                />
                <div
                    class={`absolute top-2 -right-1 flex flex-row justify-start items-center`}
                >
                    <div
                        class={`flex flex-row h-2 w-2 justify-start items-center bg-yellow-400 rounded-full`}
                    >
                        <Empty />
                    </div>
                </div>
            </button>
        </div>
        <button
            class={`flex flex-row h-[3.1rem] w-[3.1rem] justify-center items-center bg-layer-1-surface rounded-full backdrop-blur-lg`}
            onclick={async () => {}}
        >
            <Glyph
                basis={{
                    classes: `text-[22px] text-layer-0-glyph/80`,

                    key: `plus`,
                }}
            />
        </button>
    </div>
</div>
