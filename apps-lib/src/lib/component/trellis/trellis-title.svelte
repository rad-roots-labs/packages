<script lang="ts">
	import { Empty, fmt_cl, Glyph, type ITrellisTitle, LabelSwap } from "$lib";
	import type { ThemeLayer } from "@radroots/theme";

	export let basis: ITrellisTitle;
	export let layer: ThemeLayer = 0;

	$: mod = basis && basis.mod ? basis.mod : `sm`;
</script>

<div
	class={`${fmt_cl(basis.classes)} flex flex-row h-[24px] w-full pl-[2px] gap-1 items-center`}
>
	<button
		class={`flex flex-row h-full w-max items-center gap-1 ${mod === `glyph` ? `pl-[36px]` : mod === `sm` ? `pl-[16px]` : ``}`}
		on:click|preventDefault={async () => {
			if (basis && basis.callback) await basis.callback();
		}}
	>
		{#if basis.value === true}
			<Empty></Empty>
		{:else}
			<p
				class={`font-sans text-trellis_ti text-layer-${layer}-glyph-label uppercase`}
			>
				{basis.value || ``}
			</p>
		{/if}
	</button>
	{#if basis.link}
		<button
			class={`${fmt_cl(basis.link.classes)} group flex flex-row h-full w-max items-center`}
			on:click|preventDefault={async () => {
				if (basis.link && basis.link.callback)
					await basis.link.callback();
			}}
		>
			{#if basis.link.label}
				{#if `swap` in basis.link.label}
					<LabelSwap basis={basis.link.label} />
				{:else if `value` in basis.link.label}
					<p
						class={`${fmt_cl(basis.link.label.classes)} font-sans text-trellis_ti uppercase fade-in`}
					>
						{basis.link.label.value || ``}
					</p>
				{/if}
			{/if}
			{#if basis.link.glyph}
				<div class={`flex flex-row w-max`}>
					<Glyph
						basis={{
							...basis.link.glyph,
							dim: `xs-`,
							classes: `${fmt_cl(basis.link.glyph.classes)} fade-in`,
						}}
					></Glyph>
				</div>
			{/if}
		</button>
	{/if}
</div>
