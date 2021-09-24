import type { NextPage } from 'next';
import React from 'react';
import { TensorFlow, TensorFlowMode } from '../component/tensor-flow';

const Training: NextPage = () => {
  return (
    <div>
      <header className="pb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Train Your Own Model</h1>
      </header>
      <main>
        <TensorFlow mode={TensorFlowMode.Training} />
      </main>
    </div>
  );
};

export default Training;
