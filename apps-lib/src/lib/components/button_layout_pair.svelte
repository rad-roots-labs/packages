<script lang="ts">
    import {
        app_layout,
        Fill,
        t,
        type CallbackPromise,
        type IDisabledOpt,
    } from "$lib";
    import ButtonLayout from "./button_layout.svelte";

    export let basis: {
        continue: IDisabledOpt & {
            label?: string;
            callback: CallbackPromise;
        };
        back?: IDisabledOpt & {
            visible: boolean;
            label?: string;
            callback: CallbackPromise;
        };
    };
</script>

<div class={`flex flex-col justify-center items-center`}>
    <ButtonLayout
        basis={{
            disabled: basis.continue.disabled,
            label: basis.continue.label || `${$t(`common.continue`)}`,
            callback: basis.continue.callback,
        }}
    />
    {#if basis.back}
        <div class={`flex flex-col justify-center items-center el-re`}>
            {#if basis.back?.visible}
                <button
                    class={`group flex flex-row h-12 w-${$app_layout} justify-center items-center fade-in`}
                    on:click|stopPropagation={async () => {
                        if (!basis.back?.disabled) await basis.back?.callback();
                    }}
                >
                    <p
                        class={`font-sans font-[600] tracking-wide text-layer-1-glyph-shade ${basis.back?.disabled ? `` : `group-active:text-layer-1-glyph/40`} el-re`}
                    >
                        {basis.back?.label || `${$t(`common.back`)}`}
                    </p>
                </button>
            {:else}
                <div
                    class={`flex flex-row h-4 w-full justify-start items-center`}
                >
                    <Fill />
                </div>
            {/if}
        </div>
    {/if}
</div>
