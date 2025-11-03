<script lang="ts">
    import type { ILibInput } from "$lib/types/components";

    let { val = $bindable(``), basis }: { val?: string; basis: ILibInput } =
        $props();
</script>

<input
    bind:value={val}
    type={basis.type || "text"}
    inputmode={basis.type === "numeric" ? "numeric" : undefined}
    pattern={basis.pattern || basis.type === "numeric" ? "[0-9]*" : undefined}
    disabled={basis.disabled}
    class={basis.classes}
    placeholder={basis.placeholder || ``}
    onkeydown={async (ev) => {
        if (basis?.callback_keydown)
            await basis?.callback_keydown({
                key: ev.key,
                is_submit: ev.key === `Enter`,
                el: ev.currentTarget,
            });
    }}
    oninput={async (ev) => {
        if (basis?.callback_input)
            await basis?.callback_input(ev.currentTarget);
    }}
/>
