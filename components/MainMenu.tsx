import { QuizUnit, quizBook, quizUnits } from "@/data/quizData";
import { getActiveUnits, getSectionCounts } from "@/lib/quizUtils";

type Props = { bestScores: Record<string, number>; onStartUnit: (unit: QuizUnit) => void };

export default function MainMenu({ bestScores, onStartUnit }: Props) {
  const units = getActiveUnits(quizUnits);
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200">
        <div className="text-center">
          <div className="text-5xl">🚀</div>
          <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-orange-500">{quizBook.bookTitle}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Andy Weekly Test Maker</h1>
          <p className="mt-3 text-base font-bold leading-relaxed text-slate-600">
            유닛을 누르면 20문항이 바로 시작됩니다. 영영정의 8문항, 빈칸 6문항, 문장배열 6문항을 함께 연습합니다.
          </p>
        </div>

        <div className="mt-7 grid gap-3">
          {units.map((unit) => {
            const best = bestScores[unit.unitId] ?? 0;
            const counts = getSectionCounts(unit);
            return (
              <button
                key={unit.unitId}
                onClick={() => onStartUnit(unit)}
                className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-orange-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900">{unit.unitTitle}</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">총 20문항 · 약점 보완형</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-orange-600 ring-1 ring-orange-100">영영정의 {counts.match_definitions}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-sky-600 ring-1 ring-sky-100">빈칸 {counts.fill_blanks}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-violet-600 ring-1 ring-violet-100">문장배열 {counts.unscramble}</span>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
                    최고 {best}/{unit.totalQuestions}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
