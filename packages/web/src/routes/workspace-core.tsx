import React from 'react';
import { DocumentCoreProvider } from '../cosmos-design/context/DocumentCoreContext';
import { Group2_DocumentCore } from '../cosmos-design/components/Group2_DocumentCore';

const WorkspaceCorePage: React.FC = () => {
  return (
    <DocumentCoreProvider>
      <Group2_DocumentCore />
    </DocumentCoreProvider>
  );
};

export default WorkspaceCorePage;
