import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface Step1BasicInfoProps {
  email: string
  password: string
  confirmPassword: string
  emailError?: string
  passwordError?: string
  confirmPasswordError?: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
}

const Step1BasicInfo = ({
  email,
  password,
  confirmPassword,
  emailError,
  passwordError,
  confirmPasswordError,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: Step1BasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="step1-email">Email</Label>
        <Input
          id="step1-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className={emailError ? "border-destructive" : ""}
        />
        {emailError && (
          <p className="text-xs text-destructive">{emailError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="step1-password">Password</Label>
        <Input
          id="step1-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className={passwordError ? "border-destructive" : ""}
        />
        {passwordError && (
          <p className="text-xs text-destructive">{passwordError}</p>
        )}
        {!passwordError && password && (
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="step1-confirm-password">Confirm Password</Label>
        <Input
          id="step1-confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          className={confirmPasswordError ? "border-destructive" : ""}
        />
        {confirmPasswordError && (
          <p className="text-xs text-destructive">{confirmPasswordError}</p>
        )}
      </div>
    </div>
  )
}

export default Step1BasicInfo
