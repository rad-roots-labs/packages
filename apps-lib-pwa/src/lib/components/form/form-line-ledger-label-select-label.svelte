<script lang="ts">
    import { SYMBOLS } from "@radroots/apps-lib";

    let {
        basis,
    }: {
        basis: {
            label: string;
        };
    } = $props();
</script>

<div class={`flex flex-row justify-start items-center`}>
    <p
        class={`pr-[13px] font-sansd text-trellis_ti text-ly0-gl-label uppercase`}
    >
        {`(${basis.label}`}
    </p>
    <div
        class={`relative flex flex-row justify-start items-center -translate-x-[10px] -translate-y-[1px]`}
    >
        <p
            class={`absolute font-sansd text-trellis_ti text-ly0-gl-label uppercase scale-y-[70%] scale-x-[80%] -translate-y-[1px]`}
        >
            {`${SYMBOLS.up}`}
        </p>
        <p
            class={`absolute font-sansd text-trellis_ti text-ly0-gl-label uppercase scale-y-[70%] scale-x-[80%] translate-y-[2px]`}
        >
            {`${SYMBOLS.down}`}
        </p>
    </div>
    <p class={`font-sansd text-trellis_ti text-ly0-gl-label uppercase`}>
        {`)`}
    </p>
</div>
