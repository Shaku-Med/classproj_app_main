import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export interface FingerprintComponents {
  userAgent: string;
  language: string;
  languages: string[];
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  screenResolution: [number, number];
  timezoneOffset: number;
  timezone: string;
  colorDepth: number;
  pixelRatio: number;
  canvas: string;
  webglVendor: string;
  webglRenderer: string;
  touchSupport: number;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
}

export interface DeviceFingerprint {
  id: string;
  components: FingerprintComponents;
  confidence: number;
  timestamp: number;
}

export interface SessionToken {
  token: string;
  deviceId: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

export interface ValidationResult {
  valid: boolean;
  deviceMatch: boolean;
  expired: boolean;
  tampered: boolean;
}

interface CollectorConfig {
  canvasText: string;
  canvasFont: string;
}

interface SessionConfig {
  secretKey: string;
  defaultTtlMs: number;
  allowedDrift: number;
}

const DEFAULT_COLLECTOR_CONFIG: CollectorConfig = {
  canvasText: "DeviceSecurity@2024!#$%",
  canvasFont: "18px Arial",
};

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  secretKey: "CHANGE_THIS_SECRET_KEY_IN_PRODUCTION",
  defaultTtlMs: 24 * 60 * 60 * 1000,
  allowedDrift: 0.3,
};

class FingerprintCollector {
  private config: CollectorConfig;

  constructor(config: Partial<CollectorConfig> = {}) {
    this.config = { ...DEFAULT_COLLECTOR_CONFIG, ...config };
  }

  async collect(): Promise<FingerprintComponents> {
    return {
      userAgent: this.getUserAgent(),
      language: this.getLanguage(),
      languages: this.getLanguages(),
      platform: this.getPlatform(),
      hardwareConcurrency: this.getHardwareConcurrency(),
      deviceMemory: this.getDeviceMemory(),
      screenResolution: this.getScreenResolution(),
      timezoneOffset: this.getTimezoneOffset(),
      timezone: this.getTimezone(),
      colorDepth: this.getColorDepth(),
      pixelRatio: this.getPixelRatio(),
      canvas: await this.getCanvasFingerprint(),
      webglVendor: this.getWebGLVendor(),
      webglRenderer: this.getWebGLRenderer(),
      touchSupport: this.getTouchSupport(),
      cookiesEnabled: this.getCookiesEnabled(),
      doNotTrack: this.getDoNotTrack(),
    };
  }

  private getUserAgent(): string {
    return typeof navigator !== "undefined" ? navigator.userAgent : "";
  }

  private getLanguage(): string {
    return typeof navigator !== "undefined" ? navigator.language : "";
  }

  private getLanguages(): string[] {
    return typeof navigator !== "undefined" ? Array.from(navigator.languages || []) : [];
  }

  private getPlatform(): string {
    return typeof navigator !== "undefined" ? (navigator as any).platform || "" : "";
  }

  private getHardwareConcurrency(): number {
    return typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 0 : 0;
  }

  private getDeviceMemory(): number | null {
    return typeof navigator !== "undefined" ? (navigator as any).deviceMemory || null : null;
  }

  private getScreenResolution(): [number, number] {
    if (typeof screen !== "undefined") {
      return [screen.width, screen.height];
    }
    return [0, 0];
  }

  private getTimezoneOffset(): number {
    return new Date().getTimezoneOffset();
  }

  private getTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  }

  private getColorDepth(): number {
    return typeof screen !== "undefined" ? screen.colorDepth : 0;
  }

  private getPixelRatio(): number {
    return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  }

  private async getCanvasFingerprint(): Promise<string> {
    if (typeof document === "undefined") return "";

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");

      if (!ctx) return "";

      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);

      ctx.fillStyle = "#069";
      ctx.font = this.config.canvasFont;
      ctx.fillText(this.config.canvasText, 2, 15);

      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(this.config.canvasText, 4, 17);

      ctx.strokeStyle = "rgb(120,186,176)";
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.stroke();

      return canvas.toDataURL();
    } catch {
      return "";
    }
  }

  private getWebGLVendor(): string {
    if (typeof document === "undefined") return "";

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return "";

      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) return "";

      return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
    } catch {
      return "";
    }
  }

  private getWebGLRenderer(): string {
    if (typeof document === "undefined") return "";

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return "";

      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) return "";

      return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
    } catch {
      return "";
    }
  }

  private getTouchSupport(): number {
    if (typeof navigator === "undefined") return 0;
    return navigator.maxTouchPoints || 0;
  }

  private getCookiesEnabled(): boolean {
    return typeof navigator !== "undefined" ? navigator.cookieEnabled : false;
  }

  private getDoNotTrack(): string | null {
    if (typeof navigator === "undefined") return null;
    return (navigator as any).doNotTrack || (window as any).doNotTrack || null;
  }
}

class FingerprintHasher {
  private stableKeys: (keyof FingerprintComponents)[] = [
    "platform",
    "hardwareConcurrency",
    "deviceMemory",
    "timezone",
    "colorDepth",
    "webglVendor",
    "webglRenderer",
    "touchSupport",
  ];

  private volatileKeys: (keyof FingerprintComponents)[] = [
    "userAgent",
    "language",
    "languages",
    "screenResolution",
    "timezoneOffset",
    "pixelRatio",
    "canvas",
    "cookiesEnabled",
    "doNotTrack",
  ];

  hash(components: FingerprintComponents): string {
    const stableData = this.extractData(components, this.stableKeys);
    const volatileData = this.extractData(components, this.volatileKeys);

    const stableHash = this.sha256(JSON.stringify(stableData));
    const volatileHash = this.sha256(JSON.stringify(volatileData));

    const combinedHash = this.sha256(stableHash + volatileHash);

    return combinedHash;
  }

  hashStableOnly(components: FingerprintComponents): string {
    const stableData = this.extractData(components, this.stableKeys);
    return this.sha256(JSON.stringify(stableData));
  }

  private extractData(
    components: FingerprintComponents,
    keys: (keyof FingerprintComponents)[]
  ): Partial<FingerprintComponents> {
    const result: Partial<FingerprintComponents> = {};
    for (const key of keys) {
      (result as any)[key] = components[key];
    }
    return result;
  }

  private sha256(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }

  calculateSimilarity(a: FingerprintComponents, b: FingerprintComponents): number {
    let matches = 0;
    let total = 0;

    for (const key of this.stableKeys) {
      total += 2;
      if (JSON.stringify(a[key]) === JSON.stringify(b[key])) {
        matches += 2;
      }
    }

    for (const key of this.volatileKeys) {
      total += 1;
      if (JSON.stringify(a[key]) === JSON.stringify(b[key])) {
        matches += 1;
      }
    }

    return matches / total;
  }
}

class SessionManager {
  private config: SessionConfig;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config };
  }

  createSession(deviceId: string, ttlMs?: number): SessionToken {
    const token = randomBytes(32).toString("hex");
    const createdAt = Date.now();
    const expiresAt = createdAt + (ttlMs || this.config.defaultTtlMs);

    const payload = `${token}:${deviceId}:${createdAt}:${expiresAt}`;
    const signature = this.sign(payload);

    return {
      token,
      deviceId,
      createdAt,
      expiresAt,
      signature,
    };
  }

  validateSession(session: SessionToken, currentDeviceId: string): ValidationResult {
    const payload = `${session.token}:${session.deviceId}:${session.createdAt}:${session.expiresAt}`;
    const expectedSignature = this.sign(payload);

    const tampered = !this.secureCompare(session.signature, expectedSignature);
    const expired = Date.now() > session.expiresAt;
    const deviceMatch = session.deviceId === currentDeviceId;

    return {
      valid: !tampered && !expired && deviceMatch,
      deviceMatch,
      expired,
      tampered,
    };
  }

  private sign(data: string): string {
    return createHmac("sha256", this.config.secretKey).update(data).digest("hex");
  }

  private secureCompare(a: string, b: string): boolean {
    try {
      const bufA = Buffer.from(a);
      const bufB = Buffer.from(b);

      if (bufA.length !== bufB.length) {
        return false;
      }

      return timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }
}

class FuzzyMatcher {
  private threshold: number;

  constructor(threshold: number = 0.7) {
    this.threshold = threshold;
  }

  match(storedComponents: FingerprintComponents, currentComponents: FingerprintComponents): boolean {
    const hasher = new FingerprintHasher();
    const similarity = hasher.calculateSimilarity(storedComponents, currentComponents);
    return similarity >= this.threshold;
  }

  getSimilarity(storedComponents: FingerprintComponents, currentComponents: FingerprintComponents): number {
    const hasher = new FingerprintHasher();
    return hasher.calculateSimilarity(storedComponents, currentComponents);
  }
}

export class DeviceSecurity {
  private collector: FingerprintCollector;
  private hasher: FingerprintHasher;
  private sessionManager: SessionManager;
  private fuzzyMatcher: FuzzyMatcher;

  constructor(options: {
    secretKey: string;
    sessionTtlMs?: number;
    fuzzyThreshold?: number;
    collectorConfig?: Partial<CollectorConfig>;
  }) {
    this.collector = new FingerprintCollector(options.collectorConfig);
    this.hasher = new FingerprintHasher();
    this.sessionManager = new SessionManager({
      secretKey: options.secretKey,
      defaultTtlMs: options.sessionTtlMs,
    });
    this.fuzzyMatcher = new FuzzyMatcher(options.fuzzyThreshold || 0.7);
  }

  async getDeviceFingerprint(): Promise<DeviceFingerprint> {
    const components = await this.collector.collect();
    const id = this.hasher.hash(components);

    const stableId = this.hasher.hashStableOnly(components);
    const fullId = id;
    const confidence = stableId === fullId.slice(0, stableId.length) ? 1 : 0.8;

    return {
      id,
      components,
      confidence,
      timestamp: Date.now(),
    };
  }

  async getStableDeviceId(): Promise<string> {
    const components = await this.collector.collect();
    return this.hasher.hashStableOnly(components);
  }

  createSession(deviceFingerprint: DeviceFingerprint, ttlMs?: number): SessionToken {
    return this.sessionManager.createSession(deviceFingerprint.id, ttlMs);
  }

  async validateSession(session: SessionToken): Promise<ValidationResult> {
    const currentFingerprint = await this.getDeviceFingerprint();
    return this.sessionManager.validateSession(session, currentFingerprint.id);
  }

  async validateSessionWithFuzzyMatch(
    session: SessionToken,
    storedComponents: FingerprintComponents
  ): Promise<ValidationResult & { similarity: number }> {
    const currentFingerprint = await this.getDeviceFingerprint();

    const payload = `${session.token}:${session.deviceId}:${session.createdAt}:${session.expiresAt}`;
    const expectedSignature = createHmac("sha256", "temp").update(payload).digest("hex");

    const similarity = this.fuzzyMatcher.getSimilarity(storedComponents, currentFingerprint.components);
    const deviceMatch = this.fuzzyMatcher.match(storedComponents, currentFingerprint.components);
    const expired = Date.now() > session.expiresAt;

    return {
      valid: !expired && deviceMatch,
      deviceMatch,
      expired,
      tampered: false,
      similarity,
    };
  }

  serializeSession(session: SessionToken): string {
    return Buffer.from(JSON.stringify(session)).toString("base64");
  }

  deserializeSession(serialized: string): SessionToken {
    return JSON.parse(Buffer.from(serialized, "base64").toString("utf8"));
  }
}

export function createDeviceSecurity(secretKey: string): DeviceSecurity {
  return new DeviceSecurity({ secretKey });
}

export const clientCollectorScript = `
(function() {
  async function collectFingerprint() {
    const components = {};
    
    components.userAgent = navigator.userAgent;
    components.language = navigator.language;
    components.languages = Array.from(navigator.languages || []);
    components.platform = navigator.platform || '';
    components.hardwareConcurrency = navigator.hardwareConcurrency || 0;
    components.deviceMemory = navigator.deviceMemory || null;
    components.screenResolution = [screen.width, screen.height];
    components.timezoneOffset = new Date().getTimezoneOffset();
    components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    components.colorDepth = screen.colorDepth;
    components.pixelRatio = window.devicePixelRatio || 1;
    components.touchSupport = navigator.maxTouchPoints || 0;
    components.cookiesEnabled = navigator.cookieEnabled;
    components.doNotTrack = navigator.doNotTrack || window.doNotTrack || null;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.font = '18px Arial';
      ctx.fillText('DeviceSecurity@2024', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('DeviceSecurity@2024', 4, 17);
      components.canvas = canvas.toDataURL();
    } catch (e) {
      components.canvas = '';
    }
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          components.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
          components.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        }
      }
    } catch (e) {
      components.webglVendor = '';
      components.webglRenderer = '';
    }
    
    return components;
  }
  
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  async function getDeviceId() {
    const components = await collectFingerprint();
    const stableData = {
      platform: components.platform,
      hardwareConcurrency: components.hardwareConcurrency,
      deviceMemory: components.deviceMemory,
      timezone: components.timezone,
      colorDepth: components.colorDepth,
      webglVendor: components.webglVendor,
      webglRenderer: components.webglRenderer,
      touchSupport: components.touchSupport
    };
    return await sha256(JSON.stringify(stableData));
  }
  
  window.DeviceSecurity = {
    collectFingerprint,
    getDeviceId,
    sha256
  };
})();
`;

export { FingerprintCollector, FingerprintHasher, SessionManager, FuzzyMatcher };