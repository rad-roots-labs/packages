<script lang="ts">
    import { ButtonLabelGlyph, Empty } from "$root";
    import {
        type CallbackPromiseGeneric,
        type ImageAspectRatio,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: {
            callback: CallbackPromiseGeneric<ImageAspectRatio>;
        };
    } = $props();

    let ratio_curr: ImageAspectRatio = $state(`auto`);
</script>

<div class={`flex flex-row w-full justify-around items-center`}>
    <ButtonLabelGlyph
        basis={{
            glyph: `crop`,
            label: `Auto`,
            ring: ratio_curr === `auto`,
            callback: async () => {
                ratio_curr = `auto`;
                await basis.callback(`auto`);
            },
        }}
    />
    <ButtonLabelGlyph
        basis={{
            label: `1:1`,
            ring: ratio_curr === `1/1`,
            callback: async () => {
                ratio_curr = `1/1`;
                await basis.callback(`1/1`);
            },
        }}
    >
        <div
            class={`flex flex-row h-5 w-5 justify-start items-center rounded-md bg-layer-2-surface shadow-lg`}
        >
            <Empty />
        </div>
    </ButtonLabelGlyph>
    <ButtonLabelGlyph
        basis={{
            label: `4:3`,
            ring: ratio_curr === `4/3`,
            callback: async () => {
                ratio_curr = `4/3`;
                await basis.callback(`4/3`);
            },
        }}
    >
        <div
            class={`flex flex-row w-5 aspect-[4/3] justify-start items-center rounded-md bg-layer-2-surface shadow-lg rotate-90`}
        >
            <Empty />
        </div>
    </ButtonLabelGlyph>
    <ButtonLabelGlyph
        basis={{
            label: `16:9`,
            ring: ratio_curr === `16/9`,
            callback: async () => {
                ratio_curr = `16/9`;
                await basis.callback(`16/9`);
            },
        }}
    >
        <div
            class={`flex flex-row w-5 aspect-[16/9] justify-start items-center rounded-md bg-layer-2-surface shadow-lg rotate-90`}
        >
            <Empty />
        </div>
    </ButtonLabelGlyph>
    <ButtonLabelGlyph
        basis={{
            label: `3:4`,
            ring: ratio_curr === `3/4`,
            callback: async () => {
                ratio_curr = `3/4`;
                await basis.callback(`3/4`);
            },
        }}
    >
        <div
            class={`flex flex-row w-5 aspect-[3/4] justify-start items-center rounded-md bg-layer-2-surface shadow-lg`}
        >
            <Empty />
        </div>
    </ButtonLabelGlyph>
</div>
