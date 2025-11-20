<script lang="ts">
    import { app_lo } from "$lib/stores/app";
    import {
        Flex,
        fmt_cl,
        type IClOpt,
        type IDisabledOpt,
        type ILoadingOpt,
    } from "@radroots/apps-lib";
    import { type CallbackPromise } from "@radroots/utils";
    import ButtonLayout from "./button-layout.svelte";

    let {
        basis,
    }: {
        basis: IClOpt & {
            continue: IDisabledOpt &
                ILoadingOpt & {
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
    class={`${fmt_cl(basis.classes)} flex flex-col gap-1 justify-center items-center ${basis?.back?.visible ? `-translate-y-8` : ``} el-re`}
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
                        class={`font-sans font-[600] tracking-wide text-ly1-gl-shade ${basis.back?.disabled ? `` : `group-active:text-ly1-gl/40`} el-re`}
                    >
                        {basis.back.label || ``}
                    </p>
                </button>
            {:else}
                <div
                    class={`flex flex-row h-4 w-full justify-start items-center`}
                >
                    <Flex />
                </div>
            {/if}
        </div>
    {/if}
</div>
