import React, { useState, useRef } from 'react';
import { validateAndImportJSON, validateAndImportZIP } from '@cosmos/core';
import { Glass } from '../aether/Glass';

interface ImportDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportDialog({ onClose, onSuccess }: ImportDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        await validateAndImportJSON(text);
      } else if (file.name.endsWith('.zip')) {
        await validateAndImportZIP(file);
      } else {
        throw new Error('Unsupported format. Only .json and .zip files are compatible.');
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification and alignment failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Glass blur={30} opacity={0.8} border glow className="max-w-md w-full p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 className="text-lg font-bold">Align Core Grid (Restore)</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.zip"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-3">
            <span className="text-4xl block">🌌</span>
            <p className="text-sm font-semibold">
              {loading ? 'Re-aligning reality matrix...' : 'Drop Backup File Here'}
            </p>
            <p className="text-[10px] text-white/40">
              Supports .json and .zip files. Click to select manually.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
export default ImportDialog;
