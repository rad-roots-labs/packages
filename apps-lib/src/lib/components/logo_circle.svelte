<script lang="ts">
    let separator = ` • `;
    let array = [];
    $: array = [`radroots`, `radroots`].map((i) => [separator, ...i]).flat();
</script>

<div
    class={`relative flex flex-col h-[196px] w-full justify-center items-center`}
>
    <div
        class={`relative flex flex-row h-36 w-36 justify-center items-center bg-layer-2-surface rounded-full`}
    >
        <p
            class={`font-sans font-[900] text-6xl text-layer-0-glyph -tracking-[0.4rem] -translate-x-[6px]`}
        >
            {"»`,"}
        </p>
        <p
            class={`font-sans font-[900] text-6xl text-layer-0-glyph translate-x-[8px]`}
        >
            {"-"}
        </p>
    </div>
    {#each array as char, index}
        <div
            class={`char font-sans text-layer-0-glyph/60 text-[0.8rem] text-center uppercase`}
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
