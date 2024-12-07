<script lang="ts">
    import type { CallbackPromise } from "$lib";

    export let basis: {
        label: string;
        callback: CallbackPromise;
    };
</script>

<button
    class={`group flex flex-row justify-center items-center`}
    on:click={async () => {
        await basis.callback();
    }}
>
    <p
        class={`font-sans font-[600] text-guide text-layer-0-glyph-hl opacity-active`}
    >
        {basis.label}
    </p>
</button>
