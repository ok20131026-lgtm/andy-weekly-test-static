import { AnswerRecord, getSolvingGuide, SECTION_LABELS } from "@/lib/quizUtils";

type Props = { wrongAnswers: AnswerRecord[]; onPick: (index: number) => void; onHome: () => void };

export default function WrongAnswerList({ wrongAnswers, onPick, onHome }: Props) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-slate-900">오답 목록</h1>
          <button onClick={onHome} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-black text-slate-700">홈</button>
        </div>
        <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500">틀린 문제의 유형과 푸는 방식을 먼저 확인한 뒤 다시 풀어보세요.</p>
        <div className="mt-5 grid gap-3">
          {wrongAnswers.map((answer, index) => (
            <button key={`${answer.question.id}-${index}`} onClick={() => onPick(index)} className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm">
              <p className="text-sm font-black text-orange-600">{index + 1}. {SECTION_LABELS[answer.question.section]} · {answer.question.questionType}</p>
              <p className="mt-2 text-lg font-black leading-snug text-slate-900">{answer.question.section === "match_definitions" ? answer.question.displayDefinition : answer.question.question}</p>
              <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-relaxed text-slate-600">{getSolvingGuide(answer.question.questionType)}</p>
            </button>
          ))}
          {wrongAnswers.length === 0 && <p className="rounded-3xl bg-green-50 p-5 text-center font-black text-green-700">오답이 없습니다. 흔치 않은 평화입니다.</p>}
        </div>
      </section>
    </main>
  );
}
