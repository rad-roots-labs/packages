<script lang="ts">
    import { Empty } from "$root";

    let {
        basis,
        toggle = $bindable(false),
    }: {
        basis: {
            label_l: string;
            label_r: string;
        };
        toggle: boolean;
    } = $props();
</script>

<button
    class={`group relative flex flex-row h-[38px] w-full justify-between items-center rounded-touch bg-layer-2-surface`}
    onclick={async () => {
        toggle = !toggle;
    }}
>
    <div
        class={`z-10 flex flex-row h-full basis-1/2 justify-center items-center bg-transparent`}
    >
        <p
            class={`font-sans font-[400] text-[16px] tracking-wide ${!toggle ? `text-white/60` : `text-layer-0-glyph`} el-re`}
        >
            {basis.label_l}
        </p>
    </div>
    <div
        class={`z-10 flex flex-row h-full basis-1/2 justify-center items-center bg-transparent`}
    >
        <p
            class={`font-sans font-[400] text-[16px] tracking-wide ${toggle ? `text-white/60` : `text-layer-0-glyph`} el-re`}
        >
            {basis.label_r}
        </p>
    </div>
    <div
        class={`z-5 absolute top-0 bottom-0 flex flex-row h-full w-[50%] justify-center items-center rounded-touch bg-th-black transition-all duration-[400ms] ${toggle ? `translate-x-full` : `translate-x-0`}`}
    >
        <Empty />
    </div>
</button>
