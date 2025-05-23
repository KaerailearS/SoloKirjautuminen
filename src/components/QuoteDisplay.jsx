import React from "react";
import styles from '../styles/QuoteDisplay.module.css'
import finnish from "../languages/finnish";
import english from "../languages/english";


// pulls an inspirational quote from locally hosted quote server, which is fetching from ZenQuotes.io api. Has a few fallback systems in place for errors and inability to fetch. Only allows 2 cached quotes, since ZenQuotes has a strict limit on API calls per day. Updates the quote once per day, or when reloaded/refreshed etc.
export default function QuoteDisplay({ texts}) {
  const [quote, setQuote] = React.useState("Blerp");

  React.useEffect(() => {
    fetch("http://localhost:3000/quote")
      .then((res) => res.json())
      .then((data) => {
        const actualQuote = Array.isArray(data) ? data[0] : data.quote || data;
        if (!actualQuote.q || !actualQuote.a) {
          throw new Error("Invalid quote format");
        }
        setQuote(actualQuote);
      })
      .catch((err) => {
        console.error("Failed to load quote", err);
        setQuote({
          q: "Y'all might wanna start the backend quote server as well.",
          a: " Sun Tzu"
        });
      });
  }, []);
  return (
    <div className={styles.quoteSection}>
      <p className={styles.quoteText}>"{quote.q}"</p>
      <p className={styles.quoteAuthor}>– {quote.a}</p>
      </div>
      )
}
