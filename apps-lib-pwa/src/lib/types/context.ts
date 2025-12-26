import type { I18nTranslateFunction, I18nTranslateLocale, LocalCallbackColorMode, LocalCallbackGeocode, LocalCallbackGeocodeCurrent, LocalCallbackGuiAlert, LocalCallbackGuiConfirm, LocalCallbackImgBin, LocalCallbackPhotosAddMultiple, LocalCallbackPhotosUpload } from "@radroots/apps-lib";

export type ContextKeys = `lib`;

export type ContextMap = {
    lib: LibContext;
};

export type LibContext = {
    ls: I18nTranslateFunction;
    locale: I18nTranslateLocale;
    lc_color_mode: LocalCallbackColorMode;
    lc_gui_alert: LocalCallbackGuiAlert;
    lc_gui_confirm: LocalCallbackGuiConfirm;
    lc_geocode: LocalCallbackGeocode;
    lc_photos_add: LocalCallbackPhotosAddMultiple;
    lc_img_bin: LocalCallbackImgBin;
    lc_geop_current: LocalCallbackGeocodeCurrent;
    lc_photos_upload: LocalCallbackPhotosUpload;
};
