import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { applySeo } from "../utils/seo";
import DeepResult from "./DeepResult";

function TestResultScreen() {
  const location = useLocation();
  const answersByArea = location.state?.answersByArea;

  useEffect(() => {
    applySeo({ title: "Tu momento actual — MindCinema" });
  }, []);

  if (!answersByArea || typeof answersByArea !== "object") {
    return <Navigate to="/test" replace />;
  }

  return <DeepResult answersByArea={answersByArea} />;
}

export default TestResultScreen;
