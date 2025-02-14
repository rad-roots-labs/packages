<script lang="ts">
    import { app_lo, ButtonLayout, Empty } from "$root";
    import {
        fmt_cl,
        type CallbackPromise,
        type IClOpt,
        type IDisabledOpt,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IClOpt & {
            continue: IDisabledOpt & {
                label: string;
                callback: CallbackPromise;
            };
            back?: IDisabledOpt & {
                visible: boolean;
                label?: string;
                callback: CallbackPromise;
            };
        };
    } = $props();
</script>

<div
    class={`${fmt_cl(basis.classes)} flex flex-col gap-1 justify-center items-center ${basis?.back?.visible ? `-translate-y-1` : ``}`}
>
    <ButtonLayout
        basis={{
            disabled: basis.continue.disabled,
            label: basis.continue.label,
            callback: basis.continue.callback,
        }}
    />
    {#if basis.back}
        <div class={`flex flex-col justify-center items-center el-re`}>
            {#if basis.back.visible}
                <button
                    class={`group flex flex-row h-12 w-lo_${$app_lo} justify-center items-center fade-in el-re`}
                    onclick={async (ev) => {
                        ev.stopPropagation();
                        if (!basis.back?.disabled) await basis.back?.callback();
                    }}
                >
                    <p
                        class={`font-sans font-[600] tracking-wide text-layer-1-glyph-shade ${basis.back?.disabled ? `` : `group-active:text-layer-1-glyph/40`} el-re`}
                    >
                        {basis.back.label || ``}
                    </p>
                </button>
            {:else}
                <div
                    class={`flex flex-row h-4 w-full justify-start items-center`}
                >
                    <Empty />
                </div>
            {/if}
        </div>
    {/if}
</div>
