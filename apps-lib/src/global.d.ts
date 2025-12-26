declare module "$app/environment";
declare module "$app/navigation";
declare module "$app/stores";

type NavigatorUserAgentBrand = {
    brand: string;
    version: string;
};

type NavigatorUserAgentData = {
    platform: string;
    brands?: NavigatorUserAgentBrand[];
};

interface Navigator {
    userAgentData?: NavigatorUserAgentData;
}
