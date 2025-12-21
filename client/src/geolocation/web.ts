import { err_msg, type IClientGeolocationPosition, type ResolveErrorMsg } from "@radroots/utils";
import { cl_geolocation_error, type ClientGeolocationErrorMessage } from "./error.js";
import type { IClientGeolocation } from "./types.js";

type GeoPolicyAllows = boolean | "unknown";
type GeoPermissionState = PermissionState | "unknown";

interface PermissionsPolicyLike {
    allowsFeature(feature: "geolocation"): boolean;
}

interface DocumentWithPermissionsPolicy extends Document {
    permissionsPolicy: PermissionsPolicyLike;
}

interface NavigatorWithPermissions extends Navigator {
    permissions: Permissions;
}

interface GeoDebug {
    policy_allows: GeoPolicyAllows;
    permission_state: GeoPermissionState;
    error_code?: number;
    error_message?: string;
    user_agent: string;
}

const geo_debug_enabled = true;

function has_permissions_policy(doc: Document): doc is DocumentWithPermissionsPolicy {
    return "permissionsPolicy" in doc;
}

function has_permissions_api(nav: Navigator): nav is NavigatorWithPermissions {
    return "permissions" in nav;
}

function read_policy_allows_geolocation(doc: Document): GeoPolicyAllows {
    if (!has_permissions_policy(doc)) return "unknown";
    try {
        return doc.permissionsPolicy.allowsFeature("geolocation");
    } catch {
        return "unknown";
    }
}

async function read_permission_state_geolocation(nav: Navigator): Promise<GeoPermissionState> {
    if (!has_permissions_api(nav)) return "unknown";
    try {
        const status = await nav.permissions.query({ name: "geolocation" });
        return status.state;
    } catch {
        return "unknown";
    }
}

function create_debug(
    policy_allows: GeoPolicyAllows,
    permission_state: GeoPermissionState
): GeoDebug {
    return {
        policy_allows,
        permission_state,
        user_agent: navigator.userAgent
    };
}

function log_geo_debug(event: string, debug: GeoDebug): void {
    if (!geo_debug_enabled) return;
    console.debug(event, debug);
}

function get_current_position(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        });
    });
}

function map_error_key(
    debug: GeoDebug,
    error: GeolocationPositionError
) {
    if (error.code === 1) {
        if (debug.policy_allows === false) {
            return cl_geolocation_error.blocked_by_permissions_policy;
        }
        return cl_geolocation_error.permission_denied;
    }

    if (error.code === 2) {
        return cl_geolocation_error.position_unavailable;
    }

    if (error.code === 3) {
        return cl_geolocation_error.timeout;
    }

    return cl_geolocation_error.unknown_error;
}

export interface IWebGeolocation extends IClientGeolocation {}

export class WebGeolocation implements IWebGeolocation {
    public async current(): Promise<ResolveErrorMsg<IClientGeolocationPosition, ClientGeolocationErrorMessage>> {
        if (!navigator.geolocation) return err_msg(cl_geolocation_error.location_unavailable);

        const policy_allows = read_policy_allows_geolocation(document);
        const permission_state = await read_permission_state_geolocation(navigator);

        const base_debug = create_debug(policy_allows, permission_state);

        if (policy_allows === false) {
            log_geo_debug("[geolocation] blocked_by_policy", base_debug);
            return err_msg(cl_geolocation_error.blocked_by_permissions_policy);
        }

        try {
            const position = await get_current_position();

            return {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
        } catch (e) {
            if (e instanceof GeolocationPositionError) {
                const debug: GeoDebug = {
                    ...base_debug,
                    error_code: e.code,
                    error_message: e.message
                };

                const key = map_error_key(debug, e);
                log_geo_debug("[geolocation] error", debug);

                return err_msg(key);
            }

            log_geo_debug("[geolocation] unknown_exception", base_debug);
            return err_msg(cl_geolocation_error.unknown_error);
        }
    }
}
