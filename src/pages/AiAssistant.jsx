import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Loader2, MessageSquare } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Hello! I am your AeroFlow AI Assistant. I can help you analyze simulation data, explain bottlenecks, and provide optimization recommendations. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your Vercel Environment Variables.");
      }

      // Initialize the SDK
      const ai = new GoogleGenAI({ apiKey });
      
      // We pass the history if we want to use the Chat API
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are a helpful expert assistant for an Airport Operations Dashboard called AeroFlow. You specialize in agent-based modeling and passenger flow optimization.",
        }
      });
      
      // Add existing history to the chat session
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      // The SDK's chat object doesn't easily let you seed history after creation unless passed in constructor,
      // but we can just use the generateContent API with the full conversation history.
      
      const requestContents = history.concat({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: requestContents,
        config: {
          systemInstruction: "You are a helpful expert assistant for an Airport Operations Dashboard called AeroFlow. You specialize in agent-based modeling and passenger flow optimization.",
        }
      });
      
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
      
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: `**Error:** ${error.message || "Failed to communicate with the AI model."}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Bot className="w-10 h-10 text-primary" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground">Your intelligent co-pilot for airport operations and analysis</p>
        </div>

        <Card className="flex-1 flex flex-col border border-border bg-card rounded-md shadow-sm min-h-[500px]">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                </div>
                
                <div className={`px-5 py-4 max-w-[80%] prose prose-sm md:prose-base rounded-md ${
                  message.role === 'user'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-background border border-border text-foreground'
                }`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="px-5 py-4 rounded-md bg-background border border-border flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="p-4 bg-muted/50 border-t border-border">
            <form onSubmit={handleSend} className="flex w-full gap-3">
              <Input 
                placeholder="Ask me to analyze throughput, explain a bottleneck, or run a scenario..." 
                className="flex-1 bg-background border-border focus-visible:ring-primary text-base py-6 rounded-md shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-auto shadow-sm"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
