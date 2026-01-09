import { Link, type MetaFunction } from "react-router"

export const meta: MetaFunction = () => {
  return [
    { title: "Error | CLP" },
    { name: "description", content: "You are seeing this page cuz we do not want you to access a broken page" },
  ]
}

const ErrorPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-destructive/3 to-transparent" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive/10 border border-destructive/20">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Why am I here?
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              You are seeing this page cuz we do not want you to access a broken page
            </p>
          </div>
        </div>
        
        <div className="pt-4 sm:pt-6 border-t border-border/50 w-full">
          <p className="text-sm sm:text-base text-muted-foreground/80 mb-6 sm:mb-8">
            We redirected you here to prevent you from encountering a broken or inaccessible page.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Go to Sign In
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage