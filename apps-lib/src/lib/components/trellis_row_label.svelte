<script lang="ts">
	import Glyph from "$lib/ui/glyph.svelte";
	import type { ThemeLayer } from "@radroots/theme";
	import { fmt_cl, get_label_classes, type ILabelTupFields } from "..";

	export let basis: ILabelTupFields;
	export let layer: ThemeLayer;
	export let hide_active: boolean;
</script>

<div class={`flex flex-row h-full w-full items-center justify-between`}>
	{#if basis.left && basis.left.length}
		<div class={`flex flex-row h-full w-content items-center`}>
			{#each basis.left as title_l}
				<div
					class={`${fmt_cl(title_l.classes_wrap)} flex flex-row h-full max-w-fit items-center ${title_l.hide_truncate ? `` : `truncate`}`}
				>
					{#if title_l.glyph}
						<div
							class={`flex flex-row justify-start items-center pr-1`}
						>
							<Glyph basis={{ ...title_l.glyph }} />
						</div>
					{/if}
					<p
						class={`${fmt_cl(title_l.classes)} ${get_label_classes(layer, title_l.kind, hide_active)}  ${title_l.hide_truncate ? `` : `truncate`} font-sans text-trellisLine transition-all`}
					>
						{title_l.value || ``}
					</p>
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
					class={`${fmt_cl(title_r.classes_wrap)} flex flex-row h-full max-w-trellis_value gap-1 items-center ${title_r.hide_truncate ? `` : `truncate`}`}
				>
					{#if title_r.glyph}
						<Glyph basis={{ ...title_r.glyph }} />
					{/if}
					<p
						class={`${fmt_cl(title_r.classes)} ${get_label_classes(layer, title_r.kind, hide_active)} ${title_r.hide_truncate ? `` : `truncate`} font-sans text-trellisLine transition-all`}
					>
						{title_r.value || ``}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
