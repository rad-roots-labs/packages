<script lang="ts">
    import { fmt_cl } from "$lib/utils/client";

    export let basis: {
        classes?: string;
        label: string;
    };
</script>

<div
    class={`${fmt_cl(basis.classes || `bg-layer-0-surface`)} flex flex-row h-6 px-2 justify-start items-center rounded-lg`}
>
    <p
        class={`font-mono font-[500] text-[1rem] tracking-tighter text-layer-0-glyph`}
    >
        {`${basis.label}`}
    </p>
</div>
