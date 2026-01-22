import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react"

export type Screen = {
  id: string
  title: string
  component: ReactNode
}

type StackNavigatorContextType = {
  stack: Screen[]
  push: (screen: Screen) => void
  pop: () => void
  reset: () => void
  currentScreen: Screen | null
  canGoBack: boolean
  direction: "push" | "pop" | null
  isAnimating: boolean
}

const StackNavigatorContext = createContext<StackNavigatorContextType | null>(null)

export function useStackNavigator() {
  const context = useContext(StackNavigatorContext)
  if (!context) {
    throw new Error("useStackNavigator must be used within a StackNavigatorProvider")
  }
  return context
}

type StackNavigatorProviderProps = {
  children: ReactNode
  initialScreen?: Screen
}

export function StackNavigatorProvider({ children, initialScreen }: StackNavigatorProviderProps) {
  const [stack, setStack] = useState<Screen[]>(initialScreen ? [initialScreen] : [])
  const [direction, setDirection] = useState<"push" | "pop" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const push = useCallback((screen: Screen) => {
    setDirection("push")
    setIsAnimating(true)
    setStack((prev) => [...prev, screen])
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
      setDirection(null)
    }, 300)
  }, [])

  const pop = useCallback(() => {
    if (stack.length <= 1) return
    
    setDirection("pop")
    setIsAnimating(true)
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setStack((prev) => prev.slice(0, -1))
      setIsAnimating(false)
      setDirection(null)
    }, 300)
  }, [stack.length])

  const reset = useCallback(() => {
    setDirection("pop")
    setIsAnimating(true)
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setStack(initialScreen ? [initialScreen] : [])
      setIsAnimating(false)
      setDirection(null)
    }, 300)
  }, [initialScreen])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const currentScreen = stack[stack.length - 1] ?? null
  const canGoBack = stack.length > 1

  return (
    <StackNavigatorContext.Provider
      value={{ stack, push, pop, reset, currentScreen, canGoBack, direction, isAnimating }}
    >
      {children}
    </StackNavigatorContext.Provider>
  )
}

export function StackNavigatorConsumer({ children }: { children: (context: StackNavigatorContextType) => ReactNode }) {
  return (
    <StackNavigatorContext.Consumer>
      {(context) => {
        if (!context) {
          throw new Error("StackNavigatorConsumer must be used within a StackNavigatorProvider")
        }
        return children(context)
      }}
    </StackNavigatorContext.Consumer>
  )
}
