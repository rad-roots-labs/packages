import i18n from '@sveltekit-i18n/base';
import type { Config } from '@sveltekit-i18n/parser-icu';
import parser from '@sveltekit-i18n/parser-icu';
import locales_keys from './locales.json';

type LanguageConfig = {
    default?: string;
    value?: string;
};

export type Locale = keyof typeof locales_keys;

const libtranslations: Record<Locale, any> = {
    en: { locales_keys },
};

const config: Config<LanguageConfig> = {
    initLocale: `en` satisfies Locale,
    translations: libtranslations,
    parser: parser(),
    loaders: [
        ...Object.keys(libtranslations).map((locale) => [`common`, `farm`, `icu`, `measurement`, `model`, `trade`].map(key => ({
            locale,
            key,
            loader: async () => (await import(`./${locale}/${key}.json`)).default
        }))),
    ].flat()
};

const {
    t: lls,
    loading: libtranslations_loading,
    locales: liblocales,
    locale: liblocale,
    loadTranslations: libload_translations
} = new i18n(config);;

libtranslations_loading.subscribe(async (_loading) => {
    if (_loading) await libtranslations_loading.toPromise();
});
export { libload_translations, liblocale, liblocales, libtranslations, libtranslations_loading, lls };

