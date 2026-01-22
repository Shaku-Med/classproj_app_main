import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="w-full">
      {activeTab === "login" ? (
        <LoginForm />
      ) : (
        <SignupForm />
      )}
    </div>
  )
}

export default AuthTabs
