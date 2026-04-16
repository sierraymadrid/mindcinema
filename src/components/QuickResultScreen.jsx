import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { recommendationsByMood } from "../data/recommendations";
import { applySeo } from "../utils/seo";
import Result from "./Result";

function QuickResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const mood = location.state?.mood;

  useEffect(() => {
    applySeo({ title: "Tu recomendación — MindCinema" });
  }, []);

  if (!mood || !recommendationsByMood[mood]) {
    return <Navigate to="/quick" replace />;
  }

  return (
    <Result
      mood={mood}
      onBack={() => navigate("/quick")}
    />
  );
}

export default QuickResultScreen;
