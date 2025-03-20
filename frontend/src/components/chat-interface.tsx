"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
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
  Sparkles,
  ArrowRight,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ImplementedFeatures from "@/components/implemented-features"
import UpcomingFeatures from "@/components/upcoming-features"
import RagDiagram from "@/components/rag-diagram"

export default function ChatInterface() {
  const [llmProvider, setLlmProvider] = useState("Meta")
  const [model, setModel] = useState("llama-3.3")
  const [temperature, setTemperature] = useState(0.5)
  const [maxTokens, setMaxTokens] = useState(4000)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      llmProvider,
      model,
      temperature,
      maxTokens,
    },
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 mb-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            < img src="/logo.png" className="h-10 w-10 animate-float" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kubeflow RAG Chatbot Demo
              </h1>
              <p className="text-muted-foreground">Empowering Kubeflow Documentation with LLMs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden md:flex items-center space-x-2"
              onClick={() => window.open("https://kacem-mathlouthi.tn", "_blank")}
            >
                <ArrowRight className="h-4 w-4" />
                <span>Return to my Portfolio</span>
            </Button>

            <Button
              variant="outline"
              className="hidden md:flex items-center space-x-2"
              onClick={() => window.open("https://github.com/kubeflow/kubeflow", "_blank")}
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Button>

            <Button
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => window.open("https://www.kubeflow.org/docs/", "_blank")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="how-it-works" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>How It Works</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
              <Card className="flex-1 p-6 overflow-hidden flex flex-col shadow-lg border-2 border-border/50 bg-card/50 backdrop-blur-sm hexagon-bg">
                <div className="flex-1 overflow-y-auto mb-4 space-y-6 min-h-[500px] pr-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground animate-fade-in">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 animate-pulse-slow">
                        <Sparkles className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Welcome to Kubeflow Assistant</h3>
                      <p className="mb-8 max-w-md">
                        Ask questions about Kubeflow documentation, issues, or general information.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
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
                            className="justify-start text-left h-auto py-3 group transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                            onClick={() => {
                              handleInputChange({ target: { value: suggestion.text } } as any)
                              handleSubmit({ preventDefault: () => {} } as any)
                            }}
                          >
                            <div className="mr-3 h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
                              {suggestion.icon}
                            </div>
                            <span>{suggestion.text}</span>
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
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <img src="/logo.png" className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="typing-indicator mt-3">
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

                <form onSubmit={handleSubmit} className="relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Kubeflow..."
                    className="pr-12 py-6 bg-background/80 backdrop-blur-sm border-2 shadow-lg"
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
                    <p className="text-sm text-muted-foreground">
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

        {/* Settings Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="settings">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="implemented" className="flex items-center space-x-2">
                <FileCode className="h-4 w-4" />
                <span className="hidden sm:inline">Implemented</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Upcoming</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <Card className="p-6 shadow-lg border-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    LLM Configuration
                  </span>
                </h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="provider" className="text-sm font-medium">
                      LLM Developer
                    </Label>
                    <Select value={llmProvider} onValueChange={setLlmProvider}>
                      <SelectTrigger id="provider" className="bg-background/80 backdrop-blur-sm">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meta">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                            Meta
                          </div>
                        </SelectItem>
                        <SelectItem value="Google">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                            Google
                          </div>
                        </SelectItem>
                        <SelectItem value="Mistral">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                            Mistral
                          </div>
                        </SelectItem>
                        <SelectItem value="Alibaba">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                            Alibaba Cloud
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="model" className="text-sm font-medium">
                      Model
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model" className="bg-background/80 backdrop-blur-sm">
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

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature" className="text-sm font-medium">
                        Temperature
                      </Label>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values produce more consistent outputs, higher values more creative ones.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="max-tokens" className="text-sm font-medium">
                        Max Tokens
                      </Label>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{maxTokens}</span>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={1000}
                      max={8000}
                      step={1000}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of tokens to generate in the response.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="implemented">
              <ImplementedFeatures />
            </TabsContent>

            <TabsContent value="upcoming">
              <UpcomingFeatures />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

