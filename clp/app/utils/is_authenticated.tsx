export const isAuthenticated = async (request: Request): Promise<boolean> => {
  try {
    return false;
  }
  catch (error) {
    console.error(`Error found in isAuthenticated:`, error)
    return false;
  }
}

export const is_development = () => {
  return process.env.NODE_ENV === 'development';
}
