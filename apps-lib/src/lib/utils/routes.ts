export type NavigationRoute =
	| "/"
	| "/models/location-gcs"
	| "/models/nostr-profile"
	| "/models/nostr-profile/edit/field"
	| "/models/nostr-profile/view"
	| "/models/nostr-relay"
	| "/models/nostr-relay/view"
	| "/models/trade-product"
	| "/models/trade-product/add"
	| "/settings"
	| "/test"
	| "/conf/error"
	| "/conf/init";

export function parse_route(route: string): NavigationRoute {
	switch (route) {
		case "/":
		case "/models/location-gcs":
		case "/models/nostr-profile":
		case "/models/nostr-profile/edit/field":
		case "/models/nostr-profile/view":
		case "/models/nostr-relay":
		case "/models/nostr-relay/view":
		case "/models/trade-product":
		case "/models/trade-product/add":
		case "/settings":
		case "/test":
		case "/conf/error":
		case "/conf/init":
			return route;
		default:
			return "/";
	};
};