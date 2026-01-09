import GoogleButton from "./GoogleButton"
import GitHubButton from "./GitHubButton"

interface ThirdPartyAuthProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

const ThirdPartyAuth = ({ disabled, setIsThirdPartyAuth }: ThirdPartyAuthProps) => {
  return (
    <div className="space-y-3">
      <GoogleButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
      <GitHubButton disabled={disabled} setIsThirdPartyAuth={setIsThirdPartyAuth} />
    </div>
  )
}

export default ThirdPartyAuth
