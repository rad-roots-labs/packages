import { type Loader } from '@sveltekit-i18n/base';
import type { Config as ConfigIcu, Parser as ParserIcu } from "@sveltekit-i18n/parser-icu";
import parser_icu from "@sveltekit-i18n/parser-icu";
import i18n, { type Config } from 'sveltekit-i18n';

type LanguageConfig = {
    default?: string;
    value?: string;
};

type TranslationMap<T extends string> = Record<T, Record<string, unknown>>;

const LIB_CONFIG: Config<LanguageConfig> = {
    initLocale: `en`,
    fallbackLocale: `en`,
    translations: {},
    loaders: [],
};

const lib_i18n = new i18n(LIB_CONFIG);
export type I18nTranslateFunction = typeof lib_i18n.t;
export type I18nTranslateLocale = typeof lib_i18n.locale;

export const i18n_conf = <T extends string>(opts: {
    default_locale: T;
    translations: TranslationMap<T>;
    loaders: Loader.LoaderModule[]
}) => {
    const { default_locale, translations, loaders } = opts;
    const config = {
        initLocale: default_locale,
        fallbackLocale: default_locale,
        translations,
        loaders,
    } satisfies Config<Record<string, unknown>>;
    return new i18n(config);
};

export const i18n_conf_icu = <T extends string>(opts: {
    default_locale: T;
    translations: TranslationMap<T>;
    loaders: Loader.LoaderModule[]
}): i18n<ParserIcu.Params<LanguageConfig>> => {
    const { default_locale, translations, loaders } = opts;
    const config: ConfigIcu<LanguageConfig> = {
        initLocale: default_locale,
        fallbackLocale: default_locale,
        translations,
        parser: parser_icu(),
        loaders,
    };
    return new i18n(config);
};
