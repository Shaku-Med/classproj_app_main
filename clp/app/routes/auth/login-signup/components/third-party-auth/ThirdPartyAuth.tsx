import GoogleButton from "./GoogleButton"
import GitHubButton from "./GitHubButton"
import { useAuth } from "../../../lib/Context"
import { Loader2 } from "lucide-react"
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
          <>
            <GoogleButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
            <GitHubButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
          </>
        ): (
          <div className="flex gap-3 justify-center items-center w-full border rounded-md p-2">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )
      }
    </div>
  )
}

export default ThirdPartyAuth
