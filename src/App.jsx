import React from "react"
import Clock from "./components/Clock"
import QuoteDisplay from "./components/QuoteDisplay"
import WorkerList from "./components/WorkerList"

export default function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="app-container">
      <header>
        <QuoteDisplay />
        <Clock />
        <h1>G'mornin'!</h1>
      </header>
      <main>
        <WorkerList />
      </main>
      <footer>
      </footer>
    </div>
  );
}
