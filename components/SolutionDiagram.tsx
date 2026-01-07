import React from 'react';
import { Database, FileJson, ArrowRight, BrainCircuit, Code2 } from 'lucide-react';

const SolutionDiagram: React.FC = () => {
  return (
    <section className="py-24 bg-tech-darker relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                The Solution
            </h2>
            <p className="text-xl text-tech-cyan">Gemini as an Intelligent Middleware Transpiler</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            
            {/* INPUT */}
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-slate-500 flex flex-col items-center text-center group hover:border-slate-400 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Database size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Input (Ingestion)</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Direct Gemini to ingest specific <code className="text-tech-cyan">AFBPlayGameAPI</code> and <code className="text-tech-cyan">Entities</code> directories.
                </p>
                <div className="mt-auto w-full bg-slate-900/50 p-4 rounded text-left font-mono text-xs text-slate-500">
                    <div className="mb-1">/Source</div>
                    <div className="pl-4">├── Entities/</div>
                    <div className="pl-4">└── API/</div>
                </div>
            </div>

            {/* PROCESS */}
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-tech-blue flex flex-col items-center text-center relative neon-glow">
                <div className="absolute top-1/2 -left-4 hidden lg:block text-slate-600">
                    <ArrowRight size={24} />
                </div>
                <div className="absolute top-1/2 -right-4 hidden lg:block text-slate-600">
                    <ArrowRight size={24} />
                </div>
                
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-tech-blue to-tech-cyan flex items-center justify-center mb-6 animate-pulse">
                    <BrainCircuit size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Process (Analysis)</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Gemini parses raw C# definitions to understand data types, relationships, and nullable fields.
                </p>
                <div className="mt-auto flex items-center gap-2 text-tech-cyan font-mono text-sm bg-tech-blue/10 px-4 py-2 rounded-full">
                    <Code2 size={14} />
                    <span>C# Class → AST Analysis</span>
                </div>
            </div>

            {/* OUTPUT */}
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-tech-green flex flex-col items-center text-center group hover:border-green-400 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-green-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileJson size={32} className="text-tech-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Output (Generation)</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Automatically generates strict TypeScript Interfaces (.d.ts) and realistic Mock JSON Data.
                </p>
                <div className="mt-auto w-full space-y-2">
                    <div className="w-full bg-slate-900 p-2 rounded flex items-center justify-between border border-green-900/30">
                        <span className="text-xs font-mono text-green-400">types.d.ts</span>
                        <span className="text-[10px] bg-green-900/50 text-green-300 px-1 rounded">Generated</span>
                    </div>
                    <div className="w-full bg-slate-900 p-2 rounded flex items-center justify-between border border-green-900/30">
                        <span className="text-xs font-mono text-green-400">mockData.json</span>
                        <span className="text-[10px] bg-green-900/50 text-green-300 px-1 rounded">Generated</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionDiagram;