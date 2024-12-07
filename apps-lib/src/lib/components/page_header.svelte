<script lang="ts">
    export let basis: {
        label: string;
    };
</script>

<div class={`flex flex-row w-full py-4 px-6 justify-between items-center`}>
    <div class={`flex flex-row justify-start items-center`}>
        <p
            class={`font-sansd font-[600] text-2xl text-layer-0-glyph capitalize`}
        >
            {basis.label}
        </p>
    </div>
    <slot name="option" />
</div>
