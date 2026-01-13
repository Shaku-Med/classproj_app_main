import { encrypt, decrypt } from '../../Algorithm';

const isServerEnvironment = (): boolean => {
    try {
        return typeof process !== 'undefined' && 
               process.versions != null && 
               process.versions.node != null &&
               typeof Buffer !== 'undefined';
    } catch {
        return false;
    }
};

let jwt: any = null;
let jwtLoadAttempted = false;

const getJWT = async () => {
    if (jwt !== null) return jwt;
    
    if (jwtLoadAttempted) return null;
    jwtLoadAttempted = true;
    
    if (!isServerEnvironment()) {
        console.error('JWT operations require server environment');
        return null;
    }
    
    try {
        const jwtModule = await import('jsonwebtoken');
        jwt = jwtModule.default || jwtModule;
        return jwt;
    } catch (error: any) {
        console.error('Failed to load jsonwebtoken:', error?.message || error);
        return null;
    }
};

export const EncryptCombine = async (data: any, keys: any[], options?: object) => {
    try {
        if (!isServerEnvironment()) {
            console.error('EncryptCombine requires server environment');
            return null;
        }

        const jwtModule = await getJWT();
        if (!jwtModule) {
            return null;
        }

        let encryptedData = typeof data === 'object' ? JSON.stringify(data) : data;
        
        if (!keys || keys.length === 0) {
            return null;
        }
        
        for (let i = 0; i < keys.length - 1; i++) {
            if(typeof keys[i] === 'string') {
                encryptedData = await encrypt(encryptedData, keys[i]);
            }
            else {
                encryptedData = null
            }
        }

        if(!encryptedData) return null;
        const finalKey = keys[keys.length - 1];
        const jwtToken = jwtModule.sign({ data: encryptedData }, finalKey, options || {
            algorithm: 'HS512',
        });
        
        return jwtToken;
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

export const DecryptCombine = async (data: any, keys: any[], options?: object) => {
    try {
        if (!isServerEnvironment()) {
            console.error('DecryptCombine requires server environment');
            return null;
        }

        const jwtModule = await getJWT();
        if (!jwtModule) {
            return null;
        }

        if(!data) return null;
        let encryptedData = typeof data === 'object' ? JSON.stringify(data) : data;
        
        if (!keys || keys.length === 0) {
            return null;
        }
        
        const finalKey = keys[keys.length - 1];
        const decoded: any = jwtModule.verify(encryptedData, finalKey, options || {});
        
        let decryptedData = decoded?.data;
        
        for (let i = keys.length - 2; i >= 0; i--) {
            if(typeof keys[i] === 'string') {
                decryptedData = await decrypt(decryptedData, keys[i]);
            }
            else {
                decryptedData = null
            }
        }

        if(!decryptedData) return null;
        
        try {
            return JSON.parse(decryptedData);
        } catch {
            return decryptedData;
        }
    } catch (e: any) {
        console.error("Decryption failed:", e);
        return e?.toString()?.includes('expired') ? undefined : null;
    }
};