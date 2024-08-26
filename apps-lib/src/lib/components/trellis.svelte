<script lang="ts">
    import {
        fmt_cl,
        parse_layer,
        t,
        trellis_default_label,
        trellis_offset,
        trellis_title,
        trellis_touch,
        type ITrellis,
    } from "..";

    const class_rounded = `xl`;

    export let basis: { args: ITrellis };
    $: ({ args } = basis);
    $: hide_border_t =
        typeof args.hide_border_top === `boolean` ? args.hide_border_top : true;
    $: hide_border_b =
        typeof args.hide_border_bottom === `boolean`
            ? args.hide_border_bottom
            : true;
    $: hide_rounded =
        typeof args.hide_rounded === `boolean` ? args.hide_rounded : false;
    $: set_title_background =
        typeof args.set_title_background === `boolean`
            ? args.set_title_background
            : false;
    $: set_default_background =
        typeof args.set_default_background === `boolean`
            ? args.set_default_background
            : false;
</script>

<div
    id={basis.args.id || ""}
    class={`${fmt_cl(args.classes)} flex flex-col w-full`}
    data-view={basis.args.view || ""}
>
    <div
        class={`relative flex flex-col h-auto w-auto gap-[3px] ${set_title_background ? `bg-layer-${args.layer}-surface` : ``}`}
    >
        {#if args.title && (!args.default_el || (args.default_el && args.default_el.show_title))}
            <svelte:component
                this={trellis_title}
                basis={args.title}
                layer={parse_layer(args.layer - 1)}
            />
        {/if}
        {#if args.default_el}
            <div
                class={`flex flex-col h-auto w-full justify-center items-center`}
            >
                {#if $$slots.default_el}
                    <slot name="default_el" />
                {:else if args.default_el}
                    <svelte:component
                        this={trellis_default_label}
                        layer={parse_layer(args.layer - 1)}
                        labels={args.default_el.labels
                            ? args.default_el.labels
                            : [
                                  {
                                      label: `${$t(`glossary.no_items_to_display`)}.`,
                                  },
                              ]}
                    />
                {/if}
            </div>
        {:else if args.list}
            <div class={`flex flex-col w-full justify-center items-center`}>
                {#each args.list as basis}
                    <div
                        class={`${basis.hide_field ? "hidden" : ""} group flex flex-row h-full w-full justify-end items-center bg-layer-${args.layer}-surface  ${basis.full_rounded ? `rounded-${class_rounded}` : ``} ${hide_rounded ? `` : `first:rounded-t-${class_rounded} last:rounded-b-${class_rounded}`} ${!basis.hide_active ? `active:bg-layer-${args.layer}-surface_a` : ``} transition-all`}
                    >
                        <div
                            class={`flex flex-row h-full w-full gap-1 items-center overflow-y-hidden`}
                        >
                            <svelte:component
                                this={trellis_offset}
                                basis={basis.offset}
                            />
                            {#if `touch` in basis && basis.touch}
                                <svelte:component
                                    this={trellis_touch}
                                    basis={basis.touch}
                                    layer={args.layer}
                                    {hide_border_b}
                                    {hide_border_t}
                                    hide_active={!!basis.hide_active}
                                />
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    {#if $$slots.append}
        <div
            class={`flex flex-col w-full ${set_default_background ? `bg-layer-${args.layer}-surface` : ``}`}
        >
            <slot name="append" />
        </div>
    {/if}
</div>
<div class={`hidden rounded-xl first:rounded-t-xl last:rounded-b-xl`}></div>
