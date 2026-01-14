import LoginForm from "./components/LoginForm"

export const loader = async ({request}: {request: Request}) => {
  try {
    
  }
  catch (error) {
    console.error(error)
    return null;
  }
}

const LoginSignup = () => {
  return (
    <LoginForm />
  )
}

export default LoginSignup