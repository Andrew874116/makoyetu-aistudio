import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck, DollarSign, Smartphone, Check, HelpCircle, Loader2 } from 'lucide-react';
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
    onSendMessage(`💸 M-PESA SECURE DEPOSIT RESERVED: Held Ksh ${activeProperty?.price || 15000} in Makao Secure Escrow. Ref: ${escrowRef}`);
  };

  const releaseEscrowFunds = () => {
    setEscrowStatus('released');
    onSendMessage("✅ SECURE ESCROW RELEASED: Tenant confirmed move-in. Funds securely transferred to verified landlord.");
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-950 flex items-center justify-center gap-2 font-display">
          <ShieldCheck className="text-emerald-600 w-6 h-6 animate-pulse" /> Secure Chat & Escrow Ledger
        </h2>
        <p className="text-sm text-slate-600">
          Chat with verified representatives, draft legally binding agreements, and process secure rental deposits with Safaricom integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chat History Panel (Columns 1-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between h-[520px]">
          
          {/* Agent Header */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200/80 flex justify-between items-center text-slate-800">
            <div className="flex items-center space-x-3">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                src={activeProperty?.host.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Agent Profile"
              />
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-900">
                  {activeProperty?.host.name || "Andrew Muthengi"}
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">✓ Verified</span>
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold">Response SLA: <span className="text-emerald-700 font-bold">Instant</span></p>
              </div>
            </div>

            {/* Escrow Trigger Shortcut Button */}
            <button
              onClick={() => setShowEscrowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" /> Secure Deposit
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none bg-slate-50/30">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <span className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                    {isUser ? 'You' : 'Representative'}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    {msg.timestamp} {isUser && <Check className="w-3 h-3 text-emerald-600 inline" />}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached Property Reference Footer Indicator if active */}
          {activeProperty && (
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">ACTIVE REFERENCE</span>
                <span className="text-slate-800 font-bold line-clamp-1">{activeProperty.title}</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">Ksh {activeProperty.price.toLocaleString()}</span>
            </div>
          )}

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="bg-white px-4 py-3.5 border-t border-slate-200/80 flex gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Negotiate rent prices, ask for utility details, or book viewings..."
              className="flex-1 clay-input py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 p-2.5 text-white rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Dynamic Ledger & Escrow Ledger (Columns 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          <div className="clay-card p-6 text-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <DollarSign className="text-emerald-600 w-4 h-4" /> Escrow Balance Sheet
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Makao Yetu preserves tenancy deposits in a secure, audited escrow holding ledger. Funds are fully locked and protected until you inspect the property and sign off.
              </p>

              {escrowStep === 'success' ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-inner">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Deposit Total:</span>
                      <span className="font-bold text-slate-900">Ksh {activeProperty?.price.toLocaleString() || "15,000"}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-200/80 pt-2.5 font-semibold">
                      <span className="text-slate-500">Escrow Ledger:</span>
                      <span className={`font-bold uppercase ${
                        escrowStatus === 'locked' ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full'
                      }`}>
                        {escrowStatus}
                      </span>
                    </div>
                  </div>

                  {escrowStatus === 'locked' ? (
                    <div className="space-y-2">
                      <button
                        onClick={releaseEscrowFunds}
                        className="w-full clay-btn bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        ✓ Confirm & Release Funds
                      </button>
                      <p className="text-[10px] text-slate-500 text-center font-semibold">
                        Only release once you physically inspect the building and sign the keys lease.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center text-xs text-emerald-800 font-bold">
                      🎉 Payment Completed. Landlord ledger has been credited with Ksh {activeProperty?.price.toLocaleString() || "15,000"}.
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 bg-slate-50 p-8 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400">
                  <Smartphone className="w-10 h-10 text-slate-300 mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-slate-600">Escrow Ledger Empty</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Tap "Secure Deposit" to draft your tenancy deposit</p>
                </div>
              )}
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-[10px] leading-snug">
                Fully guarded under **Makao Escrow Guarantees**. Scam viewing fees are strictly barred.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* STK Push Simulation Dialog */}
      <AnimatePresence>
        {showEscrowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-slate-800 shadow-2xl text-center relative overflow-hidden"
            >
              {/* STK Push Step Idle */}
              {escrowStep === 'idle' && (
                <div className="space-y-4">
                  <Smartphone className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900">M-Pesa Express Secured Transfer</h3>
                  <p className="text-xs text-slate-500">
                    To reserve the rent of **Ksh {activeProperty?.price.toLocaleString() || "15,000"}** in secure escrow, enter your Safaricom number:
                  </p>

                  <input
                    type="text"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="clay-input py-2.5 px-4 text-xs text-center font-bold w-48 mx-auto block focus:outline-none"
                  />

                  <button
                    onClick={startEscrowPush}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Send Secure STK Push
                  </button>
                </div>
              )}

              {/* STK Push Step: Triggering push */}
              {escrowStep === 'push' && (
                <div className="space-y-3 py-6">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Awaiting Secure M-Pesa Handshake...</h4>
                  <p className="text-xs text-slate-500">Establishing handshake with Safaricom network.</p>
                </div>
              )}

              {/* STK Push Step: Pin insertion screen */}
              {escrowStep === 'pin' && (
                <div className="space-y-4">
                  <div className="bg-slate-100 p-4 border border-slate-200 rounded-2xl w-56 mx-auto text-left space-y-3 shadow-inner">
                    <p className="text-[11px] text-slate-700 font-semibold leading-tight">
                      Confirm escrow reservation of **Ksh {activeProperty?.price.toLocaleString() || "15,000"}** to **Makao Yetu Escrow**?
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold block">ENTER SAFARICOM M-PESA PIN</label>
                      <input
                        type="password"
                        value="••••"
                        disabled
                        className="bg-white border border-slate-200 text-center font-mono py-1.5 rounded-lg text-slate-800 tracking-widest text-xs w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={confirmMpesaPin}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Confirm PIN Verification
                  </button>
                </div>
              )}

              {/* STK Push Step: Success */}
              {escrowStep === 'success' && (
                <div className="space-y-4 py-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-200">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Escrow Ledger Credit Success!</h3>
                  <p className="text-xs text-slate-500 px-6 leading-relaxed">
                    Ksh {(activeProperty?.price || 15000).toLocaleString()} is locked securely in the verified escrow system. Representatives cannot claim it until you physically inspect the building and approve the key release.
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold font-mono">Reference: {escrowRef}</p>

                  <button
                    onClick={() => setShowEscrowModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Back to Secured Chat
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
