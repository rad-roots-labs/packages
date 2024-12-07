<script lang="ts">
    import { page } from "$app/stores";
    import { Fill, Glyph, nav_prev, route } from "$lib";
</script>

<div
    class={`absolute bottom-0 left-0 h-24 flex flex-row w-full pt-2 justify-center items-start`}
>
    <div class={`flex flex-row justify-between gap-10 items-center`}>
        <div
            class={`grid grid-cols-4 flex flex-row h-[3.1rem] px-6 gap-6 justify-start items-center bg-layer-1-surface rounded-full backdrop-blur-lg`}
        >
            <button
                class={`col-span-1 flex flex-row justify-center items-center`}
                on:click={async () => {
                    await route(`/`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[26px] text-layer-0-glyph/80 rotate-90`,
                        weight: $page.url.pathname !== `/` ? `bold` : `fill`,
                        key: `columns`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                on:click={async () => {
                    await route(`/`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        weight:
                            $page.url.pathname === `/search` ? `fill` : `bold`,
                        key: `magnifying-glass`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                on:click={async () => {
                    $nav_prev.push({
                        route: `/`,
                        label: `Home`,
                    });
                    route(`/settings/profile`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        weight: $page.url.pathname.startsWith(
                            `/settings/profile`,
                        )
                            ? `fill`
                            : `bold`,
                        key: `user`,
                    }}
                />
            </button>
            <button
                class={`relative col-span-1 flex flex-row h-full justify-center items-center`}
                on:click={async () => {}}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        weight: $page.url.pathname.startsWith(`/notifications`)
                            ? `fill`
                            : `bold`,
                        key: `bell`,
                    }}
                />
                <div
                    class={`absolute top-2 -right-1 flex flex-row justify-start items-center`}
                >
                    <div
                        class={`flex flex-row h-2 w-2 justify-start items-center bg-yellow-400 rounded-full`}
                    >
                        <Fill />
                    </div>
                </div>
            </button>
        </div>
        <button
            class={`flex flex-row h-[3.1rem] w-[3.1rem] justify-center items-center bg-layer-1-surface rounded-full backdrop-blur-lg`}
            on:click={async () => {}}
        >
            <Glyph
                basis={{
                    classes: `text-[22px] text-layer-0-glyph/80`,
                    weight: `bold`,
                    key: `plus`,
                }}
            />
        </button>
    </div>
</div>
