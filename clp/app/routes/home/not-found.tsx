import { redirect } from "react-router";

export const loader = () => {
    return redirect('/', 302);
}

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Page not found</p>
    </div>
  )
}

export default NotFound