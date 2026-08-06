const prompts = {
  brief: "온라인학습지원센터의 이번 주 운영 현황을 한눈에 보고 싶어요. 과정별 참여 현황, 콘텐츠 문의, 교사 지원 요청을 요약하고 사람이 확인해야 할 항목을 따로 보여주세요. 개인을 자동 평가하지는 않았으면 합니다.",
  signal: "비식별 샘플 학습기록 CSV를 올리면 참여 감소나 미이수 가능성을 보여주고, 어떤 추가 지원이 필요한지 연구자가 검토할 후보만 표시하는 화면을 만들고 싶어요. 학생을 자동 분류하거나 불이익을 주면 안 됩니다.",
  content: "스쿨포유·스쿨포유 초등·하트포유 같은 온라인 콘텐츠 시안을 교육과정 정합성, 접근성, 활동 다양성, 형성평가 문항 관점에서 점검하고 수정 근거를 남기는 도구가 필요해요.",
  evidence: "디지털교육 정책 브리프의 각 주장마다 논문이나 공식자료, 원문 페이지, 지지 강도, VERIFY 상태를 연결하고 인용이 없는 문장을 찾아주는 연구 근거 지도를 만들고 싶어요."
};

const localResults = {
  brief: {
    icon: "01", name: "온라인학습 운영 브리프", problem: "여러 과정·콘텐츠·교사 지원 이슈가 파일과 메일에 흩어져 주간 판단이 늦어지는 문제", users: "온라인학습지원센터 연구·운영 담당자, 사업 책임자", inputs: "비식별 과정별 집계표, 문의 유형, 콘텐츠 수정 이력, 지원 요청", outputs: "핵심 지표 5개, 지난주 대비 변화, 확인 필요 이슈, 회의용 1쪽 브리프", approval: "담당자가 원자료와 요약을 대조한 뒤 ‘공유 승인’을 눌러야 브리프가 배포됩니다.", week: ["샘플 집계표 정의", "로컬 화면 연결", "요약 규칙 검토", "5명 사용성 테스트"], boundary: "개인 단위 기록은 입력하지 않고 최소 10명 이상 집계값만 사용합니다. 자동 평가는 하지 않습니다."
  },
  signal: {
    icon: "02", name: "학습지원 신호 탐색기", problem: "지원이 필요한 학습자를 늦게 발견하거나 단일 지표로 오판할 수 있는 문제", users: "교육연구자, 학습지원 담당자, 사업 운영자", inputs: "비식별 샘플 참여율·과제·접속 추세와 지원 이력", outputs: "검토 후보, 신호 근거, 대안 설명, 추가 확인 질문", approval: "지원 여부와 방법은 담당자가 맥락을 확인해 결정하며 AI 점수로 자동 조치하지 않습니다.", week: ["가상 데이터 50행", "신호 규칙 합의", "설명 화면 제작", "오탐 사례 검토"], boundary: "건강·장애·가정환경 등 민감정보를 제외하고, 결과는 연구 가설 탐색에만 사용합니다."
  },
  content: {
    icon: "03", name: "온라인 콘텐츠 QA 워크벤치", problem: "콘텐츠 검토 기준과 수정 근거가 담당자·차시마다 달라 재작업이 반복되는 문제", users: "콘텐츠 연구·개발 담당자, 교과 전문가, 접근성 검토자", inputs: "차시 구조안, 대본, 활동, 형성평가 문항, 버전 정보", outputs: "기준별 체크, 근거 문장, 수정 제안, 사람 검토 상태", approval: "교과·접근성 전문가가 수정 제안을 수락·보류·반려하고 이유를 기록합니다.", week: ["QA 기준 12개", "예시 차시 2개", "근거 표시 UI", "전문가 합의 회의"], boundary: "저작권이 확인된 시안만 사용하고 실제 학생 반응 데이터는 별도 승인 전 연결하지 않습니다."
  },
  evidence: {
    icon: "04", name: "디지털교육 근거 지도", problem: "정책 문장의 출처·원문 위치·지지 강도가 원고 밖에 흩어져 검증이 느린 문제", users: "정책연구자, 공동연구자, 검토자", inputs: "주장 문장, 읽은 원문, 페이지·절, 근거 유형, 검증 상태", outputs: "claim–source 연결표, 약한 근거 경고, VERIFY 목록, 인용 감사 보고서", approval: "원문을 직접 읽은 연구자만 verified로 바꾸고, AI는 핵심 인용을 확정하지 않습니다.", week: ["claim 스키마 확정", "원고 20문장 연결", "감사 규칙 실행", "검토시간 비교"], boundary: "읽지 않은 논문은 abstract_only로 표시하고 DOI·페이지·인용수를 추측하지 않습니다."
  }
};

let activeExample = "brief";
let activeMode = "local";
const $ = (id) => document.getElementById(id);
const promptBox = $("servicePrompt");

function updateCount() { $("charCount").textContent = `${promptBox.value.length.toLocaleString()} / 1,200`; }
function chooseExample(key) {
  activeExample = key;
  document.querySelectorAll(".example").forEach((el) => el.classList.toggle("active", el.dataset.example === key));
  promptBox.value = prompts[key]; updateCount();
}
function chooseMode(mode) {
  activeMode = mode;
  document.querySelectorAll(".mode").forEach((el) => el.classList.toggle("active", el.dataset.mode === mode));
  $("modeStatus").innerHTML = mode === "local" ? "<i></i> 로컬 · 외부 전송 없음" : "<i></i> AI API · 서버 키 사용";
}
function render(data) {
  $("emptyState").classList.add("hidden"); $("resultContent").classList.remove("hidden");
  for (const key of ["icon", "name", "problem", "users", "inputs", "outputs", "approval", "boundary"]) {
    const id = key === "icon" ? "resultIcon" : key === "name" ? "resultName" : key;
    $(id).textContent = data[key] || "—";
  }
  $("weekPlan").replaceChildren(...(data.week || []).map((item) => Object.assign(document.createElement("li"), { textContent: item })));
}
async function build() {
  const prompt = promptBox.value.trim();
  if (!prompt) { promptBox.focus(); return; }
  if (activeMode === "local") { render(localResults[activeExample]); return; }
  const button = $("buildButton"); button.disabled = true; button.querySelector("span").textContent = "AI가 시안을 정리하는 중…";
  try {
    const response = await fetch("/api/assist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, example: activeExample }) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "API 연결을 확인해 주세요.");
    render(payload);
  } catch (error) {
    render({ ...localResults[activeExample], name: `${localResults[activeExample].name} · 로컬 대체`, approval: `API 연결을 사용할 수 없어 로컬 시안을 표시했습니다. ${error.message} 실제 연결 전 서버 환경변수와 기관 승인 범위를 확인하세요.` });
  } finally { button.disabled = false; button.querySelector("span").textContent = "시안 만들기"; }
}

document.querySelectorAll(".example").forEach((el) => el.addEventListener("click", () => chooseExample(el.dataset.example)));
document.querySelectorAll(".mode").forEach((el) => el.addEventListener("click", () => chooseMode(el.dataset.mode)));
$("buildButton").addEventListener("click", build);
$("resetButton").addEventListener("click", () => { chooseExample("brief"); chooseMode("local"); $("resultContent").classList.add("hidden"); $("emptyState").classList.remove("hidden"); });
promptBox.addEventListener("input", updateCount);
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") build(); });
updateCount();
