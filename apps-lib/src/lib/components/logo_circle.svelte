<script lang="ts">
    let separator = ` • `;
    let array = [];
    $: array = [`radroots`, `radroots`].map((i) => [separator, ...i]).flat();
</script>

<div
    class={`relative flex flex-col h-[196px] w-full justify-center items-center`}
>
    <div
        class={`flex flex-row h-32 w-32 justify-center items-center bg-layer-2-surface rounded-full`}
    >
        <p class={`font-sans font-[900] text-4xl text-layer-0-glyph`}>
            {"»`,-"}
        </p>
    </div>
    {#each array as char, index}
        <div
            class={`char font-sans text-layer-0-glyph text-center uppercase`}
            style="--angle: {`${(1 / array.length) * index + 0.18}turn`}"
        >
            {char}
        </div>
    {/each}
</div>

<style>
    .char {
        width: 1em;
        height: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotate(var(--angle, 0deg));
    }
</style>
