<script lang="ts">
    import { app_splash, SplashScreen } from "$lib";
</script>

{#if $app_splash}
    <SplashScreen />
{/if}
