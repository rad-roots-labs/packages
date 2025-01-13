<script lang="ts">
    import { casl_index } from "$lib";
</script>

<div class={`relative flex flex-col w-full`}>
    <div
        class={`flex transition-transform duration-500`}
        style={`transform: translateX(-${Math.max($casl_index, 0) * 100}vw)`}
    >
        <slot />
    </div>
</div>
