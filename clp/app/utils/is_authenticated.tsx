import db from "./Database/Supabase";
import { Cookie } from "./cookie-parser";
import SetToken from "./Security/unsharedkeyEncryption/Combined/Verification/SetToken";
import { VerifyToken } from "./Security/unsharedkeyEncryption/Combined/Verification/VerifyToken";
import { log } from "./log";

type AuthResult = boolean | { authenticated: boolean; headers?: Headers };

const buildCookieOptions = () => {
  const expiresAt = new Date();
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 100);
  return {
    expires: expiresAt,
    httpOnly: true,
    secure: !is_development(),
    sameSite: "Strict" as const,
    path: "/",
    priority: !is_development() ? ("medium" as const) : ("high" as const),
  };
};

export const isAuthenticated = async (
  request: Request,
  update_xs_if_possible = false,
): Promise<AuthResult> => {
  try {
    if (!db) return false;
    const xsCookie = Cookie.get("xs", request);
    const deviceCookie = Cookie.get("_d", request);

    const xsToken =
      xsCookie && typeof xsCookie === "string"
        ? await VerifyToken(
            { token: xsCookie, addedKeyNames: ["xs_key"] },
            request.headers,
          )
        : null;
    const deviceToken =
      deviceCookie && typeof deviceCookie === "string"
        ? await VerifyToken(
            { token: deviceCookie, addedKeyNames: ["device_login_key"] },
            request.headers,
          )
        : null;

    const xsValue =
      xsToken && typeof xsToken === "object" ? (xsToken as any).xs : null;
    const deviceId =
      deviceToken && typeof deviceToken === "object"
        ? (deviceToken as any).device_id
        : null;

    if (xsValue) {
      const { data: user } = await db
        .from("users")
        .select("id,xs")
        .eq("xs", xsValue)
        .maybeSingle();

      if (user) {
        if (!deviceId) return false;
        const { data: device } = await db
          .from("user_devices")
          .select("user_id,is_active")
          .eq("device_id", deviceId)
          .maybeSingle();

        if (!device || device.user_id !== user.id || device.is_active === false) {
          return false;
        }
        return true;
      }
    }

    if (!deviceId) return false;
    const { data: device } = await db
      .from("user_devices")
      .select("user_id,is_active")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (!device || !device.user_id || device.is_active === false) return false;

    const { data: user } = await db
      .from("users")
      .select("id,xs")
      .eq("id", device.user_id)
      .maybeSingle();

    if (!user || !user.xs) return false;

    const { data: settings } = await db
      .from("user_settings")
      .select("logout_on_password_reset")
      .eq("id", user.id)
      .maybeSingle();

    if (settings?.logout_on_password_reset) return false;

    if (!update_xs_if_possible) return false;

    const xsTokenRefresh = await SetToken(
      request.headers,
      {
        algorithm: "HS512",
        skipExpiration: true,
      },
      ["xs_key"],
      { xs: user.xs },
    );

    if (!xsTokenRefresh?.data) return false;

    const headers = new Headers();
    headers.append("Set-Cookie", Cookie.delete("xs", { path: "/", sameSite: "Strict" }));
    headers.append("Set-Cookie", Cookie.set("xs", xsTokenRefresh.data, buildCookieOptions()));

    return { authenticated: true, headers };
  } catch (error) {
    log({
      type: "error",
      message: "Error found in isAuthenticated",
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return false;
  }
};

export const is_development = () => {
  return process.env.NODE_ENV === 'development';
}

export const is_authenticated_keys = (is_authenticated: boolean): string[] => {
  return is_authenticated ? ['authenticated_session_token', `auth_token`] : ['session_token']
}

export const cf_setKeys = (_di: string, validate_token: {['user-agent']: string, ['ip']: string}): string | null => {
  if(!_di || !validate_token?.['user-agent']?.trim() || !validate_token?.['ip']?.trim()) return null;
  return `${_di}+${validate_token?.['user-agent']}+${validate_token?.['ip']}`
}