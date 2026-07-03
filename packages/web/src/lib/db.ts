import Dexie, { Table } from 'dexie';

export interface Entity {
  id: string;
  type: string;
  title: string;
  content: any;
  realm: string;
  tags: string[];
  status?: string;
  metadata?: any;
  createdAt: number;
  updatedAt: number;
}

export class CosmosDatabase extends Dexie {
  entities!: Table<Entity>;

  constructor() {
    super('CosmosDB');
    this.version(1).stores({
      entities: 'id, type, realm, updatedAt, *tags'
    });
  }
}

export const db = new CosmosDatabase();
