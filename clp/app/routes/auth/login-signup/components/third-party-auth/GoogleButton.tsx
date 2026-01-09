import { ChromeIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useEffect, useRef } from "react"

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
        throw new Error("Failed to verify Google login")
      }

      const data = await backendResponse.json()
      console.log("Google Login Data (from backend):", data)

      setIsThirdPartyAuth?.(true)
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const handleClick = () => {
    if (disabled) return

    if (!scriptLoaded.current) {
      console.error("Google Identity Services script not loaded")
      return
    }

    if (!tokenClientRef.current) {
      initializeGoogleAuth()
    }

    tokenClientRef.current?.requestAccessToken()
  }

  return (
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
  )
}

export default GoogleButton
