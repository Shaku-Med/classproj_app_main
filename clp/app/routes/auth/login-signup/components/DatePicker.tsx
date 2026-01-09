import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "~/components/ui/calendar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Select your date of birth",
  disabled,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date || new Date())
  const [value, setValue] = React.useState(formatDate(date))

  React.useEffect(() => {
    setValue(formatDate(date))
    if (date) {
      setMonth(date)
    } else if (!month) {
      setMonth(new Date())
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    const parsedDate = new Date(inputValue)
    if (isValidDate(parsedDate)) {
      onDateChange?.(parsedDate)
      setMonth(parsedDate)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setValue(formatDate(selectedDate))
    setOpen(false)
  }

  return (
    <div className="relative">
      <Input
        value={value}
        placeholder={placeholder}
        className="bg-background pr-10"
        onChange={handleInputChange}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
