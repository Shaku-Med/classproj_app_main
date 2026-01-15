import { Cookie } from "./cookie-parser";
import SetToken from "./Security/unsharedkeyEncryption/Combined/Verification/SetToken";
import { VerifyToken } from "./Security/unsharedkeyEncryption/Combined/Verification/VerifyToken";
import { cf_setKeys, is_authenticated_keys, isAuthenticated } from "./is_authenticated";
import { getRedirectUrl } from "./handle-redirect";
import { decrypt } from "./Security/client";
import { getClientIP } from "./Security/unsharedkeyEncryption/Combined/Verification/GetIp";
import { EnvValidator } from "./Database/EnvValidator";

interface SessionTokenProps {
  request: Request
  is_authenticated: boolean
}

interface ValidateSessionTokenProps {
  token: string
  headers: Headers
  is_authenticated: boolean
}

const makeSessionToken = async (props: SessionTokenProps, keys: string[]): Promise<{ data: string, expiresAt: string } | null> => {
  try {
    let token = await SetToken(props.request.headers, {
        expiresIn: '1h',
        algorithm: 'HS512'
      }, keys as string[])
    if(!token) return null;
    return token;
  }
  catch (error) {
    console.error(`Error found in makeSessionToken: -----> ${JSON.stringify(error)}`)
    return null;
  }
}
export const handleSessionToken = async (props: SessionTokenProps): Promise<{ data: string, expiresAt: string, valid_global_id?: boolean } | null> => {
  try {
    let global_id = Cookie.get('global_id', props.request);
    const keys = is_authenticated_keys(props.is_authenticated);
    if(!keys || keys.length === 0) return null;

    if(!global_id) {
        let token = await makeSessionToken(props, keys);
        if(!token) return null;
        return token;
    }

    const verify_Token = await VerifyToken({
        token: global_id,
        addedKeyNames: keys
    }, props.request.headers);
    if(!verify_Token) {
        let token = await makeSessionToken(props, keys);
        if(!token) return null;
        return token;
        // return null;
    };
    // return verify_Token;
    return {
        data: global_id,
        expiresAt: new Date(verify_Token?.expiresAt || '').toISOString(),
        valid_global_id: true
    };
  }
  catch (error) {
    console.error(`Error found in handleSessionToken: -----> ${JSON.stringify(error)}`)
    return null;
  }
}

export const validateSessionToken = async (token: string, headers: Headers, keys: string[]): Promise<boolean> => {
  try {
    if(!keys || keys.length === 0 || !token || !headers) return false;
    const verify_Token = await VerifyToken({
      token: token,
      addedKeyNames: keys
    }, headers);
    if(!verify_Token || typeof verify_Token !== 'object') return false;
    return true;
  }
  catch (error) {
    console.error(`Error found in validateSessionToken: -----> ${JSON.stringify(error)}`)
    return false;
  }
}


export const validateApiSessions = async (request: Request): Promise<{success: boolean, redirect_url?: string, response?: {
  data: any,
  status: number
}} | boolean> => {
  try {
    let cf = Cookie.get('_cf', request);
    let c_di = Cookie.get('_c_di', request);
    let get_client_ip = await getClientIP(request.headers);
    let cf_access_key = EnvValidator('CSRF_TOKEN');
    // authenticated users cannot access api routes
    let is_authenticated = await isAuthenticated(request);
    if(is_authenticated) return {
      success: false,
      redirect_url: getRedirectUrl('/', request),
    }

    let token = await handleSessionToken({ request, is_authenticated });
    if(!token || !cf || !c_di || !get_client_ip || !cf_access_key) return {
      success: false,
      response: {
        data: null,
        status: 401
      }
    }

    let cf_set_keys = cf_setKeys(c_di, {
      'user-agent': request.headers.get('user-agent')?.split(/\s+/)?.join('') || '',
      'ip': get_client_ip as string || ''
    });
    if(!cf_set_keys) return {
      success: false,
      response: {
        data: null,
        status: 500
      }
    }

    let validate_cf = decrypt(cf, `${cf_set_keys}`) as {
      expires_at: string,
      data: string,
      access_key: string,
    } | null;

    if(!validate_cf || typeof validate_cf !== 'object') return {
      success: false,
      response: {
        data: null,
        status: 401
      }
    }

    let expires_at = new Date(validate_cf.expires_at || '').toISOString();
    let access_key_match = validate_cf.access_key === cf_access_key;
    let data_match = validate_cf.data === c_di;

    if((expires_at < new Date().toISOString()) || !access_key_match || !data_match) return {
      success: false,
      response: {
        data: null,
        status: 401
      }
    }

    return true
  }
  catch (error) {
    console.error(`Error found in validateApiSessions: -----> ${JSON.stringify(error)}`)
    return false;
  }
}