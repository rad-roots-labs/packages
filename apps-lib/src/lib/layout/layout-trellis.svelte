<script lang="ts">
    import { fmt_cl, type IBasisOpt, type IClOpt } from "$lib";

    export let basis: IBasisOpt<IClOpt> = undefined;
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col pb-12 gap-4 justify-center items-center scroll-hide`}
>
    <slot />
</div>
