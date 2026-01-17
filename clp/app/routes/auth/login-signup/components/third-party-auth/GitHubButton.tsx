import { Button } from "~/components/ui/button"
import { Github } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { log } from "~/utils/log"

interface GitHubButtonProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

const GitHubButton = ({ disabled, setIsThirdPartyAuth }: GitHubButtonProps) => {
  const handledCallbackRef = useRef(false)
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ""
  const [errorMessage, setErrorMessage] = useState("")

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
      let redirected = false
      try {
        const response = await fetch("/api/auth/third-party/verify-github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirectUri }),
        })

        if (!response.ok) {
          setErrorMessage("GitHub sign-in failed. Please try again.")
          return
        }

        const data = await response.json()
 
        if (data?.access_token) {
          const token = encodeURIComponent(String(data.access_token))
          redirected = true
          window.location.assign(`/auth/thirdparty?access_token=${token}`)
          return
        }

        window.location.reload()

        setIsThirdPartyAuth?.(true)
      } catch (error) {
        setErrorMessage("GitHub sign-in failed. Please try again.")
        log({
          type: "error",
          message: "GitHub login error",
          error: error instanceof Error ? error : new Error(String(error)),
        })
      } finally {
        if (redirected) {
          return
        }
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
    <>
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
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  )
}

export default GitHubButton
