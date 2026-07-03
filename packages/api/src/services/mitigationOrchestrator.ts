import { RobinMemoryAgent, RobinMemoryInput, RobinMemoryOutput } from './crewEngine';

// Defines the expected interface for the WebSocket hub based on prior architecture context
interface CosmosHub {
  broadcast: (payload: { type: string; data: any }) => void;
}

// Simulated import/stub for cosmosHub. In a real environment, this connects to the WS server.
// import { cosmosHub } from '../cosmosHub';
const cosmosHub: CosmosHub = {
  broadcast: (payload) => {
    // Fallback stub if not defined globally
    console.log('[COSMOS_HUB_BROADCAST]', JSON.stringify(payload));
  }
};

class MitigationOrchestrator {
  private isMitigating: boolean = false;
  private activeMitigationPromise: Promise<RobinMemoryOutput | null> | null = null;
  private readonly robin: RobinMemoryAgent;

  constructor() {
    this.robin = new RobinMemoryAgent();

    // Bind Robin's internal telemetry to the global WebSocket hub
    this.robin.on('agent:thought', (payload) => {
      cosmosHub.broadcast({ type: 'agent:thought', data: { displayName: 'Robin', ...payload } });
    });
    this.robin.on('agent:dispatch_start', (payload) => {
      cosmosHub.broadcast({ type: 'agent:dispatch_start', data: { displayName: 'Robin', ...payload } });
    });
    this.robin.on('agent:dispatch_complete', (payload) => {
      cosmosHub.broadcast({ type: 'agent:dispatch_complete', data: { displayName: 'Robin', ...payload } });
    });
    this.robin.on('agent:error', (payload) => {
      cosmosHub.broadcast({ type: 'agent:error', data: { displayName: 'Robin', ...payload } });
    });
  }

  /**
   * Emergency Interception Logic
   * Triggers the RobinMemoryAgent to snapshot system state and cache it locally.
   * Uses an idempotent lock to ensure multiple concurrent trips don't cause race conditions.
   */
  public async handleTokenCrisis(agentId: string, currentSnapshot: any): Promise<RobinMemoryOutput | null> {
    // Idempotent Concurrency Control: If a mitigation is already in flight, return the existing Promise.
    if (this.isMitigating && this.activeMitigationPromise) {
      cosmosHub.broadcast({
        type: 'system:mitigation_duplicate_intercepted',
        data: { agentId, timestamp: Date.now(), message: 'Crisis already being handled. Awaiting lock release.' }
      });
      return this.activeMitigationPromise;
    }

    // Acquire lock
    this.isMitigating = true;

    // Broadcast emergency system state to the Lovable Frontend Console
    cosmosHub.broadcast({
      type: 'system:mitigation_active',
      data: {
        agentId,
        snapshot: currentSnapshot,
        timestamp: Date.now(),
        message: '🚨 TOKEN BUDGET CRITICAL (<5%). INITIATING ROBIN OFFLINE FALLBACK PROTOCOL.'
      }
    });

    const robinInput: RobinMemoryInput = {
      statusData: currentSnapshot,
      isCriticalFallback: true,
    };

    // Execute the mitigation sequence
    this.activeMitigationPromise = this.robin.execute('execute_token_crisis_mitigation', robinInput)
      .then((result: RobinMemoryOutput | null) => {
        // Broadcast successful mitigation
        cosmosHub.broadcast({
          type: 'system:mitigation_complete',
          data: {
            timestamp: Date.now(),
            savedPath: result?.savedPath,
            message: 'OFFLINE FALLBACK SECURED. AWAITING TOKEN RECHARGE.'
          }
        });
        return result;
      })
      .catch((error: any) => {
        // Ensure the global feed knows mitigation failed
        cosmosHub.broadcast({
          type: 'system:mitigation_failed',
          data: {
            timestamp: Date.now(),
            error: error instanceof Error ? error.message : String(error)
          }
        });
        return null;
      })
      .finally(() => {
        // Release lock
        this.isMitigating = false;
        this.activeMitigationPromise = null;
      });

    return this.activeMitigationPromise;
  }
}

export const mitigationOrchestrator = new MitigationOrchestrator();

// Export the primary entrypoint directly for the tokenGuard.ts middleware to consume
export const handleTokenCrisis = (agentId: string, currentSnapshot: any) => 
  mitigationOrchestrator.handleTokenCrisis(agentId, currentSnapshot);
