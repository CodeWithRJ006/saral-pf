"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { fetchChatCompletion } from "@/lib/openai";

const SYSTEM_PROMPT = `You are Saral, an AI assistant helping Indian citizens navigate EPFO provident fund claims. You have access to this user's mock account:

UAN: 100987654321
Member Name: Rahul Sharma (Aadhaar) / R. Sharma (UAN record) â€” 1 letter mismatch flagged
Current Employer: TechCorp India Pvt Ltd
PF Balance: â‚¹2,34,850
KYC Status: Aadhaar seeded, Bank verified, PAN linked, Name mismatch flagged (Aadhaar says "Rahul Sharma", UAN says "R. Sharma")
Active Claim: Form 19 filed 8 days ago, stuck at Field Office stage, SLA breached by 1 day

Your role: answer questions about their claim status, explain EPFO processes in plain Hindi-English (Hinglish is fine), guide them to fix the name mismatch via Joint Declaration, explain what EPFiGMS is, and help them understand their rights.

Be warm, direct, and concise. Never use more than 3 sentences per response unless the user specifically asks for detail. Start responses with the most important information first. If you don't know something specific about real EPFO backend systems, say so honestly rather than guessing. Never fabricate regulatory citations.

Match the user's language â€” Hindi in, Hindi out; English in, English out.`;

const cubicTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function SaralAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", role: "assistant", content: "Namaste. I am Saral. How can I help you with your PF account today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const apiFailed = false; // Forced to false so it never disables
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [callCount, setCallCount] = useState(0);
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isLiveCalling, setIsLiveCalling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Why is my claim delayed?",
    "How do I fix the name mismatch?",
    "What is EPFiGMS?"
  ];

  const faqs = [
    { q: "Why is my claim delayed?", a: "Claims are usually delayed due to KYC mismatches, pending employer approvals, or overlapping service histories. Please check your 'Identity & KYC' section." },
    { q: "How do I fix the name mismatch?", a: "You can submit a Joint Declaration form online. The system can auto-draft this for you if you click 'Resolve via Auto-Joint Declaration' in the Dashboard." },
    { q: "What is EPFiGMS?", a: "EPFiGMS is the official grievance management system of EPFO. If your claim breaches the SLA (e.g. 7 days), you can automatically escalate the issue there." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping, apiFailed, expandedFaq]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    
    setShowQuickReplies(false);
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content };
    const newMessages = [...messages, newUserMsg];
    
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    const cacheKey = `mock_session_${content.trim().toLowerCase()}`;

    // 1. Check cache first
    if (cache[cacheKey]) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: cache[cacheKey]
        }]);
        setIsTyping(false);
      }, 600); // Artificial short delay for cached response
      return;
    }

    // 2. Live API Call
    setIsLiveCalling(true);

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...newMessages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetchChatCompletion(apiMessages, 200, 0.3); // max 200 tokens
    
    setIsLiveCalling(false);
    setIsTyping(false);

    let finalResponse = response;
    if (response === "ERROR_API_FAILED") {
      finalResponse = "Network issue. Using fallback: To fix your issue, you can file a Joint Declaration form from the Dashboard.";
    }
    
    setCache(prev => ({ ...prev, [cacheKey]: finalResponse }));
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "assistant",
      content: finalResponse
    }]);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[145px] md:bottom-10 right-4 md:right-8 z-50 flex min-h-[44px] items-center gap-3 rounded-full border border-[#131215]/10 bg-[#F7F5F0] px-4 shadow-[0_4px_16px_rgba(19,18,21,0.06)] transition-colors hover:bg-white"
          >
            {isLiveCalling ? (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-[#2c524b]" 
              />
            ) : (
              <div className="h-2 w-2 rounded-full bg-[#2c524b]" />
            )}
            <span className="font-serif text-base tracking-wide text-[#131215]">Saral</span>
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={cubicTransition}
            className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col bg-[#F7F5F0] md:inset-auto md:bottom-4 md:right-8 md:h-[600px] md:w-[380px] md:rounded-t-2xl md:border md:border-[#131215]/10 md:shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#131215]/10 px-6 py-2 bg-[#F7F5F0] min-h-[56px]">
              <div className="flex items-center gap-3">
                {isLiveCalling ? (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-[#2c524b]" 
                  />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[#2c524b]" />
                )}
                <span className="font-serif text-lg tracking-wide text-[#131215]">Saral</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] transition-colors -mr-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div 
                    className={
                      msg.role === "user" 
                        ? "max-w-[85%] bg-[#2c524b] text-white px-4 py-3 text-sm leading-relaxed" 
                        : "max-w-[85%] bg-[#F7F5F0] text-[#131215] text-sm leading-relaxed border border-[#131215]/10 px-4 py-3"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#F7F5F0] text-[#131215]/60 text-sm leading-relaxed px-4 py-3 flex items-center">
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ...
                    </motion.div>
                  </div>
                </div>
              )}

              {/* API Failed State -> Static FAQs */}
              {apiFailed && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-[#F7F5F0] text-[#131215] text-sm leading-relaxed border border-red-700/20 px-4 py-3">
                      Saral is unavailable right now. Here are answers to common questions:
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border border-[#131215]/10 bg-white overflow-hidden transition-all">
                        <button 
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full text-left px-4 py-3 text-xs font-medium text-[#131215] hover:bg-[#131215]/5 transition-colors flex justify-between items-center"
                        >
                          {faq.q}
                          <span className="text-[#131215]/40">{expandedFaq === idx ? 'âˆ’' : '+'}</span>
                        </button>
                        {expandedFaq === idx && (
                          <div className="px-4 pb-3 pt-1 text-xs text-[#131215]/70 leading-relaxed border-t border-[#131215]/5 bg-[#F7F5F0]/50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 1 && !isTyping && !apiFailed && (
              <div className="px-6 pb-4 flex flex-col gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    className="text-left w-full min-h-[44px] border border-[#131215]/10 bg-white px-4 py-2.5 text-xs font-medium text-[#131215] transition-colors hover:bg-[#131215]/5"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-[#131215]/10 bg-white p-2 md:p-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Saral a question..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent px-2 min-h-[44px] text-sm text-[#131215] placeholder-[#131215]/40 outline-none disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#2c524b] disabled:text-[#131215]/20 hover:bg-[#2c524b]/5 rounded-full transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

