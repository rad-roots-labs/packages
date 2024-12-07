<script lang="ts">
    import { ascii } from "$lib";

    export let basis: {
        label: string;
    };
</script>

<div class={`flex flex-row justify-start items-center`}>
    <p
        class={`pr-[13px] font-sansd text-trellisTitle text-layer-0-glyph-label uppercase`}
    >
        {`(${basis.label}`}
    </p>
    <div
        class={`relative flex flex-row justify-start items-center -translate-x-[10px] -translate-y-[1px]`}
    >
        <p
            class={`absolute font-sansd text-trellisTitle text-layer-0-glyph-label uppercase scale-y-[70%] scale-x-[80%] -translate-y-[1px]`}
        >
            {`${ascii.up}`}
        </p>
        <p
            class={`absolute font-sansd text-trellisTitle text-layer-0-glyph-label uppercase scale-y-[70%] scale-x-[80%] translate-y-[2px]`}
        >
            {`${ascii.down}`}
        </p>
    </div>
    <p
        class={`font-sansd text-trellisTitle text-layer-0-glyph-label uppercase`}
    >
        {`)`}
    </p>
</div>
