import { QuizUnit } from "@/data/quizData";
import { getAccuracy } from "@/lib/quizUtils";

type Props = { unit: QuizUnit; score: number; answered: number; total: number; onRetryWrong: () => void; onWrongList: () => void; onHome: () => void };

export default function ResultScreen({ unit, score, answered, total, onRetryWrong, onWrongList, onHome }: Props) {
  const accuracy = getAccuracy(score, total);
  const wrong = answered - score;
  const unanswered = total - answered;
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-center shadow-xl shadow-slate-200">
        <div className="text-6xl">🏁</div>
        <p className="mt-4 text-sm font-black text-orange-500">{unit.unitTitle}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">결과</h1>
        <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
          <p className="text-5xl font-black">{score} / {total}</p>
          <p className="mt-2 text-lg font-bold">정답률 {accuracy}%</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-sm font-black">
          <div className="rounded-2xl bg-green-50 p-3 text-green-700">정답<br />{score}</div>
          <div className="rounded-2xl bg-red-50 p-3 text-red-700">오답<br />{wrong}</div>
          <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">미답<br />{unanswered}</div>
        </div>
        <div className="mt-6 grid gap-3">
          <button onClick={onRetryWrong} disabled={wrong === 0} className="rounded-full bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-100 disabled:bg-slate-200">오답만 다시 풀기</button>
          <button onClick={onWrongList} disabled={wrong === 0} className="rounded-full border border-slate-200 bg-white py-4 font-black text-slate-800 disabled:text-slate-300">오답 목록 보기</button>
          <button onClick={onHome} className="rounded-full bg-slate-900 py-4 font-black text-white">홈으로</button>
        </div>
      </section>
    </main>
  );
}
