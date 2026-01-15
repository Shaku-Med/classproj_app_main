/**
 * Client-side fingerprinting script
 * This file is safe to import in browser code as it contains no Node.js dependencies
 */

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
      ctx.fillText('DeviceSecurity@2024!#$%', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('DeviceSecurity@2024!#$%', 4, 17);
      ctx.strokeStyle = 'rgb(120,186,176)';
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.stroke();
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
