import { createHash } from "crypto";
import { Cookie } from "~/utils/cookie-parser";
import db from "~/utils/Database/Supabase";
import { log } from "~/utils/log";
import { is_development } from "~/utils/is_authenticated";
import SetToken from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/SetToken";
import { getClientIP } from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/GetIp";

interface LoginData {
    xs: string;
    user_id: string;
}

export const clearCookies = async (request: Request, cookie_names: string[])=> {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: !is_development(),
            sameSite: 'Strict' as const,
            path: '/',
            priority: !is_development() ? 'medium' as const : 'high' as const
        };
        return cookie_names.map((name) => Cookie.delete(name, cookieOptions));
    }
    catch (error) {
        log({ type: "error", message: "Error clearing cookies", error: error instanceof Error ? error : new Error(String(error)) });
        return [];
    }
}

export const handleLogin = async (request: Request, data: LoginData) => {
    try {
        const { xs, user_id } = data;
        let ip = await getClientIP(request.headers);
        let user_agent = request.headers.get("user-agent")?.split(/\s+/)?.join('');

        if(!ip || !user_agent || !xs || !user_id) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const deviceFingerprint = createHash("sha256")
            .update(`${user_id}|${user_agent}|${ip}`)
            .digest("hex");

        if(!db) return Response.json({ error: "Internal server error" }, { status: 500 });

        const { data: device, error: deviceError } = await db
            .from("user_devices")
            .upsert({
                user_id,
                device_fingerprint: deviceFingerprint,
                ip_address: ip,
                last_active_at: new Date().toISOString()
            }, { onConflict: "user_id,device_fingerprint" })
            .select("device_id")
            .single();

        if (deviceError || !device?.device_id) {
            throw deviceError || new Error("Failed to create device");
        }

        const deviceToken = await SetToken(request.headers, {
            algorithm: "HS512",
            skipExpiration: true
        }, ["device_login_key"], {
            ip,
            user_agent,
            device_id: device.device_id
        });

        // console.log("deviceToken", deviceToken)
        if(!deviceToken?.data) return Response.json({ error: "Internal server error" }, { status: 500 });

        const xsToken = await SetToken(request.headers, {
            algorithm: "HS512",
            skipExpiration: true
        }, ["xs_key"], { xs });

        if(!xsToken?.data) return Response.json({ error: "Internal server error" }, { status: 500 });

        const expiresAt = new Date();
        expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 100);
        const cookieOptions = {
            expires: expiresAt,
            httpOnly: true,
            secure: !is_development(),
            sameSite: 'Strict' as const,
            path: '/',
            priority: !is_development() ? 'medium' as const : 'high' as const
        };

        const clearHeaders = await clearCookies(request, ['_cf', '_c_di', 'global_id']);
        const cUserCookie = Cookie.set('c_user', user_id, cookieOptions);
        const xsCookie = Cookie.set('xs', xsToken.data, cookieOptions);
        const deviceCookie = Cookie.set('_d', deviceToken.data, cookieOptions);

        log({ type: "info", message: "send email here..." });
        // log({ type: "info", message: "clearHeaders", details: clearHeaders });

        const headers = new Headers();
        [...clearHeaders, cUserCookie, xsCookie, deviceCookie].forEach((cookie) => {
            headers.append("Set-Cookie", cookie);
        });

        return Response.json({ success: true }, {
            status: 200,
            headers
        });
    }
    catch (error) {
        log({
            type: "error",
            message: "Error handling login",
            error: error instanceof Error ? error : new Error(String(error)),
        });
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}