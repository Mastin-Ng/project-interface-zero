import React from 'react';
import { ANALYSIS_DATA } from '../constants';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const AnalysisResults: React.FC = () => {
  return (
    <section className="py-24 bg-tech-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Gemini Codebase Analysis</h2>
            <p className="text-slate-400">Automated Architecture Recognition Results</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-700">File Path</th>
                <th className="p-4 font-semibold border-b border-slate-700">Component Type</th>
                <th className="p-4 font-semibold border-b border-slate-700 w-1/3">Gemini Analysis (Insights)</th>
                <th className="p-4 font-semibold border-b border-slate-700">Actionability</th>
                <th className="p-4 font-semibold border-b border-slate-700">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40 backdrop-blur-sm">
              {ANALYSIS_DATA.map((row, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-tech-cyan">{row.path}</td>
                  <td className="p-4 text-sm font-medium text-white">{row.type}</td>
                  <td className="p-4 text-sm text-slate-400 leading-relaxed">{row.insight}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                      ${row.actionability === 'High' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        row.actionability === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        row.actionability === 'Low' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                      {row.actionability === 'High' && <CheckCircle2 size={12} />}
                      {row.actionability === 'Medium' && <AlertCircle size={12} />}
                      {row.actionability === 'Low' && <XCircle size={12} />}
                      {row.actionability}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;