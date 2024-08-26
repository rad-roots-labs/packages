<script lang="ts">
	import type { ThemeLayer } from "@radroots/theme";
	import { fill, fmt_cl, glyph, type ITrellisTitle } from "..";

	export let basis: ITrellisTitle;
	export let layer: ThemeLayer;

	$: mod = basis && basis.mod ? basis.mod : `sm`;
</script>

<div
	class={`${fmt_cl(basis.classes)} flex flex-row h-[24px] w-full pl-[6px] gap-1 items-center`}
>
	<button
		class={`flex flex-row h-full w-max items-center gap-1 ${mod === `glyph` ? `pl-[36px]` : mod === `sm` ? `pl-[16px]` : ``}`}
		on:click|preventDefault={async () => {
			if (basis && basis.callback) await basis.callback();
		}}
	>
		{#if basis.value === true}
			<svelte:component this={fill} />
		{:else}
			<p
				class={`font-sans text-trellisTitle text-layer-${layer}-glyph-label uppercase`}
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
			{#if basis.link.glyph}
				<p
					class={`${fmt_cl(basis.link.glyph.classes)} font-sans text-trellisTitle uppercase fade-in`}
				>
					{basis.link.glyph.value || ``}
				</p>
			{/if}
			{#if basis.link.icon}
				<div class={`flex flex-row w-max`}>
					<svelte:component
						this={glyph}
						basis={{
							...basis.link.icon,
							dim: `xs-`,
							classes: `${fmt_cl(basis.link.icon.classes)} fade-in`,
						}}
					/>
				</div>
			{/if}
		</button>
	{/if}
</div>
