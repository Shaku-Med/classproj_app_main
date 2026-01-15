import { createHash } from "crypto";

type QuickAuthRecord = {
  expiresAt: number;
  used: boolean;
};

class QuickAuthReplayStore {
  private records = new Map<string, QuickAuthRecord>();

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  register(token: string, expiresAtIso: string): void {
    if (!token || !expiresAtIso) return;
    const key = this.hashToken(token);
    const expiresAt = new Date(expiresAtIso).getTime();
    if (Number.isNaN(expiresAt)) return;
    this.records.set(key, { expiresAt, used: false });
  }

  consume(token: string): boolean {
    if (!token) return false;
    const key = this.hashToken(token);
    const record = this.records.get(key);
    if (!record) return false;
    const now = Date.now();
    if (record.used || now > record.expiresAt) {
      this.records.delete(key);
      return false;
    }
    this.records.set(key, { ...record, used: true });
    return true;
  }
}

export const quickAuthReplayStore = new QuickAuthReplayStore();

