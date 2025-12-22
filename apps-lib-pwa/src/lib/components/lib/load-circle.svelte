<script lang="ts">
    import type { ILoadCircle } from "$lib/types/components/lib";
    import { loading_style_map } from "$lib/utils/styles";
    import { fmt_cl, Glyph } from "@radroots/apps-lib";

    let {
        basis = undefined,
    }: {
        basis?: ILoadCircle;
    } = $props();

    const styles = $derived(
        basis?.dim
            ? loading_style_map.get(basis?.dim)
            : loading_style_map.get("sm"),
    );
</script>

<div
    class={`relative flex flex-row justify-center items-center h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] fade-in el-re`}
>
    <Glyph
        basis={{
            classes: `${fmt_cl(
                basis?.classes,
            )} text-base text-ly0-gl-a animate-spin-slow`,
            key: "circle-notch",
        }}
    />
</div>
