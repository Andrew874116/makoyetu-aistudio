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
      return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-1.5">{line.replace('###', '').trim()}</h4>;
    }
    if (line.trim().startsWith('##')) {
      return <h3 key={idx} className="text-base font-bold text-slate-900 mt-5 mb-2.5 border-b border-slate-200 pb-1">{line.replace('##', '').trim()}</h3>;
    }
    if (line.trim().startsWith('#')) {
      return <h2 key={idx} className="text-lg font-bold text-emerald-700 mt-5 mb-3">{line.replace('#', '').trim()}</h2>;
    }
    
    // Bold highlights
    let parsedLine: React.ReactNode = line;
    if (line.includes('**')) {
      const parts = line.split('**');
      parsedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-emerald-800 font-bold">{part}</strong> : part);
    }

    // Bullet points
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return (
        <ul key={idx} className="list-disc pl-5 my-1 text-slate-700 text-xs">
          <li>{parsedLine}</li>
        </ul>
      );
    }

    // Numbered lists
    if (/^\d+\./.test(line.trim())) {
      return (
        <ol key={idx} className="list-decimal pl-5 my-1 text-slate-700 text-xs">
          <li>{parsedLine}</li>
        </ol>
      );
    }

    // Tables parsing (Simple representation)
    if (line.includes('|')) {
      const columns = line.split('|').map(col => col.trim()).filter(Boolean);
      if (columns.length > 0 && !line.includes('---')) {
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 my-1 text-xs text-slate-800">
            <span className="text-slate-500 font-medium">{columns[0]}</span>
            <span className="text-slate-800 font-sans font-bold">{columns[1]}</span>
          </div>
        );
      }
      return null;
    }

    if (line.trim() === '') return <div key={idx} className="h-2"></div>;

    return <p key={idx} className="text-xs text-slate-700 leading-relaxed my-1">{parsedLine}</p>;
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
    { sender: 'ai', text: 'Jambo! I am your Makao Yetu Property Advisor. Ask me anything about Kenyan land transactions, title searches, rent laws, or how to avoid common rental deposit scams.' }
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
      setError(err.message || "Failed to fetch recommendation.");
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
      setConsultHistory(prev => [...prev, { sender: 'ai', text: `⚠️ Connection Issue: ${err.message || 'Consultation route offline'}` }]);
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
        <h2 className="text-2xl font-bold text-slate-950 flex items-center justify-center gap-2 font-display">
          <Sparkles className="text-emerald-600 w-6 h-6 animate-pulse" /> Makao Yetu Premium Advisor
        </h2>
        <p className="text-sm text-slate-600">
          Tailored property intelligence for local housing dynamics, land title verifications, and financial planning.
        </p>
      </div>

      {/* AI Tool Sub-Navigator */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        {[
          { id: 'recommend', label: 'Relocation Recommender', icon: DollarSign },
          { id: 'soil', label: 'Soil & Rain Planner', icon: Sprout },
          { id: 'consult', label: 'Property Consultant', icon: MessageSquare },
          { id: 'inspect', label: 'Defect Inspector', icon: ShieldAlert }
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
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
        <div className="lg:col-span-5 clay-card p-6 text-slate-800">
          
          {activeSubtab === 'recommend' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Salary Relocation Parameters</h3>
              
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1.5">Monthly Net Salary (Ksh)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none"
                  placeholder="e.g. 50000"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1.5">Dependents Status</label>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none text-slate-700 font-semibold"
                >
                  <option value="Single - No Dependents">Single - No Dependents</option>
                  <option value="1 Dependent">1 Dependent</option>
                  <option value="2-3 Dependents (Family)">2-3 Dependents (Family)</option>
                  <option value="Large Family (4+ Dependents)">Large Family (4+ Dependents)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1.5">Target Work Location</label>
                <input
                  type="text"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none"
                  placeholder="e.g. Westlands / Kilimani / CBD"
                />
              </div>

              <button
                onClick={handleRecommendationSubmit}
                disabled={loading}
                className="w-full clay-btn clay-btn-emerald font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Analyze & Match Estates'}
              </button>
            </div>
          )}

          {activeSubtab === 'soil' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Agro-Real Estate Parameters</h3>
              
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1.5">Target Agricultural Region</label>
                <select
                  value={agriculturalRegion}
                  onChange={(e) => setAgriculturalRegion(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs focus:outline-none text-slate-700 font-semibold"
                >
                  <option value="Kitale, Trans Nzoia">Kitale (Trans Nzoia)</option>
                  <option value="Naivasha, Nakuru">Naivasha (Great Rift)</option>
                  <option value="Laikipia Plateau">Laikipia Plateau (Semi-arid/Ranching)</option>
                  <option value="Kangundo, Machakos">Kangundo (Lower Eastern Volcanic)</option>
                  <option value="Nanyuki, Meru">Nanyuki (Mount Kenya foothills)</option>
                  <option value="Malindi, Kilifi">Malindi (Coastal sand/loam)</option>
                </select>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-2 font-medium">
                <p className="font-bold text-emerald-900">Agricultural Checks Checklist:</p>
                <p>✓ Registry Index Map (RIM) check</p>
                <p>✓ Title deed beacon surveys</p>
                <p>✓ Soil fertility suitabilities</p>
              </div>

              <button
                onClick={handleSoilSubmit}
                disabled={loading}
                className="w-full clay-btn clay-btn-emerald font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Generate Agro Viability Profile'}
              </button>
            </div>
          )}

          {activeSubtab === 'consult' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Kenyan Property Advisor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive immediate guidelines on tenant-landlord disputes, ArdhiSasa land transfers, rent pricing rules, and legal agreements.
              </p>
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-amber-900">🔥 Pro Tips to ask:</p>
                <p className="cursor-pointer hover:underline font-medium" onClick={() => setConsultQuestion("How do I conduct an official search on ArdhiSasa?")}>
                  💡 "How do I conduct an official search on ArdhiSasa?"
                </p>
                <p className="cursor-pointer hover:underline font-medium" onClick={() => setConsultQuestion("Can my landlord arbitrarily increase rent in Nairobi?")}>
                  💡 "Can my landlord arbitrarily increase rent in Nairobi?"
                </p>
              </div>
            </div>
          )}

          {activeSubtab === 'inspect' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Structural inspector</h3>
              
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1.5">Describe House Defect / Maintenance Issue</label>
                <textarea
                  value={houseIssue}
                  onChange={(e) => setHouseIssue(e.target.value)}
                  className="w-full clay-input p-3 text-xs focus:outline-none h-28 resize-none text-slate-800"
                  placeholder="e.g. Mold crawling on the master bedroom ceiling and water leaking during rainy nights."
                />
              </div>

              <button
                onClick={handleInspectSubmit}
                disabled={loading}
                className="w-full clay-btn clay-btn-emerald font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Defect Audit'}
              </button>
            </div>
          )}

        </div>

        {/* Right Output Screen (Columns 6-12) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-800 min-h-[400px] flex flex-col justify-between shadow-lg">
          
          <div>
            {/* Header Status Bar */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> 
                {activeSubtab === 'recommend' ? 'RELOCATION DECISION BOARD' :
                 activeSubtab === 'soil' ? 'AGRO GEOLOGICAL LOGS' :
                 activeSubtab === 'consult' ? 'PROPERTY ADVISORY TRANSCRIPT' : 'STRUCTURAL DIAGNOSTICS'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">VERIFIED ACCESS</span>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs mb-4">
                {error}
              </div>
            )}

            {/* Outputs rendered here */}
            <div className="space-y-4">
              {loading && (
                <div className="space-y-3 py-12 text-center">
                  <RefreshCw className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs text-slate-500">Retrieving official real estate parameters...</p>
                </div>
              )}

              {!loading && activeSubtab === 'recommend' && (
                <div>
                  {recommendationResult ? (
                    <div>
                      {calculatedBudget && (
                        <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl mb-4 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-emerald-800 font-bold block mb-1">RECOMMENDED MONTHLY HOUSING CAP</span>
                            <p className="text-xl font-bold text-emerald-950">Ksh {calculatedBudget.toLocaleString()} / mo</p>
                          </div>
                          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                            30% Rule Verified
                          </div>
                        </div>
                      )}
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 prose max-w-none text-slate-700">
                        {renderMarkdown(recommendationResult)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      Enter salary above and click "Analyze & Match Estates" to generate your financial relocation plan.
                    </div>
                  )}
                </div>
              )}

              {!loading && activeSubtab === 'soil' && (
                <div>
                  {soilResult ? (
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 prose max-w-none text-slate-700">
                      {renderMarkdown(soilResult)}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      Select target agricultural region and click "Generate Agro Viability Profile".
                    </div>
                  )}
                </div>
              )}

              {!loading && activeSubtab === 'inspect' && (
                <div>
                  {inspectResult ? (
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 prose max-w-none text-slate-700">
                      {renderMarkdown(inspectResult)}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      Provide a defect/leak description and execute "Run AI Defect Audit".
                    </div>
                  )}
                </div>
              )}

              {activeSubtab === 'consult' && (
                <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {consultHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                        {msg.sender === 'user' ? 'You' : 'Makao Advisor'}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.sender === 'ai' ? renderMarkdown(msg.text) : msg.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-auto items-start max-w-[85%] flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Makao Advisor</span>
                      <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 font-semibold">
                        Advisor is formulating official guidelines...
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Bottom Chat Input Form for Consultant only */}
          {activeSubtab === 'consult' && (
            <form onSubmit={handleConsultSubmit} className="flex gap-2.5 mt-4 pt-4 border-t border-slate-100">
              <input
                type="text"
                value={consultQuestion}
                onChange={(e) => setConsultQuestion(e.target.value)}
                placeholder="Ask about title searches, ArdhiSasa, or viewing fees safety..."
                className="flex-1 clay-input py-2.5 px-3.5 text-xs focus:outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={loading || !consultQuestion.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 p-2.5 text-white rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
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
