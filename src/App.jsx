import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./components/About";
import AreaDetail from "./components/AreaDetail";
import Hero from "./components/Hero";
import MovieDetail from "./components/MovieDetail";
import NotFound from "./components/NotFound";
import QuickResultScreen from "./components/QuickResultScreen";
import QuickScreen from "./components/QuickScreen";
import Test from "./components/Test";
import TestResultScreen from "./components/TestResultScreen";
import Layout from "./components/layout/Layout";
import { applySeo } from "./utils/seo";

function HomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    applySeo({ title: "MindCinema — Cine para crecer" });
  }, []);

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
        <Route path="/areas/:slug" element={<AreaDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
