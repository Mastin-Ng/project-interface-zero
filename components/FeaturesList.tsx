import React from 'react';
import { Layout, MessageSquareCode, Zap, Database, Play, MonitorPlay } from 'lucide-react';

const FeaturesList: React.FC = () => {
  const features = [
    {
      icon: <Layout className="text-tech-blue" size={32} />,
      title: "Adaptive UI Engine",
      description: "Intelligent layout strategy that automatically switches between 'Visual Gallery' and 'High-Density Table' views based on entity structure analysis (e.g., detecting images vs. data fields)."
    },
    {
      icon: <MessageSquareCode className="text-tech-green" size={32} />,
      title: "Comment-Driven Directives",
      description: "Parses standard C# comments to control mock data. Supports ranges (// 100-500), enum options (// \"Active\", \"Inactive\"), and semantic types (// email, // phone)."
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: "Instant Transpilation",
      description: "Real-time parsing of C# POCO classes into strict TypeScript interfaces (.d.ts), handling Nullable types (?), Lists, and Primitives accurately."
    },
    {
      icon: <Database className="text-tech-cyan" size={32} />,
      title: "Context-Aware Mocking",
      description: "Auto-generates realistic data by analyzing property names. Knows that 'ThumbnailUrl' needs an image URL and 'GameId' needs an integer, without manual config."
    },
    {
      icon: <Play className="text-purple-400" size={32} />,
      title: "Interactive Sandbox",
      description: "A fully interactive code editor allowing developers to paste any C# Entity class and instantly visualize the resulting Frontend UI and Data."
    },
    {
      icon: <MonitorPlay className="text-red-400" size={32} />,
      title: "Zero-Wait Live Preview",
      description: "Immediately renders generated React components with hot-swappable mock data, enabling frontend development to finish before the backend API is even deployed."
    }
  ];

  return (
    <section className="py-24 bg-tech-darker relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-2 border-dashed border-tech-blue/30 rounded-3xl p-8 md:p-16 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Implemented Capabilities</h2>
            <p className="text-xl text-slate-400">Detailed breakdown of the current system features</p>
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