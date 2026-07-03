import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { useRobin } from '@/lib/RobinContext';
import { engine } from '@/lib/audio-engine';
import { Glass } from '@/components/aether/Glass';
import { Heading, Label } from '@/components/aether/Typography';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Printer, Wifi, Check, AlertTriangle, Database, 
  RefreshCw, Play, Square, Download, Maximize2, Sliders, 
  User, Calendar, Hash, Cpu, Layers, ArrowLeft, Scan, Info
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function LogisticsConsole() {
  const navigate = useNavigate();
  const { realm, realmId } = useRealm();
  const { say } = useRobin();

  // --- STATE HYDRATION MECHANICS ---
  const [scannedCode, setScannedCode] = useState(() => {
    return localStorage.getItem('cosmos_scanned_code') || 'COSMOS-ZORO-9921';
  });

  const [nfcPayload, setNfcPayload] = useState(() => {
    return localStorage.getItem('cosmos_nfc_payload') || 'SECURE_REALM_PASSCODE';
  });

  const [lastPrintedReport, setLastPrintedReport] = useState(() => {
    return localStorage.getItem('cosmos_last_printed') || '';
  });

  // Scanner State
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // NFC State
  const [nfcState, setNfcState] = useState<'idle' | 'scanning' | 'writing' | 'success' | 'unsupported'>('idle');
  const [nfcLogs, setNfcLogs] = useState<string[]>(() => {
    const cached = localStorage.getItem('cosmos_nfc_logs');
    return cached ? JSON.parse(cached) : [
      `[${new Date().toLocaleTimeString()}] NFC Gateway Online. Waiting for transponder.`
    ];
  });

  // Simulator States
  const [simulatingNfc, setSimulatingNfc] = useState(false);
  const [simulatedTagPayload, setSimulatedTagPayload] = useState('EQUIPMENT_TAG_04');
  const [mockNfcLogs, setMockNfcLogs] = useState<string[]>([]);

  // Sequence and Time
  const [seqNo, setSeqNo] = useState(() => Math.floor(Math.random() * 900000) + 100000);
  const [systemTime, setSystemTime] = useState(new Date());

  // Save to Cache on state changes
  useEffect(() => {
    localStorage.setItem('cosmos_scanned_code', scannedCode);
  }, [scannedCode]);

  useEffect(() => {
    localStorage.setItem('cosmos_nfc_payload', nfcPayload);
  }, [nfcPayload]);

  useEffect(() => {
    localStorage.setItem('cosmos_nfc_logs', JSON.stringify(nfcLogs));
  }, [nfcLogs]);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup html5-qrcode
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => console.error(err));
      }
    };
  }, []);

  // --- CAMERA AND BARCODE STREAM SCANNER ---
  const startCameraScan = async () => {
    setScannerError(null);
    try {
      engine.enable();
      engine.playSound(realm.id);
      
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        // Prefer back camera if available, otherwise first camera
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment')
        );
        const cameraId = backCamera ? backCamera.id : devices[0].id;

        const html5QrCode = new Html5Qrcode("scanner-viewport-element");
        html5QrCodeRef.current = html5QrCode;
        setScanning(true);

        await html5QrCode.start(
          cameraId,
          {
            fps: 15,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            }
          },
          (decodedText) => {
            setScannedCode(decodedText);
            engine.playSound(realm.id);
            say(`สแกนบาร์โค้ดสำเร็จ บอส รหัสคือ: ${decodedText}`);
            stopCameraScan();
          },
          () => {
            // Noise updates, silent
          }
        );
      } else {
        setScannerError("No video capture devices found.");
      }
    } catch (err: any) {
      console.error(err);
      setScannerError(err?.message || "Camera access permission denied.");
    }
  };

  const stopCameraScan = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error("Stop scanner failed", err);
      }
      setScanning(false);
    }
  };

  // --- MOCK SCANNER SIMULATOR (Desktop fail-safe review tool) ---
  const triggerMockScan = (presetCode: string) => {
    engine.enable();
    engine.playSound(realm.id);
    setScannedCode(presetCode);
    say(`จำลองสแกนบาร์โค้ดสำเร็จ บอส ข้อมูลคือ ${presetCode}`);
  };

  // --- REAL WEB NFC IMPLEMENTATION ---
  const triggerRealNfcScan = async () => {
    if (!('NDEFReader' in window)) {
      setNfcState('unsupported');
      const timeStr = new Date().toLocaleTimeString();
      setNfcLogs(prev => [`[${timeStr}] ⚠️ WEB NFC NOT SUPPORTED BY CLIENT ENGINE`, ...prev]);
      return;
    }

    try {
      setNfcState('scanning');
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      const timeStr = new Date().toLocaleTimeString();
      setNfcLogs(prev => [`[${timeStr}] 📡 NFC SCANNING ACTIVE...`, ...prev]);

      ndef.addEventListener("readingerror", () => {
        setNfcLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ TAG READ ERROR`, ...prev]);
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        engine.playSound(realm.id);
        setNfcState('success');
        
        const decoded = message.records.map((record: any) => {
          const decoder = new TextDecoder(record.encoding || 'utf-8');
          return decoder.decode(record.data);
        }).join(', ');

        const logTime = new Date().toLocaleTimeString();
        setNfcLogs(prev => [
          `[${logTime}] ✅ NFC DETECTED: SN [${serialNumber}]`,
          `Payload: ${decoded}`,
          ...prev
        ]);
        
        setNfcPayload(decoded);
        say(`อ่านแท็ก NFC สำเร็จ บอส รหัสซีเรียลคือ ${serialNumber}`);
        setTimeout(() => setNfcState('idle'), 2000);
      });

    } catch (err: any) {
      console.error(err);
      setNfcState('idle');
      setNfcLogs(prev => [`[${new Date().toLocaleTimeString()}] NFC INIT ERROR: ${err.message}`, ...prev]);
    }
  };

  const triggerRealNfcWrite = async () => {
    if (!('NDEFReader' in window)) {
      setNfcState('unsupported');
      return;
    }

    try {
      setNfcState('writing');
      const ndef = new (window as any).NDEFReader();
      await ndef.write(nfcPayload);
      engine.playSound(realm.id);
      setNfcState('success');
      
      const logTime = new Date().toLocaleTimeString();
      setNfcLogs(prev => [`[${logTime}] 💾 WRITE SUCCESS: [${nfcPayload}]`, ...prev]);
      say(`เขียนข้อมูลลง NFC แท็กสำเร็จแล้วบอส`);
      setTimeout(() => setNfcState('idle'), 2000);
    } catch (err: any) {
      console.error(err);
      setNfcState('idle');
      setNfcLogs(prev => [`[${new Date().toLocaleTimeString()}] NFC WRITE ERROR: ${err.message}`, ...prev]);
    }
  };

  // --- MOCK NFC SIMULATOR ---
  const triggerMockNfcAction = (payload: string) => {
    setSimulatingNfc(true);
    engine.enable();
    engine.playSound(realm.id);
    
    setTimeout(() => {
      setSimulatingNfc(false);
      setNfcPayload(payload);
      
      const sn = `MOCK_NFC_${Math.floor(Math.random() * 90000) + 10000}`;
      const logTime = new Date().toLocaleTimeString();
      setNfcLogs(prev => [
        `[${logTime}] ✅ MOCK NFC TAG DETECTED: SN [${sn}]`,
        `Payload: ${payload}`,
        ...prev
      ]);
      say(`จำลองอ่านแท็ก NFC สำเร็จ ข้อมูล: ${payload}`);
    }, 1500);
  };

  // --- PRINT DOCUMENT ACTION COMPONENT ---
  const handlePrintReceipt = () => {
    engine.enable();
    engine.playSound(realm.id);
    say("กำลังส่งรายงานสรุปยอดโลจิสติกส์รายวันไปยังเครื่องพิมพ์บอส");
    
    // Cache print action
    const printTimeStr = new Date().toISOString();
    setLastPrintedReport(printTimeStr);
    localStorage.setItem('cosmos_last_printed', printTimeStr);
    
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Theme-specific ripple / scanning artifacts mapping
  const getThemeAesthetics = () => {
    switch (realmId) {
      case 'cyber-neon':
        return {
          primaryColor: 'text-[#00f0ff]',
          borderColor: 'border-[#00f0ff]/50',
          focusBorderColor: 'border-[#00f0ff]',
          accentText: 'text-[#ff007f]',
          scanLineColor: 'bg-[#00f0ff]/80 shadow-[0_0_20px_#00f0ff]',
          nfcPulseClass: 'border-2 border-[#00f0ff] animate-ping opacity-60 shadow-[0_0_15px_#00f0ff]',
          simulatedRing: 'border border-dashed border-[#ff007f] animate-spin',
          buttonBg: 'bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border-[#00f0ff]/40'
        };
      case 'ironman-nano':
        return {
          primaryColor: 'text-[#f97316]',
          borderColor: 'border-[#f97316]/50',
          focusBorderColor: 'border-[#3b82f6]',
          accentText: 'text-[#ef4444]',
          scanLineColor: 'bg-[#ef4444]/80 shadow-[0_0_20px_#ef4444]',
          nfcPulseClass: 'border-2 border-[#f97316] rounded-[10%] animate-pulse opacity-80',
          simulatedRing: 'border-2 border-[#3b82f6]/40 animate-pulse',
          buttonBg: 'bg-[#f97316]/10 hover:bg-[#f97316]/20 border-[#f97316]/40'
        };
      case 'venom-liquid':
        return {
          primaryColor: 'text-[#22c55e]',
          borderColor: 'border-[#22c55e]/50',
          focusBorderColor: 'border-black',
          accentText: 'text-[#10b981]',
          scanLineColor: 'bg-black/80 blur-[2px]',
          nfcPulseClass: 'bg-[#22c55e]/10 border-2 border-[#22c55e] animate-ping opacity-50 rounded-full',
          simulatedRing: 'border-4 border-black/30 animate-pulse rounded-full',
          buttonBg: 'bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border-[#22c55e]/40'
        };
      case 'retro-tape':
        return {
          primaryColor: 'text-[#eab308]',
          borderColor: 'border-[#eab308]/50',
          focusBorderColor: 'border-[#eab308]',
          accentText: 'text-[#84cc16]',
          scanLineColor: 'bg-[#eab308]/90 h-1',
          nfcPulseClass: 'border-4 border-dashed border-[#eab308] animate-spin',
          simulatedRing: 'border border-dashed border-[#84cc16] animate-pulse',
          buttonBg: 'bg-[#eab308]/10 hover:bg-[#eab308]/20 border-[#eab308]/40'
        };
      default:
        return {
          primaryColor: 'text-[var(--theme-primary)]',
          borderColor: 'border-white/10',
          focusBorderColor: 'border-[var(--theme-primary)]',
          accentText: 'text-white/80',
          scanLineColor: 'bg-[var(--theme-primary)]/80',
          nfcPulseClass: 'border border-[var(--theme-primary)] animate-ping',
          simulatedRing: 'border animate-spin',
          buttonBg: 'bg-white/5 hover:bg-white/10 border-white/10'
        };
    }
  };

  const aesthetic = getThemeAesthetics();

  return (
    <div className="w-full min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] subpixel-antialiased print:bg-white print:text-black">
      
      {/* HEADER SECTION - HIDDEN IN PRINT */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 pt-6 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl border border-white/10 bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-xl lg:text-2xl font-black tracking-widest text-[var(--theme-text)] uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--theme-primary)]" />
              LOGISTICS SYSTEMS GATEWAY
            </h1>
            <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mt-0.5">
              CUSTOM BARCODE, DAILY BILL PRINTER & WEB NFC
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Glass className="px-4 py-2 flex items-center gap-3 bg-black/20 border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-white/60">
              REALM: {realmId.toUpperCase()}
            </span>
          </Glass>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-[1920px] mx-auto p-6 lg:p-12 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: HARDWARE VIEWPORTS & HARDWARE DRIVERS (xl:span-7) */}
        <div className="xl:col-span-7 space-y-8 print:hidden">
          
          {/* BARCODE SCANNER CAMERA VIEWPORT */}
          <Glass className="p-6 border-white/10 relative overflow-hidden bg-black/30 backdrop-blur-3xl rounded-2xl">
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--theme-primary)]/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--theme-primary)]/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--theme-primary)]/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--theme-primary)]/40 rounded-br-lg" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[var(--theme-primary)]" />
                <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--theme-text)]">
                  Device Barcode Scanner Viewport
                </Label>
              </div>
              <div className="flex gap-2">
                {scanning ? (
                  <button 
                    onClick={stopCameraScan}
                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-md text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all"
                  >
                    <Square className="w-3 h-3" /> STOP SCAN
                  </button>
                ) : (
                  <button 
                    onClick={startCameraScan}
                    className="px-3 py-1 bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)]/40 text-[var(--theme-primary)] rounded-md text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3 h-3" /> ACTIVATE CAMERA
                  </button>
                )}
              </div>
            </div>

            {/* SCANNING WINDOW STAGE */}
            <div className="relative aspect-video w-full rounded-xl border border-white/5 bg-black/60 overflow-hidden flex flex-col justify-center items-center">
              
              {/* html5-qrcode target anchor */}
              <div id="scanner-viewport-element" className="absolute inset-0 w-full h-full object-cover" />

              {/* Holographic Overlays */}
              <AnimatePresence>
                {scanning && (
                  <>
                    {/* Targeting Box */}
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className={`absolute w-44 h-44 md:w-56 md:h-56 border-2 ${aesthetic.focusBorderColor} border-dashed flex items-center justify-center pointer-events-none z-10`}
                    >
                      {/* Sub-targeting brackets */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" />
                      
                      {/* Pulse target indicator */}
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    </motion.div>

                    {/* Animated sweep line */}
                    <motion.div 
                      animate={{ y: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className={`absolute left-0 right-0 h-1.5 ${aesthetic.scanLineColor} z-10`}
                    />
                  </>
                )}
              </AnimatePresence>

              {!scanning && (
                <div className="flex flex-col items-center justify-center p-8 z-10 text-center space-y-3 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-white/80">Camera Stream Dormant</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest max-w-xs mx-auto">
                      Click ACTIVATE CAMERA or use the manual test simulator below to feed barcode logs.
                    </p>
                  </div>
                </div>
              )}

              {scannerError && (
                <div className="absolute inset-0 bg-black/90 z-20 flex flex-col justify-center items-center p-6 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-500">Camera Interface Restricted</p>
                    <p className="text-[10px] text-white/60 font-mono">{scannerError}</p>
                  </div>
                  <button 
                    onClick={() => setScannerError(null)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-black tracking-widest uppercase transition-all"
                  >
                    DISMISS WARNING
                  </button>
                </div>
              )}
            </div>

            {/* QUICK TEST EMULATOR PANEL */}
            <div className="mt-6 border-t border-white/5 pt-6">
              <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 block">
                Logistics Simulator Controls (Desktop / Manual Overrides)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => triggerMockScan('COSMOS-ZORO-9921')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/80">ZORO RATIONS</span>
                    <span className="text-[9px] font-mono text-white/40 mt-0.5">COSMOS-ZORO-9921</span>
                  </div>
                  <Scan className="w-4 h-4 text-white/20 group-hover:text-[var(--theme-primary)] transition-colors" />
                </button>
                <button
                  onClick={() => triggerMockScan('ROBIN-HISTORY-7762')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/80">ROBIN LEDGER</span>
                    <span className="text-[9px] font-mono text-white/40 mt-0.5">ROBIN-HISTORY-7762</span>
                  </div>
                  <Scan className="w-4 h-4 text-white/20 group-hover:text-[var(--theme-primary)] transition-colors" />
                </button>
                <button
                  onClick={() => triggerMockScan('CARGO-SOUL-CARD-1120')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/80">SOUL CARD</span>
                    <span className="text-[9px] font-mono text-white/40 mt-0.5">CARGO-SOUL-CARD-1120</span>
                  </div>
                  <Scan className="w-4 h-4 text-white/20 group-hover:text-[var(--theme-primary)] transition-colors" />
                </button>
              </div>
            </div>
          </Glass>

          {/* ADVANCED WEB NFC LINK GATEWAY */}
          <Glass className="p-6 border-white/10 bg-black/30 backdrop-blur-3xl rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-[var(--theme-primary)]" />
                <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--theme-text)]">
                  NFC Link Gateway
                </Label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerRealNfcScan}
                  disabled={nfcState === 'scanning' || nfcState === 'writing'}
                  className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-md text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  {nfcState === 'scanning' ? 'SCANNING...' : 'SCAN TAG'}
                </button>
                <button
                  onClick={triggerRealNfcWrite}
                  disabled={nfcState === 'scanning' || nfcState === 'writing'}
                  className="px-3 py-1 bg-[var(--theme-primary)]/10 hover:bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)]/40 text-[var(--theme-primary)] rounded-md text-[10px] font-black tracking-widest uppercase transition-all"
                >
                  WRITE TAG
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* REACTIVE SCANNING STATUS LAYOUT */}
              <div className="relative h-48 rounded-xl bg-black/40 border border-white/5 overflow-hidden flex flex-col items-center justify-center">
                
                {/* Active scan pulses based on theme state */}
                <AnimatePresence>
                  {(nfcState === 'scanning' || nfcState === 'writing' || simulatingNfc) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`absolute w-32 h-32 rounded-full ${aesthetic.nfcPulseClass}`} />
                      <div className={`absolute w-44 h-44 rounded-full ${aesthetic.nfcPulseClass} [animation-delay:0.3s]`} />
                      <div className={`absolute w-24 h-24 rounded-full ${aesthetic.simulatedRing}`} />
                    </div>
                  )}
                </AnimatePresence>

                {/* NFC Transponder Icon */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                  <motion.div 
                    animate={nfcState !== 'idle' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-14 h-14 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-[var(--theme-primary)] shadow-inner"
                  >
                    <Wifi className="w-6 h-6 rotate-45" />
                  </motion.div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/80">
                    {nfcState === 'scanning' ? 'LISTENING FOR TRANSPONDER' : 
                     nfcState === 'writing' ? 'WRITING DATA BURST' :
                     simulatingNfc ? 'ACQUIRING TRANSPONDER SIGNAL' : 'NFC HARDWARE ENGINE IDLE'}
                  </span>
                  <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase">
                    DEVICE ANTENNA FIELD ACTIVE
                  </span>
                </div>
              </div>

              {/* NFC CONTROLS AND REALTIME LOG STREAM */}
              <div className="space-y-4 flex flex-col justify-between h-48">
                <div>
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-widest block mb-1">
                    NFC Transponder Write Payload
                  </label>
                  <input
                    type="text"
                    value={nfcPayload}
                    onChange={(e) => setNfcPayload(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-black/50 border border-white/10 focus:border-[var(--theme-primary)] text-white focus:outline-none transition-all"
                    placeholder="Enter payload to write"
                  />
                </div>

                {/* Simulated Tags Injection */}
                <div>
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block mb-1.5">
                    NFC Hardware Simulator (Tap Mock Tags)
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={simulatedTagPayload}
                      onChange={(e) => setSimulatedTagPayload(e.target.value)}
                      className="px-2 py-1.5 text-[10px] font-mono rounded bg-black/60 border border-white/10 text-white focus:outline-none flex-1"
                    >
                      <option value="EQUIPMENT_TAG_04">EQUIPMENT_TAG_04</option>
                      <option value="NAMI_BUDGET_REQUISITION">NAMI_REQUISITION_V3</option>
                      <option value="ZORO_SANJI_MEST">ZORO_SANJI_MEST</option>
                      <option value="ROBIN_VAULT_DECRYPT">ROBIN_DECRYPT_KEY</option>
                    </select>
                    <button
                      onClick={() => triggerMockNfcAction(simulatedTagPayload)}
                      disabled={simulatingNfc}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-black tracking-widest uppercase transition-all"
                    >
                      {simulatingNfc ? 'TAP IN PROGRESS...' : 'TAP MOCK TAG'}
                    </button>
                  </div>
                </div>

                {/* Logs Stream (Hydrated from LocalStorage) */}
                <div className="bg-black/60 border border-white/5 rounded-lg p-2 font-mono text-[9px] h-20 overflow-y-auto space-y-1">
                  {nfcLogs.slice(0, 3).map((log, index) => (
                    <div key={index} className="text-white/60 truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Glass>
        </div>

        {/* RIGHT COLUMN: DAILY SUMMARY REPORT PRINTER ROUTER (xl:span-5) */}
        {/* Under @media print rules, this thermal receipt prints centered while everything else is hidden */}
        <div id="print-receipt-section" className="xl:col-span-5 flex flex-col space-y-6">
          
          {/* Print Trigger Button Panel - HIDE IN PRINT */}
          <div className="flex gap-2 print:hidden w-full">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 py-3 bg-[var(--theme-primary)] text-black rounded-xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-[var(--theme-primary)]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Logistical Receipt (Native Window Print)
            </button>
          </div>

          {/* THERMAL BILL PRINTER DOCUMENT (REACTIONAL HARDWARE FRAME) */}
          <div 
            id="thermal-receipt" 
            className="w-full max-w-md mx-auto bg-white text-black p-6 font-mono shadow-2xl relative border-y-8 border-dashed border-gray-300 print:shadow-none print:border-none print:p-0 print:my-0 print-light"
            style={{ minHeight: '520px' }}
          >
            {/* Header */}
            <div className="text-center space-y-1 border-b border-dashed border-black/40 pb-4">
              <h2 className="text-sm font-black tracking-wider uppercase">COSMOS OS LOGISTICS</h2>
              <p className="text-[10px] tracking-widest">DAILY SUMMARY REPORT</p>
              <p className="text-[8px] tracking-tight">DIMENSIONAL GATEWAY SYNC v5.0</p>
            </div>

            {/* Metadata and Stats */}
            <div className="py-4 space-y-1.5 text-[9px] border-b border-dashed border-black/30">
              <div className="flex justify-between">
                <span>SEQUENCE:</span>
                <span className="font-bold">#{seqNo}</span>
              </div>
              <div className="flex justify-between">
                <span>SYSTEM DATE:</span>
                <span>{systemTime.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>SYSTEM TIME (UTC):</span>
                <span>{systemTime.toUTCString().split(' ')[4]}</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE DIMENSION:</span>
                <span className="font-black uppercase">{realmId}</span>
              </div>
              {lastPrintedReport && (
                <div className="flex justify-between text-black/60 text-[8px]">
                  <span>LAST PRINT AT:</span>
                  <span>{new Date(lastPrintedReport).toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Agent execution summaries */}
            <div className="py-4 space-y-4 border-b border-dashed border-black/30">
              <div>
                <p className="text-[10px] font-black border-b border-black pb-0.5 mb-1.5 uppercase flex justify-between">
                  <span>DISPATCH: RORONOA ZORO</span>
                  <span className="text-[8px] font-normal">CHIEF VANGUARD</span>
                </p>
                <div className="text-[9px] leading-relaxed space-y-0.5 text-gray-700">
                  <p>&gt; [08:30] SECURITY INTERCEPT AT BORDER: PASS</p>
                  <p>&gt; [09:12] LOCAL REQUISITION DISPATCH COMPLETED</p>
                  <p>&gt; STATUS: RAZOR-SHARP. STANDBY FOR ORDERS</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black border-b border-black pb-0.5 mb-1.5 uppercase flex justify-between">
                  <span>DISPATCH: NICO ROBIN</span>
                  <span className="text-[8px] font-normal">ARCHIVAL INTEL</span>
                </p>
                <div className="text-[9px] leading-relaxed space-y-0.5 text-gray-700">
                  <p>&gt; [07:45] SYNC ARCHIVE VAULT TO LOCAL STORAGE</p>
                  <p>&gt; [08:15] DETECTED 13 CORE ARTIFACT REPLICAS</p>
                  <p>&gt; STATUS: CHRONOS SYNC TO OBSIDIAN SECURED</p>
                </div>
              </div>
            </div>

            {/* Active Hardware metadata slots */}
            <div className="py-4 space-y-2 border-b border-dashed border-black/30 bg-gray-50 p-2.5 rounded print:bg-transparent print:p-0">
              <p className="text-[9px] font-black text-black/40 tracking-wider uppercase mb-1">
                Active Field Hardware Metadata Slots
              </p>
              <div className="flex justify-between text-[9px]">
                <span>BARCODE SCAN SLOT:</span>
                <span className="font-bold underline">{scannedCode}</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span>NFC TRANSPONDER SLOT:</span>
                <span className="font-bold underline">{nfcPayload}</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span>TRANSPONDER NETWORK:</span>
                <span className="text-emerald-700 font-bold uppercase">ONLINE (SIM)</span>
              </div>
            </div>

            {/* Footer with Auto-Generated Vector Barcode Graphic */}
            <div className="pt-6 space-y-4 text-center">
              <div className="bg-white p-2 border border-black/10 inline-block w-full">
                {/* SVG Barcode representation */}
                <svg className="w-full h-12 bg-white" viewBox="0 0 200 60">
                  <g fill="black">
                    {/* Generates high precision matching vector stripes dynamically */}
                    {scannedCode.split('').map((char, index) => {
                      const charCode = char.charCodeAt(0);
                      const width = (charCode % 3) + 1; // 1 to 3 width
                      const spacing = ((charCode >> 1) % 3) + 1; // 1 to 3 spacing
                      const offset = index * 8 + 10;
                      return (
                        <rect 
                          key={index} 
                          x={offset} 
                          y={5} 
                          width={width} 
                          height={38} 
                        />
                      );
                    })}
                  </g>
                  <text 
                    x="100" 
                    y="54" 
                    textAnchor="middle" 
                    fontSize="7" 
                    className="font-mono fill-black font-black tracking-[0.25em]"
                  >
                    *{scannedCode.toUpperCase()}*
                  </text>
                </svg>
              </div>

              <div className="space-y-0.5">
                <p className="text-[8px] font-bold tracking-widest uppercase">END OF METRICS LEDGER</p>
                <p className="text-[7px] text-gray-500">PLEASE DETACH RECORD SECURELY</p>
              </div>
            </div>

            {/* Simulated Receipt Tear Line Accents */}
            <div className="absolute -bottom-2.5 left-0 right-0 h-3 flex overflow-hidden pointer-events-none print:hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-300 rotate-45 transform origin-top-left -translate-y-2 border-r border-b border-gray-400" />
              ))}
            </div>
          </div>

          {/* Quick instructions HUD info */}
          <Glass className="p-4 border-white/5 bg-black/20 text-white/50 space-y-2 text-xs print:hidden">
            <h4 className="font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Operational Instructions
            </h4>
            <p className="text-[10px] leading-relaxed uppercase tracking-wider">
              1. Tap "ACTIVATE CAMERA" to request real camera streams for barcode decoding.
            </p>
            <p className="text-[10px] leading-relaxed uppercase tracking-wider">
              2. Use "TAP MOCK TAG" to simulate active Web NFC scan events on desktop.
            </p>
            <p className="text-[10px] leading-relaxed uppercase tracking-wider">
              3. Click "Print Logistical Receipt" to trigger native receipt generation.
            </p>
          </Glass>
        </div>

      </div>
    </div>
  );
}
