import Dexie, { Table } from 'dexie';

export interface CrisisLog {
  id?: number;
  agentId: string;
  timestamp: string;
  savedPath: string;
  yamlFrontmatter: string;
  statusSnapshot: string;
}

export interface Entity {
  id: string;
  type: string;
  title: string;
  content: string;
  realm: string;
  tags: string[];
  status?: string;
  metadata?: any;
  createdAt: number;
  updatedAt: number;
}

export class CosmosDatabase extends Dexie {
  cosmos_crisis_logs!: Table<CrisisLog, number>;
  entities!: Table<any, any>;

  constructor() {
    super('CosmosArchiveDB');
    this.version(1).stores({
      cosmos_crisis_logs: '++id, agentId, timestamp, savedPath',
      entities: 'id, type, title, realm, status, createdAt, updatedAt'
    });
  }
}

export const db = new CosmosDatabase();
