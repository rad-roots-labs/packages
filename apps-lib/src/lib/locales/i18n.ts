//import i18n, { type Config } from '@radroots/sveltekit-i18n';
import i18n from '@sveltekit-i18n/base';
import type { Config } from '@sveltekit-i18n/parser-icu';
import parser from '@sveltekit-i18n/parser-icu';
import locales_keys from './locales.json';

type Locale = keyof typeof locales_keys;

type LanguageConfig = {
	default?: string;
	value?: string;
};

const locales_files = [`app`, `common`, `currency`, `icu`, `measurement`, `trade`] as const;
const translations_keys: Record<Locale, any> = {
	en: { locales_keys },
};
export const default_locale: Locale = `en`;

const config: Config<LanguageConfig> = {
	initLocale: default_locale,
	translations: translations_keys,
	parser: parser(),
	loaders: [
		...Object.keys(translations_keys).map((locale) => locales_files.map(key => ({
			locale,
			key,
			loader: async () => (await import(`./${locale}/${key}.json`)).default
		}))),
	].flat()
};

const {
	t,
	loading: translations_loading,
	locales,
	locale,
	translations,
	loadTranslations: load_translations
} = new i18n(config);

translations_loading.subscribe(async ($loading) => {
	if ($loading) await translations_loading.toPromise();
});

export {
	load_translations, locale, locales, t, translations, translations_loading
};
