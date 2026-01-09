import React from 'react';
import { Layout, MessageSquareCode, Zap, Database, Play, MonitorPlay } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturesList: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Layout className="text-tech-blue" size={32} />,
      title: t.features.f1_title,
      description: t.features.f1_desc
    },
    {
      icon: <MessageSquareCode className="text-tech-green" size={32} />,
      title: t.features.f2_title,
      description: t.features.f2_desc
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: t.features.f3_title,
      description: t.features.f3_desc
    },
    {
      icon: <Database className="text-tech-cyan" size={32} />,
      title: t.features.f4_title,
      description: t.features.f4_desc
    },
    {
      icon: <Play className="text-purple-400" size={32} />,
      title: t.features.f5_title,
      description: t.features.f5_desc
    },
    {
      icon: <MonitorPlay className="text-red-400" size={32} />,
      title: t.features.f6_title,
      description: t.features.f6_desc
    }
  ];

  return (
    <section className="py-24 bg-tech-darker relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-2 border-dashed border-tech-blue/30 rounded-3xl p-8 md:p-16 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-xl text-slate-400">{t.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-xl group">
                <div className="mb-6 bg-slate-900/50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-tech-cyan transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;