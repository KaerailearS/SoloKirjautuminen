const fs = require('fs');
const path = require('path');

// Log unhandled errors to a file so we can read them even if the window closes -- added multiple lines for error logging during initial setup
const logPath = path.join(__dirname, 'error-log.txt');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

process.on('uncaughtException', err => {
  logStream.write(`UNCAUGHT EXCEPTION: ${err.stack || err}\n`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logStream.write(`UNHANDLED REJECTION: ${err.stack || err}\n`);
  process.exit(1);
});

const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args)
  logStream.write(args.join(' ') + '\n');
};

// require instead of import due to certain limitations when packaging server to autorun with main app
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

// express server, fixed on port 3000
const app = express()
const PORT = 3000

app.use(cors())

// quote cache allows up to 2 quotes, due to ZenQuotes API call daily limitation, reads current day to determine when to pull a new one
let quoteCache = []
let currentDay = new Date().toDateString()

// when fetching is true, doesn't allow for fetching to re-occur
let fetching = false
let lastQuote = null

// fallback quote for when no quote is available in cache or to be fetched
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
// logs server running for clarity (troubleshooting)
app.listen(PORT, ()=> {
  console.log(`Server running at http://localhost:${PORT}`)
})