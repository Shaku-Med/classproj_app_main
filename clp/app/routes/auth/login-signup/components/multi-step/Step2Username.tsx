import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface Step2UsernameProps {
  username: string
  usernameError?: string
  onUsernameChange: (value: string) => void
}

const Step2Username = ({ username, usernameError, onUsernameChange }: Step2UsernameProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="step2-username">Username</Label>
        <Input
          id="step2-username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className={usernameError ? "border-destructive" : ""}
        />
        {usernameError && (
          <p className="text-xs text-destructive">{usernameError}</p>
        )}
        {!usernameError && (
          <p className="text-xs text-muted-foreground">
            Must be 3-30 characters, start with a letter, and can contain letters, numbers, and these special characters: _, -, .
          </p>
        )}
      </div>
    </div>
  )
}

export default Step2Username
