"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Lightbulb, Target, Brain, Clock } from "lucide-react"
import { useMemory } from "@/hooks/use-memory"

const suggestedQuestions = [
  "How can I improve my customer retention rate?",
  "What's the best strategy for scaling my business?",
  "How should I allocate my marketing budget?",
  "What are the key metrics I should focus on?",
]

interface Message {
  role: "assistant" | "user"
  content: string
  timestamp: Date
  memoryId?: string
}

export default function CoachPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => Date.now().toString())

  const { storeMemory, getContext, context, retrieveMemories } = useMemory()

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    // Load conversation context
    await getContext(sessionId)

    // Load recent conversation history
    const recentMessages = retrieveMemories({
      type: "conversation",
      limit: 10,
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
    })

    if (recentMessages.length > 0) {
      const conversationHistory: Message[] = recentMessages.map((memory) => ({
        role: memory.content.role || "assistant",
        content: memory.content.message || memory.content.content || "",
        timestamp: new Date(memory.timestamp),
        memoryId: memory.id,
      }))
      setMessages(conversationHistory)
    } else {
      // Initial greeting with context
      const greeting = await generateContextualGreeting()
      const initialMessage: Message = {
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      }
      setMessages([initialMessage])

      // Store initial greeting
      await storeMemory({
        type: "conversation",
        category: "greeting",
        content: {
          role: "assistant",
          message: greeting,
          sessionId,
        },
        importance: "low",
        tags: ["greeting", "session_start"],
        sessionId,
      })
    }
  }

  const generateContextualGreeting = async (): Promise<string> => {
    if (!context) {
      return "Hello! I'm your AI Business Coach. I'm ready to help you with strategic insights, task management, and growth optimization. What would you like to discuss today?"
    }

    const { businessInfo, recentConversations, keyInsights } = context

    let greeting = "Welcome back! "

    if (businessInfo.companyName) {
      greeting += `I remember we're working on ${businessInfo.companyName}. `
    }

    if (recentConversations.length > 0) {
      const lastTopic = recentConversations[0]?.tags?.[0]
      if (lastTopic) {
        greeting += `Last time we discussed ${lastTopic}. `
      }
    }

    if (keyInsights.length > 0) {
      greeting += "I have some new insights based on our previous conversations. "
    }

    greeting += "How can I help you today?"

    return greeting
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Store user message in memory
    const userMemoryId = await storeMemory({
      type: "conversation",
      category: "user_input",
      content: {
        role: "user",
        message: message,
        sessionId,
      },
      importance: "medium",
      tags: extractTags(message),
      sessionId,
    })

    try {
      // Generate AI response with memory context
      const aiResponse = await generateAIResponse(message, context)

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Store AI response in memory
      await storeMemory({
        type: "conversation",
        category: "ai_response",
        content: {
          role: "assistant",
          message: aiResponse.content,
          sessionId,
          userMessageId: userMemoryId,
          context: aiResponse.context,
        },
        importance: aiResponse.importance,
        tags: aiResponse.tags,
        sessionId,
      })

      // Store any insights generated
      if (aiResponse.insights && aiResponse.insights.length > 0) {
        for (const insight of aiResponse.insights) {
          await storeMemory({
            type: "insight",
            category: insight.category,
            content: insight,
            importance: "high",
            tags: insight.tags,
            sessionId,
          })
        }
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userInput: string, memoryContext: any) => {
    // This would integrate with your AI service (OpenAI, etc.)
    // For now, we'll simulate an intelligent response based on memory context

    const contextualInfo = memoryContext
      ? {
          businessInfo: memoryContext.businessInfo,
          recentTopics: memoryContext.recentConversations.slice(0, 5).flatMap((c: any) => c.tags),
          keyInsights: memoryContext.keyInsights.slice(0, 3),
          patterns: memoryContext.patterns,
        }
      : {}

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate contextual response
    let response = ""
    const tags: string[] = []
    const insights: any[] = []
    let importance: "low" | "medium" | "high" | "critical" = "medium"

    if (userInput.toLowerCase().includes("revenue") || userInput.toLowerCase().includes("sales")) {
      response = `Based on our previous discussions about ${contextualInfo.businessInfo?.companyName || "your business"}, I can see revenue growth is a key focus. `

      if (contextualInfo.patterns?.taskPatterns?.commonCategories?.includes("revenue")) {
        response += "I notice you've been consistently working on revenue-related tasks. "
      }

      response +=
        "Here are my recommendations:\n\n1. **Optimize Customer Acquisition**: Focus on channels with the highest ROI\n2. **Improve Retention**: Implement customer success programs\n3. **Pricing Strategy**: Consider value-based pricing models\n\nWould you like me to dive deeper into any of these areas?"

      tags.push("revenue", "growth", "strategy")
      importance = "high"

      insights.push({
        category: "revenue_optimization",
        title: "Revenue Growth Strategy",
        content: "User is actively seeking revenue growth strategies",
        recommendations: ["Focus on high-ROI channels", "Implement retention programs", "Review pricing strategy"],
        tags: ["revenue", "growth", "optimization"],
      })
    } else if (userInput.toLowerCase().includes("customer") || userInput.toLowerCase().includes("retention")) {
      response = "Customer retention is crucial for sustainable growth. "

      if (contextualInfo.keyInsights?.some((i: any) => i.content.includes("customer"))) {
        response += "I recall we've discussed customer-related challenges before. "
      }

      response +=
        "Here's what I recommend:\n\n1. **Analyze Churn Patterns**: Identify when and why customers leave\n2. **Implement Feedback Loops**: Regular customer satisfaction surveys\n3. **Personalize Experience**: Use data to tailor customer interactions\n4. **Proactive Support**: Reach out before issues become problems\n\nWhat's your current customer retention rate?"

      tags.push("customer", "retention", "churn", "satisfaction")
      importance = "high"
    } else {
      response = `I understand you're asking about "${userInput}". `

      if (contextualInfo.recentTopics?.length > 0) {
        response += `Given our recent discussions about ${contextualInfo.recentTopics.slice(0, 2).join(" and ")}, `
      }

      response +=
        "let me provide you with some strategic insights and actionable recommendations. Based on the patterns I'm seeing in your business, here are my thoughts...\n\nWould you like me to elaborate on any specific aspect?"

      tags.push(...extractTags(userInput))
    }

    return {
      content: response,
      tags,
      insights,
      importance,
      context: contextualInfo,
    }
  }

  const extractTags = (text: string): string[] => {
    const keywords = [
      "revenue",
      "sales",
      "customer",
      "retention",
      "growth",
      "marketing",
      "strategy",
      "analytics",
      "conversion",
      "pricing",
      "competition",
      "team",
      "hiring",
      "productivity",
      "efficiency",
      "automation",
      "funding",
      "investment",
      "cash flow",
      "profit",
      "margin",
    ]

    const lowerText = text.toLowerCase()
    return keywords.filter((keyword) => lowerText.includes(keyword))
  }

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Business Coach</h1>
          <p className="text-gray-600">Get personalized strategic insights with persistent memory</p>
          {context && (
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>Memory Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{context.recentConversations.length} recent conversations</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Business Coach AI</CardTitle>
                    <p className="text-sm text-gray-500">
                      {context ? "Memory-enhanced coaching" : "Loading context..."}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
                        >
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`p-3 rounded-lg ${
                          msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me about your business strategy, metrics, or tasks..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>Suggested Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 text-xs"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Memory Context */}
            {context && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span>Memory Context</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {context.businessInfo.companyName && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-medium text-blue-800">Company</p>
                      <p className="text-xs text-blue-600">{context.businessInfo.companyName}</p>
                    </div>
                  )}

                  {context.patterns.commonTopics && context.patterns.commonTopics.length > 0 && (
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-xs font-medium text-green-800">Recent Topics</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {context.patterns.commonTopics.slice(0, 3).map((topic: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {context.keyInsights.length > 0 && (
                    <div className="p-2 bg-orange-50 rounded border border-orange-200">
                      <p className="text-xs font-medium text-orange-800">Key Insights</p>
                      <p className="text-xs text-orange-600">{context.keyInsights.length} insights available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Coach Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span>Coach Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Memory System</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Learning Mode</span>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    Continuous
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Context Aware</span>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    Enhanced
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
