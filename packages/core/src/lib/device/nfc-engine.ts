// packages/core/src/lib/device/nfc-engine.ts

export interface NFCTagConfig {
  id: string; // "01" through "20"
  serialNumber?: string; // Optional real hardware UID match
  realm: 'core' | 'work' | 'think' | 'studio' | 'life' | 'signal' | 'money' | 'forge' | 'shortcuts' | 'plugins';
  focusMode: string;
  path: string;
  color: string;
}

export const NFC_CHIPS_MAPPING: Record<string, NFCTagConfig> = {
  '01': { id: '01', realm: 'core', focusMode: '🌌 CORE', path: '/', color: '#8B5CF6' },
  '02': { id: '02', realm: 'work', focusMode: '🩵 WORK', path: '/work', color: '#30D158' },
  '03': { id: '03', realm: 'think', focusMode: '🧠 THINK', path: '/think', color: '#AF52DE' },
  '04': { id: '04', realm: 'studio', focusMode: '🎨 STUDIOS', path: '/studio', color: '#FFD60A' },
  '05': { id: '05', realm: 'life', focusMode: '❤️ LIFE', path: '/life', color: '#FF9500' },
  '06': { id: '06', realm: 'signal', focusMode: '💬 SIGNAL', path: '/signal', color: '#5AC8FA' },
  '07': { id: '07', realm: 'money', focusMode: '💰 MONEY', path: '/money', color: '#34C759' },
  '08': { id: '08', realm: 'shortcuts', focusMode: '🔗 SHORTCUTS', path: '/shortcuts', color: '#FF6B35' },
  '09': { id: '09', realm: 'plugins', focusMode: '🔌 PLUGINS', path: '/plugins', color: '#FF2D55' },
  '10': { id: '10', realm: 'forge', focusMode: '🛠️ FORGE', path: '/forge', color: '#E8A838' },
  // Additional chips mapping for complete 20 chips
  '11': { id: '11', realm: 'core', focusMode: '🌌 CORE ALT', path: '/', color: '#8B5CF6' },
  '12': { id: '12', realm: 'work', focusMode: '🩵 WORK FLOW', path: '/work', color: '#30D158' },
  '13': { id: '13', realm: 'think', focusMode: '🧠 THINK DEPTH', path: '/think', color: '#AF52DE' },
  '14': { id: '14', realm: 'studio', focusMode: '🎨 AUDIO VIBE', path: '/studio', color: '#FFD60A' },
  '15': { id: '15', realm: 'life', focusMode: '❤️ BIO HEALTH', path: '/life', color: '#FF9500' },
  '16': { id: '16', realm: 'signal', focusMode: '💬 COMMS BEAM', path: '/signal', color: '#5AC8FA' },
  '17': { id: '17', realm: 'money', focusMode: '💰 FINTECH', path: '/money', color: '#34C759' },
  '18': { id: '18', realm: 'shortcuts', focusMode: '🔗 HYPERLINK', path: '/shortcuts', color: '#FF6B35' },
  '19': { id: '19', realm: 'plugins', focusMode: '🔌 SYSTEM MODS', path: '/plugins', color: '#FF2D55' },
  '20': { id: '20', realm: 'forge', focusMode: '🛠️ MATRIX CORE', path: '/forge', color: '#E8A838' },
};

// Map hardware UID patterns to Chip index if scanned with clean serialNumber
export function findChipBySerialNumber(serialNumber: string): NFCTagConfig | null {
  const normalized = serialNumber.replace(/:/g, '').toUpperCase();
  // We can hash or check trailing characters to map UIDs to our 20 chips deterministically
  const charCodeSum = normalized.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const chipIndex = (charCodeSum % 20) + 1;
  const chipIdStr = chipIndex.toString().padStart(2, '0');
  return NFC_CHIPS_MAPPING[chipIdStr] || null;
}

export type NFCCallback = (tag: NFCTagConfig, message?: string) => void;

export class NFCEngine {
  private static instance: NFCEngine | null = null;
  private ndefReader: any = null;
  private isScanningActive = false;
  private listeners: Set<NFCCallback> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      // Check for Web NFC NDEFReader
      if ('NDEFReader' in window) {
        this.ndefReader = new (window as any).NDEFReader();
      }
    }
  }

  public static getInstance(): NFCEngine {
    if (!this.instance) {
      this.instance = new NFCEngine();
    }
    return this.instance;
  }

  public registerListener(callback: NFCCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(tag: NFCTagConfig, message?: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(tag, message);
      } catch (err) {
        console.error('NFC listener callback error:', err);
      }
    });

    // Also dispatch a browser-wide CustomEvent for non-Zustand vanilla layers to tap into
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cosmos-nfc-scan', {
          detail: { tag, message }
        })
      );
    }
  }

  public isSupported(): boolean {
    return this.ndefReader !== null;
  }

  public isScanning(): boolean {
    return this.isScanningActive;
  }

  public async startScanning(): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Web NFC (NDEFReader) is not supported by this browser/device.');
    }

    if (this.isScanningActive) return;

    try {
      await this.ndefReader.scan();
      this.isScanningActive = true;

      this.ndefReader.onreading = (event: any) => {
        const serialNumber = event.serialNumber;
        let payloadText = '';

        if (event.message && event.message.records) {
          for (const record of event.message.records) {
            if (record.recordType === 'text') {
              const textDecoder = new TextDecoder(record.encoding || 'utf-8');
              payloadText = textDecoder.decode(record.data);
            }
          }
        }

        // Try parsing payload (e.g. "id=02" or "mode=work")
        let matchedTag: NFCTagConfig | null = null;
        
        if (payloadText) {
          const matchId = payloadText.match(/id=(\d+)/i);
          const matchMode = payloadText.match(/mode=(\w+)/i);
          
          if (matchId && matchId[1]) {
            const padId = matchId[1].padStart(2, '0');
            matchedTag = NFC_CHIPS_MAPPING[padId];
          } else if (matchMode && matchMode[1]) {
            const modeLower = matchMode[1].toLowerCase();
            const found = Object.values(NFC_CHIPS_MAPPING).find(c => c.realm === modeLower);
            if (found) matchedTag = found;
          }
        }

        // Fallback to deterministically mapping the physical serialNumber
        if (!matchedTag && serialNumber) {
          matchedTag = findChipBySerialNumber(serialNumber);
        }

        if (matchedTag) {
          const infoStr = payloadText || `Hardware UID: ${serialNumber}`;
          this.notifyListeners(matchedTag, infoStr);
        }
      };

      this.ndefReader.onreadingerror = () => {
        console.warn('NDEF Reader encountered reading error on hardware scan.');
      };

    } catch (err) {
      this.isScanningActive = false;
      console.error('Failed to initiate NFC scan:', err);
      throw err;
    }
  }

  public stopScanning() {
    this.isScanningActive = false;
    // NDEFReader scan() doesn't have an explicit stop() on older drafts, but we stop listening
    if (this.ndefReader) {
      this.ndefReader.onreading = null;
      this.ndefReader.onreadingerror = null;
    }
  }

  // API/Webhook Gateway handler for external systems like Apple Shortcuts
  public triggerExternalSync(modeOrId: string): NFCTagConfig | null {
    const cleanStr = modeOrId.trim().toLowerCase();
    let matchedTag: NFCTagConfig | null = null;

    // Check if numeric ID (e.g., "02")
    if (/^\d+$/.test(cleanStr)) {
      const padId = cleanStr.padStart(2, '0');
      matchedTag = NFC_CHIPS_MAPPING[padId];
    } else {
      // Find by focus mode name or realm name
      matchedTag = Object.values(NFC_CHIPS_MAPPING).find(
        (chip) =>
          chip.realm === cleanStr ||
          chip.focusMode.toLowerCase().includes(cleanStr)
      ) || null;
    }

    if (matchedTag) {
      const syncMsg = `Apple Shortcuts trigger state sync: ${matchedTag.focusMode}`;
      this.notifyListeners(matchedTag, syncMsg);

      // Perform cross-device notification or sync logging
      if (typeof window !== 'undefined') {
        fetch('/api/sync-focus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            realm: matchedTag.realm,
            focusMode: matchedTag.focusMode,
            timestamp: Date.now()
          })
        }).catch(() => {
          // Silent fallback if server mock API is offline
        });
      }
      return matchedTag;
    }

    return null;
  }
}
