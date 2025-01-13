<script lang="ts">
    import { app_loading, LoadScreen } from "$lib";
</script>

{#if $app_loading}
    <LoadScreen />
{/if}
