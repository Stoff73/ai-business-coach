import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()

    // Build system prompt with memory context
    let systemPrompt = `You are an expert AI Business Coach with deep knowledge of business strategy, operations, marketing, finance, and growth optimization. 

Your role is to:
1. Analyze business data and provide strategic insights
2. Offer actionable recommendations based on current business metrics
3. Help with task prioritization and productivity optimization
4. Provide guidance on business growth and scaling strategies
5. Assist with problem-solving and decision-making

Current business context:
- Monthly Revenue: $124,500 (+12.5% growth)
- Active Customers: 2,847 (+8.2% growth)  
- Conversion Rate: 3.24% (-0.8% decline)
- Growth Rate: 18.7% (+2.1% improvement)

Key challenges identified:
- Conversion rate declining (checkout friction suspected)
- Need for customer acquisition optimization
- Market expansion opportunities available`

    // Add memory context if available
    if (context) {
      if (context.businessInfo?.companyName) {
        systemPrompt += `\n\nCompany: ${context.businessInfo.companyName}`
      }

      if (context.recentConversations?.length > 0) {
        systemPrompt += `\n\nRecent conversation topics: ${context.recentConversations
          .slice(0, 3)
          .map((c: any) => c.tags?.join(", "))
          .filter(Boolean)
          .join("; ")}`
      }

      if (context.keyInsights?.length > 0) {
        systemPrompt += `\n\nKey insights from previous sessions: ${context.keyInsights
          .slice(0, 2)
          .map((i: any) => i.content?.title || "Business insight")
          .join("; ")}`
      }

      if (context.patterns?.commonTopics?.length > 0) {
        systemPrompt += `\n\nUser frequently discusses: ${context.patterns.commonTopics.slice(0, 3).join(", ")}`
      }
    }

    systemPrompt += `\n\nAlways provide specific, actionable advice with clear next steps. Be concise but comprehensive. Use data-driven insights when possible.`

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
