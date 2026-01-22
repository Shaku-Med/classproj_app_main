import GoogleButton from "./GoogleButton"
import GitHubButton from "./GitHubButton"
import { useAuth } from "../../../lib/Context"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
interface ThirdPartyAuthProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

const ThirdPartyAuth = ({ disabled, setIsThirdPartyAuth }: ThirdPartyAuthProps) => {
  const { active } = useAuth()
  return (
    <div className="space-y-3">
      {
        active ? (
          <div className="space-y-4 rounded-lg border border-border/60 bg-card/50 p-4 shadow-sm">
            <div className="space-y-1 text-center">
              <h2 className="text-base font-semibold text-foreground">Continue with</h2>
              <p className="text-sm text-muted-foreground">Use a trusted provider to sign in quickly.</p>
            </div>
            <div className="space-y-3">
              <GoogleButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
              <GitHubButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
            </div>
          </div>
        ) : (
          <div className="flex gap-3 justify-center items-center w-full border rounded-md p-2">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )
      }
    </div>
  )
}

export default ThirdPartyAuth
