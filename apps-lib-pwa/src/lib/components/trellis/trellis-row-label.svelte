<script lang="ts">
	import { get_label_classes_kind } from "$lib/utils/app";
	import { type ILabelTupFields, fmt_cl } from "@radroots/apps-lib";
	import type { ThemeLayer } from "@radroots/themes";
	import ButtonGlyph from "../button/button-glyph.svelte";

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
					class={`${fmt_cl(
						title_l.classes_wrap,
					)} flex flex-row h-full items-center ${get_label_classes_kind(
						layer,
						undefined,
						hide_active,
					)} ${title_l.hide_truncate ? `` : `truncate`}`}
				>
					{#if `glyph` in title_l}
						<div
							class={`flex flex-row justify-start items-center pr-2`}
						>
							<ButtonGlyph basis={{ ...title_l.glyph }} />
						</div>
					{:else if `value` in title_l}
						<p
							class={`${fmt_cl(
								title_l.classes,
							)} font-sans text-line_d ${
								title_l.hide_truncate ? `` : `truncate`
							} el-re`}
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
					class={`${fmt_cl(
						title_r.classes_wrap,
					)} flex flex-row h-full gap-1 items-center ${
						title_r.hide_truncate ? `` : `truncate`
					}`}
				>
					{#if `glyph` in title_r}
						<ButtonGlyph basis={{ ...title_r.glyph }} />
					{:else if `value` in title_r}
						<p
							class={`${fmt_cl(
								title_r.classes,
							)} font-sans text-line_d text-ly${layer}-gl_d ${
								title_r.hide_truncate ? `` : `truncate`
							} el-re`}
						>
							{title_r.value || ``}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
