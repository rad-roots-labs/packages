<script lang="ts">
	import { GlyphButton } from "$root";
	import type { ThemeLayer } from "@radroots/theme";
	import {
		fmt_cl,
		get_label_classes_kind,
		type ILabelTupFields,
	} from "@radroots/util";

	let {
		basis,
		layer,
		hide_active,
	}: {
		basis: ILabelTupFields;
		layer: ThemeLayer;
		hide_active: boolean;
	} = $props();
</script>

<div class={`flex flex-row h-full items-center justify-between`}>
	{#if basis.left && basis.left.length}
		<div class={`flex flex-row h-full items-center truncate`}>
			{#each basis.left as title_l}
				<div
					class={`${fmt_cl(title_l.classes_wrap)} flex flex-row h-full items-center ${get_label_classes_kind(layer, undefined, hide_active)} ${title_l.hide_truncate ? `` : `truncate`}`}
				>
					{#if `glyph` in title_l}
						<div
							class={`flex flex-row justify-start items-center pr-2`}
						>
							<GlyphButton basis={{ ...title_l.glyph }}
							></GlyphButton>
						</div>
					{:else if `value` in title_l}
						<p
							class={`${fmt_cl(title_l.classes)} font-sans text-line_d ${title_l.hide_truncate ? `` : `truncate`} el-re`}
						>
							{title_l.value || ``}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if basis.right && basis.right.length}
		<div
			class={`flex flex-row h-full w-content items-center justify-end pr-4`}
		>
			{#each basis.right.reverse() as title_r}
				<div
					class={`${fmt_cl(title_r.classes_wrap)} flex flex-row h-full gap-1 items-center ${title_r.hide_truncate ? `` : `truncate`}`}
				>
					{#if `glyph` in title_r}
						<GlyphButton basis={{ ...title_r.glyph }}></GlyphButton>
					{:else if `value` in title_r}
						<p
							class={`${fmt_cl(title_r.classes)} font-sans text-line_d text-layer-${layer}-glyph_d ${title_r.hide_truncate ? `` : `truncate`} el-re`}
						>
							{title_r.value || ``}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
