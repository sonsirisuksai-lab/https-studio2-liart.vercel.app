import React from 'react';
import { Glass } from '@/components/aether/Glass3D';
import { Heading, Body } from '@/components/aether/Typography';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color, onClick }) => (
  <Glass 
    className="p-6 cursor-pointer group hover:border-white/20"
    onClick={onClick}
  >
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}20`, color }}>
      {icon}
    </div>
    <Heading size="20" className="mb-2">{title}</Heading>
    <Body size="14">{description}</Body>
  </Glass>
);
