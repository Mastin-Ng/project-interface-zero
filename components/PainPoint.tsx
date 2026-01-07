import React from 'react';
import { Clock, AlertTriangle, Link2, FileCode, Search, Ban } from 'lucide-react';

const PainPoint: React.FC = () => {
  return (
    <section id="pain-point" className="py-24 bg-tech-dark relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Pain Point</h2>
          <p className="text-xl text-slate-400">The "Waiting & Guessing Game"</p>
          <div className="w-20 h-1 bg-tech-blue mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: List of Pains */}
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl border-l-4 border-red-500 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Backend Dependency</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Our <code className="text-xs bg-slate-900 px-1 py-0.5 rounded">AFBPlaySolution</code> is a backend-driven monolith. Frontend work is frequently blocked, waiting for backend APIs to be completed or documented.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border-l-4 border-orange-500 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                  <Link2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Silent Breakers</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Backend changes to C# Entities are often communicated late or not at all, leading to immediate <span className="text-orange-400">Runtime Errors</span> upon deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border-l-4 border-yellow-500 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500 shrink-0">
                  <FileCode size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Complex Logic Sprawl</h3>
                  <p className="text-slate-400 leading-relaxed">
                    The API is entangled with heavy business logic, making it incredibly difficult for frontend devs to extract a clean, usable JSON structure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Representation */}
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent blur-3xl rounded-full" />
             <div className="relative glass-panel p-8 rounded-2xl border border-slate-700">
                <div className="flex flex-col items-center gap-6">
                    {/* Backend */}
                    <div className="w-full p-4 bg-slate-900 rounded-lg border border-slate-700 flex flex-col items-center text-center opacity-70">
                        <div className="text-slate-500 font-mono text-xs mb-2">BACKEND (C#)</div>
                        <FileCode className="text-slate-600 mb-2" />
                        <div className="h-2 w-3/4 bg-slate-800 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                    </div>
                    
                    {/* The Wall */}
                    <div className="w-full flex items-center justify-center py-4 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-full bg-slate-600"></div>
                        </div>
                        <div className="z-10 bg-slate-800 px-4 py-2 rounded-full border border-slate-600 flex items-center gap-2 text-red-400 font-bold text-sm shadow-lg">
                             <Ban size={16} /> THE BARRIER
                        </div>
                    </div>

                    {/* Frontend */}
                    <div className="w-full p-4 bg-slate-900 rounded-lg border border-red-900/50 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-2 right-2 animate-pulse">
                            <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <div className="text-slate-500 font-mono text-xs mb-2">FRONTEND (Waiting)</div>
                        <Search className="text-slate-600 mb-2" />
                        <div className="text-xs text-red-400 font-mono">Uncaught TypeError: undefined</div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoint;