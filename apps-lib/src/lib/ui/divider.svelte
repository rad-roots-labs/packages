<script lang="ts">
    import { Fill, fmt_cl } from "$lib";

    export let basis:
        | {
              classes?: string;
          }
        | undefined = undefined;
</script>

<div
    class={`${fmt_cl(basis.classes)} flex flex-row h-[1px] w-full justify-start items-center bg-layer-1-edge`}
>
    <Fill />
</div>
