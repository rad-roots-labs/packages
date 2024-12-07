<script lang="ts">
    import {
        app_layout,
        fmt_cl,
        ls,
        parse_layer,
        TrellisDefaultLabel,
        TrellisInput,
        TrellisOffset,
        TrellisSelect,
        TrellisTitle,
        TrellisTouch,
        type ITrellis,
    } from "$lib";

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
    id={basis.args.id || ``}
    class={`${fmt_cl(args.classes)} flex flex-col`}
    data-view={basis.args.view || ``}
>
    <div
        class={`relative flex flex-col h-auto w-${$app_layout} gap-[3px] ${set_title_background ? `bg-layer-${args.layer}-surface` : ``}`}
    >
        {#if args.title && (!args.default_el || (args.default_el && args.default_el.show_title))}
            <TrellisTitle
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
                    <TrellisDefaultLabel
                        layer={parse_layer(args.layer - 1)}
                        labels={args.default_el.labels
                            ? args.default_el.labels
                            : [
                                  {
                                      label: `${$ls(`common.no_items_to_display`)}.`,
                                  },
                              ]}
                    />
                {/if}
            </div>
        {:else if args.list}
            <div class={`flex flex-col w-full justify-center items-center`}>
                {#each args.list as basis}
                    <div
                        class={`${basis.hide_field ? "hidden" : ``} group flex flex-row h-full w-full justify-end items-center bg-layer-${args.layer}-surface  ${basis.full_rounded ? `rounded-touch` : ``} ${hide_rounded ? `` : `first:rounded-t-2xl last:rounded-b-2xl`} ${!basis.hide_active ? `active:bg-layer-${args.layer}-surface_a` : ``} el-re`}
                    >
                        <div
                            class={`flex flex-row h-full w-full gap-1 items-center overflow-y-hidden`}
                        >
                            {#if !args.hide_offset}
                                <TrellisOffset
                                    basis={basis.offset}
                                    layer={args.layer}
                                />
                            {/if}
                            {#if $$slots.offset}
                                <slot name="offset" />
                            {/if}
                            {#if `touch` in basis && basis.touch}
                                <TrellisTouch
                                    basis={basis.touch}
                                    layer={args.layer}
                                    {hide_border_b}
                                    {hide_border_t}
                                    hide_active={!!basis.hide_active}
                                />
                            {:else if `input` in basis && basis.input}
                                <TrellisInput
                                    basis={basis.input}
                                    layer={args.layer}
                                    {hide_border_b}
                                    {hide_border_t}
                                />
                            {:else if `select` in basis && basis.select}
                                <TrellisSelect
                                    basis={basis.select}
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
