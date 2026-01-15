import { pbkdf2Sync, randomBytes } from "crypto";
import type { KeyDeriver } from "./types";

export class Pbkdf2KeyDeriver implements KeyDeriver {
  private readonly iterations: number;
  private readonly keyLength: number;
  private readonly digest: string;

  constructor(iterations: number = 100000, keyLength: number = 32, digest: string = "sha256") {
    this.iterations = iterations;
    this.keyLength = keyLength;
    this.digest = digest;
  }

  deriveKey(password: string, salt: Buffer): Buffer {
    return pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);
  }

  generateSalt(length: number = 32): Buffer {
    return randomBytes(length);
  }
}