<script lang="ts">
    import { browser } from "$app/environment";
    import { app_th, app_thc, theme_set } from "$root";
    import { parse_color_mode, parse_theme_key } from "@radroots/theme";

    app_thc.subscribe(
        (_app_thc) =>
            browser &&
            theme_set(parse_theme_key($app_thc), parse_color_mode(_app_thc)),
    );

    app_th.subscribe(
        (_app_th) =>
            browser &&
            theme_set(parse_theme_key(_app_th), parse_color_mode($app_thc)),
    );
</script>
