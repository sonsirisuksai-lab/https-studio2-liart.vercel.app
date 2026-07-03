import JSZip from 'jszip';

export interface ExportData {
  version: string;
  timestamp: string;
  themes: any;
  workspaces: any;
  settings: any;
  realmsData: any;
}

export async function exportAllDataToJSON(): Promise<string> {
  // Grab all keys belonging to COSMOS OS from localStorage
  const cosmosData: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('cosmos:') || key.startsWith('theme:') || key.startsWith('ws:'))) {
      cosmosData[key] = localStorage.getItem(key) || '';
    }
  }

  const exportPayload: ExportData = {
    version: '5.0.0',
    timestamp: new Date().toISOString(),
    themes: localStorage.getItem('theme-preference') || 'aether',
    workspaces: localStorage.getItem('cosmos:workspaces') || 'default',
    settings: localStorage.getItem('cosmos:settings') || '{}',
    realmsData: cosmosData,
  };

  return JSON.stringify(exportPayload, null, 2);
}

export async function exportAllDataToZIP(): Promise<Blob> {
  const jsonString = await exportAllDataToJSON();
  const zip = new JSZip();
  
  // Inject metadata and local storage configuration into zip
  zip.file('cosmos_backup_metadata.json', JSON.stringify({
    system: 'COSMOS OS',
    version: '5.0.0',
    timestamp: new Date().toISOString()
  }, null, 2));
  
  zip.file('cosmos_database_sync.json', jsonString);
  
  return await zip.generateAsync({ type: 'blob' });
}
