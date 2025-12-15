import { MessageSquare, Send, Bot, User } from 'lucide-react';

export function AiChatContent() {
  const messages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your GraphLynk AI assistant. How can I help you today?",
    },
    {
      id: 2,
      role: 'user',
      content: 'Can you help me optimize my knowledge graph?',
    },
    {
      id: 3,
      role: 'assistant',
      content: "Of course! I can help you optimize your knowledge graph in several ways:\n\n1. Identify missing connections between entities\n2. Suggest relevant properties to add\n3. Recommend schema improvements\n4. Analyze your graph structure\n\nWhich area would you like to focus on?",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">AI Chat Assistant</h2>
        <p className="text-white/70">Get intelligent assistance with your knowledge graph</p>
      </div>

      {/* Chat Interface */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500/80 to-cyan-500/80 backdrop-blur-xl text-white border border-blue-400/30'
                    : 'backdrop-blur-xl bg-white/10 text-white border border-white/20'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/20 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything about your knowledge graph..."
              className="flex-1 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
