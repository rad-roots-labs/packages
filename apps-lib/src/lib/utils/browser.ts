export type BrowserPlatformInfo = {
    os: string;
    browser: string;
    version: string;
};

const remove_excess_mozilla_and_version = /^mozilla\/\d\.\d\W/;
const browser_pattern = /(\w+)\/(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)/g;
const engine_and_version_pattern = /^(ver|cri|gec)/;
const brand_list = ['chrome', 'opera', 'safari', 'edge', 'firefox'];

const mobiles: Record<string, RegExp> = {
    iphone: /iphone/,
    ipad: /ipad|macintosh/,
    android: /android/
};

const desktops: Record<string, RegExp> = {
    windows: /win/,
    mac: /macintosh/,
    linux: /linux/
};

const parse_user_agent_string = (ua_string: string): BrowserPlatformInfo => {
    const ua = ua_string.toLowerCase().replace(remove_excess_mozilla_and_version, '');

    const mobile_os = Object.keys(mobiles).find(
        (key) => mobiles[key].test(ua) && navigator.maxTouchPoints >= 1
    );
    const desktop_os = Object.keys(desktops).find((key) => desktops[key].test(ua));
    const os = mobile_os || desktop_os || '';

    const browser_matches = ua.match(browser_pattern);
    const version_regex = /version\/(\d+(\.\d+)*)/;
    const safari_version_match = ua.match(version_regex);
    const safari_version = Array.isArray(safari_version_match) ? safari_version_match[1] : null;

    const browser_offset =
        browser_matches && browser_matches.length > 2 && !engine_and_version_pattern.test(browser_matches[1])
            ? 1
            : 0;
    const browser_result =
        browser_matches && browser_matches[browser_matches.length - 1 - browser_offset].split('/');
    const browser = browser_result ? browser_result[0] : '';
    const version = safari_version || (browser_result ? browser_result[1] : '');

    return { os, browser, version };
};

export const browser_platform = (): BrowserPlatformInfo | undefined => {
    if (typeof navigator !== 'undefined') {
        if ('userAgentData' in navigator && navigator.userAgentData) {
            const ua_data = navigator.userAgentData as {
                platform: string;
                brands: { brand: string; version: string }[];
            };
            const os = ua_data.platform.toLowerCase();
            let browser = '';
            let version = '';

            if (Array.isArray(ua_data.brands)) {
                for (const { brand, version: brand_version } of ua_data.brands) {
                    const lower_brand = brand.toLowerCase();
                    if (brand_list.some((b) => lower_brand.includes(b))) {
                        browser = lower_brand;
                        version = brand_version;
                        break;
                    }
                }
            }

            if (!browser && navigator.userAgent) {
                return parse_user_agent_string(navigator.userAgent);
            }
            return { os, browser, version };
        }

        if (navigator.userAgent) {
            return parse_user_agent_string(navigator.userAgent);
        }

        const nav_platform = navigator.platform;
        if (!nav_platform) return undefined;
        return {
            os: nav_platform,
            browser: '',
            version: ''
        };
    }

    return undefined;
};
