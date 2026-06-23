import { QuizUnit, QuestionSection } from "@/data/quizData";
import { AnswerRecord, getAccuracy } from "@/lib/quizUtils";

type Props = {
  unit: QuizUnit;
  score: number;
  answered: number;
  total: number;
  answers: AnswerRecord[];
  onRetryWrong: () => void;
  onWrongList: () => void;
  onHome: () => void;
};

const SECTION_ORDER: QuestionSection[] = ["match_definitions", "fill_blanks", "unscramble"];

const RESULT_SECTION_LABELS: Record<QuestionSection, string> = {
  match_definitions: "영영정의형",
  fill_blanks: "빈칸완성형",
  unscramble: "문장배열형"
};

const SECTION_STYLES: Record<QuestionSection, { card: string; title: string; icon: string }> = {
  match_definitions: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
    title: "text-orange-500",
    icon: "⭐"
  },
  fill_blanks: {
    card: "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50",
    title: "text-sky-600",
    icon: "✏️"
  },
  unscramble: {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50",
    title: "text-violet-600",
    icon: "🌈"
  }
};

export default function ResultScreen({ unit, score, answered, total, answers, onRetryWrong, onWrongList, onHome }: Props) {
  const accuracy = getAccuracy(score, total);
  const wrong = answered - score;
  const unanswered = total - answered;

  const sectionStats = SECTION_ORDER.map((section) => {
    const sectionQuestions = unit.questions.filter((question) => question.section === section);
    const sectionAnswers = answers.filter((answer) => answer.question.section === section);
    const sectionCorrect = sectionAnswers.filter((answer) => answer.isCorrect).length;
    const sectionWrong = sectionAnswers.filter((answer) => !answer.isCorrect).length;
    const sectionUnanswered = sectionQuestions.length - sectionAnswers.length;

    return {
      section,
      label: RESULT_SECTION_LABELS[section],
      total: sectionQuestions.length,
      correct: sectionCorrect,
      wrong: sectionWrong,
      unanswered: sectionUnanswered
    };
  });

  return (
    <main className="relative mx-auto w-full max-w-md overflow-hidden px-4 py-5">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,#bae6fd_0_8px,transparent_9px),radial-gradient(circle_at_87%_12%,#fecdd3_0_8px,transparent_9px),radial-gradient(circle_at_10%_56%,#fca5a5_0_13px,transparent_14px),radial-gradient(circle_at_92%_76%,#fde68a_0_7px,transparent_8px),linear-gradient(180deg,#eef4ff_0%,#fff7df_100%)]" />

      <section className="rounded-[2rem] border border-slate-100 bg-white/95 p-5 text-center shadow-xl shadow-blue-100">
        <p className="text-sm font-black text-slate-400">결과 화면 미리보기</p>
        <p className="mt-5 text-sm font-black leading-snug text-orange-500">{unit.unitTitle}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">결과</h1>

        <div className="relative mt-5 overflow-hidden rounded-[1.5rem] border-2 border-sky-300 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 px-5 py-4 text-white shadow-lg shadow-sky-100">
          <span className="absolute left-5 top-4 text-3xl">⭐</span>
          <span className="absolute right-5 bottom-4 text-3xl">☁️</span>
          <span className="absolute right-20 top-5 text-xl opacity-70">✦</span>
          <span className="absolute left-24 bottom-4 text-lg opacity-70">✧</span>
          <p className="relative text-5xl font-black drop-shadow-sm">{score} / {total}</p>
          <p className="relative mt-1 text-xl font-black">정답률 {accuracy}%</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-base font-black">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-2 py-3 text-green-700">정답<br /><span className="text-2xl">{score}</span></div>
          <div className="rounded-2xl border border-red-200 bg-red-50 px-2 py-3 text-red-600">오답<br /><span className="text-2xl">{wrong}</span></div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-2 py-3 text-violet-700">미답<br /><span className="text-2xl">{unanswered}</span></div>
        </div>

        <div className="mt-6 text-left">
          <p className="text-center text-2xl font-black text-slate-900">유형별 오답 현황</p>
          <div className="mt-4 grid gap-3">
            {sectionStats.map((item) => {
              const style = SECTION_STYLES[item.section];
              return (
                <div key={item.section} className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm ${style.card}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-2xl font-black ${style.title}`}>{item.label}</p>
                    <p className="rounded-full bg-white/80 px-3 py-1 text-sm font-black text-slate-700">총 {item.total}</p>
                  </div>
                  <span className="absolute bottom-3 right-4 text-4xl opacity-80">{style.icon}</span>
                  <div className="mt-4 grid grid-cols-3 gap-2 pr-9 text-center text-sm font-black">
                    <div className="rounded-full bg-green-100/90 px-2 py-2 text-green-700">정답 {item.correct}</div>
                    <div className="rounded-full bg-red-100/90 px-2 py-2 text-red-600">오답 {item.wrong}</div>
                    <div className="rounded-full bg-white/80 px-2 py-2 text-slate-600">미답 {item.unanswered}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            onClick={onRetryWrong}
            disabled={wrong === 0}
            className="rounded-full bg-sky-400 py-4 text-lg font-black text-white shadow-lg shadow-sky-100 disabled:bg-slate-200 disabled:text-white"
          >
            오답만 다시 풀기
          </button>
          <button
            onClick={onWrongList}
            disabled={wrong === 0}
            className="rounded-full border border-slate-200 bg-white py-4 text-lg font-black text-slate-800 disabled:text-slate-300"
          >
            오답 목록 보기
          </button>
          <button onClick={onHome} className="rounded-full bg-blue-500 py-4 text-lg font-black text-white shadow-lg shadow-blue-100">
            🏠 홈으로
          </button>
        </div>
      </section>
    </main>
  );
}
