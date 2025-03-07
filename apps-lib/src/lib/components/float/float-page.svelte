<script lang="ts">
    import type { IFloatPage } from "$lib/types/component";
    import type { Snippet } from "svelte";

    let { basis, children }: { basis: IFloatPage; children: Snippet } =
        $props();
</script>

<div class={`absolute top-10 ${basis.posx}-6 flex flex-row`}>
    {@render children()}
</div>
<div class="hidden left-6 right-6"></div>
