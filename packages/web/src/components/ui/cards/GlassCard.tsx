import React from 'react';
import { Glass } from '@/components/aether/Glass3D';

export const GlassCard: React.FC<any> = ({ children, className, ...props }) => (
  <Glass className={`p-6 ${className}`} {...props}>
    {children}
  </Glass>
);
