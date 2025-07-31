'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, FileText, Mail, Package } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: string;
  messageType?: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for content creation. I can help you generate blog posts, product descriptions, email content, and answer questions about crystal healing. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('general_chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      messageType: selectedType
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          type: selectedType,
          context: getContextForType(selectedType)
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: formatAIResponse(data.response, selectedType),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputMessage('');
    }
  };

  const getContextForType = (type: string): string => {
    switch (type) {
      case 'blog_generation':
        return JSON.stringify({
          topic: 'Crystal Healing',
          crystalName: 'Amethyst' // You can make this dynamic
        });
      case 'product_description':
        return JSON.stringify({
          crystalName: 'Rose Quartz',
          properties: ['Love', 'Healing', 'Emotional Balance'],
          category: 'Love'
        });
      case 'email_content':
        return JSON.stringify({
          emailType: 'welcome',
          data: { customerName: 'Customer' }
        });
      default:
        return '';
    }
  };

  const formatAIResponse = (response: any, type: string): string => {
    if (typeof response === 'string') {
      return response;
    }

    switch (type) {
      case 'blog_generation':
        return `**Title:** ${response.title}\n\n**Category:** ${response.category}\n\n**Tags:** ${response.tags?.join(', ')}\n\n**Excerpt:** ${response.excerpt}\n\n**Content:**\n${response.content}`;
      case 'product_description':
        return response.description || JSON.stringify(response, null, 2);
      case 'email_content':
        return `**Subject:** ${response.subject}\n\n**Content:**\n${response.content}`;
      default:
        return JSON.stringify(response, null, 2);
    }
  };

  const quickPrompts = [
    { type: 'blog_generation', text: 'Generate a blog post about Amethyst healing properties', icon: FileText },
    { type: 'product_description', text: 'Create a product description for Rose Quartz bracelet', icon: Package },
    { type: 'email_content', text: 'Write a welcome email for new customers', icon: Mail },
    { type: 'general_chat', text: 'What are the best crystals for stress relief?', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Content Assistant</h1>
              <p className="text-gray-600">Generate blogs, descriptions, and more with DeepSeek AI</p>
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="general_chat">General Chat</option>
            <option value="blog_generation">Blog Generation</option>
            <option value="product_description">Product Description</option>
            <option value="email_content">Email Content</option>
          </select>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-3">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedType(prompt.type);
                  setInputMessage(prompt.text);
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                <prompt.icon className="w-4 h-4" />
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-purple-600' : 'bg-gray-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border shadow-sm rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Type your ${selectedType.replace('_', ' ')} request...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
