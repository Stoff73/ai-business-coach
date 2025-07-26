export interface FinancialData {
  source: string
  data: Record<string, any>
}

export class FinancialAgent {
  async fetchFromWebsite(url: string): Promise<FinancialData | null> {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status}`)
        return null
      }
      const html = await res.text()
      const cheerio = await import('cheerio')
      const $ = cheerio.load(html)

      // Simple heuristic to find tables with financial data
      const tables = $('table')
      const data: Record<string, any> = {}
      tables.each((_, table) => {
        const headers: string[] = []
        $(table)
          .find('tr')
          .each((i, row) => {
            const cells = $(row).find('th, td')
            if (i === 0) {
              cells.each((_, cell) => headers.push($(cell).text().trim()))
            } else {
              const rowData: Record<string, string> = {}
              cells.each((j, cell) => {
                const header = headers[j] || `col${j}`
                rowData[header] = $(cell).text().trim()
              })
              if (Object.values(rowData).some((v) => v)) {
                data[`row${i}`] = rowData
              }
            }
          })
      })

      if (Object.keys(data).length === 0) return null
      return { source: url, data }
    } catch (err) {
      console.error('Website fetch error', err)
      return null
    }
  }

  async fetchFromLSE(ticker: string): Promise<FinancialData | null> {
    try {
      const endpoint = `https://www.londonstockexchange.com/stock/${ticker}/company-summary`
      const res = await fetch(endpoint)
      if (!res.ok) {
        console.error(`Failed to fetch LSE data: ${res.status}`)
        return null
      }
      const html = await res.text()
      const cheerio = await import('cheerio')
      const $ = cheerio.load(html)
      const data: Record<string, any> = {}

      $('table').each((_, table) => {
        const headers: string[] = []
        $(table)
          .find('tr')
          .each((i, row) => {
            const cells = $(row).find('th, td')
            if (i === 0) {
              cells.each((_, cell) => headers.push($(cell).text().trim()))
            } else {
              const rowData: Record<string, string> = {}
              cells.each((j, cell) => {
                const header = headers[j] || `col${j}`
                rowData[header] = $(cell).text().trim()
              })
              if (Object.values(rowData).some((v) => v)) {
                data[`row${i}`] = rowData
              }
            }
          })
      })

      if (Object.keys(data).length === 0) return null
      return { source: endpoint, data }
    } catch (err) {
      console.error('LSE fetch error', err)
      return null
    }
  }

  async saveToResearch(
    companyName: string,
    category: string,
    data: any,
  ): Promise<void> {
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const dir = path.join(process.cwd(), 'research', this.sanitize(companyName))
      await fs.mkdir(dir, { recursive: true })
      const file = path.join(dir, `${category}.json`)
      await fs.writeFile(file, JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Research file save error', err)
    }
  }

  private sanitize(name: string): string {
    return name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  }
}
