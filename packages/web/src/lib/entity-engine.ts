import { db, Entity } from './db';
import { v4 as uuidv4 } from 'uuid';

export const EntityEngine = {
  create: async (data: Partial<Entity> & { type: string }) => {
    const id = data.id || uuidv4();
    const now = Date.now();
    const entity: Entity = {
      id,
      type: data.type,
      title: data.title || '',
      content: data.content || '',
      realm: data.realm || 'core',
      tags: data.tags || [],
      status: data.status,
      metadata: data.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
    await db.entities.put(entity);
    return entity;
  },
  update: async (id: string, data: Partial<Entity>) => {
    const existing = await db.entities.get(id);
    if (!existing) return;
    const updated: Entity = {
      ...existing,
      ...data,
      updatedAt: Date.now(),
    };
    await db.entities.put(updated);
    return updated;
  },
  delete: async (id: string) => {
    await db.entities.delete(id);
  },
  list: async (type: string) => {
    return await db.entities.where('type').equals(type).toArray();
  }
};
