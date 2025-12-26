import { type Loader } from '@sveltekit-i18n/base';
import type { Config as ConfigIcu, Parser as ParserIcu } from "@sveltekit-i18n/parser-icu";
import parser_icu from "@sveltekit-i18n/parser-icu";
import i18n, { type Config, type Modifier, type Parser } from 'sveltekit-i18n';

export type I18nPayloadValue = string | number | boolean;
export type I18nPayload = Record<string, I18nPayloadValue>;

type TranslationMap<T extends string> = Record<T, Record<string, unknown>>;

export type I18nTranslateFunction = i18n<
    Parser.Params<I18nPayload, Modifier.DefaultProps>,
    I18nPayload,
    Modifier.DefaultProps
>["t"];
export type I18nTranslateLocale = i18n<
    Parser.Params<I18nPayload, Modifier.DefaultProps>,
    I18nPayload,
    Modifier.DefaultProps
>["locale"];

export const i18n_conf = <T extends string, P extends I18nPayload = I18nPayload>(opts: {
    default_locale: T;
    translations: TranslationMap<T>;
    loaders: Loader.LoaderModule[]
}): i18n<Parser.Params<P, Modifier.DefaultProps>, P, Modifier.DefaultProps> => {
    const { default_locale, translations, loaders } = opts;
    const config = {
        initLocale: default_locale,
        fallbackLocale: default_locale,
        translations,
        loaders,
    } satisfies Config<P, Modifier.DefaultProps>;
    return new i18n(config);
};

export const i18n_conf_icu = <T extends string, P extends I18nPayload = I18nPayload>(opts: {
    default_locale: T;
    translations: TranslationMap<T>;
    loaders: Loader.LoaderModule[]
}): i18n<ParserIcu.Params<P>> => {
    const { default_locale, translations, loaders } = opts;
    const config: ConfigIcu<P> = {
        initLocale: default_locale,
        fallbackLocale: default_locale,
        translations,
        parser: parser_icu(),
        loaders,
    };
    return new i18n(config);
};
