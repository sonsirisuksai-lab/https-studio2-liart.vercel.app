import React from 'react';
import { MediaHubProvider } from '../cosmos-design/context/MediaHubContext';
import { Group1_MediaHub } from '../cosmos-design/components/Group1_MediaHub';

const MediaHubPage: React.FC = () => {
  return (
    <MediaHubProvider>
      <Group1_MediaHub />
    </MediaHubProvider>
  );
};

export default MediaHubPage;
