import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import '../app/styles/head.css';
import '../app/styles/default.css';
import { allowedRoutes } from "./utils/allowed-routes";
import { handleRedirect } from "./utils/handle-redirect";
import { useEffect } from "react";
import SetToken from "./utils/Security/unsharedkeyEncryption/Combined/Verification/SetToken";
import { handleSessionToken } from "./utils/session-token";
import { Cookie } from "./utils/cookie-parser";
import ErrorPage from "./routes/error-page";
import { is_development, isAuthenticated } from "./utils/is_authenticated";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({request}: {request: Request}) => {
  try {
    let is_authenticated = await isAuthenticated(request);
    const url = new URL(request.url)
    const pathname = url.pathname.toLowerCase()
    
    if(!is_authenticated) {
      let token = await handleSessionToken({ request, is_authenticated });
      if(!token && !pathname.startsWith('/error')) return handleRedirect('/error', request);
      
      const isAllowedRoute = allowedRoutes.some(route => pathname.startsWith(route.toLowerCase()))
      
      if (!isAllowedRoute && token) {
        return handleRedirect('/auth', request)
      }
      
      if (token) {
        if(token.valid_global_id) return data({ data: true, status: 200 });
        const expiresDate = new Date(token.expiresAt);
        const cookieHeader = Cookie.set('global_id', token.data, {
          expires: expiresDate,
          httpOnly: true,
          secure: !is_development(),
          sameSite: 'Strict',
          path: '/',
          priority: !is_development() ? 'medium' : 'high'
        });
        return data({ data: true, status: 200 }, {
          headers: { 'Set-Cookie': cookieHeader },
        })
      }
      
      return data({ data: null, status: 401});
    }
  }
  catch (error) {
    console.error(error)
    // return handleRedirect('/auth', request)
    return data({ data: null, status: 500 });
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <Meta />
        <Links />
      </head>
      <body className={`system`}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let data = useLoaderData<typeof loader>();
  if(!data || data.status !== 200 || !data.data) {
    return <ErrorPage />
  }
  return <Outlet />;
}