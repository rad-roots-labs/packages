import type { Snippet } from "svelte";

export type AppLayoutKey = 'lg' | 'base';
type NavigationRouteBasis = string;
export type AnchorRoute = `/${string}`;
export type NavigationRouteParamPublicKey = `pk`;
export type NavigationRouteParamId = `id`;
export type NavigationRouteParamKey = NavigationRouteParamPublicKey | NavigationRouteParamId;
export type NavigationParamTuple = [NavigationRouteParamKey, string];
export type NavigationPreviousParam = { route: NavigationRouteBasis, params?: NavigationParamTuple[] }

export type PropChildren = {
    children: Snippet;
};
