// Part 3: 05 실습 + 06 경계 + 마무리
const { C, W, H, M, CW, MONO } = require("./lib");
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "assets");
const REPO_URL = "https://github.com/smilesjcha/research-agent";

module.exports = async function part3(pres, a) {
  const SEC5 = "5 · Claude Code 실습";
  {
    const s = a.slide(true);
    a.section(s, "05", "실습: Claude Code로 카드 A · B · C", "요청문 카드 A·B·C를 여러분의 폴더(my-career)에서 실행하고, 결과 파일과 '내가 확인한 것'을 남깁니다. 모델 Fable 5.1 · 노력 높음.", "AI가 만든 결과 중 무엇을 받아들이고, 무엇을 확인 필요로 남기고, 무엇을 내가 다시 쓸 것인가?", SEC5);
    a.notes(s, { intent: "절 전환. 노트북과 Claude Desktop의 Code 탭 실행 여부를 확인한다. 저장소를 내려받은 학생은 practice_kit/my-career를 바로 연다.", time: "0.5분", next: "먼저 폴더를 엽니다. 3분이면 됩니다." });
  }

  // 33 실습 준비
  {
    const s = a.slide(false);
    a.header(s, "실습 준비 · 3분", "폴더 하나, 규칙 파일 하나, Code 탭에서 열기", "실습 자료가 없어도 됩니다. 저장소의 practice_kit/my-career에 예시 공고·경험정리·보고서·자소서가 들어 있습니다. 자기 자료가 있으면 그것을 씁니다.");
    // 좌: 폴더 트리
    const tx = M, tw = 5.2;
    a.rect(s, tx, 2.3, tw, 3.55, C.navy, { round: 0.08 });
    a.text(s, "폴더 구조", tx + 0.3, 2.5, 3, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    const tree = [
      ["my-career/", C.white, true],
      ["├─ CLAUDE.md         규칙: 확인 필요 · 출처 · 대신 쓰지 않기", C.accentLight, false],
      ["├─ 01_jd/            채용공고 1~3개", C.darkMuted, false],
      ["├─ 02_experience/경험정리.md   경험 3개 × 5칸", C.darkMuted, false],
      ["├─ 03_drafts/        보고서·자소서·README", C.darkMuted, false],
      ["└─ 04_outputs/       AI 결과 (덮어쓰기 금지)", C.darkMuted, false],
    ];
    let ty = 2.95;
    for (const [t, c, b] of tree) {
      a.text(s, t, tx + 0.3, ty, tw - 0.6, 0.32, { size: 11, color: c, bold: b, font: MONO });
      ty += 0.38;
    }
    a.text(s, "규칙은 CLAUDE.md에 적혀 있고, Claude Code가 세션마다 먼저 읽습니다. 원본은 읽기 전용, 결과는 04_outputs에만.", tx + 0.3, 5.35, tw - 0.6, 0.45, { size: 10.5, color: C.darkMuted, lsm: 1.3 });
    // 우: 연결 단계
    const rx = M + 5.5, rw = CW - 5.5;
    const steps = [
      { t: "Claude Desktop 실행 → Code 탭", d: "왼쪽 상단에서 Code를 고르고 '폴더 열기'로 my-career를 선택합니다." },
      { t: "새 세션: 모델 Fable 5.1 · 노력 높음", d: "입력창 아래 모델 메뉴에서 고릅니다. 연 폴더만 Claude가 읽고 씁니다." },
      { t: "요청문 카드 A 붙여넣기", d: "결과 파일 경로가 04_outputs/로 지정됐는지 확인 후 실행합니다. 파일 쓰기는 승인 후 진행됩니다." },
      { t: "결과 파일 열기 → 확인 표지 붙이기", d: "표의 각 행에 확인 완료·확인 필요를 직접 표시합니다." },
    ];
    let sy = 2.3;
    for (let i = 0; i < 4; i++) {
      a.rect(s, rx, sy, rw, 0.8, C.panel, { round: 0.08 });
      a.numBadge(s, i + 1, rx + 0.22, sy + 0.2, 0.4, i === 3 ? C.accent : C.navy, C.white, 12);
      a.text(s, steps[i].t, rx + 0.78, sy + 0.12, rw - 0.95, 0.3, { size: 12.5, bold: true });
      a.text(s, steps[i].d, rx + 0.78, sy + 0.42, rw - 0.95, 0.35, { size: 10.5, color: C.muted });
      sy += 0.9;
    }
    a.rect(s, M, 6.05, CW, 0.6, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "주의  ", size: 12, bold: true, color: C.accentInk },
      { text: "연구실·인턴 회사의 비공개 자료, 타인의 개인정보가 든 파일은 폴더에 넣지 않습니다. 6절에서 다시 다룹니다.", size: 12.5, color: C.ink },
    ], M + 0.3, 6.05, CW - 0.6, 0.6, { valign: "middle" });
    a.footer(s, SEC5);
    a.notes(s, {
      intent: "화면을 공유하며 1~3단계를 직접 시연한다(2분). 학생은 따라 하고, 막히면 옆 사람과 짝을 짓는다. 다음 장들의 실제 실행 화면으로 대체 시연할 수 있다.",
      time: "3분",
      next: "실습 A입니다. 5분 뒤 '가장 먼저 채울 빈칸' 한 줄을 발표해 주세요.",
      sources: "Anthropic 도움말 센터 https://support.claude.com (Claude Desktop Code 탭 · Claude Code 안내)",
    });
  }


  // 실습 실제 실행 화면 (Claude Code · Fable 5.1 · 높음) — assets/practice_X.png 가 있을 때만 생성
  const practiceShot = async (opts) => {
    const img = path.join(ASSETS, opts.image);
    if (!fs.existsSync(img)) { console.warn("skip shot:", opts.image); return; }
    const s = a.slide(false);
    a.header(s, opts.kicker, opts.title, opts.sub);
    const iw = 7.55, ih = 4.25;
    a.image(s, img, M, 2.3, iw, ih);
    const rx = M + iw + 0.3, rw = CW - iw - 0.3;
    a.rect(s, rx, 2.3, rw, ih, C.panel, { round: 0.08 });
    a.text(s, "실행에서 일어난 일", rx + 0.25, 2.48, rw - 0.5, 0.28, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    let cy = 2.8;
    for (let i = 0; i < opts.points.length; i++) {
      a.numBadge(s, i + 1, rx + 0.25, cy + 0.02, 0.3, C.navy, C.white, 10);
      a.text(s, opts.points[i], rx + 0.65, cy, rw - 0.85, 0.7, { size: 10, color: C.ink, lsm: 1.25 });
      cy += 0.72;
    }
    a.rect(s, rx + 0.25, ih + 2.3 - 0.75, rw - 0.5, 0.55, C.white, { round: 0.06 });
    a.text(s, opts.file, rx + 0.35, ih + 2.3 - 0.75, rw - 0.7, 0.55, { size: 9, color: C.navy, bold: true, valign: "middle", font: MONO, lsm: 1.2 });
    a.rect(s, M, 6.7, CW, 0.22, C.paper);
    a.text(s, opts.caption, M, 6.62, CW, 0.3, { size: 9.5, color: C.faint });
    a.footer(s, SEC5);
    a.notes(s, opts.notes);
  };

  // 34~36 실습 A/B/C 공통 레이아웃
  const practice = async (opts) => {
    const s = a.slide(false);
    a.header(s, opts.kicker, opts.title, opts.sub);
    a.promptCard(s, M, 2.3, 7.0, 3.35, { label: opts.cardLabel, lines: opts.lines });
    const rx = M + 7.3, rw = CW - 7.3;
    a.rect(s, rx, 2.3, rw, 3.35, C.panel, { round: 0.08 });
    a.text(s, "완료 기준", rx + 0.28, 2.5, rw - 0.56, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    let cy = 2.9;
    for (const d of opts.done) {
      await a.iconBadge(s, "FiCheckSquare", rx + 0.28, cy, 0.34, C.white, C.navy);
      a.text(s, d, rx + 0.75, cy - 0.02, rw - 1.0, 0.6, { size: 11.5, color: C.ink, lsm: 1.3 });
      cy += 0.66;
    }
    // 하단: 시간 배분 + 막혔을 때
    const bw = (CW - 0.3) / 2;
    a.rect(s, M, 5.85, bw, 0.8, C.navySoft, { round: 0.08 });
    a.rich(s, [
      { text: "시간 배분  ", size: 11.5, bold: true, color: C.navy },
      { text: opts.timing, size: 11.5, color: C.ink },
    ], M + 0.25, 5.85, bw - 0.5, 0.8, { valign: "middle" });
    a.rect(s, M + bw + 0.3, 5.85, bw, 0.8, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "막혔을 때  ", size: 11.5, bold: true, color: C.accentInk },
      { text: opts.stuck, size: 11.5, color: C.ink },
    ], M + bw + 0.55, 5.85, bw - 0.5, 0.8, { valign: "middle" });
    a.footer(s, SEC5);
    a.notes(s, opts.notes);
  };

  await practice({
    kicker: "실습 A · 5분",
    title: "직무 리서치: 채용공고 → 역량 매트릭스 → 첫 빈칸",
    sub: "카드 A를 그대로 실행하고, 결과 표에서 '가장 먼저 채울 빈칸 1개'를 이유와 함께 말할 수 있으면 완료입니다.",
    cardLabel: "카드 A · Claude Code (my-career 프로젝트)",
    lines: [
      "01_jd 폴더의 채용공고와 02_experience/경험정리.md를 읽고,",
      "① 요구 역량 × 회사 표 (필수 / 우대 / 언급 없음)",
      "② 내 준비도 상·중·하 + 근거(경험정리.md의 항목)",
      "③ 공고에 없는 역량은 추측하지 말고 '확인 필요'",
      { text: "결과는 04_outputs/역량매트릭스.md 로 저장하고, 표 아래에 '가장 먼저 채울 빈칸 1개'를 이유와 함께 써줘.", bold: true, color: C.navy },
    ],
    done: ["04_outputs/역량매트릭스.md 파일이 생성됨", "표의 행마다 확인 완료 · 확인 필요를 내가 표시함", "'가장 먼저 채울 빈칸' 한 줄을 옆 사람에게 30초 설명"],
    timing: "실행 1분 → 결과 읽기 2분 → 확인 표지 붙이기 1분 → 후속 요청 1회 1분",
    stuck: "결과가 길면 “표만 남기고 각 행 한 줄로” · 근거가 약하면 “인용 못 하면 '중'으로 내려줘”",
    notes: { intent: "학생이 결과를 '읽고 표시하는' 시간을 확보한다. 실행보다 확인 표지 붙이기를 감독한다.", time: "5분", next: "실습 B는 여러분이 이미 쓴 문서를 검토받습니다." },
  });

  await practiceShot({
    kicker: "실습 A · 실제 실행 화면", image: "practice_A.png",
    title: "카드 A를 붙여 넣으면 일어나는 일: 읽기 → 쓰기 1회 → 요약",
    sub: "삼성전자 DS · LG에너지솔루션 · 한화에어로스페이스 공고 요약과 경험정리.md만 읽고(Read) 결과 파일 하나만 썼습니다(Write). 모르는 칸은 '확인 필요'로 남겼습니다.",
    points: [
      "01_jd 공고 요약 3개 + 경험정리.md를 읽고 04_outputs/역량매트릭스.md 하나만 생성. 원본 폴더는 건드리지 않음",
      "역량 13행 × 3사. 칸마다 공고의 어느 섹션에서 옮겼는지 표기. LG는 자격 요건 섹션이 없어 '필수(수행업무)'로 구분",
      "준비도 '상' 0개. 전공·학위·어학은 경험정리에 사실 자체가 없어 상·중·하 대신 '확인 필요'",
      "첫 빈칸: #8 빅데이터·머신러닝 데이터 분석 — 삼성 필수 + 한화 수행업무. 측정 로그 CSV와 Python이 이미 있음",
    ],
    file: "04_outputs/역량매트릭스.md · 7턴 · 3분 53초",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "실제 화면으로 '읽기 → 쓰기 → 요약'의 순서를 보여준다. 결과 표가 아니라 '확인 필요'와 '어느 섹션에서 옮겼는지'를 짚는다. 한화 접수 마감(9/20)을 스스로 체크리스트에 올린 점도 언급.", time: "1분", next: "같은 세션에서 후속 요청 한 줄을 더 보내면 이렇게 이어집니다." },
  });
  await practiceShot({
    kicker: "실습 A · 후속 요청", image: "practice_A2.png",
    title: "후속 요청 한 줄: '하'인 역량 하나 → 30일 계획",
    sub: "같은 세션에서 '#8 데이터 분석을 골라 4주 계획을 다섯 열 표로 써줘'라고 이어 요청했습니다. 이전 대화의 표를 기억한 채 계획 파일을 하나 더 만듭니다.",
    points: [
      "후속 요청 한 줄로 04_outputs/30일계획_데이터분석.md 생성 (주차 · 목표 · 증거 · AI에게 맡길 것 · 내가 확인할 것)",
      "1주차는 '데이터 복구': 경험정리(12%p · 3회)와 보고서(약 71% · 낮음 · 보통)의 숫자 불일치를 CSV 원본으로 먼저 푼다",
      "2~4주: 기술통계 → 회귀·공개 데이터셋 → 보고서 v2 · README · 자소서 claim별 증거 대조표. 자소서 문단은 본인이",
      "일정 주의를 스스로 표기: 한화 마감(9/20) 전엔 못 쓰는 증거, 4주 뒤 #8은 '하 → 중'까지만 (표본이 작아서)",
    ],
    file: "04_outputs/30일계획_데이터분석.md · 후속 · 2분 19초",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "'고쳐 말하기'가 실력임을 실제 화면으로 보여준다. 계획표의 마지막 두 열(맡길 것 / 확인할 것)이 18번 장표와 같은 구조임을 짚고, AI가 '상까지는 못 올라간다'고 스스로 한계를 적은 점을 강조한다.", time: "0.5분", next: "실습 B는 여러분이 이미 쓴 문서를 검토받습니다." },
  });

  await practice({
    kicker: "실습 B · 5분",
    title: "기술 문서: 내 보고서에 비판적 검토 받기",
    sub: "03_drafts의 보고서·과제 하나에 카드 B를 실행합니다. 지적 3개 중 받아들일 것과 반박할 것을 나누면 완료입니다.",
    cardLabel: "카드 B · 비판적 검토 (Claude Code)",
    lines: [
      "03_drafts/보고서.md를 처음 읽는 채용 담당 엔지니어 관점으로, 칭찬은 생략하고",
      "① 논리 비약 ② 근거 없는 숫자 ③ 용어 불일치 ④ 독자가 모를 전제 ⑤ 빠진 한계",
      "기준으로 문제 문장을 원문 인용 + 이유 한 줄 + 고친 예시 한 줄로 정리해줘.",
      { text: "가장 심각한 3개를 먼저, 확신 없는 지적은 '확인 필요'로. 결과는 04_outputs/검토_보고서.md 에 저장.", bold: true, color: C.navy },
    ],
    done: ["04_outputs/검토_보고서.md 생성", "지적 3개를 '수용 / 반박(근거) / 확인 필요'로 분류함", "수용한 지적 1개를 내 문장으로 직접 고침 (AI가 쓴 예시를 그대로 붙이지 않기)"],
    timing: "실행 1분 → 지적 읽기 1.5분 → 분류 1.5분 → 문장 하나 직접 고치기 1분",
    stuck: "문서가 없으면 배포한 예시 보고서 사용 · 지적이 뭉뚱그려지면 “문장 단위로 인용해줘”",
    notes: { intent: "'반박'을 한 명 이상 발표시킨다. AI의 지적을 그대로 받아들이지 않는 경험이 목표.", time: "5분", next: "마지막 실습 C는 말하기입니다. 조금 시끄러워져도 괜찮습니다." },
  });

  await practiceShot({
    kicker: "실습 B · 실제 실행 화면", image: "practice_B.png",
    title: "카드 B의 결과: 가장 심각한 3개 + 나머지 14개",
    sub: "보고서만 읽지 않고 경험정리와 삼성전자 DS 직무소개까지 대조해 검토했습니다. 확신이 낮은 지적은 '확인 필요'로 구분했습니다.",
    points: [
      "보고서 · 경험정리 · 삼성전자 DS 반도체공정기술 직무소개를 함께 읽고 04_outputs/검토_보고서.md 작성",
      "가장 심각한 3개: 세 점으로 범위 밖 외삽 · 숫자 흔들림('약 70% 이상' vs '약 71%') · 검증 안 된 원인 단정",
      "나머지 16개는 다섯 기준별 표. 원문 인용 + 이유 한 줄 + 고친 예시 한 줄. 경험정리(개인)와 보고서(조원과 함께)가 충돌하는 부분은 '확인 필요'",
      "삼성전자 DS 직무소개가 요구하는 Python 통계 분석·수율 예측 역량이 보고서에 드러나지 않는다는 점을 별도 표로",
    ],
    file: "04_outputs/검토_보고서.md · 7턴 · 2분 06초",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "지적 19개 중 3개만 먼저 보여주는 구조가 요청문의 '가장 심각한 3개 먼저'에서 나왔음을 짚는다.", time: "1분", next: "이 지적을 그대로 받아들이지 않고 반박하면 어떻게 될까요?" },
  });
  await practiceShot({
    kicker: "실습 B · 반박", image: "practice_B2.png",
    title: "학생이 근거로 반박하면: 지적이 '근거 없음'에서 '근거 미기재'로 바뀐다",
    sub: "'측정 로그에 3회 반복 · ±2%p · 대조군 59%가 있다'고 반박했습니다. AI는 지적을 철회하지도, 고집하지도 않고 성격을 다시 분류했습니다.",
    points: [
      "판단부터: '근거 없는 숫자' 분류는 철회하되 지적은 라벨을 바꿔 유지 — '근거가 보고서 안에 연결돼 있지 않다'",
      "CSV로도 해소되지 않는 것 두 가지를 분리: '70% 이상' vs '71%' 문장 불일치, 70°C 값 부재. CSV는 못 봤으므로 표지 '요약만 확인'",
      "고쳐 쓰지 않고 근거 사슬 조건 8개만 제시 (값 하나로 · 반복 횟수 · ±2%p의 종류 · 대조군 이름과 값 · 원자료 위치 · 사실과 해석 분리)",
      "검토_보고서.md는 수정하지 않음. 원하면 _v2로 — 덮어쓰기 금지 규칙(CLAUDE.md)이 작동",
    ],
    file: "04_outputs/검토_보고서.md (미수정) · 후속 1턴",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "'반박에는 근거를'이 실제로 어떻게 작동하는지 보여준다. AI가 '대신 써 주지 마'를 지켜 조건만 제시한 점을 강조한다.", time: "0.5분", next: "마지막 실습 C는 말하기입니다. 조금 시끄러워져도 괜찮습니다." },
  });

  await practice({
    kicker: "실습 C · 5분",
    title: "면접: 예상 질문 10개와 꼬리질문 한 번",
    sub: "카드 C를 실행하고, 질문 하나를 골라 소리 내어 60초 답한 뒤 꼬리질문을 받습니다. 답변 구조는 문제·제약·결정·결과·배움.",
    cardLabel: "카드 C · 모의 면접 (Claude Code)",
    lines: [
      "02_experience/경험정리.md와 03_drafts/자소서.md(또는 README)를 읽고,",
      "경험 검증 · 기술 깊이 · 협업 · 실패·한계 네 유형으로 예상 질문 10개를 만들어줘.",
      "내가 답하면 답마다 꼬리질문 하나와, '구조(문제·제약·결정·결과·배움)'와 '근거(숫자·출처)' 두 기준의 피드백만 짧게 해줘.",
      { text: "질문 목록은 04_outputs/면접질문.md 에 저장. 답변 대신 써 주지 마.", bold: true, color: C.navy },
    ],
    done: ["04_outputs/면접질문.md 생성 (유형별 2~3개)", "질문 1개에 소리 내어 60초 답변 (녹음 권장)", "꼬리질문 1개에 답하고, 답변에서 빠진 칸(제약? 결과?)을 내가 적음"],
    timing: "실행 1분 → 질문 고르기 0.5분 → 답변 1분 → 꼬리질문·피드백 1.5분 → 빠진 칸 기록 1분",
    stuck: "자소서가 없으면 경험정리.md만으로 실행 · 답이 막히면 “제약부터 다시 물어봐 줘”",
    notes: { intent: "소리 내어 답하게 한다. 짝을 지어 한 명은 답하고 한 명은 빠진 칸을 체크하는 방식도 가능.", time: "5분", next: "실습이 끝났습니다. 남긴 것을 확인하겠습니다." },
  });

  await practiceShot({
    kicker: "실습 C · 실제 실행 화면", image: "practice_C.png",
    title: "카드 C의 결과: 네 유형 × 10개 질문, 질문마다 '출처 · 의도'",
    sub: "자소서의 빈 표현('여러 어려움', '최선의 선택')과 경험정리의 숫자 사이 틈을 질문으로 겨냥했습니다. 답변은 쓰지 않았습니다.",
    points: [
      "경험정리 + 자소서를 읽고 04_outputs/면접질문.md 저장 — 경험 검증 3 · 기술 깊이 3 · 협업 2 · 실패·한계 2",
      "질문마다 '출처 · 의도' 열: 어느 문장을 파고드는 질문인지 학생이 미리 안다",
      "원문의 위험 신호를 표로: 자소서에 숫자가 하나도 없음 · 경험 3의 결과·배움 칸 비어 있음 · 경험 2의 '개인' vs '조원 3명' 충돌은 확인 필요",
      "예: '72%는 어떤 조건에서 몇 번 측정한 평균이고 편차는?' · 'GC 조건은?' — 숫자 하나마다 출처를 묻는 질문. 체크리스트 9개",
    ],
    file: "04_outputs/면접질문.md · 5턴 · 1분 17초",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "질문 목록이 아니라 '출처·의도' 열을 보여준다. 면접관이 무엇을 확인하려는지 알면 답의 구조가 정해진다.", time: "1분", next: "실제로 답해 보면 이렇게 돌아옵니다." },
  });
  await practiceShot({
    kicker: "실습 C · 답변과 꼬리질문", image: "practice_C2.png",
    title: "60초 답변 → 꼬리질문 1개 + 구조·근거 피드백 두 줄",
    sub: "C1(협업) 질문에 소리 내어 답한 뒤 요약을 입력했습니다. 피드백은 요청문대로 '구조'와 '근거' 두 기준만, 짧게 돌아왔습니다.",
    points: [
      "꼬리질문: '장치 제작을 원한 두 명이 동의한 결정적 이유는? 72% 뒤 장치 제작은 실제로 했나?' — 건너뛴 구간과 지키지 않은 약속을 짚음",
      "구조: 문제·제약·결정·결과는 순서대로 있으나 '반대 → 합의' 장면과 '배움' 칸이 빠짐. 협업 질문에 결과 답을 한 셈",
      "근거: 4명·8주·30만원·40→72%·20→6L는 모두 경험정리와 일치. '두 명이 장치 제작을 원했다'는 출처 없는 새 사실 → 확인 필요",
      "답변을 대신 써 주지 않음. 초기 계획서와 축소 후 계획서가 가장 강한 근거라고 출처만 제안",
    ],
    file: "답변 요약 입력  · 후속 1턴  ·  파일 생성 없음",
    caption: "Claude Code(Claude Desktop 번들 2.1.270) · Claude Fable 5.1 · 노력 높음 · 2026-09-15 실제 실행 기록(practice_runs/)을 세션 화면으로 렌더링",
    notes: { intent: "'빠진 칸(제약? 결과?)을 내가 적는다'가 이 화면의 마지막 줄에서 어떻게 시작되는지 보여준다.", time: "0.5분", next: "실습이 끝났습니다. 남긴 것을 확인하겠습니다." },
  });

  // 37 실습 후 체크리스트 (표, 세로 가운데 정렬)
  {
    const s = a.slide(false);
    a.header(s, "실습 정리", "남겨야 할 네 가지: 결과 · 근거 · 내 판단 · 기록", "AI 결과 파일보다 '내가 표시한 것'이 실습의 산출물입니다. 이 네 칸이 채워져야 다음 주에도 이어집니다.");
    const P = (t, c, soft) => ({ text: t, bold: true, color: c, fill: soft, align: "center", size: 11.5 });
    const rows = [
      ["항목", "확인 질문", "실습 A", "실습 B", "실습 C", "상태"],
      ["결과", "결과 파일이 04_outputs에 있는가", "역량매트릭스.md", "검토_보고서.md", "면접질문.md", P("파일 확인", C.navy, C.navySoft)],
      ["근거", "AI가 쓴 근거를 원문과 대조했는가", "근거 열 ↔ 경험정리.md", "인용 문장 ↔ 내 보고서", "질문 ↔ 자소서 문장", P("대조 완료 / 필요", C.amber, C.amberSoft)],
      ["내 판단", "받아들인 것과 반박한 것을 나눴는가", "준비도 상·중·하 수정", "수용 / 반박 / 확인 필요", "빠진 칸 기록", P("내가 표시", C.green, C.greenSoft)],
      ["기록", "다음에 다시 쓸 요청문을 남겼는가", "후속 요청 1개", "고친 문장 1개", "녹음 또는 메모", P("파일로 저장", C.teal, C.tealSoft)],
    ];
    a.table(s, M, 2.35, [1.2, 3.3, 2.15, 2.15, 1.9, 1.23], rows, { rowH: [0.45, 0.68, 0.68, 0.68, 0.68], size: 11.5 });
    a.rect(s, M, 5.75, CW, 0.9, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "다음 주부터  ", size: 12, bold: true, color: C.accent },
      { text: "같은 폴더에서 카드 A를 매주 한 번 다시 실행하면 준비도 열이 바뀝니다. 바뀌지 않는 행이 여러분이 이번 달 만들 증거입니다.", size: 13.5, color: C.white },
    ], M + 0.3, 5.75, CW - 0.6, 0.9, { valign: "middle" });
    a.footer(s, SEC5);
    a.notes(s, {
      intent: "네 행 중 '내 판단' 행이 비어 있으면 실습이 끝나지 않은 것이라고 말한다.",
      time: "2분",
      next: "마지막으로, AI를 쓸 때 여러분이 넘지 말아야 할 선입니다.",
    });
  }

  // ═════════════ 06 경계
  const SEC6 = "6 · 사람이 결정할 경계";
  {
    const s = a.slide(true);
    a.section(s, "06", "사람이 결정할 경계", "AI를 잘 쓰는 사람과 위험하게 쓰는 사람의 차이는 실력이 아니라 경계입니다.", "어떤 자료를 넣으면 안 되고, 어떤 결과는 반드시 내가 다시 써야 하는가?", SEC6);
    a.notes(s, { intent: "절 전환.", time: "0.5분", next: "학생이 지켜야 할 세 가지 경계부터 봅니다." });
  }

  // 39 세 가지 경계
  {
    const s = a.slide(false);
    a.header(s, "세 가지 경계", "학교 규정 · 지원처 정책 · 비공개 자료", "세 경계는 도구가 바뀌어도 그대로입니다. 모르면 사용 전에 확인하고, 확인 결과를 기록해 둡니다.");
    const cards = [
      { icon: "FiBookOpen", t: "학교·수업의 AI 사용 규정", b: "과목마다 허용 범위가 다릅니다. 실러버스와 과제 안내에 명시된 범위를 확인하고, 허용될 때도 어디에 어떻게 썼는지 밝힐 수 있게 기록합니다.", act: "확인: 실러버스 · 담당 교수" },
      { icon: "FiBriefcase", t: "지원 기업의 AI 작성 정책", b: "일부 기업은 지원서의 AI 사용을 제한하거나 고지를 요구합니다. 공고와 지원 안내를 읽고, 자소서의 사실·결정·문장은 내가 쓴다는 원칙을 지킵니다.", act: "확인: 채용 공고 · 인사팀 문의" },
      { icon: "FiLock", t: "비공개 자료와 개인정보", b: "연구실 데이터, 인턴 회사 문서, 팀원의 개인정보는 폴더에 넣지 않습니다. 필요한 경우 식별 정보를 지운 요약본으로 대체하고 원본은 분리합니다.", act: "확인: 지도교수 · 회사 보안 규정" },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3), c = cards[i];
      a.rect(s, x, 2.35, cw, 3.55, C.panel, { round: 0.08 });
      await a.iconBadge(s, c.icon, x + 0.28, 2.6, 0.5, i === 2 ? C.red : C.navy, C.white);
      a.text(s, c.t, x + 0.28, 3.25, cw - 0.56, 0.45, { size: 14.5, bold: true });
      a.text(s, c.b, x + 0.28, 3.75, cw - 0.56, 1.5, { size: 11.5, color: C.muted, lsm: 1.35 });
      a.rect(s, x + 0.28, 5.3, cw - 0.56, 0.4, C.white, { round: 0.05 });
      a.text(s, c.act, x + 0.42, 5.3, cw - 0.84, 0.4, { size: 10.5, bold: true, color: i === 2 ? C.red : C.navy, valign: "middle" });
    }
    a.text(s, "규정과 정책은 기관·기업마다 다르고 자주 바뀝니다. 이 장표는 확인해야 할 항목이며, 최종 판단은 각 기관의 최신 안내를 따릅니다.", M, 6.1, CW, 0.5, { size: 11.5, color: C.faint });
    a.footer(s, SEC6);
    a.notes(s, {
      intent: "세 경계의 '확인처'를 강조한다. 특정 기업·학교 정책을 단정하지 않고 학생이 직접 확인하도록 한다.",
      time: "2분",
      next: "그럼 어떤 일은 자유롭게 맡기고, 어떤 일은 반드시 내가 결정할까요? 한 장의 판단표로 정리합니다.",
    });
  }

  // 40 영향·되돌리기 매트릭스
  {
    const s = a.slide(false);
    a.header(s, "판단표", "영향과 되돌리기 난이도에 따른 세 구역", "틀렸을 때 나와 타인에게 미치는 영향이 크고 되돌리기 어려울수록, AI 결과를 그대로 쓰지 않고 사람이 결정합니다.");
    const zones = [
      { t: "자유롭게 맡김", c: C.green, soft: C.greenSoft, items: ["공개 자료 1쪽 정리", "내 메모·노트 구조화", "형식·글자 수·용어 정리", "예상 질문 생성"] },
      { t: "확인 후 사용", c: C.amber, soft: C.amberSoft, items: ["보고서 비판적 검토", "역량 매트릭스 근거 열", "README·기획서 초안", "코드·계산 초안"] },
      { t: "사람이 결정", c: C.red, soft: C.redSoft, items: ["자소서 최종 문장·제출", "연구실·회사 비공개 데이터", "타인 개인정보가 든 자료", "팀원 기여도 서술"] },
    ];
    const cw = (CW - 0.5) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.25), z = zones[i];
      a.rect(s, x, 2.35, cw, 3.1, z.soft, { round: 0.08 });
      a.rect(s, x + 0.28, 2.62, 0.16, 0.16, z.c, { round: 0.04 });
      a.text(s, z.t, x + 0.56, 2.55, cw - 0.8, 0.32, { size: 15, bold: true, color: z.c });
      a.rich(s, z.items.map((it, k) => ({ text: it, size: 12.5, color: C.ink, bullet: { indent: 14 }, br: k < z.items.length - 1, psa: 7 })), x + 0.28, 3.05, cw - 0.56, 2.3, { lsm: 1.25 });
    }
    a.text(s, "영향 낮음 · 되돌리기 쉬움", M, 5.55, 4, 0.3, { size: 10.5, bold: true, color: C.faint });
    a.text(s, "영향 큼 · 되돌리기 어려움", W - M - 4, 5.55, 4, 0.3, { size: 10.5, bold: true, color: C.faint, align: "right" });
    a.arrow(s, M + 2.3, 5.7, CW - 4.6, C.faint);
    a.rect(s, M, 5.95, CW, 0.7, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "실행 전 세 질문  ", size: 12, bold: true, color: C.accent },
      { text: "① 틀리면 누가 영향을 받는가   ② 되돌릴 수 있는가   ③ 내가 내용을 설명할 수 있는가 — 하나라도 '아니오'면 오른쪽 구역입니다.", size: 12.5, color: C.white },
    ], M + 0.3, 5.95, CW - 0.6, 0.7, { valign: "middle" });
    a.footer(s, SEC6);
    a.notes(s, {
      intent: "세 구역의 항목을 읽고, 학생이 오늘 실습한 세 가지가 어느 구역인지 답하게 한다(A: 확인 후, B: 확인 후, C: 자유 → 답변은 사람).",
      time: "2.5분",
      next: "마무리입니다. 오늘 이후 30일 계획입니다.",
    });
  }

  // ═════════════ 마무리
  const SEC7 = "마무리";
  {
    const s = a.slide(false);
    a.header(s, "30일 계획", "작게 시작해서 매주 한 번 표를 갱신하기", "오늘 만든 폴더와 카드 세 장으로 충분합니다. 새 도구를 배우는 대신, 같은 요청을 매주 반복해 증거를 쌓습니다.");
    const weeks = [
      { w: "1주", t: "공고 3개 · 매트릭스", d: "카드 A 실행, 첫 빈칸 확정", icon: "FiSearch" },
      { w: "2주", t: "보고서 1편 재작성", d: "결론 먼저 구조 + 카드 B 검토", icon: "FiFileText" },
      { w: "3주", t: "README 1개 공개", d: "여섯 블록, 내 역할은 직접", icon: "FiGithub" },
      { w: "4주", t: "자소서 1문항 · 모의 면접", d: "인벤토리 → 초안 → 카드 C", icon: "FiMic" },
    ];
    const n = 4, gap = 0.25, bw = (CW - gap * (n - 1)) / n, y = 2.25;
    a.hline(s, M + bw / 2, y + 0.4, CW - bw, C.line, 1);
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap), wk = weeks[i];
      a.circle(s, x + bw / 2 - 0.3, y + 0.1, 0.6, i === 3 ? C.accent : C.navy);
      a.text(s, wk.w, x + bw / 2 - 0.3, y + 0.1, 0.6, 0.6, { size: 12, bold: true, color: C.white, align: "center", valign: "middle" });
      a.rect(s, x, y + 0.9, bw, 1.75, C.panel, { round: 0.08 });
      await a.iconBadge(s, wk.icon, x + bw / 2 - 0.25, y + 1.05, 0.5, C.white, C.navy);
      a.text(s, wk.t, x + 0.15, y + 1.65, bw - 0.3, 0.4, { size: 14, bold: true, align: "center" });
      a.text(s, wk.d, x + 0.15, y + 2.08, bw - 0.3, 0.5, { size: 11.5, color: C.muted, align: "center", lsm: 1.3 });
    }
    const rows = [
      ["매주 확인", "질문", "기록 위치"],
      ["준비도 열", "지난주와 달라진 행이 있는가", "04_outputs/역량매트릭스.md (주차별 복사본)"],
      ["증거 파일", "링크·숫자·문서로 남은 것이 하나 늘었는가", "03_drafts/ 또는 GitHub"],
      ["내 판단", "AI 지적 중 반박한 것이 있는가", "04_outputs/검토_*.md 하단 메모"],
    ];
    a.table(s, M, 5.15, [1.6, 5.2, 5.13], rows, { rowH: [0.38, 0.38, 0.38, 0.38], size: 11, headSize: 10.5 });
    a.footer(s, SEC7);
    a.notes(s, {
      intent: "4주 계획은 예시이며 순서를 바꿔도 된다고 말한다. 핵심은 '같은 폴더에서 같은 카드로 매주'.",
      time: "1.5분",
      next: "마지막 한 장입니다. 오늘의 문장으로 돌아갑니다.",
    });
  }

  // 42 핵심 철학 + Q&A
  {
    const s = a.slide(true);
    a.text(s, "오늘의 한 문장", M, 1.3, CW, 0.3, { size: 12, bold: true, color: C.accent, cs: 1 });
    a.text(s, "AI가 초안을,\n내가 판단을,\n근거가 결정을.", M, 1.8, CW, 2.7, { size: 46, bold: true, color: C.white, lsm: 1.15 });
    a.text(s, "Humans steer · Agents execute · Evidence decides", M, 4.55, CW, 0.4, { size: 16, color: C.darkMuted });
    const cols = [
      { t: "요청", d: "결과 · 자료 · 형식 · 경계" },
      { t: "검증", d: "확인 완료 · 요약만 · 확인 필요 · 제외" },
      { t: "책임", d: "최종 문장과 제출은 내가" },
    ];
    const cw = (CW - 0.5) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.25);
      a.rect(s, x, 5.2, cw, 0.95, C.darkPanel, { round: 0.08 });
      a.text(s, cols[i].t, x + 0.28, 5.3, cw - 0.56, 0.32, { size: 13, bold: true, color: C.accent });
      a.text(s, cols[i].d, x + 0.28, 5.64, cw - 0.56, 0.4, { size: 12, color: C.white });
    }
    a.rich(s, [
      { text: "질의응답  ", size: 12, bold: true, color: C.accent },
      { text: "도구보다 '만들고 싶은 결과'에서 질문을 시작해 주세요.   ", size: 12.5, color: C.white },
      { text: "business.sjcha@gmail.com  ·  linkedin.com/in/smilechacha  ·  ", size: 11.5, color: C.darkMuted },
      { text: "github.com/smilesjcha/research-agent", size: 11.5, color: C.accentLight, link: REPO_URL },
    ], M, 6.4, CW, 0.4);
    a.footer(s, SEC7);
    a.notes(s, {
      intent: "핵심 철학을 다시 읽고, 세 열(요청·검증·책임)로 강의 전체를 회수한다. 질문은 '원하는 결과'에서 시작하도록 유도한다.",
      time: "1분 + 질의응답",
      next: "감사합니다. 질문 받겠습니다.",
    });
  }
};
