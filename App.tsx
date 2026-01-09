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
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Languages } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [view, setView] = useState<'landing' | 'demo'>('landing');
  const { language, toggleLanguage } = useLanguage();

  const handleDemoExit = () => setView('landing');

  return (
    <div className="min-h-screen bg-tech-darker text-white selection:bg-tech-cyan selection:text-black relative">
       {/* Language Toggle Button */}
       <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-full hover:bg-slate-800 transition-all shadow-lg text-sm font-bold group"
      >
        <Languages size={16} className="text-tech-cyan group-hover:rotate-180 transition-transform duration-500" />
        <span className={`${language === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</span>
        <span className="text-slate-600">/</span>
        <span className={`${language === 'zh' ? 'text-white' : 'text-slate-500'}`}>中</span>
      </button>

      {view === 'demo' ? (
        <DemoFlow onExit={handleDemoExit} />
      ) : (
        <>
          <Hero onStartDemo={() => setView('demo')} />
          <PainPoint />
          <SolutionDiagram />
          <AnalysisResults />
          <Advantage />
          <FeaturesList />
          <ComparisonFlow />
          <Footer />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
};

export default App;