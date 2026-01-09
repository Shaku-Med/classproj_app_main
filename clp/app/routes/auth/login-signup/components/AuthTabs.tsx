import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="w-full">
      {activeTab === "login" ? (
        <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
      ) : (
        <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
      )}
    </div>
  )
}

export default AuthTabs
