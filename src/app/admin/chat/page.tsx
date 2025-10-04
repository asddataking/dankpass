// DANKPASS: Admin chat UI using Vercel AI Gateway
"use client";
import { redirect } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AdminChat() {
  const user = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // DANKPASS: Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      redirect('/auth/signin');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage = '';
      const assistantMessageId = (Date.now() + 1).toString();

      // Add assistant message placeholder
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: ''
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
              }
            } catch {
              // Ignore parsing errors for streaming
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold">DankPass Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/admin" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Dashboard
            </a>
            <a href="/admin/chat" className="px-4 py-2 bg-gray-800 rounded-lg">
              Chat
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            DankPass Admin Chat
          </h1>
          
          {/* Chat Messages */}
          <div className="border border-gray-800 rounded-2xl p-6 h-[60vh] overflow-y-auto space-y-4 mb-6 bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Welcome to DankPass Admin Assistant</h3>
                <p>Ask me anything about managing your loyalty platform!</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    m.role === "user" 
                      ? "bg-gradient-to-r from-green-500 to-purple-500 text-white" 
                      : "bg-gray-800 text-gray-100"
                  }`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input 
              className="flex-1 border border-gray-600 rounded-2xl px-4 py-3 bg-gray-900 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask your AI assistant about DankPass management..." 
              disabled={isLoading}
            />
            <button 
              disabled={isLoading || !input.trim()} 
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-purple-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setInput("Show me recent receipt processing stats")}
              className="p-4 border border-gray-600 rounded-xl hover:border-green-500 transition-colors text-left"
            >
              <div className="text-sm font-semibold">📊 Analytics</div>
              <div className="text-xs text-gray-400">View processing stats</div>
            </button>
            
            <button
              onClick={() => setInput("Help me troubleshoot a user issue")}
              className="p-4 border border-gray-600 rounded-xl hover:border-green-500 transition-colors text-left"
            >
              <div className="text-sm font-semibold">🔧 Support</div>
              <div className="text-xs text-gray-400">User troubleshooting</div>
            </button>
            
            <button
              onClick={() => setInput("Show me pending receipts that need review")}
              className="p-4 border border-gray-600 rounded-xl hover:border-green-500 transition-colors text-left"
            >
              <div className="text-sm font-semibold">📋 Review</div>
              <div className="text-xs text-gray-400">Pending receipts</div>
            </button>
            
            <button
              onClick={() => setInput("What are the current system health metrics?")}
              className="p-4 border border-gray-600 rounded-xl hover:border-green-500 transition-colors text-left"
            >
              <div className="text-sm font-semibold">💚 Health</div>
              <div className="text-xs text-gray-400">System status</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}