import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck, DollarSign, Smartphone, Check, HelpCircle, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Property } from '../types';

interface ChatSimulatorProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  activeProperty: Property | null;
  onUnlockQuest: (questId: string) => void;
}

export default function ChatSimulator({ messages, onSendMessage, activeProperty, onUnlockQuest }: ChatSimulatorProps) {
  const [inputText, setInputText] = useState('');
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  
  // Escrow STK push steps
  const [escrowStep, setEscrowStep] = useState<'idle' | 'push' | 'pin' | 'success'>('idle');
  const [escrowRef, setEscrowRef] = useState('');
  const [escrowStatus, setEscrowStatus] = useState<'locked' | 'released' | 'refunded'>('locked');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');

    // Unlock Inquiry Quest
    onUnlockQuest('q-1');
  };

  const startEscrowPush = () => {
    setEscrowStep('push');
    setTimeout(() => {
      setEscrowStep('pin');
    }, 2000);
  };

  const confirmMpesaPin = () => {
    setEscrowStep('success');
    setEscrowRef(`MPESA-TX-${Math.floor(100000 + Math.random() * 900000)}`);
    setEscrowStatus('locked');
    onSendMessage(`💸 M-PESA ESCROW TRIGGERED: Held Ksh ${activeProperty?.price || 15000} in Makao Secure Escrow. Ref: ${escrowRef}`);
  };

  const releaseEscrowFunds = () => {
    setEscrowStatus('released');
    onSendMessage("✅ ESCROW RELEASED: Tenant confirmed move-in. Funds transferred to verified agent.");
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <ShieldCheck className="text-emerald-500 w-6 h-6 animate-pulse" /> Makao Secured Chat & Escrow
        </h2>
        <p className="text-sm text-slate-400">
          Negotiate with verified agents, attach properties, and process secure rental deposits through M-Pesa simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chat History Panel (Columns 1-8) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between h-[520px]">
          
          {/* Agent Header */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <img
                className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                src={activeProperty?.host.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Agent Profile"
              />
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  {activeProperty?.host.name || "Andrew Muthengi (Agent)"}
                  <span className="text-emerald-400 text-[10px]">✓ Verified</span>
                </h4>
                <p className="text-[10px] text-slate-400">Response SLA: <span className="text-emerald-400">Instantly</span></p>
              </div>
            </div>

            {/* Escrow Trigger Shortcut Button */}
            <button
              onClick={() => setShowEscrowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" /> Secure Deposit
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <span className="text-[9px] text-slate-500 uppercase font-mono mb-0.5">
                    {isUser ? 'You' : 'Andrew'}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono mt-1 flex items-center gap-1">
                    {msg.timestamp} {isUser && <Check className="w-3 h-3 text-emerald-400 inline" />}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached Property Reference Footer Indicator if active */}
          {activeProperty && (
            <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">ATTACHED</span>
                <span className="text-slate-300 font-medium line-clamp-1">{activeProperty.title}</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">Ksh {activeProperty.price.toLocaleString()}</span>
            </div>
          )}

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="bg-slate-950 px-4 py-3.5 border-t border-slate-850 flex gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Negotiate rent prices, ask for utility details, or book viewings..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 p-2.5 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Dynamic Ledger & Escrow Ledger (Columns 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <DollarSign className="text-emerald-500 w-4 h-4" /> Escrow Balance Sheet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Makao Yetu keeps tenancy deposits in a secure simulated escrow holding tank. Scammers cannot withdraw your funds until you inspect and authorize release.
              </p>

              {escrowStep === 'success' ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Deposit Total:</span>
                      <span className="font-mono font-bold text-white">Ksh {activeProperty?.price.toLocaleString() || "15,000"}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-850 pt-2">
                      <span className="text-slate-400">Escrow Ledger Status:</span>
                      <span className={`font-mono font-bold uppercase ${
                        escrowStatus === 'locked' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {escrowStatus}
                      </span>
                    </div>
                  </div>

                  {escrowStatus === 'locked' ? (
                    <div className="space-y-2">
                      <button
                        onClick={releaseEscrowFunds}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-all shadow"
                      >
                        ✓ Release Funds (Authorized)
                      </button>
                      <p className="text-[10px] text-slate-500 text-center">
                        Only tap this after you physically inspect the building and obtain keys.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-center text-xs text-emerald-300">
                      🎉 Payment completed. verified agent has received Ksh {activeProperty?.price.toLocaleString() || "15,000"}.
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 bg-slate-950 p-6 rounded-xl flex flex-col items-center justify-center text-center text-slate-500">
                  <Smartphone className="w-10 h-10 text-slate-600 mb-2 animate-pulse" />
                  <span className="text-xs font-semibold">Escrow Ledger Empty</span>
                  <p className="text-[10px] text-slate-600 mt-1">Tap "Secure Deposit" to trigger simulated M-Pesa push</p>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <p className="text-[10px] leading-snug">
                Protected by **Makao Safekey Escrow Protocols**. Scam viewing fees are prohibited.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* STK Push Simulation Dialog */}
      <AnimatePresence>
        {showEscrowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl text-center relative overflow-hidden"
            >
              {/* STK Push Step Idle */}
              {escrowStep === 'idle' && (
                <div className="space-y-4">
                  <Smartphone className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold">M-Pesa STK Push Simulation</h3>
                  <p className="text-xs text-slate-400">
                    To hold the rent of **Ksh {activeProperty?.price.toLocaleString() || "15,000"}** in Makao Escrow, enter your Safaricom number:
                  </p>

                  <input
                    type="text"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-850 py-2.5 px-4 rounded-xl text-xs text-white text-center font-mono w-48 mx-auto block focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    onClick={startEscrowPush}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                  >
                    Simulate STK Push
                  </button>
                </div>
              )}

              {/* STK Push Step: Triggering push */}
              {escrowStep === 'push' && (
                <div className="space-y-3 py-6">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm">Awaiting M-Pesa Handshake...</h4>
                  <p className="text-xs text-slate-400">Safaricom API is packing the secure STK push package.</p>
                </div>
              )}

              {/* STK Push Step: Pin insertion screen */}
              {escrowStep === 'pin' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl w-56 mx-auto text-left space-y-3 shadow-xl">
                    <p className="text-[11px] text-slate-300 leading-tight">
                      Do you want to pay **Ksh {activeProperty?.price.toLocaleString() || "15,000"}** to **Makao Yetu Escrow**?
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 uppercase font-mono block">ENTER M-PESA PIN (MOCK)</label>
                      <input
                        type="password"
                        value="••••"
                        disabled
                        className="bg-slate-900 border border-slate-800 text-center font-mono py-1.5 rounded text-white tracking-widest text-xs w-full"
                      />
                    </div>
                  </div>

                  <button
                    onClick={confirmMpesaPin}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl text-xs transition-all shadow"
                  >
                    Simulate PIN Authorization
                  </button>
                </div>
              )}

              {/* STK Push Step: Success */}
              {escrowStep === 'success' && (
                <div className="space-y-4 py-4">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-white">Payment Received by Escrow Ledger!</h3>
                  <p className="text-xs text-slate-400 px-6 leading-relaxed">
                    Ksh {(activeProperty?.price || 15000).toLocaleString()} is locked securely in the escrow account. The agent cannot access it until you sign off!
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">Reference: {escrowRef}</p>

                  <button
                    onClick={() => setShowEscrowModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-6 rounded-xl text-xs"
                  >
                    Back to Chat
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
