
(function(){
  const DATA = window.QUIZ_DATA;
  const app = document.getElementById('app');
  let screen = 'home';
  let unit = null;
  let questions = [];
  let index = 0;
  let answers = [];
  let hintOpen = false;

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
  }
  function bestKey(unitId){ return 'andy-static-best-' + unitId; }
  function getBest(unitId){ return Number(localStorage.getItem(bestKey(unitId)) || 0); }
  function setBest(unitId, score){ localStorage.setItem(bestKey(unitId), String(Math.max(score, getBest(unitId)))); }
  function currentAnswer(){ const q = questions[index]; return answers.find(a => a.id === q.id); }
  function score(){ return answers.filter(a => a.isCorrect).length; }
  function wrongAnswers(){ return answers.filter(a => !a.isCorrect); }

  function render(){
    if(screen === 'home') return renderHome();
    if(screen === 'quiz') return renderQuiz();
    if(screen === 'result') return renderResult();
    if(screen === 'wrong') return renderWrongList();
  }

  function renderHome(){
    app.innerHTML = `
      <main class="wrap">
        <section class="panel center">
          <div class="logo">🚀</div>
          <p class="kicker">${esc(DATA.bookTitle)}</p>
          <h1>Andy Weekly Test Maker</h1>
          <p class="desc">유닛을 누르면 20문항이 바로 시작됩니다.<br>힌트는 영영정의 문제에서만 볼 수 있습니다.</p>
          <div class="unit-grid">
            ${DATA.units.map(u => `
              <button class="unit-card" data-unit="${u.unit}">
                <div class="unit-row">
                  <div>
                    <div class="unit-title">${esc(u.unitTitle)}</div>
                    <div class="unit-sub">${esc(u.lessonTitles[0] || '')}<br>${esc(u.lessonTitles[1] || '')}</div>
                  </div>
                  <div class="badge">최고 ${getBest(u.unitId)}/${u.totalQuestions}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </section>
      </main>
    `;
    document.querySelectorAll('.unit-card').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        startUnit(Number(btn.dataset.unit));
      });
    });
  }

  function startUnit(unitNo, sourceQuestions){
    unit = DATA.units.find(u => u.unit === unitNo);
    questions = sourceQuestions || unit.questions.slice();
    index = 0;
    answers = [];
    hintOpen = false;
    screen = 'quiz';
    render();
  }

  function renderQuiz(){
    const q = questions[index];
    const ans = currentAnswer();
    const answered = !!ans;
    app.innerHTML = `
      <main class="wrap">
        <section class="panel">
          <div class="topbar">
            <div class="brand"><span>🚀</span><span>Andy Weekly Test Maker</span></div>
            <button class="home-btn" id="homeBtn">홈</button>
          </div>
          <div class="unit-strip">${esc(unit.unitTitle)}</div>
          <div class="progress-row"><span>영영정의</span><span>${index+1} / ${questions.length}</span></div>
          <div class="progress"><div class="bar" style="width:${((index+1)/questions.length)*100}%"></div></div>

          <span class="type">${esc(q.questionType)}</span>
          <p class="prompt-title">영영정의를 읽고 알맞은 단어를 고르세요.</p>
          <div class="definition">${esc(q.question)}</div>

          <div class="hint-box">
            <button class="hint-btn" id="hintBtn">${hintOpen ? '힌트 숨기기' : '힌트 보기'} 💡</button>
            ${hintOpen ? `<div class="hint-content"><b>영영해석</b><br>${esc(q.hintKo)}</div>` : ''}
          </div>

          <div class="choices">
            ${q.choices.map((c,i)=>{
              const correct = answered && i === q.answerIndex;
              const wrong = answered && i === ans.selectedIndex && i !== q.answerIndex;
              return `
                <button class="choice ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-choice="${i}" ${answered ? 'disabled' : ''}>
                  <div class="choice-inner">
                    <span class="letter">${String.fromCharCode(65+i)}</span>
                    <div>
                      <div class="word">${esc(c)}</div>
                      ${answered ? `
                        <div class="meta">
                          ${correct ? '<span class="label ok">정답</span>' : ''}
                          ${wrong ? '<span class="label bad">오답</span>' : ''}
                          <span>뜻: ${esc(q.choiceMeanings[i])}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          ${answered ? `
            <div class="explain">
              <b>해설</b><br>${esc(q.explanationKo)}
              <br><br><b>핵심 단어</b>: ${esc(q.word)} · ${esc(q.meaningKo)}
            </div>
          ` : ''}

          <div class="nav">
            <button id="prevBtn" ${index===0 ? 'disabled' : ''}>이전 문제</button>
            <button class="primary" id="nextBtn">${index+1===questions.length ? '결과 보기' : '다음 문제'}</button>
          </div>
        </section>
      </main>
    `;
    document.getElementById('homeBtn').addEventListener('click', ()=>{ screen='home'; render(); });
    document.getElementById('hintBtn').addEventListener('click', ()=>{ hintOpen = !hintOpen; render(); });
    document.getElementById('prevBtn').addEventListener('click', ()=>{ if(index>0){ index--; hintOpen=false; render(); } });
    document.getElementById('nextBtn').addEventListener('click', ()=>{
      if(index+1 === questions.length){ finish(); } else { index++; hintOpen=false; render(); }
    });
    document.querySelectorAll('.choice').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(currentAnswer()) return;
        const selectedIndex = Number(btn.dataset.choice);
        answers = answers.filter(a => a.id !== q.id);
        answers.push({ id:q.id, question:q, selectedIndex, isCorrect:selectedIndex === q.answerIndex });
        render();
      });
    });
  }

  function finish(){
    setBest(unit.unitId, score());
    screen='result';
    render();
  }

  function renderResult(){
    const sc = score();
    const total = questions.length;
    const wrong = answers.filter(a=>!a.isCorrect).length;
    const unanswered = total - answers.length;
    const rate = total ? Math.round(sc/total*100) : 0;
    app.innerHTML = `
      <main class="wrap">
        <section class="panel center">
          <div class="logo">🏁</div>
          <p class="kicker">${esc(unit.unitTitle)}</p>
          <h1>결과</h1>
          <div class="result-score">
            <div class="big">${sc} / ${total}</div>
            <div class="rate">정답률 ${rate}%</div>
          </div>
          <div class="stat-grid">
            <div class="stat ok">정답<br>${sc}</div>
            <div class="stat bad">오답<br>${wrong}</div>
            <div class="stat neutral">미답<br>${unanswered}</div>
          </div>
          <div class="stack">
            <button class="full orange" id="retryWrong" ${wrong===0 ? 'disabled' : ''}>오답만 다시 풀기</button>
            <button class="full light" id="wrongList" ${wrong===0 ? 'disabled' : ''}>오답 목록 보기</button>
            <button class="full dark" id="homeBtn">홈으로</button>
          </div>
        </section>
      </main>
    `;
    document.getElementById('homeBtn').addEventListener('click', ()=>{ screen='home'; render(); });
    document.getElementById('wrongList').addEventListener('click', ()=>{ if(wrong>0){ screen='wrong'; render(); } });
    document.getElementById('retryWrong').addEventListener('click', ()=>{
      const wrongQs = wrongAnswers().map(a=>a.question);
      if(wrongQs.length){ questions=wrongQs; index=0; answers=[]; hintOpen=false; screen='quiz'; render(); }
    });
  }

  function renderWrongList(){
    const wrong = wrongAnswers();
    app.innerHTML = `
      <main class="wrap">
        <section class="panel">
          <div class="topbar">
            <h1>오답 목록</h1>
            <button class="home-btn" id="homeBtn">홈</button>
          </div>
          <p class="desc">틀린 문제는 영영정의의 핵심어를 먼저 찾고, 힌트는 마지막에 확인하세요.</p>
          <div class="stack">
            ${wrong.length ? wrong.map((a,i)=>`
              <button class="wrong-card" data-wrong="${i}">
                <div class="wrong-title">${i+1}. 영영정의형</div>
                <div class="wrong-q">${esc(a.question.question)}</div>
                <div class="guide">푸는 방식: 영영정의 → 핵심어 2개 표시 → 단어 선택 → 힌트 확인 순서로 다시 풉니다.</div>
              </button>
            `).join('') : '<div class="empty">오답이 없습니다.</div>'}
          </div>
        </section>
      </main>
    `;
    document.getElementById('homeBtn').addEventListener('click', ()=>{ screen='home'; render(); });
    document.querySelectorAll('.wrong-card').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const q = wrong[Number(btn.dataset.wrong)].question;
        questions = [q]; index=0; answers=[]; hintOpen=false; screen='quiz'; render();
      });
    });
  }

  render();
})();
