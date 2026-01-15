import { Button } from "~/components/ui/button"
import { Github } from "lucide-react"
import { useEffect, useRef } from "react"

interface GitHubButtonProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

const GitHubButton = ({ disabled, setIsThirdPartyAuth }: GitHubButtonProps) => {
  const handledCallbackRef = useRef(false)
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ""

  useEffect(() => {
    if (handledCallbackRef.current) return
    if (typeof window === "undefined") return

    const url = new URL(window.location.href)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (!code || state !== "github") return
    handledCallbackRef.current = true

    const redirectUri = `${window.location.origin}${window.location.pathname}`

    const handleCallback = async () => {
      try {
        const response = await fetch("/api/auth/third-party/verify-github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirectUri }),
        })

        if (!response.ok) {
          throw new Error("Failed to verify GitHub login")
        }

        const data = await response.json()
        console.log("GitHub Login Data (from backend):", data)
        setIsThirdPartyAuth?.(true)
      } catch (error) {
        console.error("GitHub login error:", error)
      } finally {
        url.searchParams.delete("code")
        url.searchParams.delete("state")
        url.searchParams.delete("scope")
        window.history.replaceState({}, "", url.toString())
      }
    }

    handleCallback()
  }, [])

  const handleClick = () => {
    if (disabled) return
    if (!GITHUB_CLIENT_ID) return

    const redirectUri = `${window.location.origin}${window.location.pathname}`
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state: "github",
    })
    window.location.assign(`https://github.com/login/oauth/authorize?${params.toString()}`)
  }

  return (
    <Button
      type="button"
      variant={`outline`}
      className={`w-full`}
      onClick={handleClick}
      disabled={disabled || !GITHUB_CLIENT_ID}
    >
      <Github className="size-5" />
      Continue with GitHub
    </Button>
  )
}

export default GitHubButton
