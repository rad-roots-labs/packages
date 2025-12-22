<script lang="ts">
    import type { ICb } from "@radroots/apps-lib";

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
    <p class={`font-sans font-[500] text-lg text-ly0-gl-hl tracking-wide`}>
        {`- ${basis.label} -`}
    </p>
</button>
