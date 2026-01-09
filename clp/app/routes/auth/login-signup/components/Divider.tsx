interface DividerProps {
  text?: string
}

const Divider = ({ text = "Or continue with" }: DividerProps) => {
  return (
    <div className="relative my-6 flex items-center gap-2">
      <div className="border w-full" />
      <div className="relative min-w-fit flex justify-center">
        <span className="bg-card px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide border border-border rounded-md py-1">
          {text}
        </span>
      </div>
      <div className="border w-full" />
    </div>
  )
}

export default Divider
