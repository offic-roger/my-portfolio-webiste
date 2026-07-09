"use client";

import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Habari! Mimi ni AI msaidizi wa Official Roger. \n\nUnaweza kuniuliza maswali kuhusu huduma zangu za Graphic Design, Video Editing, 2D/3D Animation, AI Solutions, Web/App Development, au bei (pricing) na jinsi ya kufanya kazi nami. Nipo hapa kukusaidia!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatLog = [...messages, userMessage].map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatLog }),
      });

      if (!res.ok) throw new Error("API Route failure");

      const data = await res.json();
      
      let replyText = data.response;

      // Browser fallback when Node.js server cannot reach Gemini API
      if (data.fallback) {
        console.warn("Server connection to Gemini timed out/blocked. Executing client-side fallback...");
        const fallbackRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${data.apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: data.contents,
              systemInstruction: {
                parts: [{ text: data.systemInstruction }],
              },
              generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (!fallbackRes.ok) {
          throw new Error("Browser fallback API call failed");
        }

        const fallbackData = await fallbackRes.json();
        replyText = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || 
          "Samahani, nilishindwa kupata majibu kwa sasa. Tafadhali jaribu tena.";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: replyText,
        },
      ]);
    } catch (err) {
      console.error("Chatbot request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Samahani, kuna hitilafu ya mtandao iliyotokea. Tafadhali jaribu tena baada ya muda mfupi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── CUSTOM INLINE STYLES FOR FLOATING ANIMATION ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-wobble {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .animate-whatsapp {
          animation: float-wobble 4s ease-in-out infinite;
        }
        .whatsapp-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />

      {/* ── Floating Buttons Container ── */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 items-end pointer-events-none">
        
        {/* ── WhatsApp FAB ── */}
        <a
          href="https://wa.me/255763112145"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-whatsapp pointer-events-auto relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200"
          title="Chat on WhatsApp"
        >
          {/* Outer Pulsing Green Ring */}
          <div className="whatsapp-ring absolute inset-0 rounded-full border-4 border-[#25D366]" />
          <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.792-4.382 9.795-9.79.002-2.618-1.01-5.08-2.849-6.92C16.378 2.05 13.918 1.03 11.3 1.03c-5.41.002-9.803 4.39-9.807 9.8-.002 1.988.511 3.927 1.488 5.65L2.145 21.8l5.502-1.446zM17.18 14.34c-.284-.143-1.687-.833-1.947-.928-.26-.096-.45-.143-.64.143-.19.287-.736.928-.902 1.12-.165.19-.33.21-.613.068-.284-.143-1.2-.442-2.285-1.41-.845-.754-1.415-1.684-1.58-1.97-.166-.285-.018-.44.124-.58.128-.129.285-.333.427-.5.143-.168.19-.287.285-.478.095-.19.047-.358-.023-.5-.07-.143-.64-1.543-.877-2.118-.23-.557-.464-.48-.64-.48-.164-.002-.353-.003-.54-.003-.19 0-.498.07-.759.358-.26.287-1 .978-1 2.387 0 1.41 1.028 2.77 1.171 2.96.143.19 2.023 3.09 4.9 4.332.685.295 1.22.472 1.637.604.688.219 1.314.188 1.808.115.552-.082 1.688-.69 1.927-1.358.24-.668.24-1.24.168-1.358-.071-.118-.26-.19-.54-.33z" />
          </svg>
        </a>

        {/* ── Customer Care FAB ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200"
          style={{ background: "#5A2DC9", border: "1px solid rgba(255,255,255,0.15)" }}
          title="24/7 AI Customer Support"
        >
          {isOpen ? (
            // Close SVG
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Chat bubble SVG
            <svg className="w-7 h-7" style={{ color: "#F7C73D" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── AI Chat Popup Window ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9999] w-[350px] sm:w-[380px] h-[500px] flex flex-col rounded-[24px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-300"
          style={{ background: "rgba(10, 10, 10, 0.9)", backdropFilter: "blur(20px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#111111] border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div
                className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/logo.jpeg')" }}
              />
              <div>
                <h4 className="text-[14px] font-display text-white font-bold leading-tight">Roger&apos;s AI Assistant</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-white/50">Online • Customer Support</span>
                </div>
              </div>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 chat-scroll">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-[16px] px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "self-end bg-[#5A2DC9] text-white rounded-br-none"
                    : "self-start bg-white/5 border border-white/5 text-white/90 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="self-start bg-white/5 border border-white/5 text-white/90 rounded-[16px] rounded-bl-none px-4 py-3 text-[13px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#111] border-t border-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Andika ujumbe wako hapa..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[13px] text-white outline-none focus:border-[#5A2DC9] transition-colors placeholder-white/30"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#5A2DC9] flex items-center justify-center text-white disabled:bg-white/5 disabled:text-white/20 transition-colors"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
