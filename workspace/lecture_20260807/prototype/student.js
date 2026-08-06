const tasks = [...document.querySelectorAll(".task")];
const confidenceButtons = [...document.querySelectorAll("[data-confidence]")];
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressMessage = document.getElementById("progressMessage");
const nextAction = document.getElementById("nextAction");
const helpDialog = document.getElementById("helpDialog");

function completedCount() {
  return tasks.filter((task) => task.classList.contains("complete")).length;
}

function currentConfidence() {
  return confidenceButtons.find((button) => button.classList.contains("active"))?.dataset.confidence || "mid";
}

function nextTask() {
  return tasks.find((task) => !task.classList.contains("complete"));
}

function renderNextAction(short = false) {
  const task = nextTask();
  const confidence = currentConfidence();
  if (!task) {
    nextAction.innerHTML = "<span>회고</span><strong>이번 주 학습을 한 문장으로 정리하기</strong><p>모든 활동을 마쳤습니다. 무엇이 도움이 되었는지 남겨보세요.</p>";
    return;
  }
  const name = task.querySelector("b").textContent;
  const minutes = Number(task.dataset.minutes);
  if (short || confidence === "low") {
    nextAction.innerHTML = `<span>더 작은 시작</span><strong>${name}의 첫 5분만 해보기</strong><p>5분 뒤 멈춰도 괜찮습니다. 시작할 수 있는 크기로 줄였습니다.</p>`;
  } else if (confidence === "high") {
    nextAction.innerHTML = `<span>도전</span><strong>${name} 마치고 질문 하나 적기</strong><p>${minutes}분 활동 뒤 이해되지 않은 점을 한 문장으로 남겨보세요.</p>`;
  } else {
    nextAction.innerHTML = `<span>추천</span><strong>${name} 시작하기</strong><p>${minutes}분을 한 번에 끝내기보다, 첫 5분부터 시작해도 충분합니다.</p>`;
  }
}

function renderProgress() {
  const completed = completedCount();
  progressText.textContent = `${completed} / ${tasks.length} 완료`;
  progressBar.style.width = `${(completed / tasks.length) * 100}%`;
  progressMessage.textContent = completed === tasks.length
    ? "이번 주 활동을 모두 마쳤어요. 잘된 점을 한 문장으로 남겨보세요."
    : completed === 0
      ? "시작하기 어려우면 첫 활동을 5분 단위로 줄여보세요."
      : "좋은 흐름이에요. 오늘은 작은 활동 하나만 더 끝내도 충분합니다.";
  renderNextAction();
}

tasks.forEach((task) => task.addEventListener("click", () => {
  const complete = task.classList.toggle("complete");
  task.setAttribute("aria-pressed", String(complete));
  task.querySelector("i").textContent = complete ? "✓" : "";
  const small = task.querySelector("small");
  small.textContent = `${task.dataset.minutes}분 · ${complete ? "완료" : "아직 시작 전"}`;
  renderProgress();
}));

confidenceButtons.forEach((button) => button.addEventListener("click", () => {
  confidenceButtons.forEach((item) => item.classList.toggle("active", item === button));
  renderNextAction();
}));

document.getElementById("shortPlan").addEventListener("click", () => renderNextAction(true));
document.getElementById("easyExplain").addEventListener("click", () => {
  const task = nextTask();
  if (!task) return renderNextAction();
  nextAction.innerHTML = `<span>쉬운 설명</span><strong>“${task.querySelector("b").textContent}”를 ① 열기 ② 5분 보기 ③ 한 줄 적기로 나누기</strong><p>모르는 단어가 나오면 멈추고 도움 요청 문장을 만들 수 있습니다.</p>`;
});

document.getElementById("helpButton").addEventListener("click", () => helpDialog.showModal());
document.getElementById("sendHelp").addEventListener("click", () => {
  const type = document.querySelector("input[name='helpType']:checked").value;
  const goal = document.querySelector("input[name='goal']:checked").value;
  document.getElementById("helpOutput").textContent = `“이번 주 목표는 ‘${goal}’인데, ${type} 담당자와 확인할 수 있을까요?” — 실제 전송 전 학생이 내용을 확인합니다.`;
});

document.getElementById("saveReflection").addEventListener("click", () => {
  const input = document.getElementById("reflectionInput");
  document.getElementById("savedReflection").textContent = input.value.trim()
    ? `기록됨: ${input.value.trim()}`
    : "한 문장을 적어주세요.";
});

renderProgress();
