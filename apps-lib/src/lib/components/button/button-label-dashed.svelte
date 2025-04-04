<script lang="ts">
    import { type ICb } from "$root";

    let {
        basis,
    }: {
        basis: ICb & {
            label: string;
        };
    } = $props();
</script>

<button
    class={`flex flex-row h-line_button w-full justify-center items-center`}
    onclick={async () => {
        await basis.callback();
    }}
>
    <p
        class={`font-sans font-[500] text-lg text-layer-0-glyph-hl tracking-wide`}
    >
        {`- ${basis.label} -`}
    </p>
</button>
