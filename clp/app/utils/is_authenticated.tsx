export const isAuthenticated = async (request: Request) => {
  try {
    console.log("Is Authenticated")
  }
  catch (error) {
    console.error(error)
    return false;
  }
}