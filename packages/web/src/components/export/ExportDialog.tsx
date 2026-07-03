import React, { useState } from 'react';
import { exportAllDataToJSON, exportAllDataToZIP } from '@cosmos/core';
import { Glass } from '../aether/Glass';

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const [loading, setLoading] = useState(false);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    setLoading(true);
    try {
      const jsonString = await exportAllDataToJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      triggerDownload(blob, `cosmos_backup_${new Date().toISOString().slice(0, 10)}.json`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate JSON backup');
    } finally {
      setLoading(false);
    }
  };

  const handleExportZIP = async () => {
    setLoading(true);
    try {
      const zipBlob = await exportAllDataToZIP();
      triggerDownload(zipBlob, `cosmos_archive_${new Date().toISOString().slice(0, 10)}.zip`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate ZIP archive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Glass blur={30} opacity={0.8} border glow className="max-w-md w-full p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 className="text-lg font-bold">Backup Core Coordinates</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
        </div>

        <p className="text-xs text-white/60 leading-relaxed">
          Compress and package your entire cognitive workspace, physical object parameters, custom audio states, and personal realm data.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExportJSON}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-center space-y-2 transition-all"
          >
            <span className="text-3xl">📄</span>
            <span className="text-xs font-semibold">Standard JSON</span>
            <span className="text-[9px] text-white/40">Compact data file</span>
          </button>

          <button
            onClick={handleExportZIP}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-center space-y-2 transition-all"
          >
            <span className="text-3xl">🗄️</span>
            <span className="text-xs font-semibold">Compressed ZIP</span>
            <span className="text-[9px] text-white/40">Includes assets</span>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs uppercase font-semibold tracking-wider transition-colors"
          >
            Cancel
          </button>
        </div>
      </Glass>
    </div>
  );
}
export default ExportDialog;
