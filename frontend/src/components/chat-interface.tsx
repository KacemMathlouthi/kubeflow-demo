"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Send,
  Settings,
  MessageSquare,
  BookOpen,
  Github,
  FileCode,
  BarChart,
  Zap,
  Database,
  Cpu,
  ArrowRight,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ImplementedFeatures from "@/components/implemented-features"
import UpcomingFeatures from "@/components/upcoming-features"
import RagDiagram from "@/components/rag-diagram"
import Footer from "./footer"

// Define Message type to replace useChat's Message type
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export default function ChatInterface() {
  const [llmProvider, setLlmProvider] = useState("Meta")
  const [model, setModel] = useState("llama-3.3")
  const [temperature, setTemperature] = useState(0.5)
  const [maxTokens, setMaxTokens] = useState(4000)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Replace useChat with WebSocket logic
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    const wsUrl = "ws://localhost:8000/ws/chat";
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        content: data.content, 
        role: 'assistant' 
      }]);
      setIsLoading(false);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    // Add user message to the UI
    setMessages((prev) => [...prev, { 
      id: Date.now().toString(), 
      content: input, 
      role: 'user' 
    }]);
    
    // Set loading state
    setIsLoading(true);
    
    // Send message with config via WebSocket
    socket.send(JSON.stringify({
      message: input,
      config: {
        llmProvider,
        model,
        temperature,
        maxTokens,
      }
    }));
    
    // Clear input field
    setInput('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <header className="py-4 mb-4 border-b flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/logo.png" className="h-8 w-8 animate-float" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kubeflow RAG Chatbot Demo
              </h1>
              <p className="text-sm text-muted-foreground">Empowering Kubeflow Documentation with LLMs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center space-x-2"
              onClick={() => window.open("https://kacem-mathlouthi.tn", "_blank")}
            >
              <ArrowRight className="h-4 w-4" />
              <span>Portfolio</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center space-x-2"
              onClick={() => window.open("https://github.com/KacemMathlouthi/kubeflow-demo", "_blank")}
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Button>

            <Button
              size="sm"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => window.open("https://www.kubeflow.org/docs/", "_blank")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Kubeflow Docs</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col min-h-0">
            <TabsList className="grid grid-cols-2 mb-2 flex-shrink-0">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="how-it-works" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>How It Works</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-0">
              <Card className="flex-1 p-6 overflow-hidden flex flex-col shadow-lg border border-border/30 bg-card/50 backdrop-blur-sm hexagon-bg">
                <div className="flex-1 overflow-y-auto mb-4 space-y-6 min-h-[500px] pr-2 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground animate-fade-in">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-full blur-xl"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse-slow"></div>
                        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                          <img src = "/logo.png" className="h-10 w-10 text-indigo-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Welcome to Kubeflow Assistant</h3>
                      <p className="mb-8 max-w-md">
                        Ask questions about Kubeflow documentation, issues, or general information.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                        {[
                          {
                            icon: <Search className="h-4 w-4" />,
                            text: "What is Kubeflow?",
                          },
                          {
                            icon: <ArrowRight className="h-4 w-4" />,
                            text: "How do I install Kubeflow?",
                          },
                          {
                            icon: <Github className="h-4 w-4" />,
                            text: "Show me common issues",
                          },
                          {
                            icon: <Cpu className="h-4 w-4" />,
                            text: "Explain Kubeflow Trainer",
                          },
                        ].map((suggestion) => (
                          <Button
                            key={suggestion.text}
                            variant="outline"
                            className="justify-start text-left h-auto py-2 group transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                            onClick={() => {
                              setInput(suggestion.text);
                              if (socket && socket.readyState === WebSocket.OPEN) {
                                setMessages((prev) => [...prev, { 
                                  id: Date.now().toString(), 
                                  content: suggestion.text, 
                                  role: 'user' 
                                }]);
                                setIsLoading(true);
                                socket.send(JSON.stringify({
                                  message: suggestion.text,
                                  config: {
                                    llmProvider,
                                    model,
                                    temperature,
                                    maxTokens,
                                  }
                                }));
                                setInput('');
                              }
                            }}
                          >
                            <div className="mr-2 h-6 w-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
                              {suggestion.icon}
                            </div>
                            <span className="text-sm">{suggestion.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <div
                          key={message.id}
                          className="animate-slide-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <ChatMessage message={message} />
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start space-x-4 animate-fade-in">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <img src="/logo.png" className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="typing-indicator mt-2">
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="relative flex-shrink-0">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Kubeflow..."
                    className="pr-12 py-5 bg-background/80 backdrop-blur-sm border-2 shadow-lg"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="how-it-works" className="flex-1">
              <Card className="p-6 shadow-lg border-2 border-border/50 bg-card/50 backdrop-blur-sm hexagon-bg">
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  How RAG Works in Kubeflow Assistant
                </h3>
                <p className="mb-6 text-muted-foreground">
                  This chatbot uses Retrieval-Augmented Generation (RAG) to provide accurate and contextual responses
                  about Kubeflow.
                </p>

                <RagDiagram />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Database className="h-4 w-4 mr-2 text-blue-500" />
                      Vector Database
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Kubeflow documentation, GitHub issues, and community resources are embedded and stored in a vector
                      database for semantic search.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Search className="h-4 w-4 mr-2 text-purple-500" />
                      Semantic Search
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      When you ask a question, the system finds the most relevant documents using vector similarity
                      search.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-green-500" />
                      LLM Generation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The retrieved documents are used as context for the LLM to generate accurate, contextual responses.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                      Continuous Improvement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The system continuously improves by tracking performance metrics and expanding its knowledge base.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col min-h-0">
          <Tabs defaultValue="settings" className="flex flex-col min-h-0">
            <TabsList className="grid grid-cols-3 mb-2 flex-shrink-0">
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="implemented" className="flex items-center space-x-2">
                <FileCode className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Implemented</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Upcoming</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="flex-1 overflow-hidden data-[state=active]:flex flex-col">
              <Card className="p-4 shadow-lg border-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-y-auto h-full">
                <h3 className="text-md font-bold mb-3 flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    LLM Configuration
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-xs font-medium">
                      LLM Developer
                    </Label>
                    <Select value={llmProvider} onValueChange={setLlmProvider}>
                      <SelectTrigger id="provider" className="bg-background/80 backdrop-blur-sm text-sm h-8">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meta">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            Meta
                          </div>
                        </SelectItem>
                        <SelectItem value="Google">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            Google
                          </div>
                        </SelectItem>
                        <SelectItem value="Mistral">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                            Mistral
                          </div>
                        </SelectItem>
                        <SelectItem value="Alibaba">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            Alibaba Cloud
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-xs font-medium">
                      Model
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model" className="bg-background/80 backdrop-blur-sm text-sm h-8">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {llmProvider === "Meta" && (
                          <>
                            <SelectItem value="llama-3.3">llama-3.3-70b-versatile</SelectItem>
                            <SelectItem value="llama-3.1">llama-3.1-8b-instant</SelectItem>
                          </>
                        )}
                        {llmProvider === "Google" && (
                          <>
                            <SelectItem value="gemma2-9b">gemma2-9b-it</SelectItem>
                          </>
                        )}
                        {llmProvider === "Mistral" && (
                          <>
                            <SelectItem value="mixtral-8x7b">mixtral-8x7b-32768</SelectItem>
                          </>
                        )}
                        {llmProvider === "Alibaba" && (
                          <>
                            <SelectItem value="qwen-2.5">qwen-2.5-32b</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature" className="text-xs font-medium">
                        Temperature
                      </Label>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="py-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values produce more consistent outputs, higher values more creative ones.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="max-tokens" className="text-xs font-medium">
                        Max Tokens
                      </Label>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{maxTokens}</span>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={1000}
                      max={8000}
                      step={1000}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="py-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of tokens to generate in the response.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="implemented" className="flex-1 overflow-hidden data-[state=active]:flex">
              <div className="overflow-y-auto h-full">
                <ImplementedFeatures />
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="flex-1 overflow-hidden data-[state=active]:flex">
              <div className="overflow-y-auto h-full">
                <UpcomingFeatures />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>      
      <Footer />
    </div>
  )
}