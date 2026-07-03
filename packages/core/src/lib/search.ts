import { db } from '@cosmos/web/src/lib/db'; // Import from @cosmos/web workspace package

export interface SearchResult {
  id: string;
  realm: string;
  type: string;
  title: string;
  content: string;
  updatedAt: number;
}

export async function searchAllRealms(query: string, filterRealm?: string): Promise<SearchResult[]> {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase();
  
  try {
    // Read all items from Dexie database
    const allEntities = await db.entities.toArray();
    
    let filtered = allEntities.filter(entity => {
      const matchTitle = (entity.title || '').toLowerCase().includes(normalizedQuery);
      const matchContent = (entity.content || '').toLowerCase().includes(normalizedQuery);
      const matchTags = entity.tags ? entity.tags.some((t: string) => t.toLowerCase().includes(normalizedQuery)) : false;
      
      return matchTitle || matchContent || matchTags;
    });

    if (filterRealm && filterRealm !== 'all') {
      filtered = filtered.filter(entity => entity.realm === filterRealm);
    }

    return filtered.map(entity => ({
      id: entity.id,
      realm: entity.realm,
      type: entity.type,
      title: entity.title,
      content: entity.content,
      updatedAt: entity.updatedAt,
    }));
  } catch (err) {
    console.error('Core search cycle interrupted:', err);
    return [];
  }
}
