import { useState } from "react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import ThirdPartyAuth from "./third-party-auth/ThirdPartyAuth"
import Divider from "./Divider"
import { validateEmail } from "../utils/validation"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [isThirdPartyAuth, setIsThirdPartyAuth] = useState(false)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    const validation = validateEmail(value)
    setEmailError(validation.error)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (!value) {
      setPasswordError("Password is required")
    } else {
      setPasswordError(undefined)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error)
    }
    if (!password) {
      setPasswordError("Password is required")
    }
    if (emailValidation.isValid && password) {
    }
  }

  return (
    <div className="space-y-6 w-full">
      <ThirdPartyAuth disabled={isThirdPartyAuth} setIsThirdPartyAuth={setIsThirdPartyAuth} />
      <Divider />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            disabled={isThirdPartyAuth}
            className={emailError ? "border-destructive" : ""}
          />
          {emailError && (
            <p className="text-xs text-destructive">{emailError}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button
              type="button"
              className="text-xs sm:text-sm text-primary hover:underline"
              disabled={isThirdPartyAuth}
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            disabled={isThirdPartyAuth}
            className={passwordError ? "border-destructive" : ""}
          />
          {passwordError && (
            <p className="text-xs text-destructive">{passwordError}</p>
          )}
        </div>
        <Button type="submit" className="w-full border-2" size="lg" disabled={isThirdPartyAuth}>
          Continue with email
        </Button>
        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
