<script lang="ts">
    import {
        app_lo,
        app_tilt,
        envelope_tilt,
        envelope_visible,
    } from "$lib/stores/app";
    import { handle_err, window_set } from "@radroots/apps-lib";
    import { onMount } from "svelte";
    import LogoCircle from "../lib/logo-circle.svelte";

    let { children } = $props();

    onMount(async () => {
        try {
            window_set();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    envelope_visible.subscribe(async (_envelope_visible) => {
        if (_envelope_visible && $envelope_tilt) app_tilt.set(true);
        else app_tilt.set(false);
    });
</script>

<div
    class={`relative lg:hidden flex flex-col h-[100vh] w-full bg-ly0 ${
        $app_tilt ? `scale-y-[96%] translate-y-4 rounded-t-[3rem]` : ``
    } overflow-x-hidden overflow-y-scroll scroll-hide delay-75 duration-200 el-re cursor-default`}
>
    {#if $app_lo}
        <div class={`flex flex-col h-full w-full`}>
            {@render children()}
        </div>
    {/if}
</div>
<div
    class={`max-lg:hidden flex flex-col h-[100vh] w-full justify-center items-center bg-ly0 cursor-default el-re`}
>
    <div class={`flex flex-col justify-center items-center`}>
        <LogoCircle />
        <div class={`flex flex-col w-full gap-1 justify-center items-center`}>
            <p class={`font-sans font-[400] text-base text-ly0-gl italic`}>
                {`Welcome to the`}
                <span class={`font-[600]`}>
                    {`Rad Roots`}
                </span>
                {`app!`}
            </p>
            <p class={`font-sans font-[400] text-base text-ly0-gl`}>
                {`Please view this application on mobile device`}
            </p>
        </div>
    </div>
</div>
