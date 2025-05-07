const fs = require('fs');
const path = require('path');

// Log unhandled errors to a file so we can read them even if the window closes
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


const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

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