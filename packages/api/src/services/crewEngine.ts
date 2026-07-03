import { EventEmitter } from 'events';

// ---------------------------------------------------------
// Core Types & Event Payloads
// ---------------------------------------------------------
export interface AgentThought {
  agentId: string;
  thought: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AgentDispatchStart {
  agentId: string;
  task: string;
  timestamp: number;
}

export interface AgentDispatchComplete<T = any> {
  agentId: string;
  task: string;
  result: T;
  timestamp: number;
}

export interface AgentError {
  agentId: string;
  error: string;
  timestamp: number;
}

// ---------------------------------------------------------
// BaseCrewAgent Abstract Class
// ---------------------------------------------------------
export abstract class BaseCrewAgent<TInput, TOutput> extends EventEmitter {
  protected abstract readonly agentId: string;
  
  constructor() {
    super();
  }

  protected emitThought(thought: string, metadata?: Record<string, any>) {
    const payload: AgentThought = {
      agentId: this.agentId,
      thought,
      timestamp: Date.now(),
      metadata,
    };
    this.emit('agent:thought', payload);
  }

  protected emitDispatchStart(task: string) {
    const payload: AgentDispatchStart = {
      agentId: this.agentId,
      task,
      timestamp: Date.now(),
    };
    this.emit('agent:dispatch_start', payload);
  }

  protected emitDispatchComplete(task: string, result: TOutput) {
    const payload: AgentDispatchComplete<TOutput> = {
      agentId: this.agentId,
      task,
      result,
      timestamp: Date.now(),
    };
    this.emit('agent:dispatch_complete', payload);
  }

  protected emitError(error: Error) {
    const payload: AgentError = {
      agentId: this.agentId,
      error: error.message,
      timestamp: Date.now(),
    };
    this.emit('agent:error', payload);
  }

  public async execute(task: string, input: TInput): Promise<TOutput | null> {
    try {
      this.emitDispatchStart(task);
      const result = await this.processTask(task, input);
      this.emitDispatchComplete(task, result);
      return result;
    } catch (error) {
      this.emitError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  protected abstract processTask(task: string, input: TInput): Promise<TOutput>;
}

// ---------------------------------------------------------
// Zoro: The Code Auditor Agent
// ---------------------------------------------------------
export interface ZoroAuditInput {
  filePath: string;
  code: string;
}

export interface ZoroAuditOutput {
  vulnerabilityCount: number;
  refinedCode: string;
  metrics: {
    complexityScore: number;
    securityRating: 'A' | 'B' | 'C' | 'D' | 'F';
  };
}

export class ZoroAuditorAgent extends BaseCrewAgent<ZoroAuditInput, ZoroAuditOutput> {
  protected readonly agentId = 'ZORO_AUDITOR';

  protected async processTask(task: string, input: ZoroAuditInput): Promise<ZoroAuditOutput> {
    this.emitThought(`เริ่มวิเคราะห์โครงสร้างไฟล์: ${input.filePath}`);
    
    // Simulate AST Parsing Delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.emitThought('กำลังตรวจสอบช่องโหว่ด้านความปลอดภัยและโครงสร้าง AST...', {
      target: input.filePath,
      action: 'security_audit'
    });
    
    // Naive vulnerability check for demonstration
    const hasVulnerability = input.code.includes('any') || input.code.includes('console.log');
    const vulnCnt = hasVulnerability ? (input.code.match(/any|console\.log/g)?.length || 0) : 0;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let fixedCode = input.code;
    if (hasVulnerability) {
      this.emitThought(`พบจุดอ่อนแอ ${vulnCnt} จุด กำลังชักดาบฟันโค้ดขยะ...`);
      fixedCode = input.code.replace(/console\.log\(.*?\);?/g, '/* [ZORO] Removed log */');
      fixedCode = fixedCode.replace(/: any/g, ': unknown');
    } else {
      this.emitThought('โครงสร้างแข็งแกร่งดี ไม่มีจุดอ่อนให้ฟัน');
    }

    return {
      vulnerabilityCount: vulnCnt,
      refinedCode: fixedCode,
      metrics: {
        complexityScore: Math.floor(Math.random() * 50) + 10,
        securityRating: hasVulnerability ? 'C' : 'A'
      }
    };
  }
}

// ---------------------------------------------------------
// Robin: The Knowledge Base & Memory Manager Agent
// ---------------------------------------------------------
export interface RobinMemoryInput {
  statusData: Record<string, any>;
  isCriticalFallback: boolean;
}

export interface RobinMemoryOutput {
  savedPath: string;
  yamlFrontmatter: string;
  indexed: boolean;
}

export class RobinMemoryAgent extends BaseCrewAgent<RobinMemoryInput, RobinMemoryOutput> {
  protected readonly agentId = 'ROBIN_MEMORY';

  protected async processTask(task: string, input: RobinMemoryInput): Promise<RobinMemoryOutput> {
    this.emitThought('รวบรวมประวัติศาสตร์และสร้างจุดเชื่อมโยงบริบท...');
    
    const timestamp = new Date().toISOString();
    const yaml = `---
title: System Context Archive
timestamp: ${timestamp}
critical_mode: ${input.isCriticalFallback}
tags: [cosmos, archive, memory, snapshot]
---
`;
    
    await new Promise(resolve => setTimeout(resolve, 400));

    if (input.isCriticalFallback) {
      this.emitThought('Token Guard แจ้งเตือนระดับวิกฤต กำลังเขียนบันทึกประวัติศาสตร์ลง Local Storage (Dexie)...', {
        fallbackEnabled: true,
        action: 'write_offline_cache'
      });
      // Simulate writing to virtual local storage fallback
      await new Promise(resolve => setTimeout(resolve, 800));
      this.emitThought('บันทึกออฟไลน์เสร็จสมบูรณ์ ความรู้ยังคงปลอดภัย');
    } else {
      this.emitThought('สถานะปกติ กำลังแปลงข้อมูลเป็น Markdown และจัดเก็บในคลังความรู้ Obsidian...');
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    return {
      savedPath: \`/vault/cosmos_status_\${Date.now()}.md\`,
      yamlFrontmatter: yaml,
      indexed: true
    };
  }
}
