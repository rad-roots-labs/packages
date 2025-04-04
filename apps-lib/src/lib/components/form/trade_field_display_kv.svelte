<script lang="ts">
    import { fmt_id, Glyph, idb, type IClOpt } from "$root";
    import { el_focus, fmt_cl, type CallbackPromise } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IClOpt & {
            visible: boolean;
            label: string;
            display: IClOpt & {
                undef?: string;
                nostyle?: boolean;
            } & (
                    | {
                          kv: string;
                      }
                    | {
                          value: string;
                      }
                );

            kv_wrap?: string;
            handle_back: CallbackPromise;
        };
    } = $props();

    const classes_undef = $derived(
        basis.visible &&
            ((`kv` in basis.display && !idb.get(fmt_id(basis.display.kv))) ||
                (`value` in basis.display && !basis.display.value))
            ? `opacity-60`
            : ``,
    );
</script>

<div
    class={`${fmt_cl(basis.classes)} flex flex-row h-6 w-full justify-between items-start`}
>
    <p
        class={`font-sans font-[500] text-layer-1-glyph_d tracking-tight capitalize`}
    >
        {basis.label}
    </p>
    {#if basis.visible}
        <button
            class={`flex flex-row max-w-[210px] gap-1 justify-end items-start`}
            onclick={async () => {
                await el_focus(
                    fmt_id(
                        basis.kv_wrap
                            ? basis.kv_wrap
                            : `kv` in basis.display
                              ? `${basis.display.kv}_wrap`
                              : ``,
                    ),
                    async () => await basis.handle_back(),
                );
            }}
        >
            <p
                class={`${fmt_cl(basis.display.classes)} font-sans font-[400] text-[1.05rem] text-justify truncate text-layer-1-glyph_d ${classes_undef} ${basis.display.nostyle ? `` : `capitalize`}`}
            >
                {#if `kv` in basis.display}
                    {#await idb.get(fmt_id(basis.display.kv)) then kv_val}
                        {kv_val || basis.display.undef || ``}
                    {/await}
                {:else}
                    {basis.display.value || basis.display.undef || ``}
                {/if}
            </p>
            <Glyph
                basis={{
                    classes: `text-layer-0-glyph ${classes_undef}  pt-1`,
                    dim: `xs`,
                    key: `caret-right`,
                }}
            />
        </button>
    {/if}
</div>
