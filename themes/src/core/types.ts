export type ThemeLayer = 0 | 1 | 2;

export type ThemeKey = "os";

export type ThemeMode = "light" | "dark";

export type ThemeId<TThemeKey extends ThemeKey = ThemeKey> = `${TThemeKey}_${ThemeMode}`;

export type LightThemeId<TThemeKey extends ThemeKey = ThemeKey> = `${TThemeKey}_light`;

export type DarkThemeId<TThemeKey extends ThemeKey = ThemeKey> = `${TThemeKey}_dark`;

export type ThemeKeys<T extends ThemeKey> = ThemeId<T>;

export type ThemeKeysLight<T extends ThemeKey> = LightThemeId<T>;

export type ThemeKeysDark<T extends ThemeKey> = DarkThemeId<T>;
