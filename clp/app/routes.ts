import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route(`*`, 'routes/home/layout.tsx', [
        index('routes/home/index.tsx'),
        route('*', 'routes/home/not-found.tsx'),
    ]),
    route('api', 'routes/api/layout.tsx', [
        route('', 'routes/api/index.tsx'),
        route('auth/third-party/verify-google', 'routes/api/auth/third-party/verify_google.tsx'),
        route('auth/third-party/verify-github', 'routes/api/auth/third-party/verify_github.tsx'),
    ]),
    route(`auth`, 'routes/auth/layout.tsx', [
        index('routes/auth/login-signup/index.tsx'),
        // route('signup', 'routes/auth/login-signup/signup/index.tsx'),
        route('thirdparty', 'routes/auth/third_party/index.tsx'),
        // route('reset', 'routes/auth/reset/layout.tsx', [
        //     index('routes/auth/reset/index.tsx'),
        //     route('password', 'routes/auth/reset/password/layout.tsx', [
        //         index('routes/auth/reset/password/index.tsx'),
        //     ]),
        //     route('verify', 'routes/auth/reset/verify/layout.tsx', [
        //         index('routes/auth/reset/verify/index.tsx'),
        //         route(':token', 'routes/auth/reset/verify/dynamic/layout.tsx', [
        //             index('routes/auth/reset/verify/dynamic/index.tsx'),
        //             route('email', 'routes/auth/reset/verify/dynamic/email/index.tsx'),
        //         ]),
        //     ]),
        // ]),
    ]),
    route('error', 'routes/error-page/index.tsx'),
] satisfies RouteConfig;
