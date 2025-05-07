import React from "react"
import styles from './styles/App.module.css'
import Clock from "./components/Clock"
import QuoteDisplay from "./components/QuoteDisplay"
import WorkerList from "./components/WorkerList"

export default function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <QuoteDisplay />
        <Clock />
        <h1>G'mornin'!</h1>
      </header>
      <main className={styles.main}>
        <WorkerList />
      </main>
      <footer>
      </footer>
    </div>
  );
}
