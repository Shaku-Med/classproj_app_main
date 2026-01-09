import { Button } from "~/components/ui/button"
import { Github } from "lucide-react"

interface GitHubButtonProps {
  disabled?: boolean
  setIsThirdPartyAuth?: (value: boolean) => void
}

const GitHubButton = ({ disabled, setIsThirdPartyAuth }: GitHubButtonProps) => {
  const handleClick = () => {
    if (disabled) return
    setIsThirdPartyAuth?.(true)
  }

  return (
    <Button
      type="button"
      variant={`outline`}
      className={`w-full`}
      onClick={handleClick}
      disabled={disabled}
    >
      <Github className="size-5" />
      Continue with GitHub
    </Button>
  )
}

export default GitHubButton
