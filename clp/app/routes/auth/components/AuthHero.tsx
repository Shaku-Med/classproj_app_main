import { useEffect, useState } from "react"
import { getTimeBasedGreeting } from "../lib/greetings"
import { getTodayHoliday } from "../lib/holidays"
import { formatTime } from "../lib/time"

const AuthHero = () => {
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()))
  const [greeting, setGreeting] = useState<string>(getTimeBasedGreeting())
  const [holiday, setHoliday] = useState(getTodayHoliday())

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      const now = new Date()
      setCurrentTime(formatTime(now))
      setGreeting(getTimeBasedGreeting())
      setHoliday(getTodayHoliday())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  return (
    <div className="relative h-full w-full flex items-center overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" /> */}
      
      <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-6 lg:py-12 text-left w-full">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-2 sm:mb-3">
              {greeting} <br /> <span className={` text-primary`}>
              Welcome to CLP
              </span>
            </h1>
            {holiday && (
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary font-medium">
                {holiday.greeting}
              </p>
            )}
          </div>
          
          <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-border/50">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-mono text-foreground font-semibold tracking-wide">
              {currentTime}
            </p>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-6 sm:mt-8 lg:mt-10 max-w-xs sm:max-w-sm leading-relaxed opacity-80">
          Sign in to continue to your account
        </p>
      </div>
    </div>
  )
}

export default AuthHero
