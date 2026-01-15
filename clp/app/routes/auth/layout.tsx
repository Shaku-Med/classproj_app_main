import { data, Outlet, redirect, useLoaderData, type MetaFunction } from "react-router"
import AuthHero from "./components/AuthHero"
import AuthMap from "./components/AuthMap"
import { AuthProvider } from "./lib/Context"
import { isAuthenticated } from "~/utils/Security/Password"
import SetToken from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/SetToken"
import { useEffect, useRef, useState } from "react"
import { clientCollectorScript } from "~/utils/Security/client/client-script"
import { validator } from "~/utils/Validator/validator"
import { VerifyToken } from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/VerifyToken"
import { validateSessionToken } from "~/utils/session-token"
import { cf_setKeys, is_authenticated_keys, is_development } from "~/utils/is_authenticated"
import { Cookie } from "~/utils/cookie-parser"
import { quickAuthReplayStore } from "~/utils/Security/quick-auth-replay"
import { encrypt } from "~/utils/Security/client"
import { EnvValidator } from "~/utils/Database/EnvValidator"

export const meta: MetaFunction = () => {
    return [
        { title: "Login / Signup" },
        { name: "description", content: `Welcome to CLP - a simple and secure way to sign up and log in. Create your account in a few easy steps: enter your email, set a password, choose a username, and add your details. You can sign in with your email and password, or use your Google or GitHub account to get started faster. The login page shows a friendly greeting that changes based on the time of day, displays the current time, and even celebrates holidays. We keep your account safe with password checks, email verification, and an easy way to reset your password if you forget it. CLP works great on your phone, tablet, or computer, so you can access your account from anywhere.` },
    ]
}

export const loader = async ({request}: {request: Request}) => {
    try {
        let is_authenticated = await isAuthenticated(request);
        if(is_authenticated) return redirect("/");

        let quick_auth = await SetToken(request.headers, {
            expiresIn: '5m',
            algorithm: 'HS512'
        }, ['quick_auth'])
        if(!quick_auth) return data(null, { status: 500 });
        quickAuthReplayStore.register(quick_auth.data, quick_auth.expiresAt);
        return data({ cf_: quick_auth.data }, { status: 200 });
    }
    catch (error) {
        console.error(`Error found in Auth Layout Loader: -----> \n`, error)
        return data(null, { status: 500 });
    }
}

export const action = async ({request}: {request: Request}) => {
    try {
        let is_authenticated = await isAuthenticated(request);
        let global_id = Cookie.get('global_id', request);
        if(!global_id) return data(null, { status: 401 });

        if(request.method !== 'POST') return data(null, { status: 405 });
        let authorization = request.headers.get('authorization');
        if(!authorization || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) return data(null, { status: 401 });

        let token = authorization.split(' ')[1];
        if(!token || typeof token !== 'string') return data(null, { status: 401 });

        let validate_token = await VerifyToken({
            token: token,
            addedKeyNames: ['quick_auth']
        }, request.headers);
        if(!validate_token || typeof validate_token !== 'object') return data(null, { status: 401 });

        const keys = is_authenticated_keys(is_authenticated);

        let validate_global_id = await validateSessionToken(global_id, request.headers, keys);
        if(!validate_global_id) return data(null, { status: 401 });

        let body = await request.json();
        let { _di } = body;
        if(!_di || typeof _di !== 'string') return data(null, { status: 400 });

        const result = validator({ value: _di, type: "deviceId", required: true }) as { valid: boolean }
        if(!result.valid) return data(null, { status: 400 });

        const isFreshToken = quickAuthReplayStore.consume(token);
        if(!isFreshToken) return data(null, { status: 401 });

        let expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
        let cf_set_keys = cf_setKeys(_di, validate_token);
        let cf_token_key = EnvValidator('CSRF_TOKEN');

        if(!cf_set_keys || !cf_token_key) return data(null, { status: 500 });
        let csrf_token = encrypt({
            access_key: `${cf_token_key}`,
            expires_at: expires_at,
            data: `${_di}`
        }, `${cf_set_keys}`)
        if(!csrf_token) return data(null, { status: 500 });

        const expiresDate = new Date(expires_at);
        const cookieOptions = {
            expires: isNaN(expiresDate.getTime()) ? undefined : expiresDate,
            httpOnly: true,
            secure: !is_development(),
            sameSite: 'Strict' as const,
            path: '/',
            priority: !is_development() ? 'medium' as const : 'high' as const
        };

        const deviceCookie = Cookie.set('_c_di', _di, cookieOptions);
        const csrfCookie = Cookie.set('_cf', csrf_token, cookieOptions);

        return data(null, { 
            status: 200,
            headers: {
                'Set-Cookie': [deviceCookie, csrfCookie].join(', ')
            }
        });
    }
    catch (error) {
        console.error(`Error found in Auth Layout Action: -----> \n`, error)
        return data(null, { status: 500 });
    }
}

export default function Layout() {
    const data = useLoaderData<typeof loader>();
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined' && !(window as any).DeviceSecurity) {
            const script = document.createElement('script');
            script.textContent = clientCollectorScript;
            document.head.appendChild(script);
        }
    }, []);

    const hasSentRef = useRef(false);

    useEffect(() => {
        if (!data?.cf_ || hasSentRef.current) return;
        hasSentRef.current = true;

        let handleFetch = async () => {
            try {
                let attempts = 0;
                while (typeof window !== 'undefined' && !(window as any).DeviceSecurity && attempts < 10) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }

                let getDev_id: string | null = null;
                if (typeof window !== 'undefined' && (window as any).DeviceSecurity) {
                    getDev_id = await (window as any).DeviceSecurity.getDeviceId();
                }

                let response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${data?.cf_}`
                    },
                    body: JSON.stringify({
                        _di: getDev_id
                    })
                })
                if(!response.ok) {
                    setActive(false);
                    return;
                }
                setActive(true);
            }
            catch (error) {
                console.error(`Something went wrong...`, error)
                return;
            }
        }
        handleFetch();
    }, [data?.cf_]);

    return (
        <AuthProvider active={active}>
            <div className="md:fixed relative inset-0 flex flex-col md:flex-row bg-background text-foreground">
                <div className="relative z-10 flex-1 min-h-[60vh] md:min-h-screen flex flex-col justify-between px-6 sm:px-10 md:px-14 py-8 md:py-10 gap-8 overflow-auto">

                    <main className="flex-1 flex flex-col justify-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/icon.png"
                                    alt="CLP logo"
                                    className="h-7 w-7 rounded-md"
                                    draggable={false}
                                />
                                <span className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                    CLP CLOUD
                                </span>
                            </div>
                            <Outlet />
                            <p className="pt-3 text-[11px] text-muted-foreground leading-relaxed w-full items-center justify-center flex flex-wrap gap-1">
                                By signing up, you agree to our{" "}
                                <span className="underline underline-offset-2 decoration-muted-foreground/50">
                                    terms of service
                                </span>{" "}
                                and{" "}
                                <span className="underline underline-offset-2 decoration-muted-foreground/50">
                                    privacy policy
                                </span>
                                .
                            </p>
                        </div>
                    </main>

                    <footer className="flex items-center justify-between text-[11px] text-muted-foreground/70">
                        <span>LOCATIONS: 500+</span>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-muted-foreground/80 hover:text-foreground transition-colors"
                        >
                            <span className="h-[1px] w-4 bg-muted-foreground/40" />
                            SECURED BY CLP
                        </button>
                    </footer>
                </div>

                <aside className="relative md:flex md:w-[55%] xl:w-[60%] md:border-l border-border bg-background border-t overflow-hidden">
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex-1 flex flex-col">
                            <div className="px-10 pt-8 pb-2  w-full h-full">
                                <AuthHero />
                            </div>
                            <AuthMap />
                        </div>
                    </div>
                </aside>
            </div> 
        </AuthProvider>
    )
}