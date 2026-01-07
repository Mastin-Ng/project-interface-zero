import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Code2, Database, Zap, Layout, CheckCircle2, Loader2, FileJson, RefreshCw, Edit3, Tag, Check, X, Table, Grid, BrainCircuit, Lightbulb, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Default initial code
const DEFAULT_CSHARP_CODE = `namespace AFBPlay.Entities 
{
    /// <summary>
    /// Core game definition for Casino Lobby
    /// </summary>
    public class GameInfo 
    {
        public int GameId { get; set; } // 1000-9999
        public string DisplayName { get; set; }
        public string? ThumbnailUrl { get; set; }
        public decimal CurrentJackpot { get; set; } // 5000-500000
        public string Status { get; set; } // "Active", "Maintenance", "Coming Soon"
        public List<string> Tags { get; set; } // "Hot", "New", "Jackpot"
    }
}`;

type LayoutStrategy = 'gallery' | 'table' | 'simple-card';

interface GeneratedResult {
    className: string;
    tsCode: string;
    jsonCode: string;
    mockDataObj: any[];
    layoutStrategy: LayoutStrategy;
    properties: { name: string; type: string; isArray: boolean; isNullable: boolean; comment?: string }[];
    reactComponentCode: string;
    designRationale: string;
}

// Fallback logic in case API Key is missing (to prevent demo crash)
const fallbackParse = (csharp: string): GeneratedResult => {
    return {
        className: "FallbackEntity",
        tsCode: "// API Key missing or API call failed.",
        jsonCode: "[]",
        mockDataObj: [],
        layoutStrategy: "simple-card",
        properties: [],
        reactComponentCode: "// AI Generation Failed.\n// Please check API Key.",
        designRationale: "System fallback due to connection error."
    }
};

interface DemoFlowProps {
  onExit: () => void;
}

const DemoFlow: React.FC<DemoFlowProps> = ({ onExit }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csharpCode, setCsharpCode] = useState(DEFAULT_CSHARP_CODE);
  
  // Generated Assets
  const [generated, setGenerated] = useState<GeneratedResult | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [streamedTS, setStreamedTS] = useState('');
  const [streamedJSON, setStreamedJSON] = useState('');

  // Refs for animation cleanup
  const tsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jsonIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jsonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle Input Change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCsharpCode(e.target.value);
  };

  // --- REAL AI IMPLEMENTATION ---
  const callGeminiAPI = async (code: string) => {
    setIsProcessing(true);
    setGenerated(null); // Clear previous data immediately
    setStreamedTS('');
    setStreamedJSON('');
    setErrorMsg(null);
    setStep(2); // Move to processing step immediately

    try {
        if (!process.env.API_KEY) {
            throw new Error("Missing API_KEY in environment variables.");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemPrompt = `
        You are an expert Backend-to-Frontend Transpiler and UI Architect.
        
        CRITICAL INSTRUCTION FOR MULTI-CLASS INPUT:
        The input C# code MAY contain multiple classes (e.g., Filters, Params, Views, Entities).
        1. You must scan ALL classes defined in the code.
        2. Select ONE "Primary Entity" to generate the Mock Data and UI for.
           - Rule 1: Prioritize classes with "Info", "View", "Agent", "Game", "User" in the name.
           - Rule 2: Prioritize classes with the most public properties (Count them!).
           - Rule 3: IGNORE classes ending in "Filter", "Param", "Request", "Response" (e.g. AgentFilter, DeleteParam).
           - Rule 4: 'afbAgent' is extremely important. If present, select it.
        3. For 'tsCode', generate interfaces for ALL detected classes.

        Your tasks:
        1. Identify the Primary Entity.
        2. Generate strict TypeScript Interfaces (.d.ts) for ALL classes found (Primary first).
        3. Create realistic Mock Data (JSON) for the PRIMARY Entity only. Use property names and comments to infer data.
        4. Decide the best UI Layout Strategy ('gallery', 'table', 'simple-card').
           - Use 'table' for data-heavy entities (like Agents, Users, Logs).
           - Use 'gallery' for items with images (ThumbnailUrl, ImageUrl).
        5. Generate the ACTUAL React Component Code (tsx) for the Primary Entity.
           - STYLE GUIDE: DARK MODE (Tailwind CSS).
           - Container: 'w-full overflow-hidden rounded-lg border border-slate-700 shadow-xl'.
           - Table Header: 'bg-slate-800 text-slate-200 uppercase font-bold text-xs tracking-wider'.
           - Table Row: 'border-b border-slate-700 hover:bg-slate-800/50 transition-colors bg-slate-900'.
           - Cells: 'px-6 py-4 text-sm text-slate-300 font-mono'.
           - Badges: Use specific colors (e.g., Active=bg-green-900/50 text-green-400).
        6. Provide a 'designRationale': Explain which class you selected as Primary and why.

        Output JSON only. Ensure strictly valid JSON.
        `;

        // Switch to generateContentStream to handle long generation times and prevent timeouts
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview', 
            contents: `Analyze this C# code:\n${code}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.1, // Reduced for stability and determinism
                topP: 0.8, // More focused sampling to reduce hallucinations
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        className: { type: Type.STRING, description: "The name of the Primary Entity selected" },
                        tsCode: { type: Type.STRING, description: "TypeScript interfaces for ALL detected classes" },
                        jsonCode: { type: Type.STRING, description: "Stringified JSON array of 6 mock items for the Primary Entity" },
                        layoutStrategy: { type: Type.STRING, enum: ["gallery", "table", "simple-card"] },
                        properties: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    isArray: { type: Type.BOOLEAN },
                                    isNullable: { type: Type.BOOLEAN },
                                    comment: { type: Type.STRING, nullable: true }
                                }
                            }
                        },
                        reactComponentCode: { type: Type.STRING, description: "The specific React functional component code" },
                        designRationale: { type: Type.STRING, description: "Explanation of class selection and layout choice" }
                    },
                    required: ["className", "tsCode", "jsonCode", "layoutStrategy", "properties", "reactComponentCode", "designRationale"]
                }
            }
        });

        let resultText = '';
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
                resultText += chunkText;
            }
        }

        if (!resultText) throw new Error("Empty response from AI");

        const parsedResult = JSON.parse(resultText);
        
        // Post-process to ensure mockDataObj exists
        const finalResult: GeneratedResult = {
            ...parsedResult,
            mockDataObj: JSON.parse(parsedResult.jsonCode)
        };

        setGenerated(finalResult);

    } catch (err: any) {
        console.error("Gemini API Error:", err);
        setErrorMsg(err.message || "Failed to connect to AI Engine.");
        // Fallback for demo purposes if key fails
        setGenerated(fallbackParse(code)); 
    }
  };

  // Simulation of AI typing effect with cleanup (Visuals only, data is real)
  useEffect(() => {
    if (step === 2 && generated) {
      // If we have generated data (AI finished), start the typing animation
      setStreamedTS('');
      setStreamedJSON('');
      
      const targetTS = generated.tsCode;
      const targetJSON = generated.jsonCode;

      let tsIndex = 0;
      let jsonIndex = 0;
      
      if (tsIntervalRef.current) clearInterval(tsIntervalRef.current);
      if (jsonIntervalRef.current) clearInterval(jsonIntervalRef.current);
      if (jsonTimeoutRef.current) clearTimeout(jsonTimeoutRef.current);

      tsIntervalRef.current = setInterval(() => {
        if (tsIndex < targetTS.length) {
          setStreamedTS(prev => targetTS.substring(0, tsIndex + 1));
          tsIndex++;
        } else {
            if (tsIntervalRef.current) clearInterval(tsIntervalRef.current);
        }
      }, 1); // Super Fast typing for large files

      jsonTimeoutRef.current = setTimeout(() => {
        jsonIntervalRef.current = setInterval(() => {
          if (jsonIndex < targetJSON.length) {
            setStreamedJSON(prev => targetJSON.substring(0, jsonIndex + 1));
            jsonIndex++;
          } else {
            if (jsonIntervalRef.current) clearInterval(jsonIntervalRef.current);
            setIsProcessing(false);
          }
        }, 1);
      }, 100);
    }

    return () => {
        if (tsIntervalRef.current) clearInterval(tsIntervalRef.current);
        if (jsonIntervalRef.current) clearInterval(jsonIntervalRef.current);
        if (jsonTimeoutRef.current) clearTimeout(jsonTimeoutRef.current);
    };
  }, [step, generated]);

  return (
    <div className="min-h-screen bg-tech-darker flex flex-col relative z-50">
      {/* Header / Nav */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Exit Demo
        </button>
        <div className="hidden md:flex items-center gap-4">
            <StepIndicator number={1} label="Backend Input" active={step >= 1} current={step === 1} />
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-tech-blue' : 'bg-slate-700'}`}></div>
            <StepIndicator number={2} label="AI Processing" active={step >= 2} current={step === 2} />
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-tech-blue' : 'bg-slate-700'}`}></div>
            <StepIndicator number={3} label="Frontend UI" active={step >= 3} current={step === 3} />
        </div>
        <div className="w-24"></div> 
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
            
          {/* STEP 1: BACKEND SOURCE (EDITABLE) */}
          {step === 1 && (
            <div className="animate-fade-in-up h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    Phase 1: The Backend Reality
                    <span className="text-xs bg-tech-blue px-2 py-1 rounded-full text-white font-normal flex items-center gap-1">
                        <Edit3 size={12} /> Interactive Mode
                    </span>
                </h2>
                <p className="text-slate-400">
                    Paste your own C# Entity class below. The system will ingest it as the "Source of Truth".
                </p>
              </div>

              <div className="flex-1 glass-panel rounded-xl border border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* File Tree */}
                <div className="w-full md:w-64 bg-slate-900 border-r border-slate-700 p-4 hidden md:block">
                    <div className="text-xs text-slate-500 font-bold mb-4 uppercase tracking-wider">Solution Explorer</div>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="text-slate-400 pl-0">AFBPlay.sln</div>
                        <div className="text-slate-400 pl-4">📂 API</div>
                        <div className="text-slate-300 pl-4">📂 Entities</div>
                        <div className="text-tech-blue bg-blue-900/20 py-1 pl-8 rounded border-l-2 border-tech-blue flex items-center gap-2">
                            <Code2 size={12} />
                            {generated ? generated.className : 'GameInfo'}.cs
                        </div>
                    </div>
                </div>

                {/* Editable Code Editor */}
                <div className="flex-1 bg-[#1e1e1e] flex flex-col relative group">
                   <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                        <button 
                            onClick={() => setCsharpCode(DEFAULT_CSHARP_CODE)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs px-2 py-1 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                            title="Reset Code"
                        >
                            <RefreshCw size={12} /> Reset
                        </button>
                        <div className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">Editable C#</div>
                   </div>
                   <textarea
                        spellCheck={false}
                        value={csharpCode}
                        onChange={handleCodeChange}
                        className="w-full h-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-6 outline-none resize-none leading-relaxed selection:bg-blue-500/30"
                   />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button 
                  onClick={() => setCsharpCode(DEFAULT_CSHARP_CODE)}
                  className="px-5 py-2.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all flex items-center gap-2 group"
                >
                    <RefreshCw size={16} className="text-slate-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                    Restore Default Code
                </button>
                <button 
                  onClick={() => callGeminiAPI(csharpCode)}
                  className="bg-tech-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <BrainCircuit size={18} className="fill-white" />
                  Generate with Gemini AI
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AI PROCESSING */}
          {step === 2 && (
            <div className="animate-fade-in-up h-full flex flex-col">
               <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Phase 2: Intelligent Generation</h2>
                    {generated && (
                        <p className="text-slate-400 flex items-center gap-2">
                            Detected Primary Entity: 
                            <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                {generated.className}
                            </span>
                        </p>
                    )}
                </div>
                {isProcessing && (
                    <div className="flex items-center gap-2 text-tech-cyan animate-pulse">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm font-mono">Waiting for Gemini...</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="flex items-center gap-2 text-red-500">
                        <X size={20} />
                        <span className="text-sm font-mono">{errorMsg}</span>
                    </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                {/* Generated Types */}
                <div className="glass-panel rounded-xl border border-slate-700 p-0 overflow-hidden flex flex-col h-full">
                    <div className="bg-slate-900/80 p-3 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-semibold text-tech-green">
                            <Code2 size={16} />
                            <span>types/generated.d.ts</span>
                        </div>
                        <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Strict Typed</span>
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] p-6 font-mono text-sm text-slate-300 overflow-auto">
                        <pre className="whitespace-pre-wrap">{streamedTS}</pre>
                    </div>
                </div>

                {/* Generated Mock Data */}
                <div className="glass-panel rounded-xl border border-slate-700 p-0 overflow-hidden flex flex-col h-full">
                    <div className="bg-slate-900/80 p-3 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-semibold text-tech-cyan">
                            <FileJson size={16} />
                            <span>mocks/{generated ? generated.className.toLowerCase() : 'loading'}.json</span>
                        </div>
                        <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">Auto Mocked</span>
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] p-6 font-mono text-sm text-yellow-100/80 overflow-auto">
                         <pre className="whitespace-pre-wrap">{streamedJSON}</pre>
                    </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                 <button 
                  onClick={() => {
                    setStep(1);
                    setGenerated(null);
                  }}
                  className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-2"
                >
                    <ArrowLeft size={14} /> Back to Edit C#
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={isProcessing || !generated}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
                    ${isProcessing || !generated ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-tech-green hover:bg-green-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                  `}
                >
                  View Frontend Result <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FRONTEND RESULT */}
          {step === 3 && generated && (
            <div className="animate-fade-in-up h-full flex flex-col">
               <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Phase 3: Adaptive UI Generation</h2>
                <div className="flex items-center gap-4 text-slate-400">
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                        generated.layoutStrategy === 'table' 
                        ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' 
                        : 'bg-blue-900/30 text-blue-400 border-blue-500/30'
                    }`}>
                        {generated.layoutStrategy === 'table' ? <Table size={14} /> : <Grid size={14} />}
                        {generated.layoutStrategy === 'table' ? 'High Density Table' : 'Visual Gallery Grid'}
                    </div>
                    <span className="text-sm opacity-50">|</span>
                    <div className="flex items-center gap-2 text-tech-cyan text-sm">
                        <Sparkles size={14} />
                        <span className="font-medium">AI Designed</span>
                    </div>
                </div>
              </div>

               {/* AI Rationale Box */}
               <div className="mb-6 p-4 bg-slate-900/50 border border-tech-blue/20 rounded-lg flex gap-4 items-start relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-tech-blue"></div>
                    <Lightbulb className="text-tech-cyan shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-tech-cyan text-sm mb-1 uppercase tracking-wide">AI Design Rationale</h4>
                        <p className="text-slate-300 text-sm italic leading-relaxed">"{generated.designRationale}"</p>
                    </div>
                </div>

              <div className="flex-1 border border-slate-700 rounded-xl overflow-hidden grid lg:grid-cols-2 min-h-[500px]">
                {/* Code Implementation */}
                <div className="bg-[#1e1e1e] p-0 flex flex-col border-r border-slate-700 h-full">
                    <div className="bg-slate-900 p-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between">
                        <span>components/{generated.className}List.tsx</span>
                        <div className="flex items-center gap-1 text-green-400">
                             <CheckCircle2 size={12} />
                             <span>Generated by Gemini</span>
                        </div>
                    </div>
                    <div className="p-6 font-mono text-sm overflow-auto text-slate-300 leading-relaxed h-full">
                        <pre className="whitespace-pre-wrap">{generated.reactComponentCode}</pre>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="bg-slate-900 p-8 flex flex-col h-full">
                     <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
                             <div className="ml-4 bg-slate-800 rounded px-3 py-1 text-xs text-slate-400 font-mono">
                                 localhost:3000/{generated.className.toLowerCase()}
                             </div>
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono uppercase">Preview Render</span>
                     </div>

                     <div className="flex-1 bg-slate-950 rounded-xl p-6 overflow-y-auto">
                        <h3 className="text-white font-bold mb-4 text-lg">{generated.className} List</h3>
                        
                        {/* CONDITIONAL RENDERING BASED ON LAYOUT STRATEGY */}
                        
                        {generated.layoutStrategy === 'gallery' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {generated.mockDataObj.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
                                        {/* Image Header */}
                                        {Object.entries(item).find(([k]) => k.toLowerCase().includes('url') || k.toLowerCase().includes('image') || k.toLowerCase().includes('thumb')) ? (
                                            <div className="h-40 bg-slate-700 relative overflow-hidden">
                                                <img 
                                                    src={Object.values(item).find(v => typeof v === 'string' && (v as string).startsWith('http')) as string} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                                <div className="absolute bottom-3 left-3 font-bold text-white text-lg shadow-black drop-shadow-md">
                                                     {Object.entries(item).find(([k, v]) => (k.toLowerCase().includes('name') || k.toLowerCase().includes('title')) && typeof v === 'string' && !k.toLowerCase().includes('url'))?.[1] as string || item.gameId}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-24 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center p-4">
                                                <div className="text-xl font-bold text-white text-center">
                                                    {Object.entries(item).find(([k, v]) => (k.toLowerCase().includes('name') || k.toLowerCase().includes('title')) && typeof v === 'string')?.[1] as string || item.id || `Entity ${idx}`}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="p-4 space-y-3">
                                            {Object.entries(item).slice(0, 6).map(([key, val]) => {
                                                if (key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('name')) return null;
                                                return (
                                                    <div key={key} className="flex justify-between items-center text-xs border-b border-slate-700/50 pb-2 last:border-0">
                                                        <span className="text-slate-400 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className={`font-mono truncate max-w-[120px] text-right ${
                                                            typeof val === 'number' ? 'text-tech-cyan' : 
                                                            String(val) === 'Active' ? 'text-green-400' : 'text-slate-300'
                                                        }`}>
                                                            {Array.isArray(val) ? `[${val.length}]` : String(val)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {generated.layoutStrategy === 'table' && (
                            <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-xl">
                                <table className="w-full text-left text-xs text-slate-400 whitespace-nowrap">
                                    <thead className="bg-slate-800 text-slate-200 uppercase font-bold tracking-wider">
                                        <tr>
                                            {generated.properties.slice(0, 8).map(p => (
                                                <th key={p.name} className="px-6 py-4">{p.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700 bg-slate-900">
                                        {generated.mockDataObj.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-800/50 transition-colors border-b border-slate-700">
                                                {generated.properties.slice(0, 8).map(p => (
                                                    <td key={p.name} className="px-6 py-4 font-mono text-sm text-slate-300">
                                                        {typeof item[p.name] === 'boolean' 
                                                            ? (item[p.name] ? <span className="text-green-500 flex items-center gap-1"><Check size={12}/> Yes</span> : <span className="text-red-500 flex items-center gap-1"><X size={12}/> No</span>)
                                                            : Array.isArray(item[p.name])
                                                                ? <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] border border-slate-600">{item[p.name].length} items</span>
                                                                : <span className={typeof item[p.name] === 'number' ? 'text-tech-cyan' : 'text-slate-300'}>{String(item[p.name])}</span>
                                                        }
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                         
                        {/* Fallback for simple card if needed */}
                        {generated.layoutStrategy === 'simple-card' && (
                            <div className="grid grid-cols-1 gap-4">
                                {generated.mockDataObj.map((item: any, idx: number) => (
                                    <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-2 hover:border-slate-600 transition-colors">
                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                                            <span className="font-bold text-white text-lg">{item.DisplayName || item.Name || `Item ${idx}`}</span>
                                            <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">ID: {idx + 1000}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                             {Object.entries(item).slice(0, 6).map(([key, val]) => (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-slate-500">{key}</span>
                                                    <span className="text-sm text-slate-300 truncate">{String(val)}</span>
                                                </div>
                                             ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                     </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                 <button 
                  onClick={() => {
                    setStep(1);
                    setGenerated(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition-all border border-slate-600"
                >
                  Try Another Entity
                </button>
                <button 
                  onClick={onExit}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  End Demo
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ number: number, label: string, active: boolean, current: boolean }> = ({ number, label, active, current }) => (
    <div className={`flex items-center gap-2 ${active ? 'text-white' : 'text-slate-600'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
            ${current ? 'bg-tech-blue border-tech-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
              active ? 'bg-tech-dark border-tech-blue text-tech-blue' : 'bg-transparent border-slate-700 text-slate-700'}
        `}>
            {active && !current ? <CheckCircle2 size={16} /> : number}
        </div>
        <span className={`text-sm font-medium ${current ? 'text-tech-blue' : ''}`}>{label}</span>
    </div>
);

export default DemoFlow;