import { QuizQuestion, QuizUnit, QuestionSection } from "@/data/quizData";

export type AnswerRecord = { question: QuizQuestion; selectedIndex: number; isCorrect: boolean };

export const SECTION_LABELS: Record<QuestionSection, string> = {
  match_definitions: "영영정의",
  fill_blanks: "빈칸 완성",
  unscramble: "문장 배열"
};

export const SECTION_COUNT_LABELS: Record<QuestionSection, string> = {
  match_definitions: "영영정의 8문항",
  fill_blanks: "빈칸 6문항",
  unscramble: "문장 배열 6문항"
};

export const getScore = (answers: AnswerRecord[]) => answers.filter((answer) => answer.isCorrect).length;
export const getAccuracy = (correct: number, total: number) => total === 0 ? 0 : Math.round((correct / total) * 100);
export const getBestScoreKey = (unitId: string) => `andy-weekly-best-${unitId}`;
export const filterWrongAnswers = (answers: AnswerRecord[]) => answers.filter((answer) => !answer.isCorrect);
export const getStoredAnswer = (answers: AnswerRecord[], questionId: string) => answers.find((answer) => answer.question.id === questionId);
export const getActiveUnits = (units: QuizUnit[]) => units.filter((unit) => unit.status === "active");

export const getSectionCounts = (unit: QuizUnit) => {
  return unit.questions.reduce<Record<QuestionSection, number>>(
    (acc, question) => {
      acc[question.section] += 1;
      return acc;
    },
    { match_definitions: 0, fill_blanks: 0, unscramble: 0 }
  );
};

export const getSolvingGuide = (type: string) => {
  const guides: Record<string, string> = {
    "영영정의형": "힌트를 보기 전에 영영정의의 핵심어 2~3개를 먼저 찾고 단어와 연결하세요.",
    "빈칸완성형": "보기 단어의 형태를 그대로 확인하세요. 특히 복수형 s와 문장 흐름을 확인합니다.",
    "문장배열형": "주어, 동사, 목적어, 문장부호 순서로 확인하세요. 의문문은 What/Is/Do/Can이 앞에 옵니다."
  };
  return guides[type] ?? "문제 유형을 확인하고 핵심 단서를 찾으세요.";
};
