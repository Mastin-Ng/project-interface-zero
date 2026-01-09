import React from 'react';
import { ArrowRight, Cpu, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onStartDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartDemo }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-tech-darker">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tech-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tech-green/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-tech-cyan/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-tech-cyan/30 text-tech-cyan mb-8 animate-fade-in-up">
          <Cpu size={16} />
          <span className="text-sm font-medium tracking-wide">{t.hero.tag}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          {t.hero.title_prefix} <span className="gradient-text">{t.hero.title_suffix}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto font-light">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tech-blue to-tech-cyan flex items-center justify-center font-bold text-white text-lg">
              JW
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">NG Jun Wei</div>
              <div className="text-sm text-tech-cyan">{t.hero.role}</div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-700"></div>
          <div className="text-slate-400 text-sm max-w-xs text-left">
            {t.hero.focus}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStartDemo}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-tech-blue hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            <Play size={20} className="fill-current" />
            {t.hero.btn_demo}
          </button>
          
          <button 
            onClick={() => document.getElementById('pain-point')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg font-semibold transition-all duration-300"
          >
            {t.hero.btn_proposal}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Decorative Grid */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-tech-darker to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;