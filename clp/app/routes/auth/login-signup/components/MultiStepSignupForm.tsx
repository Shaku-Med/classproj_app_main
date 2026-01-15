import { useState } from "react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import ThirdPartyAuth from "./third-party-auth/ThirdPartyAuth"
import Divider from "./Divider"
import StepIndicator from "./multi-step/StepIndicator"
import Step1BasicInfo from "./multi-step/Step1BasicInfo"
import Step2Username from "./multi-step/Step2Username"
import Step3DateOfBirth from "./multi-step/Step3DateOfBirth"
import Step4AdditionalInfo from "./multi-step/Step4AdditionalInfo"
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
  validateDateOfBirth,
  validateFirstName,
  validateMiddleName,
  validateLastName,
} from "../utils/validation"
import { useAuth } from "../../lib/Context"
import { Loader2 } from "lucide-react"

const TOTAL_STEPS = 4

const MultiStepSignupForm = () => {
  const { active } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")

  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>()
  const [usernameError, setUsernameError] = useState<string | undefined>()
  const [dateOfBirthError, setDateOfBirthError] = useState<string | undefined>()
  const [firstNameError, setFirstNameError] = useState<string | undefined>()
  const [middleNameError, setMiddleNameError] = useState<string | undefined>()
  const [lastNameError, setLastNameError] = useState<string | undefined>()

  const handleEmailChange = (value: string) => {
    setEmail(value)
    const validation = validateEmail(value)
    setEmailError(validation.error)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const validation = validatePassword(value)
    setPasswordError(validation.error)
    if (confirmPassword) {
      const matchValidation = validatePasswordMatch(value, confirmPassword)
      setConfirmPasswordError(matchValidation.error)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    const validation = validatePasswordMatch(password, value)
    setConfirmPasswordError(validation.error)
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    const validation = validateUsername(value)
    setUsernameError(validation.error)
  }

  const handleDateOfBirthChange = (date: Date | undefined) => {
    setDateOfBirth(date)
    const validation = validateDateOfBirth(date)
    setDateOfBirthError(validation.error)
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
    const validation = validateFirstName(value)
    setFirstNameError(validation.error)
  }

  const handleMiddleNameChange = (value: string) => {
    setMiddleName(value)
    const validation = validateMiddleName(value)
    setMiddleNameError(validation.error)
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
    const validation = validateLastName(value)
    setLastNameError(validation.error)
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === TOTAL_STEPS) {
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: {
        const emailValidation = validateEmail(email)
        const passwordValidation = validatePassword(password)
        const matchValidation = validatePasswordMatch(password, confirmPassword)
        return (
          emailValidation.isValid &&
          passwordValidation.isValid &&
          matchValidation.isValid
        )
      }
      case 2: {
        const validation = validateUsername(username)
        return validation.isValid
      }
      case 3: {
        const validation = validateDateOfBirth(dateOfBirth)
        return validation.isValid
      }
      case 4: {
        const firstNameValidation = validateFirstName(firstName)
        const middleNameValidation = validateMiddleName(middleName)
        const lastNameValidation = validateLastName(lastName)
        return (
          firstNameValidation.isValid &&
          middleNameValidation.isValid &&
          lastNameValidation.isValid
        )
      }
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create your account"
      case 2:
        return "Choose a username"
      case 3:
        return "Tell us about yourself"
      case 4:
        return "Complete your profile"
      default:
        return "Sign up"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter your email and create a secure password"
      case 2:
        return "Pick a unique username for your account"
      case 3:
        return "We need to verify your age"
      case 4:
        return "Add some additional information to complete your profile"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full border-none shadow-none rounded-none">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-3xl font-bold">{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {currentStep === 1 && (
          <>
            <ThirdPartyAuth />
            <Divider />
          </>
        )}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <Step1BasicInfo
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              emailError={emailError}
              passwordError={passwordError}
              confirmPasswordError={confirmPasswordError}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onConfirmPasswordChange={handleConfirmPasswordChange}
            />
          )}
          {currentStep === 2 && (
            <Step2Username
              username={username}
              usernameError={usernameError}
              onUsernameChange={handleUsernameChange}
            />
          )}
          {currentStep === 3 && (
            <Step3DateOfBirth
              dateOfBirth={dateOfBirth}
              dateOfBirthError={dateOfBirthError}
              onDateOfBirthChange={handleDateOfBirthChange}
            />
          )}
          {currentStep === 4 && (
            <Step4AdditionalInfo
              firstName={firstName}
              middleName={middleName}
              lastName={lastName}
              firstNameError={firstNameError}
              middleNameError={middleNameError}
              lastNameError={lastNameError}
              onFirstNameChange={handleFirstNameChange}
              onMiddleNameChange={handleMiddleNameChange}
              onLastNameChange={handleLastNameChange}
            />
          )}
          {
            active ? (
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 border-2"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 border-2"
                    size="lg"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed()}
                    className="flex-1 border-2"
                    size="lg"
                  >
                    Create account
                  </Button>
                )}
              </div>
            ): (
              <div className="flex gap-3 justify-center items-center w-full border rounded-md p-2">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            )
          }
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MultiStepSignupForm
