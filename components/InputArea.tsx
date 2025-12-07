import React, { useState, KeyboardEvent } from 'react';
import { Send, Image as ImageIcon, Code, MessageSquare, Loader2 } from 'lucide-react';
import { AppMode } from '../types';

interface InputAreaProps {
  onSend: (text: string, mode: AppMode) => void;
  isLoading: boolean;
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, activeMode, onModeChange }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input, activeMode);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1 px-2 pt-2 pb-1 border-b border-slate-700/50">
          <button
            onClick={() => onModeChange(AppMode.CHAT)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMode === AppMode.CHAT 
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <MessageSquare size={14} />
            Chat
          </button>
          <button
            onClick={() => onModeChange(AppMode.CODE)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMode === AppMode.CODE 
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Code size={14} />
            Code
          </button>
          <button
            onClick={() => onModeChange(AppMode.IMAGE)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMode === AppMode.IMAGE 
                ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <ImageIcon size={14} />
            Image
          </button>
        </div>

        <div className="flex items-end gap-2 p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMode === AppMode.IMAGE ? "Describe an image to generate..." :
              activeMode === AppMode.CODE ? "Describe the code you need..." :
              "Ask InterGen anything..."
            }
            className="w-full bg-transparent border-0 focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 px-3 min-h-[56px] max-h-32 text-sm leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/20 transform hover:scale-105 active:scale-95'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
         <p className="text-[10px] text-slate-500">
           InterGen uses gemini-2.5-flash and gemini-3-pro-preview models. AI may display inaccurate info.
         </p>
      </div>
    </div>
  );
};