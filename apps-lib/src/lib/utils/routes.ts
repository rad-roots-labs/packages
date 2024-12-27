export type NavigationRoute =
    | "/"
    | "/cfg";

export function parse_route(route: string): NavigationRoute {
    switch (route) {
        case "/":
        case "/cfg":
            return route;
        default:
            return "/";
    };
};