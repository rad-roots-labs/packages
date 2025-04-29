<script lang="ts">
    import ButtonRoundNav from "$lib/components/button/button-round-nav.svelte";
    import FloatPage from "$lib/components/float/float-page.svelte";
    import Empty from "$lib/components/lib/empty.svelte";
    import {
        fmt_id,
        get_context,
        handle_err,
        idb_init_page,
        Input,
        LayoutPage,
        LayoutView,
        NavigationTabs,
        type IViewProfileEditData,
        type ViewProfileEditFieldKey,
    } from "$root";
    import {
        type CallbackPromiseGeneric,
        type ElementCallbackValue,
        type IViewBasis,
    } from "@radroots/util";
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
            placeholder: `${$ls(`icu.enter_*`, { value: `profile username` })}`, //@todo
        },
        display_name: {
            placeholder: `${$ls(`icu.enter_*`, { value: `profile display name` })}`, //@todo
        },
        about: {
            placeholder: `${$ls(`icu.enter_*`, { value: `profile bio` })}`, //@todo
        },
    };

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_init_page();
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
                <Empty />
            </div>
            {#if basis.data.field}
                <Input
                    bind:value={val_field}
                    basis={{
                        id: fmt_id(`field`),
                        sync: true,
                        classes: `pl-6 h-entry_line text-layer-1-glyph bg-layer-1-surface rounded-2xl`,
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
