import { EncryptCombine } from '../Combined';
import { getClientIP } from './GetIp';
import { getExpirationDate } from './ExpirationTime';
import { buildKeyNames, getAllKeys } from './TokenKeys';
import { log } from '../../../../log'
import { is_development } from '~/utils/is_authenticated';

type TokenOptions = {
    expiresIn?: string;
    algorithm?: string;
    skipExpiration?: boolean;
}

const getNeverExpireDate = () => {
    const date = new Date();
    date.setUTCFullYear(date.getUTCFullYear() + 100);
    return date;
}

const SetToken = async (headers: Headers, options?: TokenOptions, addKeyNames?: any[], addData?: object, setUA?: boolean) => {
  try {
        let h = headers as unknown as Headers
        let gip = await getClientIP(h)
        //
        if(!gip) return null;
        let o = {
            'sec-ch-ua-platform': h.get('sec-ch-ua-platform') || is_development() ? "mobile" : null,
            'user-agent': h.get('user-agent')?.split(/\s+/)?.join(''),
            'x-forwarded-for': gip
        }
        // console.log('o', o);
        let obj: any = {
            ip: gip,
            ...o
        }
        // 
        if(addData){
            obj = {
                ...obj,
                ...addData
            }
        }
        // 

        if(Object.values(obj).some(value => value === null || value === undefined || value === '')) return null;
        const keyNames = buildKeyNames(['token1', 'token2', ...addKeyNames || []]);
        const encryptionKeys = await getAllKeys(keyNames);
        if(!encryptionKeys) return null;

        const expirationDate = options?.skipExpiration
            ? getNeverExpireDate()
            : getExpirationDate(options?.expiresIn)
        obj = {
            ...obj,
            expiresAt: expirationDate.toISOString()
        }

        const jwtOptions = options?.skipExpiration
            ? { algorithm: options?.algorithm || 'HS512' }
            : options || {
                expiresIn: '6m',
                algorithm: 'HS512'
            }
        let enc2 = await EncryptCombine(obj, encryptionKeys, jwtOptions)
        if(!enc2) return null;
        return {
            data: enc2,
            expiresAt: expirationDate.toISOString()
        }
  }
  catch (e) {
    log({
        type: 'error',
        message: 'Error Found in SetToken',
        error: e instanceof Error ? e : new Error(String(e)),
    })
    return null
  }
}

export default SetToken