export interface Encryptor {
    encrypt(data: string | object, key: string): string;
    decrypt(encryptedData: string, key: string): string | object;
  }
  
  export interface KeyDeriver {
    deriveKey(password: string, salt: Buffer): Buffer;
  }
  
  export interface DataSerializer {
    serialize(data: string | object): string;
    deserialize(data: string): string | object;
  }
  
  export interface EncryptedPayload {
    iv: string;
    salt: string;
    tag: string;
    data: string;
  }