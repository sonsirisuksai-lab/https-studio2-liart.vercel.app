import JSZip from 'jszip';
import { ExportData } from './export';

export async function validateAndImportJSON(jsonString: string): Promise<boolean> {
  try {
    const data: ExportData = JSON.parse(jsonString);
    
    // Core signature verification
    if (!data.version || !data.realmsData) {
      throw new Error('Invalid COSMOS OS backup file signature.');
    }

    // Recover preferences and general workspaces
    if (data.themes) localStorage.setItem('theme-preference', data.themes);
    if (data.workspaces) localStorage.setItem('cosmos:workspaces', data.workspaces);
    if (data.settings) localStorage.setItem('cosmos:settings', data.settings);

    // Apply real data payloads
    Object.entries(data.realmsData).forEach(([key, value]) => {
      localStorage.setItem(key, value as string);
    });

    return true;
  } catch (err) {
    console.error('Validation and recovery failed:', err);
    throw err;
  }
}

export async function validateAndImportZIP(zipBlob: Blob): Promise<boolean> {
  try {
    const zip = await JSZip.loadAsync(zipBlob);
    const dbFile = zip.file('cosmos_database_sync.json');
    
    if (!dbFile) {
      throw new Error('COSMOS sync database not found inside the ZIP bundle.');
    }

    const jsonString = await dbFile.async('string');
    return await validateAndImportJSON(jsonString);
  } catch (err) {
    console.error('ZIP restore cycle failed:', err);
    throw err;
  }
}
