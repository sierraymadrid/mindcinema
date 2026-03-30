import { useState } from "react";
import Hero from "./components/Hero";
import QuickMood from "./components/QuickMood";

function App() {
  const [screen, setScreen] = useState("hero");

  if (screen === "quickMood") {
    return <QuickMood onBack={() => setScreen("hero")} />;
  }

  return (
    <Hero
      onQuickStart={() => setScreen("quickMood")}
      onExploreMoment={() => alert("Aquí irá el test más adelante")}
    />
  );
}

export default App;