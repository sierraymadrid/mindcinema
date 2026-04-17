const TEST_RESULT_STORAGE_KEY = "mindcinema:test-result";

function getCurrentDayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isAnswersObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function loadStoredTestResult() {
  try {
    const rawValue = window.sessionStorage.getItem(TEST_RESULT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);

    if (
      !parsedValue ||
      parsedValue.savedAt !== getCurrentDayKey() ||
      !isAnswersObject(parsedValue.answersByArea)
    ) {
      window.sessionStorage.removeItem(TEST_RESULT_STORAGE_KEY);
      return null;
    }

    return parsedValue.answersByArea;
  } catch {
    return null;
  }
}

export function saveTestResult(answersByArea) {
  if (!isAnswersObject(answersByArea)) {
    return;
  }

  window.sessionStorage.setItem(
    TEST_RESULT_STORAGE_KEY,
    JSON.stringify({
      savedAt: getCurrentDayKey(),
      answersByArea,
    })
  );
}

export function clearStoredTestResult() {
  window.sessionStorage.removeItem(TEST_RESULT_STORAGE_KEY);
}
