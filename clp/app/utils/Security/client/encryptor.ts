import { createCipheriv, createDecipheriv, randomBytes, type CipherGCM, type DecipherGCM } from "crypto";
import type { Encryptor, EncryptedPayload, KeyDeriver, DataSerializer } from "./types";

export class Aes256GcmEncryptor implements Encryptor {
  private readonly keyDeriver: KeyDeriver;
  private readonly serializer: DataSerializer;
  private readonly algorithm = "aes-256-gcm" as const;
  private readonly ivLength: number = 16;

  constructor(keyDeriver: KeyDeriver, serializer: DataSerializer) {
    this.keyDeriver = keyDeriver;
    this.serializer = serializer;
  }

  encrypt(data: string | object, key: string): string {
    const serializedData = this.serializer.serialize(data);
    const salt = randomBytes(32);
    const derivedKey = this.keyDeriver.deriveKey(key, salt);
    const iv = randomBytes(this.ivLength);

    const cipher = createCipheriv(this.algorithm, derivedKey, iv) as CipherGCM;

    const encrypted = Buffer.concat([
      cipher.update(serializedData, "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    const payload: EncryptedPayload = {
      iv: iv.toString("base64"),
      salt: salt.toString("base64"),
      tag: tag.toString("base64"),
      data: encrypted.toString("base64"),
    };

    return Buffer.from(JSON.stringify(payload)).toString("base64");
  }

  decrypt(encryptedData: string, key: string): string | object {
    const payloadJson = Buffer.from(encryptedData, "base64").toString("utf8");
    const payload: EncryptedPayload = JSON.parse(payloadJson);

    const iv = Buffer.from(payload.iv, "base64");
    const salt = Buffer.from(payload.salt, "base64");
    const tag = Buffer.from(payload.tag, "base64");
    const data = Buffer.from(payload.data, "base64");

    const derivedKey = this.keyDeriver.deriveKey(key, salt);

    const decipher = createDecipheriv(this.algorithm, derivedKey, iv) as DecipherGCM;
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return this.serializer.deserialize(decrypted.toString("utf8"));
  }
}