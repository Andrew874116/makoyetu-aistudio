import React, { useState } from 'react';
import { Sparkles, DollarSign, Sprout, ShieldAlert, MessageSquare, Send, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

// Custom lightweight markdown/text parser to ensure bulletproof rendering
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Headers
    if (line.trim().startsWith('###')) {
      return <h4 key={idx} className="text-base font-bold text-white mt-4 mb-2">{line.replace('###', '').trim()}</h4>;
    }
    if (line.trim().startsWith('##')) {
      return <h3 key={idx} className="text-lg font-bold text-white mt-5 mb-3 border-b border-slate-800 pb-1">{line.replace('##', '').trim()}</h3>;
    }
    if (line.trim().startsWith('#')) {
      return <h2 key={idx} className="text-xl font-bold text-emerald-400 mt-6 mb-4">{line.replace('#', '').trim()}</h2>;
    }
    
    // Bold highlights
    let parsedLine: React.ReactNode = line;
    if (line.includes('**')) {
      const parts = line.split('**');
      parsedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-amber-400 font-bold">{part}</strong> : part);
    }

    // Bullet points
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return (
        <ul key={idx} className="list-disc pl-5 my-1.5 text-slate-300 text-xs">
          <li>{parsedLine}</li>
        </ul>
      );
    }

    // Numbered lists
    if (/^\d+\./.test(line.trim())) {
      return (
        <ol key={idx} className="list-decimal pl-5 my-1.5 text-slate-300 text-xs">
          <li>{parsedLine}</li>
        </ol>
      );
    }

    // Tables parsing (Simple representation)
    if (line.includes('|')) {
      const columns = line.split('|').map(col => col.trim()).filter(Boolean);
      if (columns.length > 0 && !line.includes('---')) {
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded border border-slate-800/60 my-1 text-xs">
            <span className="text-slate-400 font-medium">{columns[0]}</span>
            <span className="text-white font-mono font-semibold">{columns[1]}</span>
          </div>
        );
      }
      return null;
    }

    if (line.trim() === '') return <div key={idx} className="h-2"></div>;

    return <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1">{parsedLine}</p>;
  });
}

export default function AiTools() {
  const [activeSubtab, setActiveSubtab] = useState<'recommend' | 'soil' | 'consult' | 'inspect'>('recommend');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recommender States
  const [salary, setSalary] = useState('65000');
  const [dependents, setDependents] = useState('1 Dependent');
  const [workLocation, setWorkLocation] = useState('Nairobi CBD / Upperhill');
  const [recommendationResult, setRecommendationResult] = useState<string>('');
  const [calculatedBudget, setCalculatedBudget] = useState<number | null>(null);

  // Soil-Rain States
  const [agriculturalRegion, setAgriculturalRegion] = useState('Kitale');
  const [soilResult, setSoilResult] = useState<string>('');

  // AI Advisor States
  const [consultQuestion, setConsultQuestion] = useState('');
  const [consultHistory, setConsultHistory] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: 'Jambo! I am the Makao Yetu Property Advisor. Ask me anything about Kenyan land transactions, title searches, rent laws, or how to avoid common rental deposit scams.' }
  ]);

  // House Inspector States
  const [houseIssue, setHouseIssue] = useState('Damp ceiling patches and mold growth on walls');
  const [inspectResult, setInspectResult] = useState<string>('');

  const handleRecommendationSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary, dependents, workLocation })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRecommendationResult(data.recommendations);
      setCalculatedBudget(data.housingBudget);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSoilSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/soil-rain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: agriculturalRegion })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSoilResult(data.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to fetch agricultural analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!consultQuestion.trim()) return;

    const userMsg = consultQuestion;
    setConsultQuestion('');
    setConsultHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, chatHistory: consultHistory })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setConsultHistory(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (err: any) {
      setConsultHistory(prev => [...prev, { sender: 'ai', text: `⚠️ Error matching AI response: ${err.message || 'Consultation route offline'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueDescription: houseIssue })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setInspectResult(data.diagnosis);
    } catch (err: any) {
      setError(err.message || "Failed to inspect property issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="text-emerald-500 w-6 h-6 animate-pulse" /> Makao Yetu AI Advisory Hub
        </h2>
        <p className="text-sm text-slate-400">
          Unlock server-side Gemini intelligence tailored for local housing dynamics, land title verifications, and financial planning.
        </p>
      </div>

      {/* AI Tool Sub-Navigator */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'recommend', label: 'Relocation Recommender', icon: DollarSign },
          { id: 'soil', label: 'Soil & Rain Planner', icon: Sprout },
          { id: 'consult', label: 'AI Housing Consultant', icon: MessageSquare },
          { id: 'inspect', label: 'House Issue Inspector', icon: ShieldAlert }
        ].map(sub => {
          const Icon = sub.icon;
          const isSelected = activeSubtab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubtab(sub.id as any);
                setError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* Main Advisory Content Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input Configuration (Columns 1-5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
          
          {activeSubtab === 'recommend' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Salary Relocation Parameters</h3>
              
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">Monthly Net Salary (Ksh)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g. 50000"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">Dependents Status</label>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-300"
                >
                  <option value="Single - No Dependents">Single - No Dependents</option>
                  <option value="1 Dependent">1 Dependent</option>
                  <option value="2-3 Dependents (Family)">2-3 Dependents (Family)</option>
                  <option value="Large Family (4+ Dependents)">Large Family (4+ Dependents)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">Target Work Location</label>
                <input
                  type="text"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Westlands / Kilimani / CBD"
                />
              </div>

              <button
                onClick={handleRecommendationSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow shadow-emerald-950/20 flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Analyze & Match Estates'}
              </button>
            </div>
          )}

          {activeSubtab === 'soil' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Agro-Real Estate Parameters</h3>
              
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">Target Agricultural Region</label>
                <select
                  value={agriculturalRegion}
                  onChange={(e) => setAgriculturalRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-300"
                >
                  <option value="Kitale, Trans Nzoia">Kitale (Trans Nzoia)</option>
                  <option value="Naivasha, Nakuru">Naivasha (Great Rift)</option>
                  <option value="Laikipia Plateau">Laikipia Plateau (Semi-arid/Ranching)</option>
                  <option value="Kangundo, Machakos">Kangundo (Lower Eastern Volcanic)</option>
                  <option value="Nanyuki, Meru">Nanyuki (Mount Kenya foothills)</option>
                  <option value="Malindi, Kilifi">Malindi (Coastal sand/loam)</option>
                </select>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-300">Agricultural Checks Checklist:</p>
                <p>✓ Registry Index Map (RIM) check</p>
                <p>✓ Title deed beacon surveys</p>
                <p>✓ Soil fertility suitabilities</p>
              </div>

              <button
                onClick={handleSoilSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Generate Agro Viability Profile'}
              </button>
            </div>
          )}

          {activeSubtab === 'consult' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Kenyan Property Advisor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consult with our server-side LLM on tenant-landlord disputes, ArdhiSasa land transfers, rent pricing rules, and legal agreements.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-amber-300/90 space-y-2">
                <p className="font-bold uppercase tracking-wider text-slate-400">🔥 Pro Tips to ask:</p>
                <p className="cursor-pointer hover:underline" onClick={() => setConsultQuestion("How do I conduct an official search on ArdhiSasa?")}>
                  💡 "How do I conduct an official search on ArdhiSasa?"
                </p>
                <p className="cursor-pointer hover:underline" onClick={() => setConsultQuestion("Can my landlord arbitrarily increase rent in Nairobi?")}>
                  💡 "Can my landlord arbitrarily increase rent in Nairobi?"
                </p>
              </div>
            </div>
          )}

          {activeSubtab === 'inspect' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Tenancy Structural inspector</h3>
              
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1.5">Describe House Defect / Maintenance Issue</label>
                <textarea
                  value={houseIssue}
                  onChange={(e) => setHouseIssue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 h-28 font-sans resize-none"
                  placeholder="e.g. Mold crawling on the master bedroom ceiling and water leaking during rainy nights."
                />
              </div>

              <button
                onClick={handleInspectSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run AI Defect Audit'}
              </button>
            </div>
          )}

        </div>

        {/* Right Output Screen (Columns 6-12) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white min-h-[400px] flex flex-col justify-between shadow-xl">
          
          <div>
            {/* Header Status Bar */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs bg-slate-950 text-slate-400 px-3 py-1 rounded-full font-mono font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> 
                {activeSubtab === 'recommend' ? 'RELOCATION DECISION BOARD' :
                 activeSubtab === 'soil' ? 'AGRO GEOLOGICAL LOGS' :
                 activeSubtab === 'consult' ? 'AI ADVISORY TRANSCRIPT' : 'STRUCTURAL DIAGNOSTICS'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">POWERED BY GEMINI-3.5</span>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs mb-4">
                {error}
              </div>
            )}

            {/* Outputs rendered here */}
            <div className="space-y-4">
              {loading && (
                <div className="space-y-3 py-8 text-center">
                  <RefreshCw className="w-10 h-10 animate-spin text-emerald-500 mx-auto" />
                  <p className="text-xs text-slate-400">Gemini model synthesizing real estate parameters...</p>
                </div>
              )}

              {!loading && activeSubtab === 'recommend' && (
                <div>
                  {recommendationResult ? (
                    <div>
                      {calculatedBudget && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">SAFE HOUSING RENT CAP (30% RULE)</span>
                            <p className="text-xl font-bold font-mono text-emerald-400">Ksh {calculatedBudget.toLocaleString()} / mo</p>
                          </div>
                          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded text-xs font-bold">
                            RECOMMENDED
                          </div>
                        </div>
                      )}
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 prose max-w-none text-slate-300">
                        {renderMarkdown(recommendationResult)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      Enter salary above and click "Analyze & Match Estates" to generate your financial relocation plan.
                    </div>
                  )}
                </div>
              )}

              {!loading && activeSubtab === 'soil' && (
                <div>
                  {soilResult ? (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 prose max-w-none text-slate-300">
                      {renderMarkdown(soilResult)}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      Select target agricultural region and click "Generate Agro Viability Profile".
                    </div>
                  )}
                </div>
              )}

              {!loading && activeSubtab === 'inspect' && (
                <div>
                  {inspectResult ? (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 prose max-w-none text-slate-300">
                      {renderMarkdown(inspectResult)}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      Provide a defect/leak description and execute "Run AI Defect Audit".
                    </div>
                  )}
                </div>
              )}

              {activeSubtab === 'consult' && (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {consultHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <span className="text-[9px] text-slate-500 uppercase font-mono mb-0.5">
                        {msg.sender === 'user' ? 'You' : 'Makao Advisor'}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.sender === 'ai' ? renderMarkdown(msg.text) : msg.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-auto items-start max-w-[85%] flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-mono mb-0.5">Makao Advisor</span>
                      <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-xs text-slate-400">
                        Advisor is typing advice...
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Bottom Chat Input Form for Consultant only */}
          {activeSubtab === 'consult' && (
            <form onSubmit={handleConsultSubmit} className="flex gap-2 mt-4 pt-4 border-t border-slate-800/80">
              <input
                type="text"
                value={consultQuestion}
                onChange={(e) => setConsultQuestion(e.target.value)}
                placeholder="Ask about title searches, ArdhiSasa, or viewing fees safety..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !consultQuestion.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 p-2 text-white rounded-xl disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
