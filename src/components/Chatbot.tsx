import React, { useState, useRef, useEffect } from 'react';
import { CVData, ChatMessage } from '../types';
import { Send } from 'lucide-react';

interface ChatbotProps {
  cvData: CVData;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ cvData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || !inputValue.trim() || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.answer, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'assistant', content: 'Error contacting backend.', timestamp: new Date() }]);
    }
    setIsLoading(false);
  };



  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
        <p className="text-sm text-gray-700 mb-1">Chat with John’s CV</p>
        <p className="text-xs text-gray-400">Questions are checked for safety and answered using relevant CV info.</p>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-gray-500 text-sm text-center mt-8">No messages yet. Start the conversation!</div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[90%]">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-600">{processingStatus}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-3 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
      {/* Privacy Notice */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            Queries processed via OpenAI API. No personal data stored. 
            <span className="text-gray-400 ml-1">Using implies consent.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 