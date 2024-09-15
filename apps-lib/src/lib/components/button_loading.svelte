<script lang="ts">
    import { type CallbackPromise, fmt_cl, Loading, t } from "$lib";

    export let basis: {
        classes?:string;
        callback: CallbackPromise;
        loading?: boolean;
        label?: string;
    };
    $: basis = basis;
</script>

<button
    class={`${fmt_cl(basis.classes)} button-submit`}
    on:click={async () => {
        await basis.callback();
    }}
>
    {#if basis.loading}
        <Loading basis={{ dim: `xs` }} />
    {:else}
        {basis.label || `${$t(`common.submit`, { default: `submit` })}`}
    {/if}
</button>
