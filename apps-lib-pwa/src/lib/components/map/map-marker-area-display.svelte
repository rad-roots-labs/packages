<script lang="ts">
    import { Fade, Glyph, type IBasisOpt } from "@radroots/apps-lib";

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
            class={`flex flex-col w-fit px-5 py-[10px] justify-start items-start bg-ly1 rounded-3xl shadow-lg`}
        >
            <div class={`flex flex-col w-full gap-1 justify-start items-start`}>
                <div class={`flex flex-row gap-1 justify-start items-center`}>
                    <p
                        class={`font-sans font-[600] text-[0.95rem] text-ly2-gl`}
                    >
                        {basis.primary}
                    </p>
                    <Glyph
                        basis={{
                            classes: `text-ly2-gl -translate-y-[2px]`,
                            dim: `xs`,

                            key: `map-pin-simple`,
                        }}
                    />
                </div>
                <div
                    class={`flex flex-row w-full gap-1 justify-start items-center`}
                >
                    <p
                        class={`font-sans font-[600] text-[0.95rem] tracking-tight text-ly2-gl`}
                    >
                        {`${basis.admin},`}
                    </p>
                    <p
                        class={`font-sans font-[600] text-[0.95rem] tracking-tight text-ly2-gl`}
                    >
                        {`${basis.country}`}
                    </p>
                </div>
            </div>
        </div>
    </Fade>
{/if}
