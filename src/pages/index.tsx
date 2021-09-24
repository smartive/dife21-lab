import type { NextPage } from 'next';
import React from 'react';
import { TensorFlow } from '../component/tensor-flow';

const Home: NextPage = () => {
  return (
    <div>
      <header className="pb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Pre-Trained Generic Model</h1>
      </header>
      <main>
        <TensorFlow />
      </main>
    </div>
  );
};

export default Home;
