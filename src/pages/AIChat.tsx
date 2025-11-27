import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Send, Bot, User, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: { name: string; url: string }[];
  timestamp: Date;
}

const mockChats = [
  { id: "1", title: "Is climate change real?", preview: "Yes, climate change is...", time: "2h ago" },
  { id: "2", title: "COVID vaccine safety", preview: "Extensive research shows...", time: "5h ago" },
  { id: "3", title: "Election fraud claims", preview: "Multiple investigations...", time: "1d ago" },
];

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you verify if the recent AI breakthrough in healthcare is legitimate?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    role: "assistant",
    content: "I've analyzed 47 sources including peer-reviewed journals and official statements. The AI healthcare breakthrough is verified as legitimate. The system has been tested across 15 countries with over 10,000 patient cases, showing a 94.7% improvement in diagnostic speed with 98.2% accuracy. The research was published in Nature Medicine and independently verified by the WHO.",
    confidence: 94,
    sources: [
      { name: "Nature Medicine", url: "#" },
      { name: "WHO Report", url: "#" },
      { name: "Stanford Medical Center", url: "#" },
    ],
    timestamp: new Date(Date.now() - 3500000),
  },
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm analyzing your question across multiple verified sources. This is a demo response showing how the AI would verify information.",
        confidence: 92,
        sources: [
          { name: "Reuters", url: "#" },
          { name: "AP News", url: "#" },
        ],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat List - Desktop Only */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex w-80 border-r border-border flex-col"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ai-purple" />
              AI Chat History
            </h2>
            <p className="text-xs text-muted-foreground mt-1">3/5 chats remaining today</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {mockChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <p className="font-medium text-sm line-clamp-1">{chat.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{chat.preview}</p>
                <p className="text-xs text-muted-foreground mt-2">{chat.time}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border">
            <Button className="w-full" variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </motion.aside>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-purple to-primary flex items-center justify-center flex-shrink-0 animate-glow-pulse">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-2xl ${message.role === "user" ? "order-first" : ""}`}>
                  <Card className={`p-4 ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "glass-effect gradient-border"
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.confidence && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <ConfidenceBadge confidence={message.confidence} verified />
                      </div>
                    )}
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs font-semibold mb-2">Sources Used:</p>
                        <div className="space-y-2">
                          {message.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.url}
                              className="flex items-center gap-2 text-xs text-verified hover:underline"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {source.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                  
                  <p className="text-xs text-muted-foreground mt-2 px-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-purple to-primary flex items-center justify-center animate-glow-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <Card className="p-4 glass-effect">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-ai-purple animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-ai-purple animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-ai-purple animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask AI to verify any claim or news story..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} className="bg-gradient-to-r from-ai-purple to-primary">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                🔥 3/5 Chats Remaining Today • <span className="text-primary cursor-pointer hover:underline">Upgrade for Unlimited</span>
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Panel - Desktop Only */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex w-80 border-l border-border flex-col p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-semibold mb-3">Evidence & Sources</h3>
            <p className="text-xs text-muted-foreground">
              All responses are verified against trusted sources and fact-checking databases.
            </p>
          </div>
          
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Current Verification</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sources Checked</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg. Credibility</span>
                <span className="font-semibold text-verified">96.8%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-semibold">2.3s</span>
              </div>
            </div>
          </Card>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Trusted Sources</h4>
            <div className="space-y-2 text-sm">
              {["Reuters", "AP News", "BBC", "The Guardian", "Nature"].map((source) => (
                <div key={source} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-verified" />
                  <span className="text-muted-foreground">{source}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default AIChat;
