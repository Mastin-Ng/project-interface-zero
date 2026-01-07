import React, { useState } from 'react';
import Hero from './components/Hero';
import PainPoint from './components/PainPoint';
import SolutionDiagram from './components/SolutionDiagram';
import AnalysisResults from './components/AnalysisResults';
import Advantage from './components/Advantage';
import ComparisonFlow from './components/ComparisonFlow';
import FeaturesList from './components/FeaturesList';
import Footer from './components/Footer';
import DemoFlow from './components/DemoFlow';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'demo'>('landing');

  if (view === 'demo') {
    return <DemoFlow onExit={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-tech-darker text-white selection:bg-tech-cyan selection:text-black">
      <Hero onStartDemo={() => setView('demo')} />
      <PainPoint />
      <SolutionDiagram />
      <AnalysisResults />
      <Advantage />
      <FeaturesList />
      <ComparisonFlow />
      <Footer />
    </div>
  );
};

export default App;