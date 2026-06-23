"use client";

import { useEffect, useMemo, useState } from "react";
import { QuizQuestion, QuizUnit, quizUnits } from "@/data/quizData";
import { AnswerRecord, filterWrongAnswers, getBestScoreKey, getScore, getStoredAnswer } from "@/lib/quizUtils";
import MainMenu from "./MainMenu";
import QuestionCard from "./QuestionCard";
import ResultScreen from "./ResultScreen";
import WrongAnswerList from "./WrongAnswerList";

type Screen = "main" | "quiz" | "result" | "wrongList";

export default function QuizApp() {
  const [screen, setScreen] = useState<Screen>("main");
  const [unit, setUnit] = useState<QuizUnit | undefined>();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const scores = Object.fromEntries(
      quizUnits.map((u) => [u.unitId, Number(window.localStorage.getItem(getBestScoreKey(u.unitId)) ?? 0)])
    );
    setBestScores(scores);
  }, []);

  const wrongAnswers = useMemo(() => filterWrongAnswers(answers), [answers]);
  const activeQuestion = questions[currentIndex];
  const storedAnswer = activeQuestion ? getStoredAnswer(answers, activeQuestion.id) : undefined;

  const startUnit = (nextUnit: QuizUnit, sourceQuestions: QuizQuestion[] = nextUnit.questions) => {
    if (nextUnit.status !== "active") return;
    setUnit(nextUnit);
    setQuestions(sourceQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setScreen(sourceQuestions.length > 0 ? "quiz" : "main");
  };

  const recordAnswer = (index: number) => {
    if (!activeQuestion || storedAnswer) return;
    setAnswers((prev) => [
      ...prev.filter((item) => item.question.id !== activeQuestion.id),
      { question: activeQuestion, selectedIndex: index, isCorrect: index === activeQuestion.answerIndex }
    ]);
  };

  const finish = () => {
    if (!unit) return;
    const score = getScore(answers);
    const key = getBestScoreKey(unit.unitId);
    const best = Math.max(score, Number(window.localStorage.getItem(key) ?? 0));
    window.localStorage.setItem(key, String(best));
    setBestScores((prev) => ({ ...prev, [unit.unitId]: best }));
    setScreen("result");
  };

  const goPrev = () => setCurrentIndex((value) => Math.max(0, value - 1));

  const goNext = () => {
    if (currentIndex + 1 === questions.length) {
      finish();
      return;
    }
    setCurrentIndex((value) => value + 1);
  };

  const retryWrong = () => {
    if (unit && wrongAnswers.length > 0) startUnit(unit, wrongAnswers.map((answer) => answer.question));
  };

  const retryOne = (index: number) => {
    if (unit && wrongAnswers[index]) startUnit(unit, [wrongAnswers[index].question]);
  };

  if (screen === "main") return <MainMenu bestScores={bestScores} onStartUnit={startUnit} />;

  if (screen === "result" && unit) {
    return (
      <ResultScreen
        unit={unit}
        score={getScore(answers)}
        answered={answers.length}
        total={questions.length}
        onRetryWrong={retryWrong}
        onWrongList={() => setScreen("wrongList")}
        onHome={() => setScreen("main")}
      />
    );
  }

  if (screen === "wrongList") {
    return <WrongAnswerList wrongAnswers={wrongAnswers} onPick={retryOne} onHome={() => setScreen("main")} />;
  }

  if (!activeQuestion || !unit) return <MainMenu bestScores={bestScores} onStartUnit={startUnit} />;

  return (
    <QuestionCard
      unit={unit}
      question={activeQuestion}
      current={currentIndex + 1}
      total={questions.length}
      selectedIndex={storedAnswer?.selectedIndex}
      onSelect={recordAnswer}
      onPrev={goPrev}
      onNext={goNext}
      onHome={() => setScreen("main")}
      canPrev={currentIndex > 0}
    />
  );
}
