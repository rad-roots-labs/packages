import { Loader } from '@sveltekit-i18n/base';
import i18n, { type Config } from 'sveltekit-i18n';

type LanguageConfig = {
    default?: string;
    value?: string;
};

export const i18n_conf = <T extends string>(opts: {
    default_locale: T;
    translations: Record<T, any>;
    loaders: Loader.LoaderModule[]
}) => {
    const { default_locale: initLocale, translations, loaders } = opts;
    const config: Config<LanguageConfig> = {
        initLocale,
        fallbackLocale: initLocale,
        translations,
        loaders,
    };
    return new i18n(config);
};


const lib_config: Config<LanguageConfig> = {
    initLocale: `en`,
    fallbackLocale: `en`,
    translations: {},
    loaders: [],
};
const lib_i18n = new i18n(lib_config);

export type I18nTranslateFunction = typeof lib_i18n.t;
export type I18nTranslateLocale = typeof lib_i18n.locale;
