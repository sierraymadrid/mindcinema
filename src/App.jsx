import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import MovieDetail from "./components/MovieDetail";
import QuickResultScreen from "./components/QuickResultScreen";
import QuickScreen from "./components/QuickScreen";
import Test from "./components/Test";
import TestResultScreen from "./components/TestResultScreen";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Hero
      onQuickStart={() => navigate("/quick")}
      onExploreMoment={() => navigate("/test")}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/quick" element={<QuickScreen />} />
      <Route path="/quick/result" element={<QuickResultScreen />} />
      <Route path="/test" element={<Test />} />
      <Route path="/test/result" element={<TestResultScreen />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
