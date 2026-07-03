import React from 'react';
import { AiCenterProvider } from '../cosmos-design/context/AiCenterContext';
import { Group3_AiCenter } from '../cosmos-design/components/Group3_AiCenter';

const AiCenterPage: React.FC = () => {
  return (
    <AiCenterProvider>
      <Group3_AiCenter />
    </AiCenterProvider>
  );
};

export default AiCenterPage;
