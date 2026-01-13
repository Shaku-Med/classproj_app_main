interface CookieOptions {
    expires?: Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    priority?: 'high' | 'low' | 'medium';
}

const parseCookieString = (cookieHeader: string | null): Record<string, string> => {
    if (!cookieHeader) return {};
    
    return cookieHeader
        .split(';')
        .reduce((acc, cookie) => {
            const [key, ...valueParts] = cookie.trim().split('=');
            if (key) {
                acc[key.trim()] = decodeURIComponent(valueParts.join('=') || '');
            }
            return acc;
        }, {} as Record<string, string>);
};

const buildCookieString = (
    name: string,
    value: string,
    options: CookieOptions = {}
): string => {
    const parts: string[] = [`${name}=${encodeURIComponent(value)}`];
    
    if (options.expires) {
        parts.push(`Expires=${options.expires.toUTCString()}`);
    }
    
    if (options.maxAge !== undefined) {
        parts.push(`Max-Age=${options.maxAge}`);
    }
    
    if (options.domain) {
        parts.push(`Domain=${options.domain}`);
    }
    
    if (options.path) {
        parts.push(`Path=${options.path}`);
    }
    
    if (options.secure) {
        parts.push('Secure');
    }
    
    if (options.httpOnly) {
        parts.push('HttpOnly');
    }
    
    if (options.sameSite) {
        parts.push(`SameSite=${options.sameSite}`);
    }
    
    if (options.priority) {
        parts.push(`Priority=${options.priority}`);
    }
    
    return parts.join('; ');
};

export const parseCookies = (request: Request): Record<string, string> => {
    try {
        const cookieHeader = request.headers.get('Cookie');
        return parseCookieString(cookieHeader);
    } catch (error) {
        console.error(`Error found in parseCookies: -----> \n`, error);
        return {};
    }
};

export const Cookie  = {
    get: (name: string, request: Request): string | null => {
        try {
            const cookies = parseCookies(request);
            return cookies[name] || null;
        } catch (error) {
            console.error(`Error found in Cookie.get: -----> \n`, error);
            return null;
        }
    },
    
    getAll: (request: Request): Record<string, string> => {
        try {
            return parseCookies(request);
        } catch (error) {
            console.error(`Error found in Cookie.getAll: -----> \n`, error);
            return {};
        }
    },
    
    has: (name: string, request: Request): boolean => {
        try {
            const cookies = parseCookies(request);
            return name in cookies;
        } catch (error) {
            console.error(`Error found in Cookie.has: -----> \n`, error);
            return false;
        }
    },
    
    set: (
        name: string,
        value: string,
        options: CookieOptions = {}
    ): string => {
        try {
            return buildCookieString(name, value, options);
        } catch (error) {
            console.error(`Error found in Cookie.set: -----> \n`, error);
            return '';
        }
    },
    
    delete: (name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): string => {
        try {
            return buildCookieString(name, '', {
                ...options,
                expires: new Date(0),
                maxAge: 0
            });
        } catch (error) {
            console.error(`Error found in Cookie.delete: -----> \n`, error);
            return '';
        }
    }
};