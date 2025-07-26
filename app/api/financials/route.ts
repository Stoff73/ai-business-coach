import { FinancialAgent } from '@/lib/agents/financial-agent'
import { memoryManager } from '@/lib/memory/memory-manager'

export async function POST(req: Request) {
  try {
    const { companyName, website, ticker } = await req.json()
    const agent = new FinancialAgent()
    const results: any[] = []

    if (website) {
      const data = await agent.fetchFromWebsite(website)
      if (data) results.push(data)
    }

    if (ticker) {
      const data = await agent.fetchFromLSE(ticker)
      if (data) results.push(data)
    }

    if (results.length > 0) {
      await Promise.all(
        results.map((entry) =>
          memoryManager.store({
            type: 'business_data',
            category: 'financials',
            importance: 'high',
            tags: ['financials', companyName],
            content: entry,
          }),
        ),
      )

      await agent.saveToResearch(companyName, 'financials', results)
    }

    return new Response(JSON.stringify({ companyName, results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Financials API error', err)
    return new Response('Error fetching financials', { status: 500 })
  }
}
