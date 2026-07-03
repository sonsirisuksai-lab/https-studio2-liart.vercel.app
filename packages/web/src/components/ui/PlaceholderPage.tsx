import React from 'react';
import { Heading } from '@/components/aether/Typography';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <Heading>{title}</Heading>
    <p className="opacity-60 mt-4">This module is currently being synthesized...</p>
  </div>
);

export default PlaceholderPage;
