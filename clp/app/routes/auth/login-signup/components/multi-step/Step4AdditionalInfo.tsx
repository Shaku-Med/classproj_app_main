import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface Step4AdditionalInfoProps {
  firstName: string
  middleName: string
  lastName: string
  firstNameError?: string
  middleNameError?: string
  lastNameError?: string
  onFirstNameChange: (value: string) => void
  onMiddleNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
}

const Step4AdditionalInfo = ({
  firstName,
  middleName,
  lastName,
  firstNameError,
  middleNameError,
  lastNameError,
  onFirstNameChange,
  onMiddleNameChange,
  onLastNameChange,
}: Step4AdditionalInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="step4-firstname">First Name</Label>
        <Input
          id="step4-firstname"
          type="text"
          placeholder="John"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          required
          className={firstNameError ? "border-destructive" : ""}
        />
        {firstNameError && (
          <p className="text-xs text-destructive">{firstNameError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="step4-middlename">Middle Name (Optional)</Label>
        <Input
          id="step4-middlename"
          type="text"
          placeholder="Michael"
          value={middleName}
          onChange={(e) => onMiddleNameChange(e.target.value)}
          className={middleNameError ? "border-destructive" : ""}
        />
        {middleNameError && (
          <p className="text-xs text-destructive">{middleNameError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="step4-lastname">Last Name</Label>
        <Input
          id="step4-lastname"
          type="text"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          required
          className={lastNameError ? "border-destructive" : ""}
        />
        {lastNameError && (
          <p className="text-xs text-destructive">{lastNameError}</p>
        )}
      </div>
    </div>
  )
}

export default Step4AdditionalInfo
