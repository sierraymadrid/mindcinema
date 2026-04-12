import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./components/About";
import AreaDetail from "./components/AreaDetail";
import Hero from "./components/Hero";
import MovieDetail from "./components/MovieDetail";
import QuickResultScreen from "./components/QuickResultScreen";
import QuickScreen from "./components/QuickScreen";
import Test from "./components/Test";
import TestResultScreen from "./components/TestResultScreen";
import Layout from "./components/layout/Layout";

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
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/quick" element={<QuickScreen />} />
        <Route path="/quick/result" element={<QuickResultScreen />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test/result" element={<TestResultScreen />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/areas/:key" element={<AreaDetail />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
