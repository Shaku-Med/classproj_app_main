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
    const body = (await request.json()) as VerifyGoogleRequestBody

    if (!body?.accessToken || typeof body.accessToken !== "string") {
      return new Response(JSON.stringify({ error: "accessToken is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const userInfo = await fetchGoogleUserInfo(body.accessToken)

    // TODO: Integrate with your user system:
    // - Find or create a local user record using userInfo.email / userInfo.id
    // - Create a session / issue your own JWT
    // - Attach session cookie to the response

    return new Response(
      JSON.stringify({
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Google verification failed:", error)
    return new Response(JSON.stringify({ error: "Failed to verify Google login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}