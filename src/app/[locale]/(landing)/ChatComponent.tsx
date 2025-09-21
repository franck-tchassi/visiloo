"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Home, MessagesSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";


type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type ChatbotWidgetProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChatbotWidget({ open, onClose }: ChatbotWidgetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"accueil" | "conversations">("accueil");
  const chatBodyRef = useRef<HTMLInputElement>(null)

  
  const generateBotResponse = async (history: any) => {
    
    // Helper function to update chat history
    const updateHistory = (text: any) => {
        setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}])
    }

  // Formater les messages pour Gemini
  const formattedHistory = history.map(
    ({ role, text }: { role: string; text: string }) => ({
      role,
      parts: [{ text }],
    })
  );

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // 🔧 Correction ici
    body: JSON.stringify({ contents: formattedHistory }),
  };

  try {
    // 🔄 Appel vers l'API locale pour éviter CORS
    const response = await fetch("/api/chat", requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Something went wrong!");

    const apiResponseText =  data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

    updateHistory(apiResponseText);

   // console.log(data); // 🔍 Tu peux inspecter la structure ici
  } catch (error) {
    console.error("Erreur lors de la requête Gemini :", error);
  }
};


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Ajoute le message utilisateur
    setChatHistory(history => [...history, { role: "user", text: userMessage }]);

    // Ajoute un placeholder "Thinking..." pour la réponse bot
    setTimeout(() => {
      setChatHistory(history => {
        // Empêche le doublon de "Thinking..."
        if (
          history[history.length - 1]?.role === "model" &&
          history[history.length - 1]?.text === "Thinking..."
        ) {
          return history;
        }
        return [...history, { role: "model", text: "Thinking..." }];
      });
    }, 600);

    // Call the function to generate the bot's response
    generateBotResponse([...chatHistory, { role: "user", text: userMessage }])
  };

  useEffect(() => {
    if (open && activeTab === "conversations") inputRef.current?.focus();
  }, [open, activeTab]);

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current?.scrollTo({top: chatBodyRef.current?.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mb-4 w-full max-w-md min-w-[350px]"
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col h-[480px] max-h-[75vh] w-full min-w-[350px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 w-full">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo/visiloo.png"
                  width={28}
                  height={28}
                  alt="Visiloo"
                  className="rounded"
                />
                <h2 className="font-bold text-lg text-amber-600">Visiloo</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fermer le chatbot"
                onClick={onClose}
              >
                <X />
              </Button>
            </div>
            
            {/* Body */}
            <div className={`flex-1 px-4 py-3 overflow-auto w-full ${
              activeTab === "accueil" 
                ? "bg-gradient-to-b from-amber-50 via-amber-25 to-white" 
                : "bg-gray-50"
            }`}>
              {activeTab === "accueil" && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 select-none">
                  Nous sommes là pour vous aider !<br />
                  Comment pouvons-nous vous aider ?
                </div>
              )}
              {activeTab === "conversations" && (
                <div className="flex flex-col gap-2 h-full">
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 select-none">
                      <MessagesSquare size={32} className="mb-2" />
                      <div className="text-sm">Aucune conversation pour le moment.</div>
                    </div>
                  ) : (
                    <div ref={chatBodyRef} className="flex flex-col gap-2">
                      {chatHistory.map((chat, index) => (
                        <div
                          key={index}
                          className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} my-1`}
                        >
                          <div
                            className={`flex items-center px-3 py-2 rounded-lg max-w-[80%] 
                              ${chat.role === "model" ? "bg-gray-200 text-left" : "bg-amber-100 text-right"}`}
                          >
                            {chat.role === "model" && <MessagesSquare size={20} className="mr-2" />}
                            <p>{chat.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer : barre d'onglets + zone de saisie optionnelle */}
            <div className="flex flex-col w-full">
              {/* Zone de saisie UNIQUEMENT pour "Conversations" */}
              {activeTab === "conversations" && (
                <form
                  action="#"
                  className="flex items-center gap-2 p-3 border-b border-gray-200 w-full"
                  onSubmit={handleFormSubmit}
                >
                  <Input
                    type="text"
                    placeholder="Tapez votre message…"
                    ref={inputRef}
                    className="flex-1"
                    aria-label="Tapez votre message"
                  />
                  <Button type="submit" size="icon" variant="default" aria-label="Envoyer">
                    <Send />
                  </Button>
                </form>
              )}
              
              {/* Onglets en bas */}
              <div className="flex w-full">
                <button
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition relative
                    ${activeTab === "accueil" 
                      ? "text-amber-600 bg-gradient-to-t from-amber-50 to-white" 
                      : "text-gray-500 hover:text-amber-600"}
                  `}
                  onClick={() => setActiveTab("accueil")}
                  aria-selected={activeTab === "accueil"}
                  tabIndex={0}
                  type="button"
                >
                  <Home size={18} />
                  Accueil
                </button>
                
                <button
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition
                    ${activeTab === "conversations" 
                      ? "text-amber-600 bg-gray-50" 
                      : "text-gray-500 hover:text-amber-600"}
                  `}
                  onClick={() => setActiveTab("conversations")}
                  aria-selected={activeTab === "conversations"}
                  tabIndex={0}
                  type="button"
                >
                  <MessagesSquare size={18} />
                  Conversations
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}