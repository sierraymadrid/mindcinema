import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuickMood from "./QuickMood";
import { applySeo } from "../utils/seo";

function QuickScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    applySeo({
      title: "Recomendación rápida — MindCinema",
      description:
        "Elige lo que necesitas ahora y encuentra una película con sentido para hoy.",
    });
  }, []);

  return (
    <QuickMood
      onBack={() => navigate("/")}
      onMoodSelect={(mood) => navigate("/quick/result", { state: { mood } })}
    />
  );
}

export default QuickScreen;
