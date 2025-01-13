<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Empty, Glyph } from "$lib";
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
                    await goto(`/`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[26px] text-layer-0-glyph/80 rotate-90`,
                        weight: $page.url.pathname !== `/` ? `bold` : `fill`,
                        key: `columns`,
                    }}
                ></Glyph>
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                on:click={async () => {
                    await goto(`/search`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        weight: $page.url.pathname.startsWith(`/search`)
                            ? `fill`
                            : `bold`,
                        key: `magnifying-glass`,
                    }}
                ></Glyph>
            </button>
            <button
                class={`relative col-span-1 flex flex-row justify-center items-center`}
                on:click={async () => {
                    goto(`/settings/profile`);
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
                ></Glyph>
            </button>
            <button
                class={`relative col-span-1 flex flex-row h-full justify-center items-center`}
                on:click={async () => {
                    await goto(`/notifications`);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-[24px] text-layer-0-glyph/80`,
                        weight: $page.url.pathname.startsWith(`/notifications`)
                            ? `fill`
                            : `bold`,
                        key: `bell`,
                    }}
                ></Glyph>
                <div
                    class={`absolute top-2 -right-1 flex flex-row justify-start items-center`}
                >
                    <div
                        class={`flex flex-row h-2 w-2 justify-start items-center bg-yellow-400 rounded-full`}
                    >
                        <Empty></Empty>
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
            ></Glyph>
        </button>
    </div>
</div>
