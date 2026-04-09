import { useNavigate } from "react-router-dom";
import TestAreaScreen from "./TestAreaScreen";

function Test() {
  const navigate = useNavigate();

  return (
    <TestAreaScreen
      onComplete={(answersByArea) =>
        navigate("/test/result", { state: { answersByArea } })
      }
    />
  );
}

export default Test;
