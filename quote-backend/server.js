import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 3000

app.use(cors())

let quoteCache = []
let currentDay = new Date().toDateString()
let fetching = false
let lastQuote = null

const fallbackQuote = {
  q: "Elämä o laiffii",
  a: "Matti Nykänen"
}
app.get('/quote', async (req, res) => {
  const today = new Date().toDateString()

  if (today !== currentDay) {
    quoteCache = []
    currentDay = today
    lastQuote = null
  }
  if (quoteCache.length >= 2) {
    return res.json({
      message: "Quote limit reached for today",
      quote: quoteCache[quoteCache.length-1]
    })
  }
  if (fetching) {
    return res.json({
      message: "Fetch in progress. Serving last available quote.",
      quote: lastQuote || fallbackQuote
    })
  }
  try {
    fetching = true
    const response = await fetch('https://zenquotes.io/api/random')

    if (!response.ok){
      throw new Error(`ZenQuotes returned ${response.status}`)
    }
    const data = await response.json()
    const quote = data[0]
    
    quoteCache.push(quote)
    res.json(quote)
  } catch(error) {
    console.error('Error fetching quote', error.message)
    quoteCache.push(fallbackQuote)
    lastQuote = fallbackQuote
    res.status(200).json(fallbackQuote)
  } finally {
    fetching = false
  }
})

app.listen(PORT, ()=> {
  console.log(`Server running at http://localhost:${PORT}`)
})