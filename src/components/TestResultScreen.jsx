import { Navigate, useLocation } from "react-router-dom";
import DeepResult from "./DeepResult";

function TestResultScreen() {
  const location = useLocation();
  const answersByArea = location.state?.answersByArea;

  if (!answersByArea || typeof answersByArea !== "object") {
    return <Navigate to="/test" replace />;
  }

  return <DeepResult answersByArea={answersByArea} />;
}

export default TestResultScreen;
