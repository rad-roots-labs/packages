<script lang="ts">
    import type { IBasisOpt } from "$lib/types/component";
    import type { IClOpt } from "$lib/types/interface";
    import { fmt_cl } from "$lib/util/app";

    export let basis: IBasisOpt<IClOpt> = undefined;
</script>

<div class={`${fmt_cl(basis?.classes)} flex`}>
    <slot />
</div>
