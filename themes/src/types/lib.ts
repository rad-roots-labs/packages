export type ThemeKey = `os` | `garden`;
export type ThemeMode = `light` | `dark`;
export type ThemeKeys<T extends ThemeKey> = `${T}_${ThemeMode}`;
export type ThemeKeysLight<T extends ThemeKey> = `${T}_light`;
export type ThemeKeysDark<T extends ThemeKey> = `${T}_dark`;
