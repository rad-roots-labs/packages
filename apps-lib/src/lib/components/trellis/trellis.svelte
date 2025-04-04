<script lang="ts">
    import {
        app_lo,
        TrellisDefaultLabel,
        TrellisInput,
        TrellisOffset,
        TrellisSelect,
        TrellisTitle,
        TrellisTouch,
        type ITrellis,
    } from "$root";
    import {
        fmt_cl,
        parse_layer,
        type I18nTranslateFunction,
    } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis,
        el_default,
        el_offset,
        el_append,
        ls,
    }: {
        basis: ITrellis;
        el_default?: Snippet;
        el_offset?: Snippet;
        el_append?: Snippet;
        ls: I18nTranslateFunction;
    } = $props();

    const hide_border_t = $derived(
        typeof basis.hide_border_top === `boolean`
            ? basis.hide_border_top
            : true,
    );

    const hide_border_b = $derived(
        typeof basis.hide_border_bottom === `boolean`
            ? basis.hide_border_bottom
            : true,
    );

    const hide_rounded = $derived(
        typeof basis.hide_rounded === `boolean` ? basis.hide_rounded : false,
    );

    const set_title_background = $derived(
        typeof basis.set_title_background === `boolean`
            ? basis.set_title_background
            : false,
    );

    const set_default_background = $derived(
        typeof basis.set_default_background === `boolean`
            ? basis.set_default_background
            : false,
    );
</script>

<div
    id={basis.id || ``}
    class={`${fmt_cl(basis.classes)} flex flex-col`}
    data-view={basis.view || ``}
>
    <div
        class={`relative flex flex-col h-auto w-lo_${$app_lo} gap-[3px] ${set_title_background ? `bg-layer-${basis.layer}-surface` : ``}`}
    >
        {#if basis.title && (!basis.default_el || (basis.default_el && basis.default_el.show_title))}
            <TrellisTitle
                basis={basis.title}
                layer={parse_layer(basis.layer - 1)}
            />
        {/if}
        {#if basis.default_el}
            <div
                class={`flex flex-col h-auto w-full justify-center items-center`}
            >
                {#if el_default}
                    {@render el_default()}
                {:else if basis.default_el}
                    <TrellisDefaultLabel
                        layer={parse_layer(basis.layer - 1)}
                        labels={basis.default_el.labels
                            ? basis.default_el.labels
                            : [
                                  {
                                      label: `${$ls(`common.no_items_to_display`)}.`,
                                  },
                              ]}
                    />
                {/if}
            </div>
        {:else if basis.list}
            <div class={`flex flex-col w-full justify-center items-center`}>
                {#each basis.list as li}
                    {#if li}
                        <div
                            class={`${li.hide_field ? `hidden` : ``} group flex flex-row h-full w-full justify-end items-center bg-layer-${basis.layer}-surface  ${li.full_rounded ? `rounded-touch` : ``} ${hide_rounded ? `` : `first:rounded-t-2xl last:rounded-b-2xl`} ${!li.hide_active ? `active:bg-layer-${basis.layer}-surface_a` : ``} el-re`}
                        >
                            <div
                                class={`flex flex-row h-full w-full gap-1 items-center overflow-y-hidden`}
                            >
                                {#if !basis.hide_offset}
                                    <TrellisOffset
                                        basis={li.offset}
                                        layer={basis.layer}
                                    />
                                {/if}
                                {#if el_offset}
                                    {@render el_offset()}
                                {/if}
                                {#if `touch` in li && li.touch}
                                    <TrellisTouch
                                        basis={li.touch}
                                        layer={basis.layer}
                                        {hide_border_b}
                                        {hide_border_t}
                                        hide_active={!!li.hide_active}
                                    />
                                {:else if `input` in li && li.input}
                                    <TrellisInput
                                        basis={li.input}
                                        layer={basis.layer}
                                        {hide_border_b}
                                        {hide_border_t}
                                    />
                                {:else if `select` in li && li.select}
                                    <TrellisSelect
                                        basis={li.select}
                                        layer={basis.layer}
                                        {hide_border_b}
                                        {hide_border_t}
                                        hide_active={!!li.hide_active}
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
    {#if el_append}
        <div
            class={`flex flex-col w-full ${set_default_background ? `bg-layer-${basis.layer}-surface` : ``}`}
        >
            {@render el_append()}
        </div>
    {/if}
</div>
<div
    class={`hidden group-first:border-t-0 group-first:border-t-line group-first:border-b-0 group-first:border-b-line`}
></div>
