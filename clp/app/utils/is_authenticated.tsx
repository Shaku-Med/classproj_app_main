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

export const is_authenticated_keys = (is_authenticated: boolean): string[] => {
  return is_authenticated ? ['authenticated_session_token', `auth_token`] : ['session_token']
}

export const cf_setKeys = (_di: string, validate_token: {['user-agent']: string, ['ip']: string}): string | null => {
  if(!_di || !validate_token?.['user-agent']?.trim() || !validate_token?.['ip']?.trim()) return null;
  return `${_di}+${validate_token?.['user-agent']}+${validate_token?.['ip']}`
}