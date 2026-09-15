// Part 1: 시작 + 01 채용 시장 + 02 직무 리서치
const { C, W, H, M, CW, MONO } = require("./lib");
const QRCode = require("qrcode");
const REPO_URL = "https://github.com/smilesjcha/research-agent";
const LECTURE_URL = REPO_URL + "/tree/main/workspace/lecture_20260915";

module.exports = async function part1(pres, a) {
  const SEC0 = "OPENING";
  // ───────────── 01 표지
  {
    const s = a.slide(true);
    a.text(s, "부산대학교 공학커뮤니케이션", M, 0.6, 8, 0.3, { size: 12, bold: true, color: C.accentLight, cs: 1 });
    a.text(s, "AI와 함께 쓰는\n공학 커뮤니케이션", M, 1.75, CW, 2.2, { size: 50, bold: true, color: C.white, lsm: 1.08 });
    a.text(s, "취업을 앞둔 공학도를 위한 직무 리서치 · 기술 문서 · 자기소개의 새로운 방법", M, 4.05, CW, 0.5, { size: 18, color: C.darkMuted });
    a.rect(s, M, 5.35, 2.4, 0.06, C.accent);
    a.text(s, "2026.09.15(화)  ·  부산대학교 공학커뮤니케이션  ·  Claude Code 실습 포함", M, 5.6, CW, 0.3, { size: 13, color: C.white });
    a.rich(s, [
      { text: "차성재", size: 14, bold: true, color: C.white },
      { text: "     무신사 Agentic AI PM  ·  아주대학교 AI대학원 겸임교수", size: 12, color: C.darkMuted },
    ], M, 6.0, CW, 0.35);
    a.rich(s, [
      { text: "강의 자료 · 실습 하네스  ", size: 11, bold: true, color: C.accentLight },
      { text: REPO_URL, size: 11, color: C.white, link: REPO_URL },
    ], M, 6.4, CW, 0.3);
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "제목을 읽고 오늘 강의가 도구 소개가 아니라 '취업 준비에 바로 쓰는 커뮤니케이션 방법'임을 첫 문장으로 밝힌다.",
      time: "1분",
      next: "먼저 제가 왜 이 주제를 이야기하는지 짧게 소개하겠습니다.",
    });
  }

  // ───────────── 02 강사 소개
  {
    const s = a.slide(false);
    a.header(s, "강사 소개", "현재 · 이력 · 연락처", "AI Engineer에서 AI PM으로, 그리고 강의를 함께 진행합니다.");
    const cols = [
      { icon: "FiBriefcase", k: "현재", t: "현업 · 강의", b: "무신사 Agentic AI PM\n아주대학교 AI대학원 겸임교수" },
      { icon: "FiTrendingUp", k: "이력", t: "직무 · 산업 · 기술", b: "AI Engineer → Agentic AI PM\n금융 → 의료 → 교육 → 이커머스\nML → CV → LLM → Agent" },
      { icon: "FiMail", k: "연락처", t: "AI 활용 · 취업 문의", b: "LinkedIn  linkedin.com/in/smilechacha\nEmail  business.sjcha@gmail.com\nPhone  010-9562-9958" },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3);
      await a.card(s, x, 2.35, cw, 3.4, { icon: cols[i].icon, title: cols[i].t, body: cols[i].b, iconBg: i === 2 ? C.accent : C.navy, bodySize: 12.5 });
      a.text(s, cols[i].k, x + 0.28 + 0.65, 2.35 + 0.36, 2, 0.3, { size: 11, bold: true, color: C.accent });
    }
    a.text(s, "취업 준비 과정에서 AI 활용이나 포트폴리오 방향이 궁금하면 언제든 편하게 연락해 주세요.", M, 6.1, CW, 0.4, { size: 14, color: C.muted });
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "이름을 반복하지 않고 현재 활동·이력·연락처를 순서대로 45초 안에 안내한다. 산업과 기술이 계속 바뀌었다는 점에서 '설명 능력'이 이직의 공통 자산이었음을 짚는다.",
      time: "1분",
      next: "그렇다면 AI 시대의 공학도는 코드를 얼마나 잘 써야 할까요? 오늘의 답은 '코드의 양보다 요청·검증·책임'입니다.",
    });
  }

  // ───────────── 03 오늘의 흐름 (타임라인)
  {
    const s = a.slide(false);
    a.header(s, "강의 구성", "50분의 흐름: 세 가지 사례와 한 번의 실습", "각 사례는 '요청 → 결과 → 내 판단'의 같은 순서로 진행합니다. 실습은 여러분의 자료로 합니다.");
    const items = [
      { t: "00–05", k: "시작", d: "오늘 가져갈 것 · 하네스 저장소 · 공감 장면" },
      { t: "05–11", k: "01 채용 시장", d: "기업이 보는 것 · 요청의 네 요소" },
      { t: "11–19", k: "02 직무 리서치", d: "채용공고 · 기술자료 1쪽 정리" },
      { t: "19–27", k: "03 기술 문서", d: "보고서 · 캡스톤 · 비판적 검토" },
      { t: "27–35", k: "04 자기소개", d: "경험 인벤토리 · 자소서 · 면접" },
      { t: "35–46", k: "05 실습", d: "Claude Code 11분 · 카드 A~C" },
      { t: "46–50", k: "06 경계·마무리", d: "지켜야 할 선 · 30일 계획" },
    ];
    const n = items.length, gap = 0.18, bw = (CW - gap * (n - 1)) / n;
    const y = 2.55;
    a.hline(s, M, y + 0.55, CW, C.line, 1);
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap);
      const hot = i === 5;
      a.circle(s, x + bw / 2 - 0.11, y + 0.44, 0.22, hot ? C.accent : C.navy);
      a.text(s, items[i].t, x, y, bw, 0.3, { size: 11, bold: true, color: hot ? C.accent : C.navy, align: "center", font: MONO });
      a.rect(s, x, y + 0.95, bw, 2.0, hot ? C.accentSoft : C.panel, { round: 0.08 });
      a.text(s, items[i].k, x + 0.16, y + 1.15, bw - 0.32, 0.5, { size: 13.5, bold: true, color: hot ? C.accentInk : C.ink, lsm: 1.1 });
      a.text(s, items[i].d, x + 0.16, y + 1.75, bw - 0.32, 1.1, { size: 11, color: C.muted, lsm: 1.3 });
    }
    a.text(s, "실습은 강의 중 소개한 요청문 카드 3장을 그대로 씁니다. 노트북과 Claude Desktop의 Code 탭(Claude Code)을 준비해 주세요.", M, 5.95, CW, 0.4, { size: 13, color: C.muted });
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "시간표를 낭독하지 않고, 사례 세 개가 같은 구조로 반복된다는 점과 실습이 자기 자료로 진행된다는 점만 강조한다.",
      time: "1분",
      next: "먼저 오늘 끝나면 손에 남을 세 가지를 말씀드리겠습니다.",
    });
  }


  // ───────────── 03-1 오늘의 자료 · GitHub 하네스 저장소
  {
    const s = a.slide(false);
    a.header(s, "오늘의 자료", "GitHub 하네스 저장소: 강의를 그대로 따라 할 수 있는 곳", "장표·요청문 카드·실습 프로젝트·실제 실행 기록이 한 저장소에 있습니다. 강의 후 같은 폴더에서 같은 카드로 반복하면 됩니다.");
    // 좌: 링크 패널 + QR
    const lx = M, lw = 4.6;
    a.rect(s, lx, 2.3, lw, 3.6, C.navy, { round: 0.08 });
    a.text(s, "저장소", lx + 0.3, 2.5, 3, 0.28, { size: 10.5, bold: true, color: C.accentLight, cs: 1 });
    a.text(s, "github.com/smilesjcha/research-agent", lx + 0.3, 2.82, lw - 0.6, 0.6, { size: 15, bold: true, color: C.white, lsm: 1.15, link: REPO_URL });
    a.text(s, "workspace/lecture_20260915/", lx + 0.3, 3.45, lw - 0.6, 0.3, { size: 11.5, color: C.darkMuted, font: MONO, link: LECTURE_URL });
    const qr = await QRCode.toDataURL(LECTURE_URL, { margin: 1, width: 512, color: { dark: "#0B1F3A", light: "#FFFFFF" } });
    a.rect(s, lx + 0.3, 3.95, 1.75, 1.75, C.white, { round: 0.06 });
    s.addImage({ data: qr, x: lx + 0.38, y: 4.03, w: 1.59, h: 1.59 });
    a.text(s, "QR로 열기\n강의 폴더 바로가기", lx + 2.25, 4.35, lw - 2.5, 0.9, { size: 11.5, color: C.darkMuted, lsm: 1.35 });
    // 우: 저장소 구성
    const rx = M + 4.9, rw = CW - 4.9;
    const rows = [
      ["폴더", "들어 있는 것", "언제 쓰나"],
      [{ text: "workspace/lecture_20260915/", font: MONO, size: 10.5 }, "PPTX · PDF · 요청문 카드 · 실습 가이드 · 50분 진행안", "강의 중 · 복습"],
      [{ text: "…/practice_kit/my-career/", font: MONO, size: 10.5 }, "실습 프로젝트: 실제 공고 요약 3개(삼성전자 DS · LG에너지솔루션 · 한화에어로스페이스) · 경험정리 · 보고서 · 자소서 · CLAUDE.md", "실습 A·B·C"],
      [{ text: "…/practice_runs/", font: MONO, size: 10.5 }, "오늘 카드 A·B·C를 Claude Code(Fable 5.1 · 높음)로 실제 실행한 기록", "결과 비교"],
      [{ text: "CLAUDE.md · policies/ · commands/", font: MONO, size: 10.5 }, "논문 탐색·작성·심사용 하네스 원본 (규칙 → 명령 → 검증의 구조)", "내 하네스 만들 때"],
    ];
    a.table(s, rx, 2.3, [2.55, 3.35, 1.13], rows, { rowH: [0.42, 0.62, 0.72, 0.62, 0.62], size: 11, firstBold: false });
    a.rect(s, rx, 5.4, rw, 0.5, C.accentSoft, { round: 0.06 });
    a.rich(s, [
      { text: "하네스 엔지니어링  ", size: 11, bold: true, color: C.accentInk },
      { text: "규칙(CLAUDE.md) · 자료 폴더 · 결과 폴더 · 검증 표지를 한 프로젝트에 묶어 두면, 같은 요청을 매주 반복해도 결과의 품질이 유지됩니다.", size: 11, color: C.ink },
    ], rx + 0.2, 5.4, rw - 0.4, 0.5, { valign: "middle" });
    // 하단 3단계
    const steps = ["저장소 내려받기 (Code → Download ZIP 또는 git clone)", "Claude Desktop → Code 탭 → practice_kit/my-career 폴더 열기", "새 세션 · 모델 Fable 5.1 · 노력 높음 → 카드 A 붙여넣기"];
    for (let i = 0; i < 3; i++) {
      const w = (CW - 0.5) / 3, x = M + i * (w + 0.25);
      a.rect(s, x, 6.05, w, 0.6, C.panel, { round: 0.08 });
      a.numBadge(s, i + 1, x + 0.15, 6.17, 0.36, i === 2 ? C.accent : C.navy, C.white, 11);
      a.text(s, steps[i], x + 0.62, 6.05, w - 0.75, 0.6, { size: 10.5, valign: "middle", lsm: 1.25 });
    }
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "링크와 QR을 보여주고 '오늘 강의는 이 저장소 안에서 전부 재현된다'고 말한다. 폴더 네 개의 역할만 짚고, 하네스 엔지니어링을 한 문장으로 정의한다.",
      time: "1분",
      next: "그런데 이 방법은 Claude에만 묶인 것일까요? 한 장만 보고 넘어가겠습니다.",
      sources: REPO_URL,
    });
  }


  // ───────────── 04-1 같은 방법, 다른 도구
  {
    const s = a.slide(false);
    a.header(s, "도구 선택", "같은 방법, 다른 도구: Claude Code · Codex · NotebookLM", "오늘은 Claude Desktop의 Code 탭으로 실습하지만, 방법은 도구에 묶여 있지 않습니다. 규칙 파일 · 자료 폴더 · 결과 파일 · 확인 표지만 있으면 어디서든 같습니다.");
    const cols = [
      { icon: "FiTerminal", vendor: "Claude Desktop", t: "Code 탭 (Claude Code)", tag: "오늘 실습", hot: true,
        rows: [["규칙", "CLAUDE.md"], ["자료", "폴더를 프로젝트로 열기"], ["결과", "04_outputs/ 에 파일로"], ["설정", "Fable 5.1 · 노력 높음"]],
        d: "폴더의 규칙을 세션마다 먼저 읽고, 파일을 읽고 쓰며, 쓰기 전에 승인을 묻습니다." },
      { icon: "FiCommand", vendor: "ChatGPT Desktop", t: "Codex", tag: "같은 환경으로 가능",
        rows: [["규칙", "AGENTS.md"], ["자료", "폴더(작업 공간) 열기"], ["결과", "같은 폴더에 파일로"], ["설정", "모델 · 추론 강도 선택"]],
        d: "동일하게 폴더를 열어 규칙 파일을 읽고 파일 단위로 작업합니다. 요청문 카드는 그대로 씁니다." },
      { icon: "FiBookOpen", vendor: "Google Gemini", t: "NotebookLM", tag: "자료 중심 방식",
        rows: [["규칙", "노트에 지침 저장"], ["자료", "소스로 업로드 (PDF · 문서)"], ["결과", "출처 표시가 붙은 답 · 노트"], ["설정", "소스 범위 선택"]],
        d: "폴더 대신 소스 묶음을 씁니다. 답마다 출처 위치가 붙어 '확인 완료 · 확인 필요' 표지를 붙이기 쉽습니다." },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3), c = cols[i];
      a.rect(s, x, 2.3, cw, 3.7, c.hot ? C.accentSoft : C.white, { round: 0.08, line: c.hot ? C.accentSoft : C.line, shadow: c.hot ? undefined : a.shadow() });
      await a.iconBadge(s, c.icon, x + 0.26, 2.55, 0.5, c.hot ? C.accent : C.navy, C.white);
      a.text(s, c.vendor, x + 0.9, 2.55, cw - 1.1, 0.25, { size: 10.5, bold: true, color: c.hot ? C.accentInk : C.faint, cs: 1 });
      a.text(s, c.t, x + 0.9, 2.8, cw - 1.1, 0.35, { size: 15.5, bold: true, color: c.hot ? C.accentInk : C.ink });
      a.tag(s, c.tag, x + 0.26, 3.28, 1.9, 0.3, c.hot ? C.accent : C.navySoft, c.hot ? C.white : C.navy, 9.5);
      let ry = 3.75;
      for (const [k, v] of c.rows) {
        a.text(s, k, x + 0.26, ry, 0.7, 0.28, { size: 10.5, bold: true, color: C.navy });
        a.text(s, v, x + 0.96, ry, cw - 1.2, 0.28, { size: 11, color: C.ink });
        a.hline(s, x + 0.26, ry + 0.32, cw - 0.52, c.hot ? "CFE3D9" : C.line, 0.5);
        ry += 0.4;
      }
      a.text(s, c.d, x + 0.26, 5.4, cw - 0.52, 0.55, { size: 10.5, color: C.muted, lsm: 1.3 });
    }
    a.rect(s, M, 6.15, CW, 0.55, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "바뀌지 않는 것  ", size: 11.5, bold: true, color: C.accentLight },
      { text: "규칙 파일 · 자료 폴더 · 결과 파일 · 확인 표지. 도구는 바꿔도 이 네 가지가 있으면 오늘의 카드 A·B·C를 그대로 실행할 수 있습니다.", size: 12.5, color: C.white },
    ], M + 0.3, 6.15, CW - 0.6, 0.55, { valign: "middle" });
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "도구 비교가 아니라 '방법이 도구에 묶이지 않는다'는 메시지만 준다. Codex는 AGENTS.md, NotebookLM은 소스 업로드라는 차이 한 가지씩만 짚는다. 각 도구의 메뉴 위치·요금제는 학생이 직접 확인하도록 안내한다.",
      time: "1분",
      next: "먼저 오늘 끝나면 손에 남을 세 가지를 말씀드리겠습니다.",
      sources: "Anthropic Claude Code 문서 https://docs.claude.com/ko/docs/claude-code · OpenAI Codex 문서 https://developers.openai.com/codex · Google NotebookLM 도움말 https://support.google.com/notebooklm — 기능 명칭은 2026-09 기준, 최신 안내 확인 필요",
    });
  }

  // ───────────── 04 오늘 가져갈 것
  {
    const s = a.slide(false);
    a.header(s, "오늘의 약속", "강의가 끝나면 손에 남을 세 가지", "도구 사용법이 아니라, 취업 준비 문서 세 종류를 다루는 '방법'을 가져갑니다.");
    const cards = [
      { icon: "FiSearch", t: "자료를 1쪽으로 정리하는 요청법", b: "채용공고·기술 블로그·논문을 읽고 '확인된 사실 · 확인 필요 · 다음 행동'으로 정리하게 하는 한 가지 요청문." },
      { icon: "FiEdit3", t: "경험을 근거로 쓰는 구조", b: "내 프로젝트를 '문제 · 제약 · 결정 · 결과 · 배움'으로 다시 쓰는 법. 자소서·포트폴리오·면접의 공통 재료가 됩니다." },
      { icon: "FiCheckCircle", t: "AI 초안을 내 글로 만드는 기준", b: "칭찬 대신 틀린 곳부터 찾게 하는 검토 요청과, AI 티 나는 표현을 걷어내는 체크리스트." },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3);
      await a.card(s, x, 2.35, cw, 3.3, { icon: cards[i].icon, title: cards[i].t, body: cards[i].b, iconBg: C.navy, bodySize: 12.5, titleSize: 15 });
      a.text(s, `0${i + 1}`, x + cw - 0.9, 2.35 + 0.3, 0.62, 0.4, { size: 20, bold: true, color: C.accent, align: "right", font: MONO });
    }
    a.rect(s, M, 5.95, CW, 0.7, C.navySoft, { round: 0.08 });
    a.rich(s, [
      { text: "핵심 철학  ", size: 12, bold: true, color: C.accent },
      { text: "AI가 초안을, 내가 판단을, 근거가 결정을.  ", size: 14, bold: true, color: C.navy },
      { text: "Humans steer · Agents execute · Evidence decides", size: 12, color: C.muted },
    ], M + 0.3, 5.95, CW - 0.6, 0.7, { valign: "middle" });
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "세 약속을 읽고 마지막에 핵심 철학 한 문장을 소리 내어 읽는다. 강의 끝에 같은 문장으로 회수한다.",
      time: "1.5분",
      next: "그런데 이 세 가지가 왜 필요할까요? 여러분이 이미 겪어본 장면부터 보겠습니다.",
    });
  }

  // ───────────── 05 공감 장면
  {
    const s = a.slide(false);
    a.header(s, "공감 장면", "기술은 있는데, 설명이 안 되는 네 순간", "공학도가 취업 준비에서 막히는 지점은 대부분 '무엇을 했는가'가 아니라 '어떻게 말하는가'입니다.");
    const items = [
      { icon: "FiFileText", t: "실험보고서 마감 전날", q: "“결과는 나왔는데 고찰에 뭘 써야 하죠?”" },
      { icon: "FiMonitor", t: "캡스톤 발표 5분", q: "“기능은 다 되는데 뭐가 중요한지 못 정하겠어요.”" },
      { icon: "FiUser", t: "자기소개서 800자", q: "“다양한 프로젝트 경험을 통해… 그다음이 안 써져요.”" },
      { icon: "FiMessageCircle", t: "면접 꼬리질문", q: "“그 프로젝트에서 본인이 직접 결정한 건 뭐였나요?”" },
    ];
    const cw = (CW - 0.75) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.25);
      a.rect(s, x, 2.35, cw, 3.15, C.white, { round: 0.08, line: C.line, shadow: a.shadow() });
      await a.iconBadge(s, items[i].icon, x + 0.28, 2.62, 0.5, C.accentSoft, C.accentInk);
      a.text(s, items[i].t, x + 0.28, 3.28, cw - 0.56, 0.4, { size: 14.5, bold: true });
      a.text(s, items[i].q, x + 0.28, 3.78, cw - 0.56, 1.5, { size: 12.5, color: C.muted, italic: true, lsm: 1.35 });
    }
    a.rect(s, M, 5.85, CW, 0.8, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "공통점  ", size: 12, bold: true, color: C.accent },
      { text: "네 장면 모두 '근거가 있는 한 문장'이 없어서 막힙니다. 오늘은 그 문장을 AI와 함께 찾는 방법을 다룹니다.", size: 14, color: C.white },
    ], M + 0.3, 5.85, CW - 0.6, 0.8, { valign: "middle" });
    a.footer(s, SEC0);
    a.notes(s, {
      intent: "네 장면 중 하나를 골라 손을 들게 해 공감을 만든다. '기술 부족'이 아니라 '설명 부족'으로 문제를 재정의한다.",
      time: "2분",
      next: "그럼 기업은 실제로 무엇을 보고 있을까요? 첫 번째 절로 들어갑니다.",
    });
  }

  // ═════════════ 01 채용 시장
  const SEC1 = "1 · 채용 시장이 보는 것";
  {
    const s = a.slide(true);
    a.section(s, "01", "채용 시장이 보는 것", "기술 역량은 입장권이고, 설명 능력이 합격선을 가릅니다.", "AI가 코드와 초안을 대신 쓰는 시대에, 신입 엔지니어에게 남는 역량은 무엇인가?", SEC1);
    a.notes(s, { intent: "절 전환. 질문을 읽고 3초 멈춘다.", time: "0.5분", next: "채용공고에 반복해서 등장하는 표현부터 보겠습니다." });
  }

  // 07 기업이 보는 세 가지
  {
    const s = a.slide(false);
    a.header(s, "채용공고의 공통 언어", "기업이 신입 엔지니어에게 확인하는 세 가지", "직무는 달라도 채용공고와 면접 질문에는 같은 표현이 반복됩니다. 세 가지 모두 '커뮤니케이션'으로 증명됩니다.");
    const cols = [
      { n: 1, t: "문제를 정의하는 힘", b: "무엇이 문제이고 왜 지금 풀어야 하는지 한 문단으로 쓰는 능력.", ex: "“문제 정의” · “요구사항 분석” · “우선순위”" },
      { n: 2, t: "근거로 설명하는 힘", b: "결정의 이유를 데이터·실험·비교로 보여주는 능력. 감이 아니라 숫자.", ex: "“데이터 기반 의사결정” · “실험 설계” · “검증”" },
      { n: 3, t: "함께 일하는 문서의 힘", b: "동료가 읽고 바로 움직일 수 있는 보고서·README·회의록을 남기는 능력.", ex: "“문서화” · “협업” · “코드 리뷰”" },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3);
      await a.card(s, x, 2.35, cw, 3.0, { n: cols[i].n, title: cols[i].t, body: cols[i].b, bodySize: 12.5 });
      a.rect(s, x, 5.45, cw, 0.7, C.white, { round: 0.06, line: C.line });
      a.text(s, "공고 속 표현", x + 0.2, 5.52, 1.2, 0.25, { size: 9.5, bold: true, color: C.accent });
      a.text(s, cols[i].ex, x + 0.2, 5.74, cw - 0.4, 0.35, { size: 11, color: C.muted });
    }
    a.text(s, "면접관은 '무엇을 했는가'보다 '왜 그렇게 결정했고, 어떻게 확인했는가'를 묻습니다. 세 역량 모두 말과 글로만 보여줄 수 있습니다.", M, 6.3, CW, 0.5, { size: 13, color: C.muted });
    a.footer(s, SEC1);
    a.notes(s, {
      intent: "세 역량을 '기술 외 스펙'이 아니라 기술 역량을 증명하는 통로로 설명한다. 공고 표현은 학생들이 실제 공고에서 확인하도록 유도한다.",
      time: "2분",
      next: "이 세 가지가 엔지니어의 하루에서 어디에 나타나는지 보겠습니다.",
    });
  }

  // 08 엔지니어의 하루
  {
    const s = a.slide(false);
    a.header(s, "일의 흐름", "엔지니어의 일은 설명으로 시작해 설명으로 끝난다", "구현은 가운데 한 단계입니다. 앞뒤 네 단계가 모두 읽고 쓰고 말하는 일입니다.");
    const steps = [
      { t: "요구 파악", d: "기획서·이슈·논문 읽기", comm: true, icon: "FiBookOpen" },
      { t: "설계 제안", d: "설계 문서·대안 비교", comm: true, icon: "FiPenTool" },
      { t: "구현·실험", d: "코드·측정·시뮬레이션", comm: false, icon: "FiCpu" },
      { t: "리뷰·검증", d: "PR 설명·실험 노트", comm: true, icon: "FiGitPullRequest" },
      { t: "보고·발표", d: "결과 보고서·발표", comm: true, icon: "FiBarChart2" },
    ];
    const n = 5, gap = 0.5, bw = (CW - gap * (n - 1)) / n, y = 2.55;
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap);
      const st = steps[i];
      a.rect(s, x, y, bw, 2.55, st.comm ? C.navySoft : C.white, { round: 0.08, line: st.comm ? C.navySoft : C.line });
      await a.iconBadge(s, st.icon, x + bw / 2 - 0.3, y + 0.32, 0.6, st.comm ? C.navy : C.panel, st.comm ? C.white : C.navy);
      a.text(s, st.t, x, y + 1.1, bw, 0.4, { size: 15, bold: true, align: "center" });
      a.text(s, st.d, x + 0.15, y + 1.55, bw - 0.3, 0.7, { size: 11.5, color: C.muted, align: "center", lsm: 1.3 });
      if (i < n - 1) a.arrow(s, x + bw + 0.08, y + 0.62, gap - 0.16, C.faint);
    }
    a.text(s, "커뮤니케이션 단계", M, 5.35, 3, 0.3, { size: 10.5, bold: true, color: C.navy });
    a.rect(s, M + 1.55, 5.4, 0.22, 0.18, C.navySoft);
    a.text(s, "기술 실행 단계", M + 2.1, 5.35, 3, 0.3, { size: 10.5, bold: true, color: C.muted });
    a.rect(s, M + 3.35, 5.4, 0.22, 0.18, C.white, { line: C.line });
    a.rect(s, M, 5.85, CW, 0.8, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "AI가 바꾼 것  ", size: 12, bold: true, color: C.accentInk },
      { text: "가운데 단계(구현·실험)의 속도가 빨라질수록, 앞뒤 단계에서 '무엇을 왜 만들지'와 '결과가 맞는지'를 설명하는 사람의 가치가 커집니다.", size: 13.5, color: C.ink },
    ], M + 0.3, 5.85, CW - 0.6, 0.8, { valign: "middle" });
    a.footer(s, SEC1);
    a.notes(s, {
      intent: "다섯 단계 중 네 단계가 커뮤니케이션임을 시각적으로 보여준다. 비율 수치는 제시하지 않고 구조로 설득한다.",
      time: "2분",
      next: "그래서 AI 시대에 남는 것과 사라지는 것을 나눠 보겠습니다.",
    });
  }

  // 09 코드의 양보다 요청·검증·책임 (비교표)
  {
    const s = a.slide(false);
    a.header(s, "전환", "코드의 양보다 요청 · 검증 · 책임", "AI에게 맡길 수 있는 일과 여러분에게 남는 일을 나누면, 무엇을 연습해야 하는지가 분명해집니다.");
    const rows = [
      ["작업", "예전의 방식", "AI와 함께하는 방식", "여러분에게 남는 것"],
      ["자료 조사", "검색 → 스크랩 → 요약 (반나절)", "자료를 넣고 1쪽 정리 요청 (10분)", { text: "무엇을 확인할지 정하고, 확인 필요 항목을 직접 검증", color: C.navy, bold: true }],
      ["초안 작성", "빈 문서 앞에서 첫 문장 고민", "구조와 초안을 먼저 받고 고쳐 쓰기", { text: "내 경험·숫자·결정을 넣고 최종 표현을 책임", color: C.navy, bold: true }],
      ["코드·계산", "예제 검색 후 수정, 디버깅", "설명과 함께 코드 초안 생성", { text: "요구사항 정의, 테스트 케이스, 결과 해석", color: C.navy, bold: true }],
      ["검토", "친구·선배에게 부탁 (기약 없음)", "비판적 검토를 즉시 요청", { text: "지적을 받아들일지 판단하고 근거로 반박", color: C.navy, bold: true }],
    ];
    a.table(s, M, 2.35, [1.6, 3.1, 3.4, 3.83], rows, { rowH: [0.45, 0.62, 0.62, 0.62, 0.62], size: 12 });
    a.rect(s, M, 5.75, CW, 0.85, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "결론  ", size: 12, bold: true, color: C.accent },
      { text: "연습해야 할 것은 '요청을 정확히 쓰는 법', '결과를 검증하는 법', '최종본에 책임지는 법'입니다. 이 세 가지가 공학 커뮤니케이션입니다.", size: 14, color: C.white },
    ], M + 0.3, 5.75, CW - 0.6, 0.85, { valign: "middle" });
    a.footer(s, SEC1);
    a.notes(s, {
      intent: "표의 마지막 열만 강조해서 읽는다. AI가 대체하는 열이 아니라 남는 열이 오늘의 커리큘럼임을 밝힌다.",
      time: "2분",
      next: "그럼 요청은 어떻게 써야 정확할까요? 네 가지 요소만 기억하면 됩니다.",
    });
  }

  // 10 요청의 네 요소
  {
    const s = a.slide(false);
    a.header(s, "요청의 구조", "좋은 요청의 네 요소: 결과 · 자료 · 형식 · 경계", "“잘 정리해줘”가 아니라, 네 요소를 채우면 첫 결과부터 쓸 만해집니다.");
    const items = [
      { icon: "FiTarget", t: "결과", d: "무엇이 나오면 끝인가", ex: "채용공고 3개의 요구 역량을 비교한 표 1개" },
      { icon: "FiFolder", t: "자료", d: "무엇을 읽고 답할 것인가", ex: "첨부한 공고 PDF 3개와 내 경험 정리 파일" },
      { icon: "FiLayout", t: "형식", d: "어떤 모양으로 줄 것인가", ex: "역량 × 회사 표 + 준비도 3단계, 1쪽 이내" },
      { icon: "FiShield", t: "경계", d: "하지 말아야 할 것", ex: "공고에 없는 역량을 추측하지 말고 '확인 필요'로 표시" },
    ];
    const cw = (CW - 0.75) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.25);
      a.rect(s, x, 2.35, cw, 2.75, C.panel, { round: 0.08 });
      await a.iconBadge(s, items[i].icon, x + 0.26, 2.6, 0.5, C.navy, C.white);
      a.text(s, items[i].t, x + 0.9, 2.66, cw - 1.1, 0.4, { size: 18, bold: true });
      a.text(s, items[i].d, x + 0.26, 3.3, cw - 0.52, 0.4, { size: 12.5, bold: true, color: C.navy });
      a.text(s, items[i].ex, x + 0.26, 3.75, cw - 0.52, 1.2, { size: 11.5, color: C.muted, lsm: 1.35 });
    }
    a.promptCard(s, M, 5.3, CW, 1.35, {
      label: "네 요소를 채운 요청문 예시",
      lines: [
        { text: "첨부한 채용공고 3개(자료)를 읽고 요구 역량을 회사별로 비교한 표(결과)를 만들어줘. 역량 × 회사 표에 내 준비도를 상·중·하로 붙이고 1쪽 이내로(형식). 공고에 명시되지 않은 역량은 추측하지 말고 '확인 필요'로 표시해줘(경계)." },
      ],
    });
    a.footer(s, SEC1);
    a.notes(s, {
      intent: "네 요소를 읽고 예시 요청문에서 괄호를 짚어 준다. 학생이 자기 요청문에 괄호 네 개를 붙여 보게 한다.",
      time: "2.5분",
      next: "이 요청을 어디서 어떻게 실행할지, 오늘 쓸 도구를 한 장으로 보겠습니다.",
    });
  }

  // 11 Claude Desktop 한눈에
  {
    const s = a.slide(false);
    a.header(s, "도구 소개", "Claude Desktop 한눈에: 대화 · 프로젝트 · Code · 아티팩트", "오늘 실습은 Code 탭(Claude Code)으로 내 폴더를 열어, 자료를 읽고 결과 파일을 같은 폴더에 남기는 방식으로 진행합니다.");
    const tiles = [
      { icon: "FiMessageSquare", t: "대화", d: "생각을 다듬을 때. 질문을 던지고 답을 보며 요청을 고친다.", when: "아이디어 정리 · 표현 고치기" },
      { icon: "FiLayers", t: "프로젝트", d: "자료와 지침을 묶어 두는 공간. 자소서·포트폴리오처럼 반복 작업에 적합.", when: "취업 준비 자료 모음" },
      { icon: "FiTerminal", t: "Code (Claude Code)", d: "내 폴더를 프로젝트로 열고, CLAUDE.md 규칙 아래 파일을 읽고 결과를 파일로 저장한다.", when: "오늘 실습의 중심", hot: true },
      { icon: "FiFileText", t: "아티팩트", d: "표·문서·간단한 웹 화면을 결과물로 만들어 바로 확인한다.", when: "표 · 1쪽 문서 · 시안" },
    ];
    const cw = (CW - 0.75) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.25);
      const t = tiles[i];
      a.rect(s, x, 2.35, cw, 3.05, t.hot ? C.accentSoft : C.white, { round: 0.08, line: t.hot ? C.accentSoft : C.line, shadow: t.hot ? undefined : a.shadow() });
      await a.iconBadge(s, t.icon, x + 0.26, 2.6, 0.5, t.hot ? C.accent : C.navy, C.white);
      a.text(s, t.t, x + 0.26, 3.25, cw - 0.52, 0.4, { size: 15, bold: true, color: t.hot ? C.accentInk : C.ink });
      a.text(s, t.d, x + 0.26, 3.7, cw - 0.52, 1.1, { size: 11.5, color: C.muted, lsm: 1.35 });
      a.tag(s, t.when, x + 0.26, 4.85, cw - 0.52, 0.34, t.hot ? C.accent : C.navySoft, t.hot ? C.white : C.navy, 10);
    }
    const steps = ["폴더 만들기  my-career/ (CLAUDE.md 포함)", "Code 탭 → 폴더 열기 → 새 세션 (Fable 5.1 · 높음)", "요청문 카드 붙여넣기 → 04_outputs 확인"];
    for (let i = 0; i < 3; i++) {
      const x = M + i * ((CW - 0.5) / 3 + 0.25);
      const w = (CW - 0.5) / 3;
      a.numBadge(s, i + 1, x, 5.72, 0.36, C.navy, C.white, 11);
      a.text(s, steps[i], x + 0.48, 5.72, w - 0.95, 0.36, { size: 12, valign: "middle" });
      if (i < 2) a.arrow(s, x + w - 0.32, 5.9, 0.3, C.faint);
    }
    a.text(s, "실습 준비 3단계는 5절에서 다시 안내합니다.", M, 6.25, CW, 0.3, { size: 11, color: C.faint });
    a.footer(s, SEC1);
    a.notes(s, {
      intent: "네 기능의 역할 차이만 설명한다. 메뉴 위치는 실습에서 화면으로 보여준다. Code 탭이 '폴더의 규칙(CLAUDE.md)을 읽고, 파일을 읽고, 파일로 남긴다'는 점을 강조한다.",
      time: "2분",
      next: "이제 첫 번째 사례, 채용공고를 읽는 법입니다.",
      sources: "Anthropic 도움말 센터 https://support.claude.com (Claude Desktop · Claude Code · 프로젝트 안내)",
    });
  }

  // ═════════════ 02 직무 리서치
  const SEC2 = "2 · 직무 리서치";
  {
    const s = a.slide(true);
    a.section(s, "02", "직무 리서치: 채용공고를 읽는 법", "공고 열 개를 훑는 대신, 세 개를 제대로 읽고 준비 계획으로 바꿉니다.", "내가 지원할 직무가 실제로 요구하는 역량은 무엇이고, 나는 어디까지 준비되어 있는가?", SEC2);
    a.notes(s, { intent: "절 전환.", time: "0.5분", next: "먼저 결과물부터 보겠습니다. 요구 역량 매트릭스입니다." });
  }

  // 13 요구 역량 매트릭스 (실제 공고 기반: 삼성전자 DS · LG에너지솔루션 · 한화에어로스페이스)
  {
    const s = a.slide(false);
    a.header(s, "사례 1 · 결과물", "채용공고 3개 → 요구 역량 매트릭스", "화공·화학·소재·재료 전공이 실제로 지원하는 세 직무의 공식 직무소개를 역량 단위로 쪼개고, 회사별 요구 강도와 내 준비도를 한 표에 둡니다.");
    const F = (t, lvl) => ({ text: t, align: "center", bold: true, color: lvl === 2 ? C.navy : lvl === 1 ? C.teal : C.faint, size: 11.5 });
    const R = (t, lvl) => ({ text: t, align: "center", bold: true, color: lvl === "상" ? C.green : lvl === "중" ? C.amber : lvl === "하" ? C.red : C.amber, fill: lvl === "상" ? C.greenSoft : lvl === "중" ? C.amberSoft : lvl === "하" ? C.redSoft : C.amberSoft, size: 11 });
    const rows = [
      ["요구 역량", { text: "삼성전자 DS · 반도체공정기술 (링크)", link: "https://www.samsung-dsrecruit.com/recruits/job_intro/memory/semiProcess_tech.php" }, { text: "LG에너지솔루션 · 소재/Cell 개발 (링크)", link: "https://www.lgensol.com/kr/career-guide-job-tab1" }, { text: "한화에어로스페이스 · 추진제 개발(화공) (링크)", link: "https://hanwhaaerospace-recruit.com/jdebook/index.html" }, "내 준비도", "근거 (내 경험)"],
      ["화공·재료 전공 지식 (고분자 · 반응공학 · 상변태)", F("추천 전공", 2), F("필수", 2), F("필수", 2), R("중", "중"), "전공 수업 이수, 고분자 합성 실습 없음"],
      ["실험 설계 · 시험평가 · 규격화", F("필수", 2), F("필수", 2), F("필수", 2), R("상", "상"), "공정 실습 수율 실험 3회 반복, 대조군 비교"],
      ["소재 특성 · 기기 분석 (SEM · XRD · 열분석)", F("필수", 2), F("필수", 2), F("필수", 2), R("중", "중"), "분석 실습 1회, 결과 해석은 조교 의존"],
      ["데이터 · 통계 분석 (Python · 머신러닝)", F("필수 + 우대", 2), F("언급 없음*", 0), F("필수", 2), R("중", "중"), "측정 자동화 스크립트, 통계 검정 경험 없음"],
      ["공정 개선 · 양산 Trouble shooting", F("필수", 2), F("필수", 2), F("필수", 2), R("하", "하"), "양산·현장 경험 없음"],
      ["논문 · 특허 · 프로젝트 증거", F("우대", 1), F("언급 없음", 0), F("우대", 1), R("확인 필요", "확인 필요"), "학회 스터디 발표 6회, 공개 산출물 없음"],
    ];
    a.table(s, M, 2.25, [2.55, 1.85, 1.9, 2.0, 1.05, 2.58], rows, { rowH: [0.5, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46], size: 10.5, headSize: 10.5 });
    a.rect(s, M, 5.55, CW, 0.78, C.panel, { round: 0.08 });
    a.rich(s, [
      { text: "읽는 법  ", size: 11.5, bold: true, color: C.accent },
      { text: "세 회사 모두 '필수'인데 준비도가 '하'인 행(공정 개선 · 양산)이 첫 빈칸입니다. 다만 신입에게 양산 경험 자체를 요구하는지는 공고마다 다르므로, 실습에서는 '필수'로 단정하지 말고 원문 위치를 붙여 다시 판정합니다. ", size: 12, color: C.ink },
      { text: "근거 열은 예시이며 실습에서 본인 경험정리.md로 다시 채웁니다.", size: 11, color: C.muted },
    ], M + 0.3, 5.55, CW - 0.6, 0.78, { valign: "middle" });
    a.rich(s, [
      { text: "출처(2026-09-15 확인, 열 제목 클릭): ", size: 9, color: C.faint },
      { text: "삼성전자 DS 직무소개 「반도체공정기술」", size: 9, color: C.navy, link: "https://www.samsung-dsrecruit.com/recruits/job_intro/memory/semiProcess_tech.php" },
      { text: " · ", size: 9, color: C.faint },
      { text: "LG에너지솔루션 직무소개 「R&D 소재/Cell 개발」", size: 9, color: C.navy, link: "https://www.lgensol.com/kr/career-guide-job-tab1" },
      { text: " · ", size: 9, color: C.faint },
      { text: "한화에어로스페이스 2026 하반기 JD e-Book 「PGM사업부 제조/생산기술_화학공학/화학(대전)」", size: 9, color: C.navy, link: "https://hanwhaaerospace-recruit.com/jdebook/index.html" },
      { text: ".  필수·우대 판정은 직무소개 문장을 강사가 요약한 것이며, 자격 요건은 각 회차 채용공고 원문 확인 필요.  * LG에너지솔루션은 DX 직무에서 별도로 요구.", size: 9, color: C.faint },
    ], M, 6.38, CW, 0.5, { lsm: 1.25 });
    a.footer(s, SEC2);
    a.notes(s, {
      intent: "표를 읽는 순서를 알려준다: 필수 열이 많은 행 → 준비도가 낮은 행 → 근거 열. 세 직무가 실제 공식 직무소개에서 왔다는 점과, 그래도 '필수·우대' 판정은 강사의 요약이라 원문 확인 필요라는 점을 함께 말한다. 한화 e-Book은 화공 전공 직무가 사업부별로 여러 개 있으니 QR로 직접 보게 한다.",
      time: "2.5분",
      next: "공고뿐 아니라 기업 기술 블로그·논문도 같은 방식으로 1쪽에 정리할 수 있습니다.",
      sources: "https://www.samsung-dsrecruit.com/recruits/job_intro/memory/semiProcess_tech.php · https://www.lgensol.com/kr/career-guide-job-tab1 · https://hanwhaaerospace-recruit.com/jdebook/index.html",
    });
  }

  // 14 기술 자료 1쪽 정리
  {
    const s = a.slide(false);
    a.header(s, "사례 1 · 핵심 요청", "기술 자료 한 편을 '사실 · 확인 필요 · 다음 행동'으로", "면접 전 지원 기업의 기술 블로그를 읽을 때 가장 먼저 써볼 요청입니다. 요약이 아니라 판단 재료를 만듭니다.");
    const cols = [
      { t: "확인된 사실", c: C.green, soft: C.greenSoft, icon: "FiCheck", items: ["원문에 명시된 내용만", "출처 위치(절·페이지) 함께", "숫자는 단위·조건 포함"], ex: "예) 해당 팀은 2025년부터 배터리 셀 불량 검출에 비전 모델을 도입함 (블로그 2절)" },
      { t: "확인 필요", c: C.amber, soft: C.amberSoft, icon: "FiHelpCircle", items: ["원문이 암시만 한 내용", "다른 자료와 충돌하는 내용", "AI가 추정한 내용"], ex: "예) 모델 정확도 수치가 본문에 없음 → 채용 설명회에서 질문" },
      { t: "다음 행동", c: C.navy, soft: C.navySoft, icon: "FiArrowRightCircle", items: ["내가 할 일 3개 이내", "기한과 결과물 명시", "자소서·면접 연결점"], ex: "예) 이 주제로 자소서 지원동기 1문단 초안 → 금요일까지" },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3), col = cols[i];
      a.rect(s, x, 2.35, cw, 3.65, col.soft, { round: 0.08 });
      await a.iconBadge(s, col.icon, x + 0.28, 2.6, 0.48, col.c, C.white);
      a.text(s, col.t, x + 0.9, 2.64, cw - 1.1, 0.4, { size: 17, bold: true, color: col.c });
      a.rich(s, col.items.map((it, k) => ({ text: it, size: 12.5, color: C.ink, bullet: { indent: 12 }, br: k < 2, psa: 4 })), x + 0.28, 3.25, cw - 0.56, 1.2);
      a.hline(s, x + 0.28, 4.55, cw - 0.56, col.c, 0.5);
      a.text(s, col.ex, x + 0.28, 4.7, cw - 0.56, 1.2, { size: 11.5, color: C.muted, italic: true, lsm: 1.35 });
    }
    a.text(s, "요청문 한 줄:  “첨부한 글을 읽고 확인된 사실 · 확인 필요 · 다음 행동 세 칸으로 1쪽에 정리해줘. 각 사실에는 원문 위치를 붙이고, 모르면 확인 필요로 남겨줘.”", M, 6.2, CW, 0.5, { size: 12.5, color: C.navy, bold: true });
    a.footer(s, SEC2);
    a.notes(s, {
      intent: "세 칸의 기준을 읽는다. '확인 필요' 칸이 비어 있으면 오히려 의심하라고 말한다.",
      time: "2.5분",
      next: "그런데 '확인됨'의 정도가 다 같지 않습니다. 네 가지 표지로 나눕니다.",
    });
  }

  // 15 확인 상태 네 가지 (표)
  {
    const s = a.slide(false);
    a.header(s, "검증 상태", "결과에 붙이는 네 가지 확인 표지", "모든 내용을 같은 확신으로 말하지 않으면, 어디를 더 읽어야 하는지 바로 보입니다. 자소서 숫자에도 같은 표지를 씁니다.");
    const P = (t, c, soft) => ({ text: t, bold: true, color: c, fill: soft, align: "center", size: 11.5 });
    const rows = [
      ["표지", "뜻", "취업 준비에서의 예", "다음 행동"],
      [P("확인 완료", C.green, C.greenSoft), "원문 위치와 내용이 직접 연결됨", "공고에 '통계 분석 필수'가 명시됨 (자격요건 2항)", "그대로 인용 · 자소서 근거로 사용"],
      [P("요약만 확인", C.teal, C.tealSoft), "AI 요약은 봤지만 원문은 아직", "기술 블로그 요약에서 '비전 모델 도입' 언급", "핵심 인용 전 원문 1회 확인"],
      [P("확인 필요", C.amber, C.amberSoft), "정보가 부족하거나 자료 간 충돌", "면접 후기에 '코딩 테스트 있음' vs 공고에 없음", "설명회·인사팀 문의 목록에 추가"],
      [P("제외", C.faint, C.panel), "이번 범위 밖, 이유를 남김", "3년차 이상 요구하는 공고", "제외 이유 기록 → 같은 검토 반복 방지"],
    ];
    a.table(s, M, 2.35, [1.55, 3.0, 4.3, 3.08], rows, { rowH: [0.45, 0.62, 0.62, 0.62, 0.62], size: 12, firstBold: false });
    a.rect(s, M, 5.75, CW, 0.85, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "원칙  ", size: 12, bold: true, color: C.accent },
      { text: "모르는 내용을 그럴듯하게 채우지 않고 '확인 필요'로 남기는 것이, 면접장에서 여러분을 지키는 습관입니다.", size: 14, color: C.white },
    ], M + 0.3, 5.75, CW - 0.6, 0.85, { valign: "middle" });
    a.footer(s, SEC2);
    a.notes(s, {
      intent: "네 표지를 자소서 숫자에 적용하는 예를 하나 말한다: '정확도 95%'가 확인 완료인지 기억인지.",
      time: "2분",
      next: "실제 요청문을 Claude Desktop 화면 형태로 보겠습니다.",
    });
  }

  // 16 요청문 카드 (직무 리서치)
  {
    const s = a.slide(false);
    a.header(s, "사례 1 · 요청문 카드", "직무 리서치 요청문: 그대로 붙여 넣어 쓰는 첫 번째 카드", "왼쪽은 실습에서 쓸 요청문, 오른쪽은 첫 결과를 받은 뒤 고쳐 말하는 후속 요청입니다.");
    a.promptCard(s, M, 2.3, 6.6, 4.3, {
      label: "카드 A · 첫 요청 (Claude Code, my-career 폴더를 프로젝트로 열기)",
      lines: [
        { text: "01_jd 폴더의 채용공고 3개와 02_experience/경험정리.md를 읽고,", },
        { text: "① 요구 역량 × 회사 표를 만들어줘. 각 칸은 필수 / 우대 / 언급 없음 중 하나로." },
        { text: "② 내 준비도 열을 상·중·하로 채우고, 근거 열에는 경험정리.md의 어느 항목을 근거로 했는지 적어줘." },
        { text: "③ 공고에 명시되지 않은 역량은 추측하지 말고 '확인 필요'로 표시해줘." },
        { text: "결과는 04_outputs/역량매트릭스.md 로 저장하고, 표 아래에 '가장 먼저 채울 빈칸 1개'를 이유와 함께 써줘.", bold: true, color: C.navy },
      ],
    });
    const x2 = M + 6.9, w2 = CW - 6.9;
    a.rect(s, x2, 2.3, w2, 4.3, C.panel, { round: 0.08 });
    a.text(s, "후속 요청 · 결과를 보며 한 가지씩", x2 + 0.28, 2.5, w2 - 0.56, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    const follow = [
      ["결과가 너무 길 때", "“표만 남기고 설명은 각 행 한 줄로 줄여줘.”"],
      ["근거가 약할 때", "“준비도 '상'으로 표시한 행마다 경험정리.md의 원문을 인용해줘. 인용할 수 없으면 '중'으로 내려줘.”"],
      ["다음이 안 보일 때", "“'하'인 역량 하나를 골라 4주 안에 증거를 만들 계획을 주차별로 써줘.”"],
      ["검토를 받고 싶을 때", "“이 표를 채용 담당자 관점에서 보고, 근거가 부족해 보이는 칸 3개를 지적해줘.”"],
    ];
    let fy = 2.9;
    for (const [k, v] of follow) {
      a.text(s, k, x2 + 0.28, fy, w2 - 0.56, 0.25, { size: 11.5, bold: true, color: C.navy });
      a.text(s, v, x2 + 0.28, fy + 0.27, w2 - 0.56, 0.6, { size: 11, color: C.muted, lsm: 1.3 });
      fy += 0.9;
    }
    a.footer(s, SEC2);
    a.notes(s, {
      intent: "요청문에서 결과·자료·형식·경계가 어디에 있는지 짚는다. 후속 요청은 '고쳐 말하기'가 실력임을 강조한다.",
      time: "2.5분",
      next: "이 표가 준비 계획으로 어떻게 바뀌는지 마지막으로 보겠습니다.",
    });
  }

  // 17 준비 계획 표
  {
    const s = a.slide(false);
    a.header(s, "사례 1 · 다음 행동", "빈칸을 증거로 바꾸는 30일 준비 계획", "'하'인 역량 하나를 골라, 4주 안에 자소서에 쓸 수 있는 증거(파일·숫자·링크)를 만드는 계획입니다.");
    const rows = [
      ["주차", "목표", "만들 증거", "AI에게 맡길 것", "내가 확인할 것"],
      ["1주", "기술 문서 기준 익히기", "지원 기업 기술 블로그 2편 1쪽 정리", "사실·확인 필요·다음 행동 정리", "원문 위치 대조, 확인 필요 항목 해소"],
      ["2주", "내 프로젝트 보고서 재작성", "캡스톤 보고서 결론 먼저 구조로 개정본", "구조 제안, 비판적 검토", "숫자·조건·한계 문장은 직접 작성"],
      ["3주", "공개 가능한 산출물", "GitHub README 1개 (문제·역할·결과·한계)", "README 초안, 용어 일관성 점검", "내 역할과 결정이 사실인지"],
      ["4주", "자소서 연결", "'기술 문서·보고' 역량 문단 400자", "예상 질문 10개, 표현 중복 점검", "최종 문장과 제출 책임"],
    ];
    a.table(s, M, 2.35, [0.8, 2.3, 3.3, 2.8, 2.73], rows, { rowH: [0.45, 0.62, 0.62, 0.62, 0.62], size: 11.5 });
    const kp = [
      { icon: "FiFlag", t: "한 번에 하나", d: "역량 하나, 증거 하나. 넓게 시작하면 4주 뒤 남는 파일이 없습니다." },
      { icon: "FiPaperclip", t: "증거는 파일로", d: "'했다'가 아니라 링크·숫자·문서로 남깁니다. 면접에서 꺼낼 수 있어야 합니다." },
      { icon: "FiRefreshCw", t: "매주 표를 갱신", d: "준비도 열을 매주 다시 채우면, 자소서 마감 때 근거 열이 완성돼 있습니다." },
    ];
    const cw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3);
      a.rect(s, x, 5.55, cw, 1.1, C.panel, { round: 0.08 });
      await a.iconBadge(s, kp[i].icon, x + 0.22, 5.75, 0.42, C.accent, C.white);
      a.text(s, kp[i].t, x + 0.78, 5.68, cw - 1.0, 0.3, { size: 12.5, bold: true });
      a.text(s, kp[i].d, x + 0.78, 5.98, cw - 1.0, 0.65, { size: 10.5, color: C.muted, lsm: 1.3 });
    }
    a.footer(s, SEC2);
    a.notes(s, {
      intent: "표의 마지막 두 열(맡길 것 / 확인할 것)의 구분을 강조한다. 계획은 예시이며 학생이 실습 후 자기 표로 대체한다.",
      time: "2분",
      next: "두 번째 사례는 여러분이 가장 자주 쓰는 문서, 실험보고서와 캡스톤 문서입니다.",
    });
  }
};
