<script lang="ts">
	import type { ThemeLayer } from "@radroots/theme";
	import { fmt_cl, get_label_classes, glyph, type ILabelTupFields } from "..";

	export let basis: ILabelTupFields;
	export let layer: ThemeLayer;
	export let hide_active: boolean;
</script>

<div class={`flex flex-row h-full items-center justify-between`}>
	{#if basis.left && basis.left.length}
		<div class={`flex flex-row h-full w-content items-center`}>
			{#each basis.left as title_l}
				<div
					class={`flex flex-row h-full max-w-fit gap-1 items-center ${title_l.hide_truncate ? `` : `truncate`}`}
				>
					{#if title_l.icon}
						<svelte:component
							this={glyph}
							basis={{ ...title_l.icon }}
						/>
					{/if}
					<p
						class={`${fmt_cl(title_l.classes)} ${get_label_classes(layer, title_l.kind, hide_active)}  ${title_l.hide_truncate ? `` : `truncate`} glyph font-sans text-lineTrellis transition-all`}
					>
						{title_l.value || ``}
					</p>
				</div>
			{/each}
		</div>
	{/if}
	{#if basis.right && basis.right.length}
		<div class={`flex flex-row h-full w-content items-center justify-end`}>
			{#each basis.right.reverse() as title_r}
				<div
					class={`${fmt_cl(title_r.classes)} flex flex-row h-full max-w-fit gap-1 items-center ${title_r.hide_truncate ? `` : `truncate`}`}
				>
					{#if title_r.icon}
						<svelte:component
							this={glyph}
							basis={{ ...title_r.icon }}
						/>
					{/if}
					<p
						class={`${get_label_classes(layer, title_r.kind, hide_active)} ${title_r.hide_truncate ? `` : `truncate`} glyph truncate font-sans text-lineTrellis transition-all`}
					>
						{title_r.value || ``}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
