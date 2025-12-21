<script lang="ts">
    import type { IFloatPage } from "$lib/types/components/lib";
    import type { Snippet } from "svelte";

    let { basis, children }: { basis: IFloatPage; children: Snippet } =
        $props();
</script>

<div class={`absolute top-10 ${basis.posx}-6 flex flex-row`}>
    {@render children()}
</div>
