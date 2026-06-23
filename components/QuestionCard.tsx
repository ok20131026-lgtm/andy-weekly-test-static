"use client";

import { useEffect, useState } from "react";
import { QuizQuestion, QuizUnit } from "@/data/quizData";
import { SECTION_LABELS } from "@/lib/quizUtils";

type Props = {
  unit: QuizUnit;
  question: QuizQuestion;
  current: number;
  total: number;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onHome: () => void;
  canPrev: boolean;
};

const SECTION_STYLE = {
  match_definitions: "bg-orange-100 text-orange-700",
  fill_blanks: "bg-sky-100 text-sky-700",
  unscramble: "bg-violet-100 text-violet-700"
};

export default function QuestionCard({ unit, question, current, total, selectedIndex, onSelect, onPrev, onNext, onHome, canPrev }: Props) {
  const answered = selectedIndex !== undefined;
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => { setHintOpen(false); }, [question.id]);

  const isDefinition = question.section === "match_definitions";
  const sectionClass = SECTION_STYLE[question.section];

  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-orange-600">
            <span>🚀</span><span>Andy Weekly Test Maker</span>
          </div>
          <button onClick={onHome} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-black text-slate-700">홈</button>
        </div>

        <div className="mt-5 rounded-2xl bg-orange-50 p-3 text-sm font-black text-orange-700">{unit.unitTitle}</div>

        <div className="mt-4 flex items-center justify-between text-sm font-black text-slate-500">
          <span>{SECTION_LABELS[question.section]}</span><span>{current} / {total}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-sky-400" style={{ width: `${(current / total) * 100}%` }} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${sectionClass}`}>{question.questionType}</span>
          {question.weakFocusTag && <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-600">{question.weakFocusTag}</span>}
        </div>

        <p className="mt-4 text-base font-black text-slate-600">{question.promptTitle}</p>

        {isDefinition ? (
          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-lg font-black leading-relaxed text-slate-900">
            {question.displayDefinition}
          </div>
        ) : question.section === "fill_blanks" ? (
          <div className="mt-3 rounded-3xl border border-sky-100 bg-sky-50 p-4">
            <div className="mb-4 rounded-[1.5rem] border border-sky-200 bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-black text-sky-700">그림 단서</p>
              {question.imagePath ? (
                <img
                  src={question.imagePath}
                  alt={question.imageAlt ?? question.visualClueAlt ?? "빈칸완성 그림 단서"}
                  className="mx-auto mt-3 max-h-48 w-full rounded-2xl object-contain"
                />
              ) : (
                <div
                  role="img"
                  aria-label={question.visualClueAlt ?? "빈칸완성 그림 단서"}
                  className="mt-3 text-7xl leading-none"
                >
                  {question.visualClueEmoji ?? "🖼️"}
                </div>
              )}
            </div>
            <p className="text-2xl font-black leading-snug text-slate-900">{question.question}</p>
            {question.wordBank && <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500">보기: {question.wordBank.join(" · ")}</p>}
          </div>
        ) : (
          <div className="mt-3 rounded-3xl border border-violet-100 bg-violet-50 p-4">
            <p className="mb-3 text-sm font-black text-violet-700">아래 단어를 보고 바르게 배열된 문장을 고르세요.</p>
            <div className="flex flex-wrap gap-2">
              {question.givenWords?.map((word, index) => (
                <span key={`${word}-${index}`} className="rounded-2xl bg-white px-3 py-2 text-lg font-black text-slate-800 shadow-sm ring-1 ring-slate-100">{word}</span>
              ))}
            </div>
          </div>
        )}

        {isDefinition && question.hintKo && (
          <div className="mt-4">
            <button type="button" onClick={() => setHintOpen((value) => !value)} className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-base font-black text-amber-800 shadow-sm">
              {hintOpen ? "영영해석 숨기기" : "영영해석 힌트 보기"} 💡
            </button>
            {hintOpen && (
              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base font-bold leading-relaxed text-amber-900">
                <p className="font-black">영영정의 한글뜻</p>
                <p className="mt-1">{question.hintKo}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 grid gap-3">
          {question.choices.map((choice, index) => {
            const correct = answered && index === question.answerIndex;
            const wrong = answered && index === selectedIndex && index !== question.answerIndex;
            const meaning = question.choiceMeanings?.[index];
            return (
              <button
                key={`${question.id}-${choice}`}
                disabled={answered}
                onClick={() => onSelect(index)}
                className={`rounded-3xl border-2 px-4 py-4 text-left transition ${correct ? "border-green-400 bg-green-50 text-green-800" : wrong ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-900"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-black text-slate-700">{String.fromCharCode(65 + index)}</span>
                  <div className="min-w-0">
                    <p className="text-xl font-black leading-snug">{choice}</p>
                    {answered && meaning && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-base font-bold leading-snug">
                        {correct && <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-black text-green-700">정답</span>}
                        {wrong && <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-black text-red-700">오답</span>}
                        <span className={correct ? "text-green-700" : wrong ? "text-red-700" : "text-slate-600"}>뜻: {meaning}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {answered && !isDefinition && (
          <div className="mt-5 rounded-3xl bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
            <p className="font-extrabold text-amber-700">해설</p>
            <p className="mt-1">{question.explanationKo}</p>
            {question.grammarFocus && <p className="mt-2 font-bold text-slate-700">문장 규칙: {question.grammarFocus}</p>}
            {question.keywordClues && question.keywordClues.length > 0 && <p className="mt-2 font-bold text-slate-700">핵심어: {question.keywordClues.join(" · ")}</p>}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onPrev} disabled={!canPrev} className="rounded-full border border-slate-200 bg-white py-4 font-black text-slate-700 disabled:bg-slate-100 disabled:text-slate-300">이전 문제</button>
          <button onClick={onNext} className="rounded-full bg-slate-900 py-4 font-black text-white shadow-lg shadow-slate-200">{current === total ? "결과 보기" : "다음 문제"}</button>
        </div>
      </section>
    </main>
  );
}
