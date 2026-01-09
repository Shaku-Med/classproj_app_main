import { Label } from "~/components/ui/label"
import DatePicker from "../DatePicker"

interface Step3DateOfBirthProps {
  dateOfBirth: Date | undefined
  dateOfBirthError?: string
  onDateOfBirthChange: (date: Date | undefined) => void
}

const Step3DateOfBirth = ({
  dateOfBirth,
  dateOfBirthError,
  onDateOfBirthChange,
}: Step3DateOfBirthProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <DatePicker
          date={dateOfBirth}
          onDateChange={onDateOfBirthChange}
          placeholder="Select your date of birth"
        />
        {dateOfBirthError && (
          <p className="text-xs text-destructive">{dateOfBirthError}</p>
        )}
        {!dateOfBirthError && (
          <p className="text-xs text-muted-foreground">
            You must be at least 13 years old to create an account
          </p>
        )}
      </div>
    </div>
  )
}

export default Step3DateOfBirth
