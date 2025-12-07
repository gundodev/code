import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Zap, Box, MessageSquare, Code, Image as ImageIcon } from 'lucide-react';

import { ChatMessage, AppMode, MessageRole, MessageType } from './types';
import { generateResponse } from './services/geminiService';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { InputArea } from './components/InputArea';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CHAT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, mode: AppMode) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: MessageRole.USER,
      content,
      type: MessageType.TEXT,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Filter history for chat context, ignoring errors or images for simplicity in prompt construction
      const history = messages
        .filter(m => m.type !== MessageType.ERROR && m.type !== MessageType.IMAGE)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await generateResponse(content, mode, history);
      
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: MessageRole.ASSISTANT,
        content: response.text,
        type: response.imageData ? MessageType.IMAGE : (mode === AppMode.CODE ? MessageType.CODE : MessageType.TEXT),
        timestamp: Date.now(),
        imageData: response.imageData
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: MessageRole.ASSISTANT,
        content: "Sorry, I encountered an error processing your request. Please try again.",
        type: MessageType.ERROR,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500/30">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              InterGen
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
             <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800">
               <Zap size={10} className={activeMode === AppMode.CODE ? "text-emerald-400" : "text-brand-400"} />
               v2.5-Flash
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {messages.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
                <div className="relative w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center shadow-2xl">
                   <Box size={40} className="text-brand-400" />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-bold text-white">Welcome to InterGen</h2>
                <p className="text-slate-400">
                  Your all-in-one AI workspace. Generate code, create stunning images, or just chat.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
                <button 
                  onClick={() => setActiveMode(AppMode.CHAT)}
                  className="group p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare size={18} className="text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-200">Chat & Ask</h3>
                  <p className="text-xs text-slate-500 mt-1">General purpose assistance</p>
                </button>

                <button 
                   onClick={() => setActiveMode(AppMode.CODE)}
                   className="group p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Code size={18} className="text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-200">Generate Code</h3>
                  <p className="text-xs text-slate-500 mt-1">Python, TS, Rust & more</p>
                </button>

                <button 
                   onClick={() => setActiveMode(AppMode.IMAGE)}
                   className="group p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon size={18} className="text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-200">Create Images</h3>
                  <p className="text-xs text-slate-500 mt-1">Powered by Imagen 3 tech</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                 <div className="flex items-center gap-3 text-slate-500 text-sm ml-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Sparkles size={16} className="text-brand-400 animate-spin" />
                    </div>
                    <span>InterGen is thinking...</span>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/50 pb-4 pt-2 z-20">
        <InputArea 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          activeMode={activeMode}
          onModeChange={setActiveMode}
        />
      </footer>
    </div>
  );
};

export default App;