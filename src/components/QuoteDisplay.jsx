import React from "react";

export default function QuoteDisplay() {
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
    <div className="quote-section">
      <p className='quote-text'>"{quote.q}"</p>
      <p className='quote-author'>– {quote.a}</p>
      </div>
      )
}
