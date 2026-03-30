import { useState } from "react";
import Hero from "./components/Hero";
import QuickMood from "./components/QuickMood";
import Result from "./components/Result";

function App() {
  const [screen, setScreen] = useState("hero");
  const [selectedMood, setSelectedMood] = useState("");

  if (screen === "result") {
    return (
      <Result
        mood={selectedMood}
        onBack={() => setScreen("quickMood")}
      />
    );
  }

  if (screen === "quickMood") {
    return (
      <QuickMood
        onBack={() => setScreen("hero")}
        onMoodSelect={(mood) => {
          setSelectedMood(mood);
          setScreen("result");
        }}
      />
    );
  }

  return (
    <Hero
      onQuickStart={() => setScreen("quickMood")}
      onExploreMoment={() => alert("Aquí irá el test más adelante")}
    />
  );
}

export default App;
