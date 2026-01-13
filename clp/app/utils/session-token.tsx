import { Cookie } from "./cookie-parser";
import SetToken from "./Security/unsharedkeyEncryption/Combined/Verification/SetToken";
import { VerifyToken } from "./Security/unsharedkeyEncryption/Combined/Verification/VerifyToken";

interface SessionTokenProps {
  request: Request
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
    console.error(`Error found in makeSessionToken: -----> \n`, error)
    return null;
  }
}
export const handleSessionToken = async (props: SessionTokenProps): Promise<{ data: string, expiresAt: string, valid_global_id?: boolean } | null> => {
  try {
    let global_id = Cookie.get('global_id', props.request);
    const keys = props.is_authenticated ? ['authenticated_session_token', `auth_token`] : ['session_token']
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
    console.error(`Error found in handleSessionToken: -----> \n`, error)
    return null;
  }
}