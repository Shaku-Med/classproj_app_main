import { redirect } from "react-router"
import { handleRedirect } from "~/utils/handle-redirect"
import { validateApiSessions } from "~/utils/session-token"
import { handleusersdata } from "~/routes/api/auth/lib/handleusersdata"

type GoogleUserInfo = {
  id: string
  email: string
  verified_email?: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
}

type VerifyGoogleRequestBody = {
  accessToken?: string
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Google user info")
  }

  return (await response.json()) as GoogleUserInfo
}

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 })
  }

  try {
    type ValidateApiSessionsResult =
      | boolean
      | {
          success: boolean
          redirect_url?: string
          headers?: Headers
          response?: {
            data: any
            status: number
            headers?: Headers
          }
        }
    let validate_api_sessions: ValidateApiSessionsResult = await validateApiSessions(request);
    if(!validate_api_sessions) return new Response(null, { status: 401 });
    if(typeof validate_api_sessions === 'object' && !validate_api_sessions.success) return new Response(validate_api_sessions.response?.data, { status: validate_api_sessions.response?.status || 401, headers: validate_api_sessions.response?.headers });
    if(typeof validate_api_sessions === 'object' && validate_api_sessions.redirect_url) return redirect(validate_api_sessions.redirect_url, request);

    const body = (await request.json()) as VerifyGoogleRequestBody

    if (!body?.accessToken || typeof body.accessToken !== "string") {
      return new Response(JSON.stringify({ error: "accessToken is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const userInfo = await fetchGoogleUserInfo(body.accessToken)
    if (!userInfo.verified_email) {
      return new Response(JSON.stringify({ error: "Google account not verified" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const response = await handleusersdata(
      {
        email: userInfo.email,
        username: userInfo.email?.split("@")[0],
        fullName: userInfo.name,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        picture: userInfo.picture,
      },
      "google",
      request,
    )
    if(typeof validate_api_sessions === 'object' && validate_api_sessions.headers) {
      const headers = new Headers(response.headers);
      validate_api_sessions.headers.forEach((value: string, key: string) => {
        if (key.toLowerCase() === "set-cookie") {
          headers.append("Set-Cookie", value);
        } else {
          headers.set(key, value);
        }
      });
      const body = await response.text();
      return new Response(body, { status: response.status, headers });
    }
    return response
  } catch (error) {
    console.error("Google verification failed:", error)
    return new Response(JSON.stringify({ error: "Failed to verify Google login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const loader = async ({ request }: { request: Request }) => {
  return handleRedirect('/auth', request)
}