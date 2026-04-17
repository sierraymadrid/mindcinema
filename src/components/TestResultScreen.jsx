import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { applySeo } from "../utils/seo";
import { loadStoredTestResult } from "../utils/testResultStorage";
import DeepResult from "./DeepResult";

function TestResultScreen() {
  const location = useLocation();
  const answersByArea = location.state?.answersByArea || loadStoredTestResult();

  useEffect(() => {
    applySeo({ title: "Tu momento actual — MindCinema" });
  }, []);

  if (!answersByArea || typeof answersByArea !== "object") {
    return <Navigate to="/test" replace />;
  }

  return <DeepResult answersByArea={answersByArea} />;
}

export default TestResultScreen;
