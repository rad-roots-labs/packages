<script>
    import Blur from "$lib/ui/blur.svelte";
</script>

<div
    class={`relative flex flex-col h-[100vh] w-full overflow-x-hidden overflow-y-hidden bg-layer-0-surface`}
>
    <div class={`flex flex-col h-full w-full`}>
        <slot />
    </div>
    <slot name="overlay" />
    <Blur />
</div>
