<script lang="ts">
    import { app_blur, Fill } from "$lib";
</script>

<div
    class={`z-10 absolute top-0 left-0 modal modal-bottom ${$app_blur ? `modal-open` : ``} h-[100vh] w-full m-0 p-0 backdrop-blur-sm overflow-y-hidden transition-all`}
>
    <div
        class={`modal-box h-full w-full m-0 p-0 bg-transparent overflow-hidden transition-all`}
    >
        <Fill />
    </div>
</div>
