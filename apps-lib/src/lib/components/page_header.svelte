<script lang="ts">
    import {
        route,
        type NavigationParamTuple,
        type NavigationRoute,
    } from "$lib";

    export let basis: {
        label:
            | string
            | [
                  string,
                  {
                      route: NavigationRoute;
                      route_param?: NavigationParamTuple[];
                  },
              ];
    };
</script>

<div class={`flex flex-row w-full py-4 px-6 justify-between items-center`}>
    <div class={`flex flex-row justify-start items-center`}>
        {#if typeof basis.label === `string`}
            <p
                class={`font-sansd font-[600] text-2xl text-layer-0-glyph capitalize`}
            >
                {basis.label || ``}
            </p>
        {:else}
            <button
                class={`flex flex-row gap-1 justify-center items-center`}
                on:click={async () => {
                    if (typeof basis.label !== `string`)
                        await route(
                            basis.label[1].route,
                            basis.label[1].route_param || undefined,
                        );
                }}
            >
                <p
                    class={`font-sansd font-[600] text-2xl text-layer-0-glyph capitalize`}
                >
                    {basis.label[0] || ``}
                </p>
            </button>
        {/if}
    </div>
    <slot name="option" />
</div>
