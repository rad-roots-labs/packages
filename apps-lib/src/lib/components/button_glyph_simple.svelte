<script lang="ts">
    import type { CallbackPromise } from "$lib";

    export let basis: {
        kind?: `primary` | `neutral`;
        label: string;
        callback: CallbackPromise;
    };

    $: classes_kind =
        basis.kind === `neutral`
            ? `text-layer-0-glyph-shade`
            : `text-layer-0-glyph-hl`;
</script>

<button
    class={`group flex flex-row justify-center items-center`}
    on:click={async () => {
        await basis.callback();
    }}
>
    <p class={`font-sans font-[600] text-guide ${classes_kind} opacity-active`}>
        {basis.label}
    </p>
</button>
