import React from 'react';
import { Rocket, ShieldCheck, BrainCog } from 'lucide-react';

const Advantage: React.FC = () => {
  return (
    <section className="py-24 bg-tech-darker relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-tech-blue/5 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          The <span className="text-white">"Interface Zero"</span> Advantage
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group glass-panel p-8 rounded-2xl border border-slate-800 hover:border-tech-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300">
            <div className="mb-6 flex justify-between items-start">
              <div className="p-4 rounded-xl bg-tech-cyan/10 text-tech-cyan group-hover:scale-110 transition-transform duration-300">
                <Rocket size={32} />
              </div>
              <div className="text-2xl font-bold text-tech-cyan">30-40%</div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Velocity</h3>
            <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">From Serial to Parallel</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Before: Frontend blocked by backend.<br/>
              After: <span className="text-white">Zero-Wait Workflow.</span> Frontend & Backend in parallel.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group glass-panel p-8 rounded-2xl border border-slate-800 hover:border-tech-green/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300">
            <div className="mb-6 flex justify-between items-start">
              <div className="p-4 rounded-xl bg-tech-green/10 text-tech-green group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={32} />
              </div>
              <div className="px-2 py-1 bg-green-900/30 rounded border border-green-500/30 text-xs font-mono text-green-400">.d.ts</div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Stability</h3>
            <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">Eliminate Type-Mismatches</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              The Risk: Runtime Errors from silent backend changes.<br/>
              The Solution: AI-generated <span className="text-white">strict Type Safety</span> for Compile-Time validation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group glass-panel p-8 rounded-2xl border border-slate-800 hover:border-tech-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300">
            <div className="mb-6 flex justify-between items-start">
              <div className="p-4 rounded-xl bg-tech-blue/10 text-tech-blue group-hover:scale-110 transition-transform duration-300">
                <BrainCog size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Efficiency</h3>
            <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">Operational Cost Reduction</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Focus on Logic, Not Boilerplate.<br/>
              Faster Onboarding with clean, <span className="text-white">AI-generated documentation</span>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Advantage;