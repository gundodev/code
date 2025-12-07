import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, MessageRole, MessageType } from '../types';
import { Bot, User, Cpu, AlertTriangle, Download } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isError = message.type === MessageType.ERROR;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600' : isError ? 'bg-red-500' : 'bg-brand-600'
        } shadow-lg`}>
          {isUser ? <User size={20} className="text-white" /> : 
           isError ? <AlertTriangle size={20} className="text-white" /> :
           <Bot size={20} className="text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-md ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : isError 
                ? 'bg-red-900/50 border border-red-800 text-red-200 rounded-tl-none'
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
          }`}>
            
            {message.imageData ? (
               <div className="flex flex-col gap-3">
                 <p className="text-sm opacity-90 mb-2">{message.content}</p>
                 <div className="relative group overflow-hidden rounded-lg border border-slate-600">
                    <img 
                      src={message.imageData} 
                      alt="Generated AI" 
                      className="w-full h-auto max-w-md object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={message.imageData} 
                        download={`intergen-${message.id}.png`}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-colors"
                      >
                        <Download size={24} />
                      </a>
                    </div>
                 </div>
               </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none break-words">
                <ReactMarkdown
                   components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="relative my-4 rounded-md overflow-hidden border border-slate-600 bg-slate-950">
                          <div className="bg-slate-900 px-3 py-1 text-xs text-slate-400 border-b border-slate-700 font-mono flex justify-between">
                             <span>{match[1]}</span>
                          </div>
                          <div className="p-4 overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </div>
                        </div>
                      ) : (
                        <code className={`${className} bg-slate-700/50 px-1.5 py-0.5 rounded text-brand-200 font-mono text-sm`} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 mt-1 mx-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};