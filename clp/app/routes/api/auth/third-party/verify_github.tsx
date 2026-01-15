import { redirect } from "react-router"
import { EnvValidator } from "~/utils/Database/EnvValidator"
import { handleRedirect } from "~/utils/handle-redirect"
import { validateApiSessions } from "~/utils/session-token"

type VerifyGitHubRequestBody = {
  code?: string
  redirectUri?: string
}

type GitHubTokenResponse = {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
  error_uri?: string
}

type GitHubUserInfo = {
  id: number
  login: string
  name?: string
  email?: string
  avatar_url?: string
}

type GitHubEmail = {
  email: string
  primary: boolean
  verified: boolean
  visibility?: string | null
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const clientId = EnvValidator("GITHUB_CLIENT_ID")
  const clientSecret = EnvValidator("GITHUB_CLIENT_SECRET")

  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth env vars are missing")
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  })

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: params,
  })

  const data = (await response.json()) as GitHubTokenResponse
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Failed to exchange GitHub code")
  }

  return data.access_token
}

async function fetchGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user info")
  }

  return (await response.json()) as GitHubUserInfo
}

async function fetchGitHubEmails(accessToken: string) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  })

  if (!response.ok) {
    return [] as GitHubEmail[]
  }

  return (await response.json()) as GitHubEmail[]
}

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 })
  }

  try {
    let validate_api_sessions: boolean | {success: boolean, redirect_url?: string, response?: {
      data: any,
      status: number
    }} = await validateApiSessions(request);
    if(!validate_api_sessions) return new Response(null, { status: 401 });
    if(typeof validate_api_sessions === 'object' && !validate_api_sessions.success) return new Response(validate_api_sessions.response?.data, { status: validate_api_sessions.response?.status || 401 });
    if(typeof validate_api_sessions === 'object' && validate_api_sessions.redirect_url) return redirect(validate_api_sessions.redirect_url, request);


    const body = (await request.json()) as VerifyGitHubRequestBody

    if (!body?.code || typeof body.code !== "string") {
      return new Response(JSON.stringify({ error: "code is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!body?.redirectUri || typeof body.redirectUri !== "string") {
      return new Response(JSON.stringify({ error: "redirectUri is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const accessToken = await exchangeCodeForToken(body.code, body.redirectUri)
    const userInfo = await fetchGitHubUser(accessToken)
    const emails = await fetchGitHubEmails(accessToken)

    const primaryEmail =
      emails.find((email) => email.primary && email.verified)?.email ||
      emails.find((email) => email.verified)?.email ||
      emails[0]?.email ||
      userInfo.email

    return new Response(
      JSON.stringify({
        user: {
          id: String(userInfo.id),
          email: primaryEmail,
          name: userInfo.name || userInfo.login,
          picture: userInfo.avatar_url,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("GitHub verification failed:", error)
    return new Response(JSON.stringify({ error: "Failed to verify GitHub login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}


export const loader = async ({ request }: { request: Request }) => {
  return handleRedirect('/auth', request)
}