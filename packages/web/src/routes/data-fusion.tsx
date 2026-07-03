import React from 'react';
import { DataFusion } from '@/components/cosmos';

const DataFusionPage = () => {
  return (
    <div className="min-h-[80vh] w-full max-w-6xl mx-auto px-6 py-8 relative">
      <div className="bg-black/15 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-3xl">
        <DataFusion />
      </div>
    </div>
  );
};

export default DataFusionPage;
