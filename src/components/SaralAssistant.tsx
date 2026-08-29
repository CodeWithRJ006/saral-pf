"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { fetchChatCompletion } from "@/lib/openai";
import { useScenario } from "@/context/ScenarioContext";

const cubicTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function SaralAssistant() {
  const { scenario, profile } = useScenario();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", role: "assistant", content: "Namaste. I am Saral. How can I help you with your PF account today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  // Rate limiting to protect the free tier
  const [callCount, setCallCount] = useState(0);
  const MAX_CALLS = 10; // Max live calls per session component lifecycle
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isLiveCalling, setIsLiveCalling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic quick replies based on scenario
  let quickReplies: string[] = [];
  if (scenario === "MISMATCH") {
    quickReplies = ["How do I fix the name mismatch?", "What is a Joint Declaration?", "Why is my claim delayed?"];
  } else if (scenario === "MERGE") {
    quickReplies = ["Why is there a service overlap?", "What is Form 13?", "How do I transfer my PF?"];
  } else if (scenario === "NOMINATION") {
    quickReplies = ["How do I add a nominee?", "Is e-Nomination mandatory?", "Can I file Form 19 without it?"];
  } else {
    quickReplies = ["How do I withdraw my PF?", "What is Form 19?", "When will the money reach my bank?"];
  }

  // Reset conversation when scenario changes
  useEffect(() => {
    setMessages([{ id: "msg-0", role: "assistant", content: "Namaste. I am Saral. How can I help you with your PF account today?" }]);
    setShowQuickReplies(true);
    setInputValue("");
    setIsTyping(false);
  }, [scenario]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    
    setShowQuickReplies(false);
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content };
    const newMessages = [...messages, newUserMsg];
    
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    const cacheKey = `${scenario}_${content.trim().toLowerCase()}`;

    // 1. Check cache first
    if (cache[cacheKey]) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: cache[cacheKey]
        }]);
        setIsTyping(false);
      }, 400); 
      return;
    }

    // 2. Rate limit check
    if (callCount >= MAX_CALLS) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: "To protect the free tier demo rate limits, you have reached the maximum number of live AI calls for this session. Please switch scenarios to reset, or ask one of the cached questions."
        }]);
        setIsTyping(false);
      }, 400);
      return;
    }

    // 3. Live API Call
    setIsLiveCalling(true);
    setCallCount(prev => prev + 1);

    const systemPrompt = `You are Saral AI, an intelligent assistant built to simplify the EPFO provident fund experience for Indian citizens. 
You have access to this user's mock account:
UAN: ${profile.uan}
Member Name: ${profile.name} (UAN record) vs ${profile.panName} (Aadhaar record)
Current Scenario: ${scenario} (${scenario === "MISMATCH" ? "Name mismatch flagged" : scenario === "MERGE" ? "Multiple unmerged accounts" : scenario === "NOMINATION" ? "Missing e-Nomination" : "All Clear"})

Your instructions:
1. Always respond in the language the user writes in (English, Hindi, Hinglish, etc.).
2. Keep responses simple, clear, and very concise (max 2-3 sentences).
3. Base your advice strictly on their current scenario (${scenario}).
4. If they ask what Saral AI is, explain that it's a next-generation AI assistant designed to demystify PF management and auto-fix claim blockers.
5. Put the most important information first, formatted plainly.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...newMessages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetchChatCompletion(apiMessages, 200, 0.3);
    
    setIsLiveCalling(false);
    setIsTyping(false);

    let finalResponse = response;
    if (response === "ERROR_API_FAILED") {
      finalResponse = "Network issue or rate limit reached on Groq API. Please check your API key and rate limit quotas.";
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
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 1 && !isTyping && (
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
