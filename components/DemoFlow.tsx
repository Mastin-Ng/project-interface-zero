import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, BrainCircuit, Check, Sparkles, AlertTriangle, FileCode, Zap, Layout, FileJson, ArrowRight, Code2, RotateCcw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';

const GEMINI_MODEL = 'gemini-3-flash-preview';

const DEFAULT_CSHARP_CODE = `namespace AFBPlay.Entities 
{
    /// <summary>
    /// Core game definition for Casino Lobby
    /// </summary>
    public class GameInfo 
    {
        public int GameId { get; set; }
        public string DisplayName { get; set; }
        public string? ThumbnailUrl { get; set; }
        public decimal CurrentJackpot { get; set; }
        public string Status { get; set; } // "Active", "Maintenance", "ComingSoon"
        public List<string> Tags { get; set; }
        public int PlayerCount { get; set; }
        public bool IsNew { get; set; }
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

const RuntimeRenderer: React.FC<{ code: string; data: any[] }> = ({ code, data }) => {
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) return;

        let isMounted = true;

        const compile = async () => {
            try {
                // 1. Clean code: Remove Markdown and imports carefully
                let processedCode = code
                    .replace(/```(tsx|jsx|javascript|typescript)?/g, '')
                    .replace(/```/g, '');

                // Robust Import Removal:
                // 1. Remove single-line imports (anchored to start of line to avoid matching inside strings)
                processedCode = processedCode.replace(/^\s*import\s+.*?;/gm, '');
                
                // 2. Remove multi-line imports (looking for 'import {' ... '} from')
                // We use a non-greedy match that requires starting with 'import' and ending with a string quote and semicolon or just string quote
                processedCode = processedCode.replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*['"].*?['"];?/gm, '');

                // 3. Fallback: Remove remaining imports if they look standard, but be careful of code that looks like import
                // This regex ensures 'from' is followed by a quote
                processedCode = processedCode.replace(/import\s+[\w\s{},*]+\s+from\s+['"][^'"]+['"];?/g, '');
                
                // Handle exports SECURELY to avoid "Identifier already declared" errors
                processedCode = processedCode
                    .replace(/export\s+default\s+/g, 'const __DefaultExport = ')
                    .replace(/export\s+/g, '');

                // 2. Transpile using Babel
                // @ts-ignore
                if (!window.Babel) {
                    throw new Error("Babel compiler not found. Refreshing might help.");
                }
                
                // @ts-ignore
                const transpiled = window.Babel.transform(processedCode, {
                    presets: ['react', ['typescript', { isTSX: true, allExtensions: true }]],
                    filename: 'generated.tsx', // Helps Babel with error reporting
                }).code;

                // 3. Prepare injection scope for icons and React
                const validIconKeys = Object.keys(LucideIcons).filter(key => 
                    key !== 'default' && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key)
                );
                const validIconValues = validIconKeys.map(key => (LucideIcons as any)[key]);

                const factory = new Function(
                    'React',
                    'Lucide',
                    ...validIconKeys,
                    `
                    try {
                        ${transpiled}
                        
                        // 1. Check for the captured default export
                        if (typeof __DefaultExport !== 'undefined') return __DefaultExport;

                        // 2. Check for the explicitly requested name
                        if (typeof GeneratedComponent !== 'undefined') return GeneratedComponent;
                        
                        // 3. Fallbacks - Heuristics for finding the component
                        if (typeof GameInfoGallery !== 'undefined') return GameInfoGallery;
                        if (typeof GameInfoTable !== 'undefined') return GameInfoTable;
                        if (typeof App !== 'undefined') return App;
                        if (typeof Gallery !== 'undefined') return Gallery;
                        if (typeof Table !== 'undefined') return Table;

                        return null;
                    } catch (e) {
                        throw e;
                    }
                    `
                );

                const BuiltComponent = factory.call({}, React, LucideIcons, ...validIconValues);
                
                if (isMounted) {
                    if (BuiltComponent) {
                        setComponent(() => BuiltComponent);
                        setError(null);
                    } else {
                        setError("Could not find a valid React Component in the generated code.");
                    }
                }
            } catch (err: any) {
                console.error("Runtime Compilation Error:", err);
                if (isMounted) setError(err.message || "Compilation failed");
            }
        };

        compile();
        return () => { isMounted = false; };
    }, [code]);

    if (error) {
        return (
            <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 overflow-auto max-h-[400px]">
                <div className="flex items-center gap-2 mb-2 font-bold">
                    <AlertTriangle size={18} /> Compilation Warning
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap opacity-80">{error}</pre>
                <div className="mt-4 p-2 bg-red-500/10 rounded text-[10px] italic">
                    AI generated code might have syntax issues. Try 'Generate' again.
                </div>
            </div>
        );
    }

    if (!Component) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-pulse">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p className="text-sm font-mono tracking-widest uppercase">Mounting Bridge...</p>
            </div>
        );
    }

    try {
        return <Component items={data} />;
    } catch (e: any) {
        return (
            <div className="p-4 border border-red-500/50 rounded text-red-500 text-xs">
                Runtime Render Error: {e.message}
            </div>
        );
    }
};

interface DemoFlowProps {
  onExit: () => void;
}

const DemoFlow: React.FC<DemoFlowProps> = ({ onExit }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csharpCode, setCsharpCode] = useState(DEFAULT_CSHARP_CODE);
  const [generated, setGenerated] = useState<GeneratedResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t, language } = useLanguage();

  const steps = [
    { id: 1, label: t.demo.step1, icon: FileCode },
    { id: 2, label: t.demo.step2, icon: FileJson },
    { id: 3, label: t.demo.step3, icon: Zap }
  ];

  const handleTranspile = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key configuration error.");

        const ai = new GoogleGenAI({ apiKey });
        
        // Add language-specific instruction for the designRationale
        const langInstruction = language === 'zh' 
            ? "CRITICAL: The 'designRationale' field MUST be in Traditional Chinese (繁體中文)."
            : "The 'designRationale' field MUST be in English.";

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Transpile this C# Entity into:
            1. TypeScript interface (.d.ts).
            2. Mock JSON data (5+ items).
            3. A React component 'GeneratedComponent' (Tailwind + Lucide icons) to display the items prop.
            
            Design Requirements:
            - Modern, clean card layout (or table if appropriate).
            - **CRITICAL**: Action buttons (e.g., "View Details", "Play Now", "Edit") MUST be positioned at the absolute bottom of their container card (use flex-col and mt-auto on the button wrapper).
            - Use semantic colors for status and badges.
            - ${langInstruction}

            C# Code:
            ${csharpCode}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        className: { type: Type.STRING },
                        tsCode: { type: Type.STRING },
                        jsonCode: { type: Type.STRING },
                        layoutStrategy: { type: Type.STRING },
                        properties: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    isArray: { type: Type.BOOLEAN },
                                    isNullable: { type: Type.BOOLEAN },
                                    comment: { type: Type.STRING }
                                }
                            }
                        },
                        reactComponentCode: { type: Type.STRING },
                        designRationale: { type: Type.STRING }
                    },
                    required: ["className", "tsCode", "jsonCode", "layoutStrategy", "properties", "reactComponentCode", "designRationale"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("API returned an empty response.");
        
        // Sanitize response to avoid JSON parsing errors from Markdown
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // Locate outer braces to remove any preamble
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(cleanedText);
        
        // Critical Fix: Remove hallucinated JSON keys leaking into the React Code string
        if (parsed.reactComponentCode && typeof parsed.reactComponentCode === 'string') {
            const leakagePatterns = ['","designRationale"', '", "designRationale"', '","layoutStrategy"'];
            for (const pattern of leakagePatterns) {
                if (parsed.reactComponentCode.includes(pattern)) {
                    parsed.reactComponentCode = parsed.reactComponentCode.split(pattern)[0];
                    break; 
                }
            }
        }

        let mockData = [];
        try {
            mockData = JSON.parse(parsed.jsonCode);
        } catch (e) {
            console.warn("Failed to parse jsonCode directly, trying to fix:", e);
            const cleaned = parsed.jsonCode.replace(/```json/g, '').replace(/```/g, '');
            mockData = JSON.parse(cleaned);
        }

        const result: GeneratedResult = {
            ...parsed,
            mockDataObj: mockData
        };

        setGenerated(result);
        setStep(2); // Go to Assets step
    } catch (err: any) {
        console.error("Transpilation failed:", err);
        setErrorMsg(err.message || "Operation failed.");
        setStep(1);
    } finally {
        setIsProcessing(false);
    }
  };

  const renderProcessingOverlay = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-tech-darker/90 backdrop-blur-sm">
        <div className="relative">
            <div className="absolute inset-0 bg-tech-blue/30 blur-xl rounded-full"></div>
            <BrainCircuit size={80} className="text-tech-blue mb-8 animate-bounce relative z-10" />
        </div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">{t.demo.processing_title}</h2>
        <p className="text-slate-400">{t.demo.processing_desc}</p>
    </div>
  );

  const renderSummaryCard = (result: GeneratedResult) => (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Check className="text-tech-green" size={24} />
                    {result.className} {t.demo.synced}
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">{result.designRationale}</p>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-slate-800/50">
                 <button 
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700 flex items-center gap-2 text-slate-300 hover:text-white"
                >
                    <RotateCcw size={14} />
                    {t.demo.btn_new_entity}
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-tech-darker text-white p-6 relative">
        {/* Processing Overlay */}
        {isProcessing && renderProcessingOverlay()}

        {/* Header */}
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
            <button 
                onClick={onExit}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> {t.demo.back}
            </button>
            <div className="flex items-center gap-2 text-tech-cyan">
                <Sparkles size={20} />
                <span className="font-bold tracking-widest uppercase text-sm">{t.demo.sandbox_title}</span>
            </div>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 top-6 w-full h-1 bg-slate-800 rounded-full -z-10" />
                <div 
                    className="absolute left-0 top-6 h-1 bg-gradient-to-r from-tech-blue to-tech-cyan rounded-full -z-10 transition-all duration-700 ease-out"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />

                {steps.map((s) => {
                    const isActive = step >= s.id;
                    const isCurrent = step === s.id;
                    const Icon = s.icon;
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => step > s.id && setStep(s.id as 1 | 2 | 3)}>
                            <div 
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-tech-darker
                                    ${isActive 
                                        ? 'border-tech-blue text-tech-blue shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                                        : 'border-slate-800 text-slate-600'}
                                    ${isCurrent ? 'scale-110' : ''}
                                `}
                            >
                                {step > s.id ? <Check size={20} /> : <Icon size={20} />}
                            </div>
                            <span 
                                className={`
                                    text-xs font-bold tracking-widest uppercase transition-colors duration-300
                                    ${isActive ? 'text-white' : 'text-slate-600'}
                                `}
                            >
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
            {step === 1 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    {/* Intelligence Layer Info - Moved to Top */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="p-4 bg-tech-blue/10 border border-tech-blue/30 rounded-lg shrink-0">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-tech-cyan">
                                    <Sparkles size={18} />
                                    {t.demo.intel_title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                                    {t.demo.intel_desc}
                                </p>
                            </div>
                            <ul className="grid md:grid-cols-3 gap-4 text-slate-400 text-sm flex-1">
                                <li className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tech-blue shrink-0" />
                                    <span>{t.demo.intel_p1}</span>
                                </li>
                                <li className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tech-blue shrink-0" />
                                    <span>{t.demo.intel_p2}</span>
                                </li>
                                <li className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-tech-blue shrink-0" />
                                    <span>{t.demo.intel_p3}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Input Area - Full Width */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FileCode className="text-tech-blue" />
                            {t.demo.input_title}
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-tech-blue to-tech-cyan rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <textarea 
                                value={csharpCode}
                                onChange={(e) => setCsharpCode(e.target.value)}
                                className="relative w-full h-[500px] bg-slate-900 border border-slate-700 rounded-xl p-6 font-mono text-sm focus:outline-none focus:border-tech-blue transition-colors text-slate-300"
                                spellCheck={false}
                            />
                             {/* Reset Button */}
                             <button 
                                onClick={() => setCsharpCode(DEFAULT_CSHARP_CODE)}
                                className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg backdrop-blur-sm border border-slate-700 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                                title="Reset to Default"
                            >
                                <RotateCcw size={14} />
                                {t.demo.btn_reset}
                            </button>
                        </div>
                        <button 
                            onClick={handleTranspile}
                            disabled={isProcessing}
                            className="w-full py-4 bg-tech-blue hover:bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 text-white"
                        >
                            <BrainCircuit size={20} />
                            {t.demo.btn_transpile}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && generated && (
                <div className="space-y-8 animate-fade-in">
                    {renderSummaryCard(generated)}

                    <div className="grid lg:grid-cols-2 gap-8">
                         <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-[500px]">
                            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-[10px] font-mono text-slate-400 uppercase tracking-widest flex justify-between items-center">
                                <span>{t.demo.ts_interface}</span>
                                <span className="text-tech-cyan">.d.ts</span>
                            </div>
                            <pre className="flex-1 p-4 overflow-auto font-mono text-[11px] text-tech-cyan leading-relaxed">{generated.tsCode}</pre>
                        </div>
                        <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-[500px]">
                            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-[10px] font-mono text-slate-400 uppercase tracking-widest flex justify-between items-center">
                                <span>{t.demo.mock_json}</span>
                                <span className="text-tech-green">.json</span>
                            </div>
                            <pre className="flex-1 p-4 overflow-auto font-mono text-[11px] text-tech-green leading-relaxed">{generated.jsonCode}</pre>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={() => setStep(3)}
                            className="px-8 py-3 bg-tech-blue hover:bg-blue-600 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            {t.demo.btn_run_live} <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && generated && (
                <div className="space-y-8 animate-fade-in">
                    {renderSummaryCard(generated)}

                    {/* Preview Panel */}
                    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden min-h-[600px] shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-tech-green animate-pulse" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{t.demo.runtime_renderer}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] bg-tech-blue/20 text-tech-blue border border-tech-blue/30 px-2 py-0.5 rounded uppercase font-bold">{generated.layoutStrategy}</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-slate-950 p-6 relative">
                            <RuntimeRenderer code={generated.reactComponentCode} data={generated.mockDataObj} />
                        </div>
                    </div>

                    {/* Code Display Panel (Replaces previous Button) */}
                    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-[400px]">
                        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-[10px] font-mono text-slate-400 uppercase tracking-widest flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Code2 size={14} className="text-tech-blue" />
                                <span>{t.demo.generated_ui}</span>
                            </div>
                            <span className="text-tech-blue">.tsx</span>
                        </div>
                        <pre className="flex-1 p-4 overflow-auto font-mono text-[11px] text-blue-300 leading-relaxed bg-slate-950/50">
                            {generated.reactComponentCode}
                        </pre>
                    </div>
                </div>
            )}
        </div>
        
        {errorMsg && (
            <div className="fixed bottom-8 right-8 max-w-md bg-red-950/90 border border-red-500 rounded-xl p-4 shadow-2xl flex gap-3 animate-slide-up backdrop-blur z-50">
                <AlertTriangle className="text-red-500 shrink-0" />
                <div className="text-white text-sm">{errorMsg}</div>
            </div>
        )}
    </div>
  );
};

export default DemoFlow;