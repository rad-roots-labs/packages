<script>
    import { Blur, app_tilt } from "$lib";
</script>

<div
    class={`relative flex flex-col h-[100vh] w-full overflow-x-hidden overflow-y-hidden bg-layer-0-surface ${$app_tilt ? `scale-y-[96%] translate-y-4 rounded-t-[3rem]` : ``} delay-75 duration-200 el-re`}
>
    <div class={`flex flex-col h-full w-full`}>
        <slot />
    </div>
    <slot name="overlay" />
    <Blur />
</div>
