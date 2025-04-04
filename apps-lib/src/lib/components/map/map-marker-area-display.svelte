<script lang="ts">
    import { Fade, Glyph, type IBasisOpt } from "$root";

    let {
        basis = undefined,
    }: {
        basis?: IBasisOpt<{
            primary: string;
            admin: string;
            country: string;
        }>;
    } = $props();
</script>

{#if basis}
    <Fade
        basis={{
            classes: `flex-col w-full justify-center items-start`,
        }}
    >
        <div
            class={`flex flex-col w-fit px-5 py-[10px] justify-start items-start bg-layer-1-surface rounded-3xl shadow-lg`}
        >
            <div class={`flex flex-col w-full gap-1 justify-start items-start`}>
                <div class={`flex flex-row gap-1 justify-start items-center`}>
                    <p
                        class={`font-sans font-[600] text-[0.95rem] text-layer-2-glyph`}
                    >
                        {basis.primary}
                    </p>
                    <Glyph
                        basis={{
                            classes: `text-layer-2-glyph -translate-y-[2px]`,
                            dim: `xs`,

                            key: `map-pin-simple`,
                        }}
                    />
                </div>
                <div
                    class={`flex flex-row w-full gap-1 justify-start items-center`}
                >
                    <p
                        class={`font-sans font-[600] text-[0.95rem] tracking-tight text-layer-2-glyph`}
                    >
                        {`${basis.admin},`}
                    </p>
                    <p
                        class={`font-sans font-[600] text-[0.95rem] tracking-tight text-layer-2-glyph`}
                    >
                        {`${basis.country}`}
                    </p>
                </div>
            </div>
        </div>
    </Fade>
{/if}
