import React from 'react';
import { PersonalSpaceProvider } from '../cosmos-design/context/PersonalSpaceContext';
import { Group4_PersonalSpace } from '../cosmos-design/components/Group4_PersonalSpace';

const PersonalSpacePage: React.FC = () => {
  return (
    <PersonalSpaceProvider>
      <Group4_PersonalSpace />
    </PersonalSpaceProvider>
  );
};

export default PersonalSpacePage;
