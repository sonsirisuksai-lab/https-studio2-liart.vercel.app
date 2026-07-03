import React from 'react';
import { Glass } from './Glass3D';

export const RuiBoConsole = (props: any) => (
  <Glass className="p-4 h-full">
    <div className="font-mono text-xs text-green-400 opacity-80">
      <div>&gt; INITIALIZING COSMOS_OS_V5...</div>
      <div>&gt; KERNEL_STABLE_LOADED</div>
      <div>&gt; READY_FOR_INPUT</div>
      {props.completionPercentage && <div>&gt; COMPLETION: {props.completionPercentage}%</div>}
    </div>
  </Glass>
);
