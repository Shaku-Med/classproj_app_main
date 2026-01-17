import { ChromeIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { log } from "~/utils/log"

interface GoogleButtonProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

type TokenClient = {
  requestAccessToken: () => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string }) => void
          }) => TokenClient
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const GoogleButton = ({ disabled, setIsThirdPartyAuth }: GoogleButtonProps) => {
  const scriptLoaded = useRef(false)
  const tokenClientRef = useRef<TokenClient | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (scriptLoaded.current || !GOOGLE_CLIENT_ID) return

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      scriptLoaded.current = true
      initializeGoogleAuth()
    }
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const initializeGoogleAuth = () => {
    if (!window.google || !GOOGLE_CLIENT_ID) return

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      callback: handleTokenResponse,
    })
  }

  const handleTokenResponse = async (response: { access_token: string }) => {
    try {
      const backendResponse = await fetch("/api/auth/third-party/verify-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: response.access_token }),
      })

      if (!backendResponse.ok) {
        setErrorMessage("Google sign-in failed. Please try again.")
        return
      }

      const data = await backendResponse.json()

      if (data?.access_token) {
        const token = encodeURIComponent(String(data.access_token))
        window.location.assign(`/auth/thirdparty?access_token=${token}`)
        return
      }

      // reload the page when success
      window.location.reload()

      setIsThirdPartyAuth?.(true)
    } catch (error) {
      setErrorMessage("Google sign-in failed. Please try again.")
      log({
        type: "error",
        message: "Google login error",
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }

  const handleClick = () => {
    if (disabled) return

    if (!scriptLoaded.current) {
      log({
        type: "warning",
        message: "Google Identity Services script not loaded",
      })
      return
    }

    if (!tokenClientRef.current) {
      initializeGoogleAuth()
    }

    tokenClientRef.current?.requestAccessToken()
  }

  return (
    <>
      <Button
        type="button"
        variant={`outline`}
        className={`w-full`}
        onClick={handleClick}
        disabled={disabled || !GOOGLE_CLIENT_ID}
      >
        <ChromeIcon className="size-5"  />
        Continue with Google
      </Button>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  )
}

export default GoogleButton
