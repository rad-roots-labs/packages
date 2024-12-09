export type NavigationRoute =
    | "/"
    | "/farm/land"
    | "/farm/land/add"
    | "/farm/land/view"
    | "/models/location-gcs"
    | "/models/nostr-profile"
    | "/models/nostr-profile/edit/field"
    | "/models/nostr-profile/view"
    | "/models/nostr-relay"
    | "/models/nostr-relay/view"
    | "/models/trade-product"
    | "/models/trade-product/add"
    | "/models/trade-product/view"
    | "/notifications"
    | "/search"
    | "/settings"
    | "/settings/nostr"
    | "/settings/profile"
    | "/settings/profile/edit"
    | "/test"
    | "/cfg/error"
    | "/cfg/init";

export function parse_route(route: string): NavigationRoute {
    switch (route) {
        case "/":
        case "/farm/land":
        case "/farm/land/add":
        case "/farm/land/view":
        case "/models/location-gcs":
        case "/models/nostr-profile":
        case "/models/nostr-profile/edit/field":
        case "/models/nostr-profile/view":
        case "/models/nostr-relay":
        case "/models/nostr-relay/view":
        case "/models/trade-product":
        case "/models/trade-product/add":
        case "/models/trade-product/view":
        case "/notifications":
        case "/search":
        case "/settings":
        case "/settings/nostr":
        case "/settings/profile":
        case "/settings/profile/edit":
        case "/test":
        case "/cfg/error":
        case "/cfg/init":
            return route;
        default:
            return "/";
    };
};