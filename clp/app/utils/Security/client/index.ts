import { Aes256GcmEncryptor } from "./encryptor";
import { Pbkdf2KeyDeriver } from "./key-driver";
import { JsonDataSerializer } from "./serializer";
import type { Encryptor } from "./types";

export function createEncryptor(): Encryptor {
  const keyDeriver = new Pbkdf2KeyDeriver();
  const serializer = new JsonDataSerializer();
  return new Aes256GcmEncryptor(keyDeriver, serializer);
}

const defaultEncryptor = createEncryptor();

export function encrypt(data: string | object, key: string): string {
  return defaultEncryptor.encrypt(data, key);
}

export function decrypt(encryptedData: string, key: string): string | object {
  return defaultEncryptor.decrypt(encryptedData, key);
}

export { Aes256GcmEncryptor } from "./encryptor";
export { Pbkdf2KeyDeriver } from "./key-driver";
export { JsonDataSerializer } from "./serializer";
export * from "./types";