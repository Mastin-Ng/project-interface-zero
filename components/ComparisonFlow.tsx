import React from 'react';
import { X, Check, Clock, Zap, Rocket } from 'lucide-react';

const ComparisonFlow: React.FC = () => {
  return (
    <section className="py-24 bg-tech-dark">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-16 text-center">Workflow Transformation</h2>

        <div className="space-y-16">
          {/* BEFORE */}
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm font-bold tracking-wider">BEFORE</div>
              <span className="text-slate-400">Serial & Blocked</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 relative">
              {/* Step 1 */}
              <div className="flex-1 w-full bg-slate-800 p-6 rounded-lg border border-slate-700 text-center relative grayscale">
                <div className="text-slate-300 font-semibold">Backend</div>
                <div className="text-xs text-slate-500">C# / AFBPlaySolution</div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-red-500 rounded-full p-1 text-white">
                    <X size={14} />
                </div>
              </div>

              {/* Waiting Block */}
              <div className="flex-none w-32 flex flex-col items-center justify-center text-red-400 animate-pulse">
                <Clock size={32} />
                <span className="text-xs font-bold mt-1">WAITING...</span>
                <span className="text-[10px] opacity-70">Days/Weeks</span>
              </div>

              {/* Step 2 */}
              <div className="flex-1 w-full bg-slate-800 p-6 rounded-lg border border-slate-700 text-center grayscale opacity-70">
                 <div className="text-slate-300 text-sm">Manual API Docs</div>
              </div>
              
              <div className="hidden md:block w-8 border-t-2 border-slate-700 border-dashed"></div>

              {/* Step 3 */}
              <div className="flex-1 w-full bg-slate-800 p-6 rounded-lg border border-slate-700 text-center grayscale opacity-70">
                 <div className="text-slate-300 text-sm">Manual Typing</div>
              </div>

               <div className="hidden md:block w-8 border-t-2 border-slate-700 border-dashed"></div>

               {/* Step 4 */}
               <div className="flex-1 w-full bg-green-900/20 p-6 rounded-lg border border-green-900/50 text-center grayscale opacity-50">
                 <div className="text-green-500 font-semibold">Develop UI</div>
              </div>
            </div>
            <p className="text-center text-red-400/70 mt-4 text-sm">Slow, Error-Prone, High Dependency</p>
          </div>

          {/* AFTER */}
          <div className="relative">
             <div className="absolute inset-0 bg-tech-blue/5 rounded-3xl -m-8"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-bold tracking-wider">AFTER</div>
                <span className="text-white font-medium">Project Interface Zero: Parallel & Instant</span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Step 1 */}
                <div className="flex-none w-full md:w-48 bg-tech-blue/20 p-6 rounded-lg border border-tech-blue/40 text-center">
                    <div className="text-white font-semibold">Backend</div>
                    <div className="text-xs text-tech-cyan">C# / Entities</div>
                </div>

                {/* AI Magic */}
                <div className="flex-1 w-full relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-purple-900/80 to-pink-900/80 p-6 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center text-center">
                        <Zap className="text-yellow-400 mb-2 fill-yellow-400" size={24} />
                        <div className="text-white font-bold text-sm">Auto-Generate</div>
                        <div className="text-xs text-purple-200">Interfaces & Mock Data</div>
                    </div>
                    {/* Lightning Bolts */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400">
                        <Zap size={40} className="fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                    </div>
                </div>

                {/* Parallel Output */}
                <div className="flex flex-col gap-3 w-full md:w-48">
                    <div className="bg-tech-blue/20 p-3 rounded border border-tech-blue/40 text-center">
                        <div className="text-xs text-tech-blue font-bold">Strict Type Safety</div>
                    </div>
                    <div className="bg-tech-cyan/20 p-3 rounded border border-tech-cyan/40 text-center">
                        <div className="text-xs text-tech-cyan font-bold">Realistic Mock JSON</div>
                    </div>
                </div>

                {/* Result */}
                 <div className="flex-none w-full md:w-48 bg-tech-green/20 p-6 rounded-lg border border-tech-green/40 text-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <div className="text-white font-semibold flex items-center justify-center gap-2">
                        <Rocket size={16} />
                        <span>Frontend</span>
                    </div>
                    <div className="text-xs text-tech-green mt-1">IMMEDIATELY Develops UI</div>
                </div>

                </div>
                 <p className="text-center text-green-400 mt-6 text-sm font-medium">Zero-Wait, Type-Safe, Parallel Sprint.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonFlow;