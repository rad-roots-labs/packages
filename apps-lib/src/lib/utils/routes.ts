export type NavigationRoute =
	| "/"
	| "/map"
	| "/map/choose-location"
	| "/models/location-gcs"
	| "/models/location-gcs/view-map"
	| "/models/nostr-profile"
	| "/models/nostr-profile/edit/field"
	| "/models/nostr-profile/view"
	| "/models/nostr-relay"
	| "/models/nostr-relay/view"
	| "/models/trade-product"
	| "/models/trade-product/add"
	| "/nostr"
	| "/nostr/keys"
	| "/nostr/notes"
	| "/nostr/notes/post"
	| "/nostr/profile"
	| "/settings"
	| "/test"
	| "/conf/init";

export function parse_route(route: string): NavigationRoute {
	switch (route) {
		case "/":
		case "/map":
		case "/map/choose-location":
		case "/models/location-gcs":
		case "/models/location-gcs/view-map":
		case "/models/nostr-profile":
		case "/models/nostr-profile/edit/field":
		case "/models/nostr-profile/view":
		case "/models/nostr-relay":
		case "/models/nostr-relay/view":
		case "/models/trade-product":
		case "/models/trade-product/add":
		case "/nostr":
		case "/nostr/keys":
		case "/nostr/notes":
		case "/nostr/notes/post":
		case "/nostr/profile":
		case "/settings":
		case "/test":
		case "/conf/init":
			return route;
		default:
			return "/";
	};
};