import React from "react";
import styles from "./styles/App.module.css";
import finnish from "./languages/finnish";
import english from "./languages/english";
import finnishFlag from "./assets/images/finnishflag_2.png"
import englishFlag from "./assets/images/englishflag_2.png"
import Clock from "./components/Clock";
import QuoteDisplay from "./components/QuoteDisplay";
import WorkerList from "./components/WorkerList";

export default function App() {
  const [language, setLanguage] = React.useState("english");
  const [texts, setTexts] = React.useState(english);
  // language selection, starts in english by default, clicking the finnish flag changes to finnish and vice versa
  React.useEffect(() => {
    if (language === "finnish") {
      setTexts(finnish);
    } else {
      setTexts(english);
    }
  }, [language]);

  // renders; language buttons, inspirational quote, the clock, and then the main worker punchcard section
  return (
    <div className={styles.container}>
      <div className={styles.languageButtonContainer}>
        <button className={styles.englishButton} onClick={() => setLanguage("english")}><img src={englishFlag} /></button>
        <button className={styles.finnishButton} onClick={() => setLanguage("finnish")}><img src={finnishFlag}/></button>
      </div>
      <header className={styles.header}>
        <QuoteDisplay texts={texts} />
        <Clock texts={texts} />
        <h1>{texts.morningText}</h1>
      </header>
      <main className={styles.main}>
        <WorkerList texts={texts} />
      </main>
    </div>
  );
}
