<script lang="ts">
    import type { IClOpt } from "$lib/types/client";
    import { fmt_cl } from "$lib/utils/client";

    export let basis: IClOpt | undefined = undefined;
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col w-full pt-4 px-6 pb-12 gap-4 scroll-hide`}
>
    <slot />
</div>
