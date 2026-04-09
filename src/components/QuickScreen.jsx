import { useNavigate } from "react-router-dom";
import QuickMood from "./QuickMood";

function QuickScreen() {
  const navigate = useNavigate();

  return (
    <QuickMood
      onBack={() => navigate("/")}
      onMoodSelect={(mood) => navigate("/quick/result", { state: { mood } })}
    />
  );
}

export default QuickScreen;
