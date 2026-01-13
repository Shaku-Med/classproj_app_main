export const isAuthenticated = async (request: Request): Promise<boolean> => {
  try {
    console.log("Is Authenticated")
    return true;
  }
  catch (error) {
    console.error(`Error found in isAuthenticated:`, error)
    return false;
  }
}