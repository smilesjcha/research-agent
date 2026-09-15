// Part 2: 03 기술 문서 + 04 자기소개
const { C, W, H, M, CW, MONO } = require("./lib");

module.exports = async function part2(pres, a) {
  const SEC3 = "3 · 기술 문서";
  {
    const s = a.slide(true);
    a.section(s, "03", "기술 문서: 읽히는 보고서", "잘한 실험도 읽히지 않으면 평가받지 못합니다. 결론을 먼저 쓰고, 근거를 사슬로 잇습니다.", "실험보고서·캡스톤 문서·발표 자료를 채용 담당자가 읽어도 통하는 문서로 바꾸려면?", SEC3);
    a.notes(s, { intent: "절 전환.", time: "0.5분", next: "읽히는 보고서의 구조는 한 가지입니다. 결론이 먼저 옵니다." });
  }

  // 19 결론 먼저 구조
  {
    const s = a.slide(false);
    a.header(s, "문서 구조", "읽히는 보고서의 순서: 결론 → 근거 → 방법 → 한계 → 다음", "학교 보고서는 서론부터, 현업 문서는 결론부터 읽습니다. 순서만 바꿔도 같은 실험이 다르게 평가됩니다.");
    const steps = [
      { t: "결론", d: "한 문장. 무엇이 얼마나 좋아졌는가", ex: "80°C 조건에서 수율 12%p 향상", w: 1.0 },
      { t: "근거", d: "결론을 지지하는 숫자·그래프 2~3개", ex: "n=3, 평균 ±2%p, 대조군 대비", w: 0.85 },
      { t: "방법", d: "재현 가능한 조건과 절차", ex: "장비·재료·측정 간격·코드 링크", w: 0.7 },
      { t: "한계", d: "이 결론이 성립하지 않는 조건", ex: "온도 90°C 이상 미측정", w: 0.55 },
      { t: "다음", d: "누가 무엇을 언제까지", ex: "90°C 추가 실험 → 10/2", w: 0.4 },
    ];
    const n = 5, gap = 0.22, bw = (CW - gap * (n - 1)) / n, y = 2.65;
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap), st = steps[i];
      const barH = 0.5 + st.w * 1.1;
      a.rect(s, x, y + 1.7 - barH, bw, barH, i === 0 ? C.navy : C.navySoft, { round: 0.06 });
      a.text(s, st.t, x, y + 1.7 - barH, bw, barH, { size: 17, bold: true, color: i === 0 ? C.white : C.navy, align: "center", valign: "middle" });
      a.text(s, st.d, x + 0.1, y + 1.9, bw - 0.2, 0.8, { size: 11.5, color: C.ink, align: "center", lsm: 1.3 });
      a.text(s, st.ex, x + 0.1, y + 2.75, bw - 0.2, 0.7, { size: 10.5, color: C.muted, align: "center", italic: true, lsm: 1.3 });
    }
    a.text(s, "독자의 관심 · 읽는 순서", M, 2.3, 4, 0.3, { size: 10.5, bold: true, color: C.faint });
    a.arrow(s, M + 2.05, 2.44, 3.0, C.faint);
    a.rect(s, M, 5.95, CW, 0.7, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "요청문  ", size: 12, bold: true, color: C.accentInk },
      { text: "“첨부한 보고서를 결론 → 근거 → 방법 → 한계 → 다음 순서로 재구성해줘. 결론은 한 문장, 숫자는 원문에 있는 것만 쓰고 없으면 [확인 필요]로 남겨줘.”", size: 13, color: C.ink },
    ], M + 0.3, 5.95, CW - 0.6, 0.7, { valign: "middle" });
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "막대 높이가 독자의 관심도임을 설명한다. 결론 한 문장을 못 쓰면 실험이 아직 끝나지 않은 것이라고 말한다.",
      time: "2분",
      next: "같은 결과를 두 가지 문장으로 써 보면 차이가 보입니다.",
    });
  }

  // 20 Before / After
  {
    const s = a.slide(false);
    a.header(s, "표현의 전환", "같은 실험, 다른 문장: 조건 · 숫자 · 비교", "왼쪽은 학생 보고서에서 자주 보는 문장, 오른쪽은 채용 담당자가 읽고 싶은 문장입니다. 조건·숫자·비교가 들어가면 근거가 됩니다.");
    const cw = (CW - 0.4) / 2;
    const L = M, R = M + cw + 0.4;
    a.rect(s, L, 2.35, cw, 3.4, C.panel, { round: 0.08 });
    a.rect(s, R, 2.35, cw, 3.4, C.white, { round: 0.08, line: C.line, shadow: a.shadow() });
    a.tag(s, "BEFORE", L + 0.28, 2.6, 1.1, 0.32, C.faint, C.white, 10);
    a.tag(s, "AFTER", R + 0.28, 2.6, 1.1, 0.32, C.navy, C.white, 10);
    const before = [
      "“다양한 조건에서 실험을 진행하였다.”",
      "“결과가 전반적으로 잘 나왔다.”",
      "“향후 추가 연구가 필요할 것으로 보인다.”",
      "“팀원들과 협력하여 문제를 해결하였다.”",
    ];
    const after = [
      "“온도 60·70·80°C, 압력 고정, 각 조건 3회 반복 측정했다.”",
      "“80°C에서 수율 71%로 대조군(59%) 대비 12%p 높았다(±2%p).”",
      "“90°C 이상은 미측정이며, 장비 한계로 10월 2일 추가 실험 예정.”",
      "“측정 자동화 스크립트를 내가 작성해 반복당 40분 → 8분으로 줄였다.”",
    ];
    let y = 3.1;
    for (let i = 0; i < 4; i++) {
      a.text(s, before[i], L + 0.28, y, cw - 0.56, 0.55, { size: 12, color: C.muted, italic: true, valign: "middle" });
      a.text(s, after[i], R + 0.28, y, cw - 0.56, 0.55, { size: 11.5, color: C.ink, bold: true, valign: "middle", lsm: 1.25 });
      if (i < 3) { a.hline(s, L + 0.28, y + 0.6, cw - 0.56, C.line, 0.5); a.hline(s, R + 0.28, y + 0.6, cw - 0.56, C.line, 0.5); }
      y += 0.66;
    }
    const chips = ["조건이 있는가", "숫자와 단위가 있는가", "비교 대상이 있는가", "내 결정·행동이 보이는가"];
    const cwid = (CW - 0.6) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cwid + 0.2);
      a.rect(s, x, 5.95, cwid, 0.7, C.navySoft, { round: 0.08 });
      a.numBadge(s, i + 1, x + 0.18, 5.95 + 0.18, 0.34, C.navy, C.white, 11);
      a.text(s, chips[i], x + 0.62, 5.95, cwid - 0.75, 0.7, { size: 12.5, bold: true, color: C.navy, valign: "middle" });
    }
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "네 문장 쌍을 읽고 아래 네 질문으로 회수한다. AI에게 '이 네 질문 기준으로 내 문장을 지적해 달라'고 요청하는 예를 든다.",
      time: "2.5분",
      next: "캡스톤이나 공모전처럼 아직 만들기 전 단계라면, 1쪽 기획서가 먼저입니다.",
    });
  }

  // 21 캡스톤 1쪽 기획서
  {
    const s = a.slide(false);
    a.header(s, "기획 문서", "캡스톤 1쪽 기획서의 네 칸", "기능 목록 대신 네 칸을 채우면, 팀원과 교수·심사위원이 같은 그림을 봅니다. 면접에서 '왜 그걸 만들었나'의 답이 됩니다.");
    const cells = [
      { icon: "FiAlertCircle", t: "문제", d: "누가, 언제, 무엇 때문에 불편한가. 우리가 관찰한 장면 하나.", ex: "학과 실험실 아세톤 폐용매가 주 20L 배출되고, 기존 증류기 회수율은 40%에 그침 (관찰 2주)" },
      { icon: "FiZap", t: "작은 예상", d: "가장 작은 버전이 성공하면 무엇이 달라지는가.", ex: "환류비·가열 온도 두 조건만 바꿔도 회수율 60% 이상이면 폐용매 처리량이 절반 이하로 줄 것" },
      { icon: "FiXCircle", t: "하지 않을 일", d: "이번 학기에 의도적으로 뺀 기능과 이유.", ex: "새 장치 제작 · 자동 제어 · 혼합 용매(아세톤+에탄올)는 제외 — 검증 전 확장 금지" },
      { icon: "FiActivity", t: "확인할 변화", d: "성공을 무엇으로 측정할 것인가. 숫자와 기간.", ex: "4주 운용 후 회수율(GC 순도 포함) · 주당 폐용매 배출량 · 안전 사고 0건" },
    ];
    const cw = (CW - 0.3) / 2, ch = 1.75;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.3), y = 2.35 + Math.floor(i / 2) * (ch + 0.25);
      const c = cells[i];
      a.rect(s, x, y, cw, ch, C.panel, { round: 0.08 });
      await a.iconBadge(s, c.icon, x + 0.26, y + 0.26, 0.48, C.navy, C.white);
      a.text(s, c.t, x + 0.88, y + 0.28, 3, 0.4, { size: 16, bold: true });
      a.text(s, c.d, x + 0.88, y + 0.68, cw - 1.1, 0.5, { size: 11.5, color: C.muted, lsm: 1.3 });
      a.rect(s, x + 0.26, y + 1.15, cw - 0.52, 0.45, C.white, { round: 0.05 });
      a.text(s, "예)  " + c.ex, x + 0.4, y + 1.15, cw - 0.8, 0.45, { size: 10.5, color: C.navy, valign: "middle" });
    }
    a.text(s, "요청문:  “캡스톤 아이디어 메모를 읽고 문제·작은 예상·하지 않을 일·확인할 변화 네 칸으로 1쪽 기획서를 만들어줘. 각 칸에 '팀이 아직 정하지 않은 것'을 질문으로 남겨줘.”", M, 6.35, CW, 0.4, { size: 12, color: C.navy, bold: true });
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "'하지 않을 일' 칸을 가장 오래 설명한다. 면접에서 범위를 줄인 결정이 가장 좋은 이야기가 된다.",
      time: "2분",
      next: "문서를 썼다면 이제 검토입니다. 칭찬 말고 틀린 곳부터 찾게 합니다.",
    });
  }

  // 22 비판적 검토 요청
  {
    const s = a.slide(false);
    a.header(s, "검토 요청", "비판적 검토: 칭찬 말고 틀린 곳부터", "AI는 기본적으로 친절합니다. 검토를 요청할 때는 관점과 기준을 지정해야 쓸 만한 지적이 나옵니다.");
    a.promptCard(s, M, 2.3, 5.9, 3.5, {
      label: "카드 B · 비판적 검토 요청",
      lines: [
        { text: "너는 이 보고서를 처음 읽는 채용 담당 엔지니어야. 칭찬은 생략하고," },
        { text: "① 논리 비약  ② 근거 없는 숫자  ③ 용어 불일치  ④ 독자가 모를 전제  ⑤ 빠진 한계" },
        { text: "다섯 기준으로 문제 되는 문장을 원문 그대로 인용하고, 왜 문제인지 한 줄, 고친 예시 한 줄을 붙여줘." },
        { text: "가장 심각한 것 3개를 먼저 보여주고, 확신이 없는 지적은 '확인 필요'로 표시해줘.", bold: true, color: C.navy },
      ],
    });
    const x2 = M + 6.2, w2 = CW - 6.2;
    const lenses = [
      { t: "논리 비약", d: "결과에서 결론으로 건너뛴 곳" },
      { t: "근거 없는 숫자", d: "출처·조건·단위가 없는 수치" },
      { t: "용어 불일치", d: "같은 대상을 다른 이름으로 부름" },
      { t: "독자가 모를 전제", d: "우리 팀만 아는 배경·약어" },
      { t: "빠진 한계", d: "성립하지 않는 조건을 숨김" },
    ];
    a.text(s, "다섯 가지 검토 렌즈", x2, 2.3, w2, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    let ly = 2.7;
    for (let i = 0; i < 5; i++) {
      a.numBadge(s, i + 1, x2, ly + 0.05, 0.34, C.navy, C.white, 11);
      a.text(s, lenses[i].t, x2 + 0.48, ly, w2 - 0.5, 0.25, { size: 12.5, bold: true });
      a.text(s, lenses[i].d, x2 + 0.48, ly + 0.26, w2 - 0.5, 0.3, { size: 11, color: C.muted });
      ly += 0.63;
    }
    a.rect(s, M, 6.0, CW, 0.65, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "판단은 내가  ", size: 12, bold: true, color: C.accentInk },
      { text: "지적 3개 중 받아들일 것과 반박할 것을 나누고, 반박에는 근거를 붙입니다. 이 과정 자체가 면접 답변 연습입니다.", size: 13, color: C.ink },
    ], M + 0.3, 6.0, CW - 0.6, 0.65, { valign: "middle" });
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "'관점 지정(채용 담당 엔지니어)'과 '기준 지정(다섯 렌즈)' 두 장치를 강조한다. 실습 B에서 그대로 사용한다.",
      time: "2.5분",
      next: "지적을 받아들일지 판단하려면 근거가 어디서 왔는지 추적할 수 있어야 합니다.",
    });
  }

  // 23 근거 사슬
  {
    const s = a.slide(false);
    a.header(s, "근거 사슬", "주장 → 출처 → 원문 위치 → 확인 상태", "보고서와 자소서의 모든 숫자는 이 사슬로 되짚을 수 있어야 합니다. 끊긴 고리가 면접 꼬리질문이 됩니다.");
    const chain = [
      { t: "주장", d: "“측정 시간을 40분에서 8분으로 줄였다”", c: C.navy },
      { t: "출처", d: "캡스톤 실험 로그 (2026-05 3주차)", c: C.teal },
      { t: "원문 위치", d: "logs/week3.csv 12~20행, 자동화 전후 비교", c: C.teal },
      { t: "확인 상태", d: "확인 완료 · 팀원 2명 교차 확인", c: C.green },
    ];
    const n = 4, gap = 0.45, bw = (CW - gap * (n - 1)) / n, y = 2.45;
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap), c = chain[i];
      a.rect(s, x, y, bw, 1.9, C.white, { round: 0.08, line: C.line, shadow: a.shadow() });
      a.rect(s, x + 0.26, y + 0.28, 0.5, 0.5, c.c, { round: 0.1 });
      a.text(s, String(i + 1), x + 0.26, y + 0.28, 0.5, 0.5, { size: 14, bold: true, color: C.white, align: "center", valign: "middle" });
      a.text(s, c.t, x + 0.9, y + 0.33, bw - 1.1, 0.4, { size: 16, bold: true });
      a.text(s, c.d, x + 0.26, y + 0.95, bw - 0.52, 0.85, { size: 11.5, color: C.muted, lsm: 1.35 });
      if (i < n - 1) a.arrow(s, x + bw + 0.07, y + 0.53, gap - 0.14, C.faint);
    }
    const rows = [
      ["끊긴 고리", "면접에서 나오는 질문", "미리 하는 일"],
      ["출처 없음", "“그 수치는 어디서 나왔죠?”", "로그·노트·스크린샷을 한 폴더에 모아 둔다"],
      ["원문 위치 없음", "“어느 실험이었는지 기억나세요?”", "파일명·날짜·행 번호까지 적는다"],
      ["확인 상태 없음", "“팀원 기여와 본인 기여를 나눠 주세요.”", "교차 확인한 사람과 방법을 남긴다"],
    ];
    a.table(s, M, 4.65, [2.2, 4.4, 5.33], rows, { rowH: [0.42, 0.5, 0.5, 0.5], size: 11.5 });
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "사슬 예시를 읽고 '확인 상태' 고리가 비어 있을 때 면접 질문이 어떻게 오는지 표로 연결한다.",
      time: "2분",
      next: "마지막으로 발표. 캡스톤 발표 10장은 이 순서면 충분합니다.",
    });
  }

  // 24 발표 10장 구조 — 실험·연구 결과 발표 (화공·재료 예시)
  {
    const s = a.slide(false);
    a.header(s, "발표 구조", "실험 결과 발표 10장: 문제 1 · 결론 1 · 근거 4 · 한계 1", "졸업연구·공정 실습·학회 발표는 보고서의 순서를 그대로 따릅니다. 장비 사진과 절차 나열보다 '왜 이 조건인가'와 '얼마나 달라졌나'가 먼저입니다.");
    const rows = [
      ["장", "역할", "한 장의 핵심 질문", "화공·재료 예시 (온도 조건별 수율 실험)", "시간"],
      [{ text: "1", align: "center" }, "문제", "어떤 조건에서 무엇이 안 되는가 (장면 하나)", "60°C 조건 수율이 낮고 원인을 몰랐다", { text: "0:40", align: "center", font: MONO }],
      [{ text: "2", align: "center" }, "결론", "무엇을 얼마나 바꿨는가 (숫자 한 줄)", "80°C에서 수율 71%, 대조군(60°C) 대비 12%p ↑", { text: "0:30", align: "center", font: MONO }],
      [{ text: "3–6", align: "center" }, "근거 · 방법", "조건 설계 → 대조군 비교 → 측정 결과 → 재현성", "3조건 × 3회 반복 · 압력 고정 · 편차 ±2%p · 측정 로그", { text: "2:30", align: "center", font: MONO }],
      [{ text: "7", align: "center" }, "내 역할", "내가 직접 결정하고 만든 것 (조원 기여와 구분)", "측정 자동화 스크립트 작성 (40분 → 8분)", { text: "0:30", align: "center", font: MONO }],
      [{ text: "8", align: "center" }, "한계", "성립하지 않는 조건과 이유", "90°C 이상 미측정 · 반응 메커니즘 미확인", { text: "0:30", align: "center", font: MONO }],
      [{ text: "9", align: "center" }, "다음", "누가 무엇을 언제까지", "90°C 추가 실험 → 10/2, 열분석 병행", { text: "0:20", align: "center", font: MONO }],
      [{ text: "10", align: "center" }, "질의응답", "예상 질문 3개를 미리 적어 둔다", "“3회로 충분한가?” “대조군은 왜 60°C인가?”", { text: "—", align: "center", font: MONO }],
    ];
    a.table(s, M, 2.3, [0.7, 1.5, 4.0, 4.7, 1.03], rows, { rowH: [0.42, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44], size: 11.5, firstBold: false, aligns: ["center", "left", "left", "left", "center"] });
    a.rect(s, M, 6.0, CW, 0.65, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "요청문  ", size: 12, bold: true, color: C.accentLight },
      { text: "“보고서를 읽고 위 10장 구조로 장표별 제목(결론형 한 문장)과 발표 대본 2줄씩을 써줘. 7장 '내 역할'은 비워 두고 나에게 질문 3개를 해줘.”", size: 12.5, color: C.white },
    ], M + 0.3, 6.0, CW - 0.6, 0.65, { valign: "middle" });
    a.footer(s, SEC3);
    a.notes(s, {
      intent: "예시 열이 앞 장표(결론 먼저 · Before/After · 근거 사슬)의 같은 실험임을 짚는다. 7장 '내 역할'을 AI에게 맡기지 않는 이유를 설명한다. 발표 시간은 5분 기준 예시.",
      time: "2분",
      next: "이제 세 번째 사례, 여러분 자신을 설명하는 문서입니다.",
    });
  }

  // ═════════════ 04 자기소개
  const SEC4 = "4 · 자기소개";
  {
    const s = a.slide(true);
    a.section(s, "04", "자기소개: 경험을 근거로 말하기", "자소서·포트폴리오·면접은 다른 문서가 아니라, 같은 경험 재료를 세 가지 형식으로 꺼내는 일입니다.", "AI가 자소서를 대신 쓸 수 있는 시대에, 내 글임을 증명하는 것은 무엇인가?", SEC4);
    a.notes(s, { intent: "절 전환. AI가 쓴 자소서를 걸러내는 기업이 늘고 있다는 점을 한 문장으로 언급한다(수치 인용 없이).", time: "0.5분", next: "재료부터 만듭니다. 경험 인벤토리입니다." });
  }

  // 26 경험 인벤토리
  {
    const s = a.slide(false);
    a.header(s, "재료 만들기", "경험 인벤토리: 자소서 · 포트폴리오 · 면접의 공통 재료", "경험 하나를 다섯 칸으로 쪼개 표로 쌓아 두면, 어떤 문항이 와도 조합만 하면 됩니다. AI는 빈칸을 질문으로 찾아 줍니다.");
    const rows = [
      ["경험", "문제", "제약", "내 결정", "결과 (숫자)", "배움"],
      ["캡스톤 · 폐용매 증류 회수 개선", "아세톤 폐용매 주 20L, 회수율 40%", "4명 · 8주 · 예산 30만원 · 야간 실험 불가", "새 장치 제작 제외, 환류비·온도 조건만 최적화", "회수율 40 → 72% (3회 평균), 배출 20 → 6 L/주", "범위를 줄이는 결정이 완성도를 만든다"],
      ["공정 실습 · 수율 실험", "조건별 수율 차이 원인 불명", "장비 1대 · 측정 40분/회", "측정 자동화 스크립트 직접 작성", "40분 → 8분, 80°C 수율 +12%p", "측정 시간을 줄이면 반복 횟수가 는다"],
      ["학회 스터디 · 논문 리뷰", "발표 준비에 매주 6시간", "비전공 팀원 2명 포함", "논문 1쪽 정리 양식 도입", "준비 시간 6h → 3h, 6주 유지", "양식 하나가 팀 커뮤니케이션을 바꾼다"],
      [{ text: "(빈 행)", color: C.faint, italic: true }, { text: "AI가 질문으로 채움", color: C.faint, italic: true }, "", "", "", ""],
    ];
    a.table(s, M, 2.3, [2.15, 2.15, 1.75, 2.05, 2.05, 1.78], rows, { rowH: [0.45, 0.72, 0.72, 0.72, 0.42], size: 11 });
    a.rect(s, M, 5.75, CW, 0.9, C.panel, { round: 0.08 });
    a.rich(s, [
      { text: "요청문  ", size: 12, bold: true, color: C.accent },
      { text: "“02_experience/경험정리.md를 읽고 경험 × (문제·제약·결정·결과·배움) 표로 정리해줘. 결과 칸에 숫자가 없으면 비워 두고, 채우기 위해 나에게 물어볼 질문을 경험마다 2개씩 적어줘.”", size: 12.5, color: C.ink, br: true },
      { text: "표의 내용은 예시입니다. 숫자·결정은 반드시 본인의 기록에서 가져옵니다.", size: 10.5, color: C.muted },
    ], M + 0.3, 5.75, CW - 0.6, 0.9, { valign: "middle" });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "'내 결정' 열과 '결과(숫자)' 열이 비어 있는 경험은 아직 자소서 재료가 아니라고 말한다. 빈 행을 AI 질문으로 채우는 방식을 강조한다.",
      time: "2.5분",
      next: "이 다섯 칸이 곧 답변 구조입니다. STAR를 공학용으로 바꾼 것입니다.",
    });
  }

  // 27 문제·제약·결정·결과·배움
  {
    const s = a.slide(false);
    a.header(s, "답변 구조", "STAR를 공학용으로: 문제 · 제약 · 결정 · 결과 · 배움", "'제약'과 '결정'이 들어가면 이야기가 됩니다. 엔지니어의 가치는 제약 아래에서 내린 결정에서 드러납니다.");
    const steps = [
      { t: "문제", d: "관찰한 장면", icon: "FiAlertCircle" },
      { t: "제약", d: "시간·인원·장비·비용", icon: "FiLock", hot: true },
      { t: "결정", d: "대안 중 내가 고른 것과 이유", icon: "FiGitBranch", hot: true },
      { t: "결과", d: "숫자·비교·기간", icon: "FiBarChart2" },
      { t: "배움", d: "다음에 다르게 할 것", icon: "FiCompass" },
    ];
    const n = 5, gap = 0.3, bw = (CW - gap * (n - 1)) / n, y = 2.4;
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap), st = steps[i];
      a.rect(s, x, y, bw, 1.65, st.hot ? C.accentSoft : C.panel, { round: 0.08 });
      await a.iconBadge(s, st.icon, x + 0.24, y + 0.24, 0.48, st.hot ? C.accent : C.navy, C.white);
      a.text(s, st.t, x + 0.85, y + 0.28, bw - 1.0, 0.4, { size: 17, bold: true, color: st.hot ? C.accentInk : C.ink });
      a.text(s, st.d, x + 0.24, y + 0.9, bw - 0.48, 0.6, { size: 11.5, color: C.muted, lsm: 1.3 });
      if (i < n - 1) a.arrow(s, x + bw + 0.05, y + 0.48, gap - 0.1, C.faint);
    }
    a.rect(s, M, 4.3, CW, 2.35, C.white, { round: 0.08, line: C.line, shadow: a.shadow() });
    a.text(s, "예시 답변 · 60초 (면접 “가장 어려웠던 프로젝트는?”)", M + 0.3, 4.48, CW - 0.6, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    a.rich(s, [
      { text: "문제  ", size: 12, bold: true, color: C.navy }, { text: "학과 실험실에서 아세톤 폐용매가 주 20L 나오는데 기존 증류기 회수율이 40%에 그쳤습니다.  ", size: 12.5 },
      { text: "제약  ", size: 12, bold: true, color: C.accentInk }, { text: "4명, 8주, 예산 30만원에 인화성 규정으로 야간 실험이 안 돼 처음 계획한 새 장치 제작은 불가능했습니다.  ", size: 12.5, br: true },
      { text: "결정  ", size: 12, bold: true, color: C.accentInk }, { text: "제가 '기존 증류기의 환류비와 온도 두 조건만 먼저 검증하자'고 제안해 범위를 줄였고, 대신 4주 실제 운용을 조건으로 걸었습니다.  ", size: 12.5, br: true },
      { text: "결과  ", size: 12, bold: true, color: C.navy }, { text: "회수율이 40%에서 72%(3회 평균)로 올라 4주 동안 폐용매 배출이 주 20L에서 6L로 줄었고, 운용 로그를 근거로 학과에 정식 적용을 제안했습니다.  ", size: 12.5, br: true },
      { text: "배움  ", size: 12, bold: true, color: C.navy }, { text: "범위를 줄이는 결정이 완성도를 만든다는 것을 배웠고, 다음엔 순도 측정 방법을 첫 주에 정할 것입니다.", size: 12.5 },
    ], M + 0.3, 4.85, CW - 0.6, 1.7, { lsm: 1.4 });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "예시 답변을 소리 내어 읽고(약 50초) 제약·결정 문장에서 멈춘다. 학생이 자기 경험 하나를 이 구조로 30초 말해 보게 한다.",
      time: "3분",
      next: "그럼 자소서에서 AI는 어디까지 도와야 할까요?",
    });
  }

  // 28 초안은 내가, 검토는 AI가
  {
    const s = a.slide(false);
    a.header(s, "역할 분담", "자소서에서의 분업: 초안은 내가, 검토는 AI가", "AI에게 초안을 맡기면 누구나 쓸 수 있는 글이 나옵니다. 재료와 첫 문장은 내가 쓰고, AI는 질문하고 지적하고 다듬습니다.");
    const cw = (CW - 0.4) / 2;
    const L = M, R = M + cw + 0.4;
    a.rect(s, L, 2.35, cw, 3.25, C.navy, { round: 0.08 });
    a.rect(s, R, 2.35, cw, 3.25, C.panel, { round: 0.08 });
    a.text(s, "내가 쓰는 것", L + 0.3, 2.6, cw - 0.6, 0.4, { size: 17, bold: true, color: C.white });
    a.text(s, "AI가 돕는 것", R + 0.3, 2.6, cw - 0.6, 0.4, { size: 17, bold: true, color: C.ink });
    const mine = ["경험의 사실 · 숫자 · 날짜", "제약 아래에서 내가 내린 결정과 이유", "그때의 감정과 배움 (한 문장이면 충분)", "지원 동기의 '나만의 계기'", "최종 문장과 제출 책임"];
    const ai = ["빈칸을 찾는 질문 (“그 결정의 대안은 무엇이었나요?”)", "문항 요구와 내 초안의 구조 대조", "글자 수 조정 · 중복 표현 · 문장 길이", "채용 담당자 관점의 비판적 검토", "예상 꼬리질문 생성"];
    a.rich(s, mine.map((t, i) => ({ text: t, size: 13, color: C.white, bullet: { indent: 14 }, br: i < 4, psa: 8 })), L + 0.3, 3.15, cw - 0.6, 2.3, { lsm: 1.25 });
    a.rich(s, ai.map((t, i) => ({ text: t, size: 13, color: C.ink, bullet: { indent: 14 }, br: i < 4, psa: 8 })), R + 0.3, 3.15, cw - 0.6, 2.3, { lsm: 1.25 });
    a.rect(s, M, 5.8, CW, 0.85, C.accentSoft, { round: 0.08 });
    a.rich(s, [
      { text: "순서  ", size: 12, bold: true, color: C.accentInk },
      { text: "경험 인벤토리(표) → 내가 첫 초안 300자 → AI 질문 5개에 답하며 보강 → 비판적 검토 → 내가 최종 수정.  ", size: 13, color: C.ink },
      { text: "AI가 먼저 쓰게 하지 않는 것이 핵심입니다.", size: 13, bold: true, color: C.navy },
    ], M + 0.3, 5.8, CW - 0.6, 0.85, { valign: "middle" });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "'AI가 먼저 쓰게 하지 않는다'를 규칙으로 못 박는다. 이유: 표현의 균질화, 기업의 AI 작성 탐지, 면접에서 내용을 방어 못 함.",
      time: "2분",
      next: "그래도 AI 냄새가 남습니다. 어떻게 알아보고 고칠까요?",
    });
  }

  // 29 AI 티 나는 글 → 내 글
  {
    const s = a.slide(false);
    a.header(s, "표현 점검", "AI 티 나는 글의 징후와 고치는 법", "채용 담당자는 하루에 수백 장을 읽습니다. 아래 징후가 세 개 이상이면 내 글이 아니라고 판단됩니다.");
    const rows = [
      ["징후", "예시 문장", "고치는 법", "고친 예시"],
      ["추상 형용사 나열", "“다양하고 폭넓은 경험을 통해 성장했습니다.”", "사건 하나 + 숫자", "“8주 캡스톤에서 실험 범위를 두 조건으로 줄여 4주 실제 운용을 만들었습니다.”"],
      ["결정 없는 서술", "“팀원들과 협력하여 문제를 해결했습니다.”", "내가 고른 대안과 이유", "“새 장치 대신 기존 증류기 조건만 먼저 검증하자고 제안했습니다. 예산이 30만원이었기 때문입니다.”"],
      ["균형 잡힌 결론", "“장단점을 모두 고려하여 최선의 선택을 했습니다.”", "포기한 것을 밝힘", "“자동 제어를 포기하고 회수율과 순도 측정에 집중했습니다.”"],
      ["감정 없는 배움", "“많은 것을 배울 수 있었던 값진 경험이었습니다.”", "다음에 다르게 할 것 한 가지", "“다음엔 순도 측정 방법을 첫 주에 정하겠습니다.”"],
      ["문항과 무관한 서론", "“4차 산업혁명 시대에 엔지니어의 역할은…”", "첫 문장부터 내 장면", "“실험실 폐용매의 60%가 위탁 처리로 버려지고 있었습니다.”"],
    ];
    a.table(s, M, 2.3, [1.8, 3.4, 2.1, 4.63], rows, { rowH: [0.42, 0.62, 0.62, 0.62, 0.62, 0.62], size: 11 });
    a.rect(s, M, 5.95, CW, 0.7, C.navy, { round: 0.08 });
    a.rich(s, [
      { text: "요청문  ", size: 12, bold: true, color: C.accent },
      { text: "“내 자소서 초안에서 위 다섯 징후에 해당하는 문장을 인용하고, 고치기 위해 나에게 필요한 정보를 질문으로 물어줘. 대신 써 주지는 마.”", size: 12.5, color: C.white },
    ], M + 0.3, 5.95, CW - 0.6, 0.7, { valign: "middle" });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "고친 예시 열을 읽으면 모두 '사건·숫자·결정'이 있음을 짚는다. 요청문 끝의 '대신 써 주지는 마'를 강조한다.",
      time: "2.5분",
      next: "글이 준비되면 보여줄 곳이 필요합니다. 포트폴리오 README입니다.",
    });
  }

  // 30 포트폴리오 README
  {
    const s = a.slide(false);
    a.header(s, "포트폴리오", "포트폴리오 README 한 화면, 여섯 블록", "채용 담당자는 README를 30초 봅니다. 코드보다 먼저, 이 여섯 블록이 위에서 아래로 보여야 합니다.");
    // 좌: README 목업
    const mx = M, mw = 6.3, my = 2.3, mh = 4.35;
    a.rect(s, mx, my, mw, mh, C.white, { round: 0.08, line: C.line, shadow: a.shadow() });
    a.rect(s, mx, my, mw, 0.42, C.panel, { round: 0.08 });
    a.rect(s, mx, my + 0.25, mw, 0.17, C.panel);
    a.circle(s, mx + 0.22, my + 0.14, 0.13, "E06C6C"); a.circle(s, mx + 0.42, my + 0.14, 0.13, "E9B54A"); a.circle(s, mx + 0.62, my + 0.14, 0.13, "5FB77D");
    a.text(s, "github.com/you/solvent-recovery  ·  README.md", mx + 0.9, my + 0.08, mw - 1.1, 0.26, { size: 9.5, color: C.faint, font: MONO });
    const blocks = [
      ["# solvent-recovery", "실험실 폐용매 증류 회수 조건 최적화 · 4주 운용 회수율 72%", true],
      ["## 문제", "아세톤 폐용매 주 20L 배출 · 기존 회수율 40% · 관찰 2주", false],
      ["## 데모", "[그래프 3장]  환류비 × 온도 → 회수율 · GC 순도", false],
      ["## 내 역할 (4명 중)", "실험 설계(조건 3 × 3회) · GC 순도 측정 · 4주 운용 로그 분석", false],
      ["## 기술 결정", "새 장치 제작 대신 기존 증류기 조건 최적화 — 예산 30만원 · 안전 규정 제약", false],
      ["## 결과 · 한계", "회수율 40 → 72% · 순도 98%  /  혼합 용매는 미검증", false],
    ];
    let by = my + 0.6;
    for (const [h, b, big] of blocks) {
      a.text(s, h, mx + 0.3, by, mw - 0.6, 0.26, { size: big ? 13 : 11, bold: true, color: C.navy, font: MONO });
      a.text(s, b, mx + 0.3, by + 0.26, mw - 0.6, 0.3, { size: 10.5, color: C.muted });
      by += 0.62;
    }
    // 우: 체크 기준
    const rx = M + 6.6, rw = CW - 6.6;
    const checks = [
      { t: "첫 줄에 결론", d: "무엇을 만들었고 결과가 무엇인지 한 줄" },
      { t: "데모는 30초 안", d: "GIF·짧은 영상·스크린샷 3장 중 하나" },
      { t: "내 역할은 분수로", d: "'4명 중 나는 ○○' — 팀 기여와 분리" },
      { t: "결정에는 제약을", d: "왜 그 기술을 골랐는지 제약과 함께" },
      { t: "한계를 숨기지 않기", d: "미검증 조건을 적으면 신뢰가 오른다" },
    ];
    a.text(s, "30초 안에 확인되는 다섯 가지", rx, 2.3, rw, 0.3, { size: 10.5, bold: true, color: C.accent, cs: 1 });
    let cy = 2.72;
    for (let i = 0; i < 5; i++) {
      await a.iconBadge(s, "FiCheck", rx, cy, 0.36, C.greenSoft, C.green);
      a.text(s, checks[i].t, rx + 0.5, cy - 0.02, rw - 0.5, 0.28, { size: 12.5, bold: true });
      a.text(s, checks[i].d, rx + 0.5, cy + 0.27, rw - 0.5, 0.3, { size: 11, color: C.muted });
      cy += 0.72;
    }
    a.text(s, "요청문: “프로젝트 폴더를 읽고 위 여섯 블록 README 초안을 써줘. '내 역할'과 '기술 결정'은 비워 두고 질문해줘.”", rx, 6.3, rw, 0.4, { size: 10.5, color: C.navy, bold: true });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "목업의 위에서 아래 순서를 손가락으로 따라가며 30초 안에 읽힌다는 점을 보여준다. '내 역할'은 AI가 쓸 수 없는 블록임을 반복한다.",
      time: "2분",
      next: "재료와 문서가 준비됐다면, 마지막은 말하기 연습입니다.",
    });
  }

  // 31 면접 준비 루프
  {
    const s = a.slide(false);
    a.header(s, "면접 준비", "모의 면접 루프: 질문 → 답변 → 꼬리질문 → 피드백", "AI는 면접관 역할을 지치지 않고 반복합니다. 단, 답변은 소리 내어 말하고 녹음해서 기록으로 남깁니다.");
    const loop = [
      { t: "자소서 · README", icon: "FiFileText" },
      { t: "질문 10개", icon: "FiHelpCircle" },
      { t: "소리 내어 답변", icon: "FiMic" },
      { t: "꼬리질문 3개", icon: "FiCornerDownRight" },
      { t: "구조 · 근거 피드백", icon: "FiMessageSquare" },
    ];
    const n = 5, gap = 0.3, bw = (CW - gap * (n - 1)) / n, y = 2.35;
    for (let i = 0; i < n; i++) {
      const x = M + i * (bw + gap);
      a.rect(s, x, y, bw, 1.15, i === 2 ? C.accentSoft : C.panel, { round: 0.08 });
      await a.iconBadge(s, loop[i].icon, x + 0.22, y + 0.32, 0.5, i === 2 ? C.accent : C.navy, C.white);
      a.text(s, loop[i].t, x + 0.85, y, bw - 1.0, 1.15, { size: 12.5, bold: true, valign: "middle", color: i === 2 ? C.accentInk : C.ink, lsm: 1.2 });
      if (i < n - 1) a.arrow(s, x + bw + 0.05, y + 0.57, gap - 0.1, C.faint);
    }
    const rows = [
      ["질문 유형", "면접관이 확인하려는 것", "예시 질문", "답변에 반드시 들어갈 것"],
      ["경험 검증", "자소서 내용이 사실인가", "“회수율 72%는 어떻게 측정했나요?”", "측정 방법 · 기간 · 원자료 위치"],
      ["기술 깊이", "왜 그 방법을 골랐는가", "“새 장치 대신 기존 증류기 조건만 바꾼 이유는?”", "제약 · 대안 · 트레이드오프"],
      ["협업", "본인 기여와 갈등 처리", "“팀원이 반대했을 때 어떻게 설득했나요?”", "구체 장면 · 내 행동 · 결과"],
      ["실패·한계", "한계를 인식하는가", "“혼합 용매가 들어오면 어떻게 되나요?”", "미검증 조건 인정 · 다음 계획"],
    ];
    a.table(s, M, 3.75, [1.5, 2.6, 4.2, 3.63], rows, { rowH: [0.42, 0.5, 0.5, 0.5, 0.5], size: 11.5 });
    a.text(s, "요청문 (카드 C):  “자소서와 README를 읽고 위 네 유형별로 질문을 만들어 총 10개를 줘. 내가 답하면 답마다 꼬리질문 하나와 ‘구조·근거’ 두 기준의 피드백만 짧게 해줘.”", M, 6.25, CW, 0.45, { size: 11.5, color: C.navy, bold: true });
    a.footer(s, SEC4);
    a.notes(s, {
      intent: "루프의 세 번째 단계(소리 내어 답변)만 강조한다. 텍스트로 답하면 면접 연습이 되지 않는다. 실습 C에서 사용.",
      time: "2.5분",
      next: "이제 15분 동안 여러분 자료로 직접 해 봅니다.",
    });
  }
};
