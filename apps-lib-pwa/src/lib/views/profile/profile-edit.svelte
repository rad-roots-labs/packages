<script lang="ts">
    import { FloatPage, LayoutPage, LayoutView, NavigationTabs } from "$lib";
    import ButtonRoundNav from "$lib/components/button/button-round-nav.svelte";
    import type { IViewBasis } from "$lib/types/views";
    import type {
        IViewProfileEditData,
        ViewProfileEditFieldKey,
    } from "$lib/types/views/profile";
    import {
        type ElementCallbackValue,
        Flex,
        InputExt,
        fmt_id,
        get_context,
        idb_kv_init_page,
    } from "@radroots/apps-lib";
    import { type CallbackPromiseGeneric, handle_err } from "@radroots/utils";
    import { onMount } from "svelte";

    const { ls } = get_context(`lib`);

    let {
        basis,
        val_field = $bindable(``),
    }: {
        basis: IViewBasis<{
            data?: IViewProfileEditData;
            on_handle_back: CallbackPromiseGeneric<{
                field: ViewProfileEditFieldKey;
                public_key: string;
            }>;
            on_handle_input: ElementCallbackValue;
        }>;
        val_field: string;
    } = $props();

    const param: Record<ViewProfileEditFieldKey, { placeholder: string }> = {
        name: {
            placeholder: `${$ls(`icu.enter_*`, { value: `profile username` })}`, // @todo
        },
        display_name: {
            placeholder: `${$ls(`icu.enter_*`, {
                value: `profile display name`,
            })}`, // @todo
        },
        about: {
            placeholder: `${$ls(`icu.enter_*`, { value: `profile bio` })}`, // @todo
        },
    };

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_kv_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const input_placeholder = $derived(
        basis.data?.field ? param[basis.data.field]?.placeholder : ``,
    );
</script>

{#if basis.data}
    {@const { data: basis_data } = basis}
    <LayoutView>
        <LayoutPage>
            <div class={`flex flex-row h-20 w-full justify-start items-center`}>
                <Flex />
            </div>
            {#if basis.data.field}
                <InputExt
                    bind:value={val_field}
                    basis={{
                        id: fmt_id(`field`),
                        sync: true,
                        classes: `pl-6 h-entry_line text-ly1-gl bg-ly1 rounded-2xl`,
                        placeholder: input_placeholder,
                        callback: basis.on_handle_input,
                    }}
                />
            {/if}
        </LayoutPage>
    </LayoutView>
    <FloatPage
        basis={{
            posx: `left`,
        }}
    >
        <ButtonRoundNav
            basis={{
                glyph: `arrow-left`,
                callback: async () => {
                    await basis.on_handle_back({
                        field: basis_data.field,
                        public_key: basis_data.public_key,
                    });
                },
            }}
        />
    </FloatPage>
    <NavigationTabs />
{/if}
