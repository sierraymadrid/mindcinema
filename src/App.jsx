import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Hero from "./components/Hero";
import QuickMood from "./components/QuickMood";
import Result from "./components/Result";
import Test from "./components/Test";

function HomeFlow() {
  const [screen, setScreen] = useState("hero");
  const [selectedMood, setSelectedMood] = useState("");
  const navigate = useNavigate();

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
      onExploreMoment={() => navigate("/test")}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeFlow />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;
