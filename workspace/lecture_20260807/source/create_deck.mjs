import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/sungjae-cha/Documents/research-agent";
const OUT = path.join(ROOT, "workspace/lecture_20260807");
const ASSET = path.join(OUT, "assets");
const FINAL = path.join(OUT, "KEDI_Codex_Research_AX_20260807.pptx");

const W = 1280;
const H = 720;
const M = 72;
const FONT = "NanumGothic";
const MONO = "Menlo";
const C = {
  ink: "#050505",
  ink2: "#161616",
  paper: "#F6F6F4",
  white: "#FFFFFF",
  muted: "#686866",
  soft: "#D6D6D1",
  // 기존 키 이름은 레이아웃 호환을 위해 유지하되, 실제 색은
  // 블랙·화이트·코발트·블루그레이 중심의 절제된 팔레트로 통일한다.
  cyan: "#8E9AFF",
  lime: "#9299AA",
  coral: "#C85D52",
  blue: "#4F5FFF",
  green: "#2F8067",
  yellow: "#B88932",
  red: "#BF4E49",
};

const img = (name) => path.join(ASSET, name);
const local = (name) => path.join(ROOT, name);
const urls = {
  openaiHarness: "https://openai.com/index/harness-engineering/",
  openaiBest: "https://learn.chatgpt.com/guides/best-practices.md",
  openaiPrompt: "https://learn.chatgpt.com/docs/prompting.md",
  openaiAgents: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
  openaiGithub: "https://learn.chatgpt.com/docs/third-party/github",
  microsoft: "https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born",
  githubRepo: "https://github.com/smilesjcha/research-agent",
  openalexWorks: "https://developers.openalex.org/api-reference/works",
  openalexList: "https://developers.openalex.org/api-reference/works/list-works",
  unesco: "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research?hub=67098",
  nist: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
  pipc: "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=G010030020&nttId=11439",
  nia2026: "https://www.nia.or.kr/site/nia_kor/ex/bbs/View.do?bcIdx=29526&cbIdx=37989",
  law: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283735",
  kediOrg: "https://www.kedi.re.kr/khome/main/intro/organization.do",
  kediStaff: "https://www.kedi.re.kr/khome/mobile2/intro/listStaffForm.do",
  kediCredit: "https://www.kedi.re.kr/khome/main/announce/selectNoticeAnnounceForm.do?article_sq_no=36278&board_sq_no=1&selectTp=0",
  kediOnline: "https://www.kedi.re.kr/khome/main/announce/selectNoticeAnnounceForm.do?article_sq_no=36333&board_sq_no=1&selectTp=0",
  kediSchoolForYou2026: "https://www.kedi.re.kr/khome/main/announce/selectNoticeAnnounceForm.do?article_sq_no=36334&board_sq_no=1&selectTp=0",
  kediSchoolForYou: "https://www.kedi.re.kr/khome/main/announce/selectBroadAnnounceForm.do?article_sq_no=35582&board_sq_no=3&selectTp=0",
  kediHeartForYou: "https://www.kedi.re.kr/khome/main/announce/selectNoticeAnnounceForm.do?article_sq_no=36342&board_sq_no=1&selectTp=0",
  kediESchool: "https://www.kedi.re.kr/khome/main/announce/selectBroadAnnounceForm.do?article_sq_no=35834&board_sq_no=3&selectTp=0",
  kediAiClassroom: "https://www.kedi.re.kr/khome/main/announce/selectBroadAnnounceForm.do?article_sq_no=36409&board_sq_no=3&selectTp=0",
  kediForum: "https://www.kedi.re.kr/khome/main/announce/selectBroadAnnounceForm.do?article_sq_no=36408&board_sq_no=3&selectTp=0",
  openaiQuickstart: "https://developers.openai.com/api/docs/quickstart",
  openaiLatest: "https://developers.openai.com/api/docs/guides/latest-model.md",
  vercelCli: "https://vercel.com/docs/projects/deploy-from-cli",
  vercelEnv: "https://vercel.com/docs/environment-variables",
  vercelFunctions: "https://vercel.com/docs/functions",
  xkcdAutomation: "https://xkcd.com/1319/",
  xkcdWorthTime: "https://xkcd.com/1205/",
  xkcdLicense: "https://xkcd.com/license.html",
};

const imageCache = new Map();
async function imageBytes(p) {
  if (imageCache.has(p)) return imageCache.get(p);
  const b = await fs.readFile(p);
  const ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  imageCache.set(p, ab);
  return ab;
}

function addRect(slide, x, y, w, h, fill, radius = 0, lineFill = "none", lineWidth = 0) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
    ...(radius ? { borderRadius: "rounded-xl" } : {}),
  });
}

function addText(slide, text, x, y, w, h, size = 24, color = C.ink, bold = false, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: size,
    fontFamily: options.fontFamily || FONT,
    color,
    bold,
    alignment: options.align || "left",
    ...(options.italic ? { italic: true } : {}),
  };
  return shape;
}

async function addImage(slide, p, x, y, w, h, fit = "cover", radius = true) {
  return slide.images.add({
    blob: await imageBytes(p),
    contentType: p.endsWith(".jpg") || p.endsWith(".jpeg") || p.endsWith("_full.png") ? "image/jpeg" : "image/png",
    alt: path.basename(p),
    fit,
    position: { left: x, top: y, width: w, height: h },
    geometry: radius ? "roundRect" : "rect",
    ...(radius ? { borderRadius: "rounded-xl" } : {}),
  });
}

function baseSlide(pres, dark = false) {
  const slide = pres.slides.add();
  slide.background.fill = dark ? C.ink : C.paper;
  return slide;
}

function addFooter(slide, n, section, dark = false) {
  const color = dark ? "#8F8F8F" : "#777777";
  addRect(slide, M, 672, W - 2 * M, 1, dark ? "#2A2A2A" : C.soft);
  addText(slide, section, M, 682, 600, 22, 14, color, false);
  addText(slide, String(n).padStart(2, "0"), W - M - 48, 682, 48, 22, 14, color, true, { align: "right" });
}

function titleBlock(slide, kicker, title, subtitle = "", dark = false) {
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  addText(slide, kicker.toUpperCase(), M, 48, 620, 24, 15, dark ? C.cyan : C.blue, true);
  addText(slide, title, M, 82, W - 2 * M, 72, 46, fg, true);
  if (subtitle) addText(slide, subtitle, M, 154, W - 2 * M, 52, 22, muted, false);
}

function noteSlide(slide, spec, n) {
  const sourceLines = (spec.sources && spec.sources.length ? spec.sources : ["None (facilitation/original synthesis)."])
    .map((s) => `- ${s}`)
    .join("\n");
  const notes = [
    `권장 시간: ${spec.time || "1분"}`,
    `진행: ${spec.note || spec.title || "핵심 메시지를 간결하게 전달한다."}`,
    `전환: ${spec.transition || "다음 장표에서 이 내용을 연구 환경에 적용한다."}`,
    "",
    "[Sources]",
    sourceLines,
  ].join("\n");
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
  addFooter(slide, n, spec.section || "KEDI × RESEARCH AX", !!spec.dark);
}

function bulletsText(items) {
  return items.map((x) => `• ${x}`).join("\n");
}

function drawClaim(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const accent = spec.accent || C.cyan;
  addRect(slide, M, 250, 10, 260, accent, 5);
  addText(slide, spec.claim, M + 42, 242, 1000, 220, spec.claimSize || 54, fg, true);
  if (spec.caption) addText(slide, spec.caption, M + 42, 480, 980, 78, 23, dark ? "#A4A4A4" : C.muted, false);
}

function drawBullets(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  const y = spec.subtitle ? 236 : 210;
  if (spec.lead) addText(slide, spec.lead, M, y, 1080, 62, 30, fg, true);
  addText(slide, bulletsText(spec.items), M, y + (spec.lead ? 84 : 0), 1110, 340, spec.bodySize || 25, fg, false);
  if (spec.bottom) addText(slide, spec.bottom, M, 594, 1120, 46, 20, muted, false);
}

function drawColumns(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  const cols = spec.columns;
  const gap = 30;
  const x0 = M;
  const y0 = spec.subtitle ? 238 : 214;
  const cw = (W - 2 * M - gap * (cols.length - 1)) / cols.length;
  for (let i = 0; i < cols.length; i++) {
    const x = x0 + i * (cw + gap);
    if (i > 0) addRect(slide, x - gap / 2, y0, 1, 350, dark ? "#303030" : C.soft);
    addText(slide, cols[i].label || String(i + 1).padStart(2, "0"), x, y0, cw, 28, 16, cols[i].color || (dark ? C.cyan : C.blue), true);
    addText(slide, cols[i].head, x, y0 + 42, cw, 76, cols[i].headSize || 30, fg, true);
    addText(slide, cols[i].body, x, y0 + 132, cw, 210, cols[i].bodySize || 21, muted, false);
  }
  if (spec.bottom) addText(slide, spec.bottom, M, 602, W - 2 * M, 42, 20, muted, false);
}

function drawSteps(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  const steps = spec.steps;
  const gap = 18;
  const y = spec.subtitle ? 268 : 244;
  const sw = (W - 2 * M - gap * (steps.length - 1)) / steps.length;
  for (let i = 0; i < steps.length; i++) {
    const x = M + i * (sw + gap);
    addText(slide, String(i + 1).padStart(2, "0"), x, y, sw, 26, 15, steps[i].color || (dark ? C.cyan : C.blue), true);
    addRect(slide, x, y + 40, sw, 4, steps[i].color || (dark ? C.cyan : C.blue));
    addText(slide, steps[i].head, x, y + 66, sw, 72, steps[i].headSize || 27, fg, true);
    addText(slide, steps[i].body || "", x, y + 154, sw, 160, 19, muted, false);
  }
  if (spec.bottom) addText(slide, spec.bottom, M, 600, W - 2 * M, 42, 20, muted, false);
}

function drawCompare(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  const y = spec.subtitle ? 242 : 218;
  const gap = 64;
  const cw = (W - 2 * M - gap) / 2;
  [spec.left, spec.right].forEach((col, i) => {
    const x = M + i * (cw + gap);
    addText(slide, col.label, x, y, cw, 26, 16, col.color || (i === 0 ? C.coral : C.cyan), true);
    addText(slide, col.head, x, y + 42, cw, 80, 32, fg, true);
    addText(slide, bulletsText(col.items), x, y + 140, cw, 260, 22, muted, false);
  });
  addRect(slide, W / 2, y, 1, 360, dark ? "#303030" : C.soft);
  if (spec.bottom) addText(slide, spec.bottom, M, 600, W - 2 * M, 42, 20, muted, true, { align: "center" });
}

function drawCode(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const y = spec.subtitle ? 236 : 210;
  addRect(slide, M, y, W - 2 * M, spec.codeHeight || 360, dark ? "#141414" : "#EAEAE7", 12, dark ? "#303030" : "#CDCDC8", 1);
  addText(slide, spec.code, M + 28, y + 24, W - 2 * M - 56, (spec.codeHeight || 360) - 48, spec.codeSize || 20, dark ? "#F1F1F1" : C.ink2, false, { fontFamily: MONO });
  if (spec.bottom) addText(slide, spec.bottom, M, y + (spec.codeHeight || 360) + 18, W - 2 * M, 46, 19, dark ? "#A4A4A4" : C.muted, false);
}

async function drawImageText(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const dark = !!spec.dark;
  const fg = dark ? C.white : C.ink;
  const muted = dark ? "#A4A4A4" : C.muted;
  const y = spec.subtitle ? 228 : 202;
  const imageLeft = spec.imageLeft !== false;
  const iw = spec.imageWidth || 640;
  const gap = 44;
  const tx = imageLeft ? M + iw + gap : M;
  const ix = imageLeft ? M : W - M - iw;
  const tw = imageLeft ? W - M - tx : W - 2 * M - iw - gap;
  await addImage(slide, spec.image, ix, y, iw, spec.imageHeight || 380, spec.fit || "cover", true);
  addText(slide, spec.head, tx, y + 6, tw, 104, spec.headSize || 34, fg, true);
  addText(slide, spec.body, tx, y + 126, tw, 230, spec.bodySize || 22, muted, false);
  if (spec.sourceCaption) addText(slide, spec.sourceCaption, ix, y + (spec.imageHeight || 380) + 8, iw, 24, 13, muted, false);
}

async function drawScreenshot(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const y = spec.subtitle ? 220 : 194;
  const x = spec.cropX || M;
  const w = spec.cropW || W - 2 * M;
  const h = spec.cropH || 426;
  await addImage(slide, spec.image, x, y, w, h, spec.fit || "cover", true);
  if (spec.callout) {
    addRect(slide, W - M - 420, 548, 420, 82, C.ink, 10);
    addText(slide, spec.callout, W - M - 392, 564, 364, 52, 20, C.white, true);
  }
  if (spec.sourceCaption) addText(slide, spec.sourceCaption, M, 628, 1000, 24, 13, C.muted, false);
}

function drawSection(slide, spec) {
  addText(slide, spec.num, M, 74, 240, 100, 78, C.cyan, true);
  addRect(slide, M, 210, 108, 8, C.lime);
  addText(slide, spec.title, M, 260, 1020, 170, 54, C.white, true);
  addText(slide, spec.subtitle, M, 470, 980, 86, 24, "#A4A4A4", false);
}

function drawTimeline(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const y = 286;
  addRect(slide, M, y + 40, W - 2 * M, 5, C.soft);
  const unit = (W - 2 * M) / spec.items.length;
  spec.items.forEach((it, i) => {
    const x = M + i * unit;
    addRect(slide, x, y + 28, 28, 28, it.color || C.cyan, 14);
    addText(slide, it.time, x, y - 8, unit - 10, 26, 15, C.blue, true);
    addText(slide, it.head, x, y + 78, unit - 18, 68, 25, C.ink, true);
    addText(slide, it.body, x, y + 152, unit - 18, 98, 18, C.muted, false);
  });
}

function drawMatrix(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  const x = 250, y = 250, cw = 260, ch = 106;
  addText(slide, spec.yLabel || "영향도 ↑", 72, y + 80, 140, 30, 18, C.muted, true);
  addText(slide, spec.xLabel || "되돌리기 어려움 →", x + 520, y + 350, 350, 30, 18, C.muted, true);
  const colors = [["#DFF5E9", "#FFF0C7", "#FFD8D3"], ["#CDEFE3", "#FFE5A3", "#FFBEB5"], ["#B8E7D6", "#FFD56A", "#FF9B90"]];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      addRect(slide, x + c * cw, y + (2 - r) * ch, cw - 8, ch - 8, colors[r][c], 6);
      addText(slide, spec.cells[r][c], x + c * cw + 14, y + (2 - r) * ch + 20, cw - 36, ch - 32, 19, C.ink, r + c > 2, { align: "center" });
    }
  }
}

function drawChart(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", !!spec.dark);
  slide.charts.add("bar", {
    position: { left: 100, top: 238, width: 760, height: 340 },
    categories: spec.categories,
    series: [{ name: "후보 수", values: spec.values, fill: C.cyan }],
    hasLegend: false,
    dataLabels: { showValue: true, position: "outEnd" },
    yAxis: { majorGridlines: { style: "solid", fill: C.soft, width: 1 } },
  });
  addText(slide, spec.big, 930, 250, 250, 110, 70, C.ink, true, { align: "center" });
  addText(slide, spec.bigLabel, 900, 378, 310, 100, 25, C.muted, true, { align: "center" });
  addText(slide, spec.bottom, 890, 500, 330, 70, 20, C.muted, false, { align: "center" });
}

async function drawGovernance(slide, spec) {
  titleBlock(slide, spec.kicker || spec.section, spec.title, spec.subtitle || "", false);
  const gap = 20;
  const cw = (W - 2 * M - 2 * gap) / 3;
  for (let i = 0; i < spec.items.length; i++) {
    const x = M + i * (cw + gap);
    await addImage(slide, spec.items[i].image, x, 228, cw, 215, "cover", true);
    addText(slide, spec.items[i].head, x, 464, cw, 58, 22, C.ink, true);
    addText(slide, spec.items[i].body, x, 526, cw, 94, 17, C.muted, false);
  }
}

async function renderSpec(pres, spec, n) {
  const slide = baseSlide(pres, !!spec.dark);
  switch (spec.type) {
    case "hero": {
      addText(slide, "한국교육개발원 디지털교육연구실", M, 56, 650, 26, 15, C.cyan, true);
      addText(slide, spec.title, M, 172, 1050, 180, 68, C.white, true);
      addText(slide, spec.subtitle, M, 390, 900, 90, 26, "#A4A4A4", false);
      addRect(slide, M, 536, 240, 8, C.blue);
      addText(slide, spec.meta, M, 570, 850, 36, 18, C.white, false);
      if (spec.speakerName) {
        addText(slide, spec.speakerName, M, 608, 92, 30, 17, C.white, true);
        addText(slide, spec.speakerRole || "", M + 104, 610, 980, 28, 14, "#A4A4A4", false);
      } else if (spec.speaker) {
        addText(slide, spec.speaker, M, 610, 1040, 28, 14, "#A4A4A4", false);
      }
      break;
    }
    case "section": drawSection(slide, spec); break;
    case "claim": drawClaim(slide, spec); break;
    case "bullets": drawBullets(slide, spec); break;
    case "columns": drawColumns(slide, spec); break;
    case "steps": drawSteps(slide, spec); break;
    case "compare": drawCompare(slide, spec); break;
    case "code": drawCode(slide, spec); break;
    case "imageText": await drawImageText(slide, spec); break;
    case "screenshot": await drawScreenshot(slide, spec); break;
    case "timeline": drawTimeline(slide, spec); break;
    case "matrix": drawMatrix(slide, spec); break;
    case "chart": drawChart(slide, spec); break;
    case "governance": await drawGovernance(slide, spec); break;
    default: drawClaim(slide, spec); break;
  }
  noteSlide(slide, spec, n);
}

const specs = [
  {
    type: "hero", dark: true, section: "OPENING", time: "45초",
    title: "Codex 하네스 엔지니어링 기반\n연구 환경 AX 자동화",
    subtitle: "GitHub·Jupyter·근거 추적을 연결해 디지털교육 연구의 속도와 신뢰를 함께 높이는 법",
    meta: "2026.08.07 FRI 15:00–17:00  ·  한국교육개발원 디지털교육연구실",
    note: "제목의 ‘자동화’보다 ‘연구 환경’과 ‘근거 추적’을 강조한다.",
    transition: "오늘의 핵심 질문을 한 문장으로 제시한다.",
  },
  {
    type: "claim", dark: true, section: "OPENING", time: "45초", kicker: "오늘의 질문",
    title: "연구자의 경쟁력은 어디로 이동하는가?",
    claim: "더 빨리 쓰는 사람 →\n더 잘 검증하는 시스템을 설계하는 사람",
    caption: "AI 시대의 희소 자원은 문장 생성 능력이 아니라 연구자의 판단과 주의력이다.",
    note: "참가자가 자동화에 대해 갖고 있는 기대를 ‘판단 설계’로 전환한다.",
  },
  {
    type: "timeline", section: "OPENING", time: "50초", kicker: "2시간 운영",
    title: "100분은 촘촘하게, 15분은 질문에 남겨둡니다",
    items: [
      { time: "15:00", head: "핵심 강의", body: "AX·하네스·프롬프트", color: C.cyan },
      { time: "15:53", head: "라이브 랩", body: "Research-agent 실행", color: C.blue },
      { time: "16:21", head: "거버넌스", body: "안전·윤리·인용", color: C.coral },
      { time: "16:45", head: "Q&A", body: "현장 사례 중심", color: C.lime },
    ],
    note: "버퍼 5분이 있다는 점을 짧게 안내하고 질문은 메모해 달라고 요청한다.",
  },
  {
    type: "columns", section: "OPENING", time: "50초", kicker: "학습 목표",
    title: "오늘 끝날 때 네 가지를 직접 할 수 있습니다",
    columns: [
      { label: "EXPLAIN", head: "설명", body: "프롬프트와 하네스 엔지니어링의 차이를 설명한다." },
      { label: "SPECIFY", head: "명세", body: "연구 요청을 목표·맥락·제약·완료조건으로 쓴다." },
      { label: "RUN", head: "실행", body: "GitHub와 노트북으로 산출물과 변경을 추적한다." },
      { label: "GOVERN", head: "통제", body: "AI 활용 범위를 위험과 근거 수준으로 결정한다." },
    ],
    note: "학습 목표를 기능이 아닌 행동으로 읽는다.",
  },
  {
    type: "bullets", section: "OPENING", time: "1분 10초", kicker: "빠른 진단",
    title: "연구 시간은 주로 어디에서 사라집니까?",
    lead: "손을 들어 가장 큰 한 가지를 골라보세요.",
    items: ["검색식 만들기와 재검색", "PDF·메타데이터 정리", "표·코드·파일의 재작업", "초안의 근거 확인", "공동연구자 피드백 반영"],
    bottom: "정답은 없습니다. 반복되고 검증 가능한 일이 파일럿 후보입니다.",
    note: "참가자의 응답 2~3개를 받아 뒤의 사례에 연결한다.",
  },

  { type: "section", dark: true, section: "1 · AX SHIFT", num: "01", time: "30초", title: "AX는 도구 도입이 아니라\n업무 재설계입니다", subtitle: "챗봇을 추가하는 순간이 아니라, 업무의 입력·산출물·검증·책임이 다시 연결될 때 전환이 시작됩니다." },
  {
    type: "columns", section: "1 · AX SHIFT", time: "1분", kicker: "세 단계",
    title: "자동화·증강·전환은 같은 말이 아닙니다",
    columns: [
      { label: "AUTOMATE", head: "자동화", body: "반복 절차를 더 빠르게 실행\n예: 서지정보 정규화" },
      { label: "AUGMENT", head: "증강", body: "사람의 판단을 더 넓게 보조\n예: 검색식 대안 생성" },
      { label: "TRANSFORM", head: "전환", body: "업무 단위와 승인 구조를 재설계\n예: claim 단위 검증" },
    ],
    bottom: "AX의 목표는 ‘AI 사용량’이 아니라 더 좋은 업무 결과입니다.",
  },
  {
    type: "steps", section: "1 · AX SHIFT", time: "1분", kicker: "업무 환경의 진화",
    title: "대화형 보조에서 인간이 이끄는 시스템으로 이동합니다",
    steps: [
      { head: "Chat assistant", body: "사람이 묻고\nAI가 답한다" },
      { head: "Tool-using agent", body: "파일·코드·검색을\n직접 다룬다" },
      { head: "Human-led system", body: "경계와 승인 안에서\n여러 작업을 연결한다" },
    ],
    bottom: "단계가 올라갈수록 프롬프트보다 환경 설계가 중요해집니다.",
    sources: [urls.openaiHarness],
  },
  {
    type: "imageText", section: "1 · AX SHIFT", time: "1분 20초", kicker: "산업 신호",
    title: "리더의 81%는 에이전트가 AI 전략에 들어올 것으로 봅니다",
    image: img("web_screenshots/microsoft_frontier_firm.jpg"), imageLeft: true, imageWidth: 650, imageHeight: 380,
    head: "82%\n전략·운영 재고의 분기점",
    body: "Microsoft의 2025 Work Trend Index는 31개국 31,000명을 조사했습니다. 81%의 리더는 향후 12–18개월 내 에이전트가 AI 전략에 중간 이상으로 통합될 것으로 예상했습니다.",
    sourceCaption: "Source: Microsoft Work Trend Index 2025",
    sources: [urls.microsoft],
    note: "수치는 전망이므로 확정된 미래가 아니라 조직 설계 신호로 해석한다.",
  },
  {
    type: "steps", section: "1 · AX SHIFT", time: "1분", kicker: "FRONTIER FIRM",
    title: "업무는 세 단계로 재편됩니다",
    steps: [
      { head: "1. 보조자", body: "개인의 생산성을\n돕는 AI" },
      { head: "2. 디지털 동료", body: "사람의 지시에 따라\n특정 업무 수행" },
      { head: "3. 인간–에이전트 팀", body: "업무 흐름 전체를\n함께 운영" },
    ],
    bottom: "연구조직에서는 ‘논문을 쓰는 AI’보다 ‘검증 가능한 연구팀 구성’이 핵심입니다.",
    sources: [urls.microsoft],
  },
  {
    type: "columns", section: "1 · AX SHIFT", time: "1분", kicker: "새로운 연구 역량",
    title: "연구자는 ‘agent boss’처럼 네 가지 일을 하게 됩니다",
    columns: [
      { label: "DEFINE", head: "정의", body: "문제와 성공조건" },
      { label: "DELEGATE", head: "위임", body: "작업·도구·경계" },
      { label: "EVALUATE", head: "평가", body: "근거·품질·오류" },
      { label: "ORCHESTRATE", head: "조율", body: "사람·AI·승인" },
    ],
    sources: [urls.microsoft, urls.openaiBest],
  },
  {
    type: "claim", dark: true, section: "1 · AX SHIFT", time: "50초", kicker: "GitHub의 역할",
    title: "GitHub는 코드 저장소를 넘어섭니다",
    claim: "조직의 기억을\n버전으로 남기는 운영체제",
    caption: "무엇을, 왜, 누가 바꿨는지 검토하고 되돌릴 수 있어야 연구 자동화가 조직 자산이 됩니다.",
    sources: [urls.githubRepo, urls.openaiHarness],
  },
  {
    type: "steps", section: "1 · AX SHIFT", time: "1분", kicker: "AI-NATIVE WORK",
    title: "AI-native 업무는 실행 가능하고 관찰 가능해야 합니다",
    steps: [
      { head: "Versioned", body: "입력·규칙·산출물의\n변경 이력" },
      { head: "Executable", body: "누구나 같은 절차를\n다시 실행" },
      { head: "Observable", body: "로그·테스트·검토로\n결과 확인" },
      { head: "Recoverable", body: "오류가 나면\n되돌리기" },
    ],
    sources: [urls.openaiHarness],
  },
  {
    type: "compare", section: "1 · AX SHIFT", time: "1분", kicker: "업무 단위의 변화",
    title: "문서 중심에서 파이프라인과 claim 중심으로 이동합니다",
    left: { label: "BEFORE", head: "문서가 단위", items: ["파일마다 맥락이 흩어짐", "최종본만 보임", "근거 확인이 사후 작업"] },
    right: { label: "AFTER", head: "흐름과 claim이 단위", items: ["입력과 산출물이 연결됨", "변경 이유가 기록됨", "근거 확인이 작업 중 내장"] },
  },
  {
    type: "bullets", section: "1 · AX SHIFT", time: "50초", kicker: "변하지 않는 것",
    title: "AI가 강해져도 연구 책임은 이동하지 않습니다",
    items: ["연구문제의 가치와 범위를 결정하는 책임", "방법론의 타당성을 설명하는 책임", "참여자와 데이터의 권리를 보호하는 책임", "근거를 해석하고 결론의 강도를 조절하는 책임"],
    bottom: "위임 가능한 것은 작업입니다. 책임은 사람에게 남습니다.",
    sources: [urls.unesco],
  },
  {
    type: "columns", section: "1 · AX SHIFT", time: "1분 10초", kicker: "KEDI 적용 지도",
    title: "디지털교육 연구의 네 구간에서 바로 시작할 수 있습니다",
    columns: [
      { label: "DISCOVER", head: "탐색", body: "정책·논문 모니터링\n검색식 대안\n메타데이터 정리" },
      { label: "ANALYZE", head: "분석", body: "코드 초안\n결측·이상치 점검\n표 재현" },
      { label: "WRITE", head: "작성", body: "구조·초안\n용어 일관성\n도표 설명" },
      { label: "REVIEW", head: "검토", body: "인용 감사\n반론 생성\n수정 backlog" },
    ],
  },
  {
    type: "compare", dark: true, section: "1 · AX SHIFT", time: "55초", kicker: "가속의 양면",
    title: "AI는 좋은 프로세스와 나쁜 프로세스를 모두 증폭합니다",
    left: { label: "DISCIPLINE", head: "좋은 규칙을 만나면", items: ["재현성", "추적성", "검토 속도"] },
    right: { label: "DISORDER", head: "경계가 없으면", items: ["환각의 대량생산", "근거 없는 확신", "재작업과 책임 공백"] },
    bottom: "따라서 첫 투자는 모델보다 하네스입니다.",
  },
  {
    type: "claim", dark: true, section: "1 · AX SHIFT", time: "40초", kicker: "첫 번째 결론",
    title: "도입 질문을 바꿉니다",
    claim: "“어떤 챗봇을 살까?”가 아니라\n“어떤 연구 하네스를 만들까?”",
    caption: "하네스는 AI가 일을 잘하도록 만드는 문서·도구·경계·검증·기록의 결합입니다.",
    sources: [urls.openaiHarness],
  },

  { type: "section", dark: true, section: "2 · HARNESS", num: "02", time: "30초", title: "Harness engineering:\nAI가 일할 수 있는 환경을 설계합니다", subtitle: "좋은 모델을 고르는 일에서 멈추지 않고, 모델이 반복해서 좋은 일을 하도록 작업 환경을 명세합니다." },
  {
    type: "claim", section: "2 · HARNESS", time: "1분", kicker: "정의",
    title: "하네스는 모델을 둘러싼 운영 환경입니다",
    claim: "Model + Context + Tools + Constraints\n+ Feedback + Audit trail",
    claimSize: 47,
    caption: "프롬프트 하나가 아니라 맥락, 도구, 경계, 검증, 변경 기록이 함께 작동합니다.",
    sources: [urls.openaiHarness, urls.openaiBest],
  },
  {
    type: "claim", dark: true, section: "2 · HARNESS", time: "50초", kicker: "신뢰도 공식",
    title: "하네스의 품질은 곱셈입니다",
    claim: "Legibility × Boundaries × Verification",
    claimSize: 56,
    caption: "어느 하나가 0이면 전체 신뢰도도 0에 가까워집니다.",
    sources: [urls.openaiHarness],
  },
  {
    type: "compare", section: "2 · HARNESS", time: "1분", kicker: "차이",
    title: "프롬프트는 요청을, 하네스는 시스템을 개선합니다",
    left: { label: "PROMPT ENGINEERING", head: "한 작업의 명확성", items: ["목표와 맥락", "출력 형식", "완료조건"] },
    right: { label: "HARNESS ENGINEERING", head: "반복 시스템의 신뢰성", items: ["지속 규칙과 도구", "검증 루프", "버전과 감사"] },
    bottom: "좋은 프롬프트는 하네스의 한 구성요소입니다.",
    sources: [urls.openaiBest],
  },
  {
    type: "columns", section: "2 · HARNESS", time: "1분 15초", kicker: "6개 레이어",
    title: "Research-agent는 여섯 층으로 읽을 수 있습니다",
    columns: [
      { label: "01", head: "Guidance", body: "AGENTS.md\n어디서 무엇을 읽는가" },
      { label: "02–03", head: "Procedure + Policy", body: "commands/ · policies/\n반복 순서와 품질·안전 기준", headSize: 27 },
      { label: "04–06", head: "Run & Record", body: "notebooks/ · workspace/ · GitHub\n실행·산출물·변경통제" },
    ],
    sources: [local("README.md")],
  },
  {
    type: "screenshot", section: "2 · HARNESS", time: "1분 10초", kicker: "실제 저장소",
    title: "저장소 구조 자체가 AI와 사람을 위한 연구 지도입니다",
    image: img("web_screenshots/github_research_agent.jpg"), fit: "cover", cropH: 418,
    sourceCaption: "Source: github.com/smilesjcha/research-agent",
    callout: "README → commands → policies → notebooks → workspace",
    sources: [urls.githubRepo],
  },
  {
    type: "code", dark: true, section: "2 · HARNESS", time: "1분", kicker: "AGENTS.MD",
    title: "짧은 헌법이 에이전트의 기본 행동을 고정합니다",
    code: `먼저 읽기\n1. README.md\n2. docs/harness/workflow.md\n3. policies/citation_grounding_policy.md\n\n원칙\n- DOI·저자·연도·페이지를 만들지 않는다\n- 근거 부족 문장은 VERIFY\n- 새 산출물은 workspace/ 또는 references/`,
    codeSize: 21, codeHeight: 350,
    bottom: "AGENTS.md는 백과사전이 아니라 정확한 출발점과 금지선을 제공합니다.",
    sources: [local("AGENTS.md"), urls.openaiAgents],
  },
  {
    type: "bullets", section: "2 · HARNESS", time: "55초", kicker: "COMMANDS",
    title: "commands/는 반복 업무를 실행 가능한 SOP로 바꿉니다",
    lead: "동일한 요청에 동일한 점검 항목과 산출물 형식을 적용합니다.",
    items: ["00 상태 진단 → 01 질문 범위화 → 02 문헌검색 점검", "03 PDF 인입 → 04 근거 추출 → 05 문헌 분류", "06 아이디어 → 07 초록 → 08 원고 → 09 리뷰 → 10 인용감사"],
    sources: [local("commands/00_start_session.md"), local("commands/10_audit_citations.md")],
  },
  {
    type: "columns", section: "2 · HARNESS", time: "1분", kicker: "POLICIES",
    title: "정책 파일은 품질 판단을 기계가 읽을 수 있게 만듭니다",
    columns: [
      { label: "EVIDENCE", head: "근거 등급", body: "원문·방법·수치·위치에 따라 1–5점" },
      { label: "REFERENCE", head: "문헌 역할", body: "core / supporting / background / excluded" },
      { label: "REVIEW", head: "거절 위험", body: "novelty·rigor·grounding 등 6축" },
    ],
    sources: [local("policies/evidence_quality_rubric.md"), local("policies/reference_ranking_policy.md"), local("policies/manuscript_review_policy.md")],
  },
  {
    type: "claim", section: "2 · HARNESS", time: "50초", kicker: "NOTEBOOKS",
    title: "노트북은 ‘코드 파일’이 아니라 재현 가능한 연구 도구입니다",
    claim: "입력 + 실행 + 출력 + 설명",
    caption: "검색 날짜와 필터, 점수 계산, 저장 경로를 한 화면에서 재현하고 검토합니다.",
    sources: [local("notebooks/01_search_papers.ipynb"), local("notebooks/02_score_quality.ipynb")],
  },
  {
    type: "steps", section: "2 · HARNESS", time: "1분", kicker: "WORKSPACE",
    title: "workspace/는 연구 진행 상태를 파일로 표현합니다",
    steps: [
      { head: "Question", body: "01_research_question" },
      { head: "Map & Idea", body: "02_literature_map\n03_idea_backlog" },
      { head: "Draft", body: "04_abstract\n05_outline\n06_manuscript" },
      { head: "Review", body: "07_scorecard\n08_citation_audit" },
    ],
    sources: [local("docs/harness/workflow.md")],
  },
  {
    type: "steps", section: "2 · HARNESS", time: "1분", kicker: "GITHUB CHANGE CONTROL",
    title: "변경은 제안되고, 검토되고, 되돌릴 수 있어야 합니다",
    steps: [
      { head: "Branch", body: "작업 격리" },
      { head: "Commit", body: "작은 변경 단위" },
      { head: "Pull request", body: "근거와 검증 공개" },
      { head: "Review & merge", body: "사람의 승인과 기록" },
      { head: "Rollback", body: "문제 시 복구" },
    ],
    sources: [urls.openaiGithub, urls.openaiHarness],
  },
  {
    type: "steps", dark: true, section: "2 · HARNESS", time: "1분", kicker: "FEEDBACK LOOP",
    title: "한 번의 답변을 학습하는 운영 루프로 바꿉니다",
    steps: [
      { head: "Intent", body: "목표·제약" },
      { head: "Action", body: "도구 실행" },
      { head: "Artifact", body: "파일·표·코드" },
      { head: "Test", body: "불변조건" },
      { head: "Review", body: "사람 판단" },
      { head: "Rule update", body: "재발 방지" },
    ],
    sources: [urls.openaiHarness, urls.openaiBest],
  },
  {
    type: "imageText", section: "2 · HARNESS", time: "1분 10초", kicker: "PROGRESSIVE DISCLOSURE",
    title: "지도를 주고, 1,000쪽 매뉴얼은 피합니다",
    image: img("web_screenshots/openai_harness_engineering.jpg"), imageLeft: false, imageWidth: 610, imageHeight: 370,
    head: "짧은 AGENTS.md\n→ 구조화된 docs/",
    body: "OpenAI의 하네스 사례는 거대한 단일 지침이 맥락을 잠식하고 빠르게 낡는다고 설명합니다. 짧은 목차에서 필요한 문서로 점진적으로 들어가게 합니다.",
    sourceCaption: "Source: OpenAI, Harness engineering (2026)",
    sources: [urls.openaiHarness],
  },
  {
    type: "columns", section: "2 · HARNESS", time: "55초", kicker: "DEFINITION OF DONE",
    title: "완료는 파일 생성이 아니라 검증 증거까지입니다",
    columns: [
      { label: "ARTIFACT", head: "산출물", body: "요청한 파일과 구조가 생겼는가?" },
      { label: "VERIFY", head: "검증", body: "테스트·표본검수·원문 대조를 했는가?" },
      { label: "REVIEW", head: "검토", body: "변경 이유와 남은 위험이 기록되었는가?" },
    ],
    sources: [urls.openaiBest],
  },
  {
    type: "steps", section: "2 · HARNESS", time: "1분", kicker: "AUTONOMY LADDER",
    title: "자율성은 한 번에 켜는 스위치가 아닙니다",
    steps: [
      { head: "L0 설명", body: "읽고 답하기" },
      { head: "L1 초안", body: "사람이 복사·적용" },
      { head: "L2 실행", body: "허용된 범위에서 파일 생성" },
      { head: "L3 변경 제안", body: "PR·검증 후 승인" },
      { head: "L4 자동화", body: "안정된 반복 작업만" },
    ],
    bottom: "영향이 크고 되돌리기 어려울수록 사람의 승인 지점을 앞에 둡니다.",
    sources: [urls.openaiBest, urls.openaiHarness],
  },
  {
    type: "bullets", dark: true, section: "2 · HARNESS", time: "1분 10초", kicker: "MICRO ACTIVITY",
    title: "이 실패에는 어떤 하네스 층이 빠졌습니까?",
    lead: "AI가 50편을 찾았지만 검색 날짜가 없고, DOI 두 개는 틀렸고, 원본 CSV를 덮어썼습니다.",
    items: ["Guidance?", "Procedure?", "Policy?", "Instrument?", "Artifact state?", "Change control?"],
    bottom: "정답: 하나가 아니라 provenance·인용 정책·쓰기 경계·버전 관리가 함께 필요합니다.",
  },

  { type: "section", dark: true, section: "3 · PROMPT", num: "03", time: "30초", title: "Prompt engineering:\n질문을 작업 계약으로 바꿉니다", subtitle: "좋은 프롬프트는 길어서 좋은 것이 아니라, 선택과 검증의 기준을 명확하게 만듭니다." },
  {
    type: "steps", section: "3 · PROMPT", time: "50초", kicker: "성숙도",
    title: "좋은 요청은 반복 가능한 시스템으로 진화합니다",
    steps: [
      { head: "질문", body: "한 번의 답" },
      { head: "명세", body: "목표·제약·완료" },
      { head: "Command", body: "반복 가능한 SOP" },
      { head: "Policy-backed", body: "품질 기준과 검증" },
    ],
    sources: [urls.openaiBest],
  },
  {
    type: "columns", dark: true, section: "3 · PROMPT", time: "1분", kicker: "기본 4요소",
    title: "Goal · Context · Constraints · Done when",
    columns: [
      { label: "GOAL", head: "무엇을 바꿀까", body: "활동이 아니라 결과" },
      { label: "CONTEXT", head: "무엇을 볼까", body: "파일·데이터·현재 상태" },
      { label: "CONSTRAINTS", head: "무엇을 지킬까", body: "범위·안전·표준" },
      { label: "DONE WHEN", head: "어떻게 끝낼까", body: "검증 가능한 완료조건" },
    ],
    sources: [urls.openaiBest],
  },
  {
    type: "columns", section: "3 · PROMPT", time: "1분", kicker: "연구용 5요소",
    title: "연구 프롬프트에는 증거와 검증을 앞에 둡니다",
    columns: [
      { label: "RQ", head: "Research question", body: "대상·개입·결과·맥락" },
      { label: "EVIDENCE", head: "Evidence", body: "데이터베이스·기간·원문 수준" },
      { label: "BOUNDARY", head: "Boundaries", body: "금지·권한·개인정보" },
      { label: "OUTPUT + VERIFY", head: "Output & Verify", body: "스키마·경로·검증 상태" },
    ],
  },
  {
    type: "claim", dark: true, section: "3 · PROMPT", time: "45초", kicker: "약한 프롬프트",
    title: "무엇이 빠졌는지 찾아보세요",
    claim: "“AI 교육 관련 좋은 논문을\n찾아서 정리해줘.”",
    claimSize: 58,
    caption: "‘좋은’, ‘관련’, ‘정리’의 기준이 없고 후보 검색과 인용 확정을 구분하지 않습니다.",
  },
  {
    type: "code", section: "3 · PROMPT", time: "1분 10초", kicker: "강한 프롬프트",
    title: "검색·산출물·검증 수준을 한 번에 명세합니다",
    code: `Goal: 2020–2026년 영어 논문 후보 50편을 OpenAlex에서 수집한다.\nContext: workspace/01_research_question.md와 data/topic_keywords.txt를 먼저 읽는다.\nConstraints: 제목·초록 검색, 실행일과 필터 기록, 결과는 후보일 뿐 핵심 인용으로 확정하지 않는다.\nOutput: data/papers_raw.csv와 data/search_strategy.md.\nDone when: 50행, 필수 열, query/year/language/run_date가 검증되고 DOI 누락은 빈칸으로 남는다.`,
    codeSize: 19, codeHeight: 348,
    sources: [urls.openaiBest, local("commands/02_search_literature.md")],
  },
  {
    type: "columns", section: "3 · PROMPT", time: "1분", kicker: "PROMPT PATCH",
    title: "모호한 단어를 운영 가능한 언어로 바꿉니다",
    columns: [
      { label: "‘관련’", head: "→ 검색 필드", body: "title_and_abstract\n영어\n2020–2026" },
      { label: "‘좋은’", head: "→ 평가 기준", body: "관련성·방법·원문\n인용수는 보조" },
      { label: "‘정리’", head: "→ 출력 스키마", body: "열·상태·경로\n결측 처리" },
      { label: "‘완료’", head: "→ acceptance", body: "행 수·검증·diff\n남은 VERIFY" },
    ],
  },
  {
    type: "claim", section: "3 · PROMPT", time: "50초", kicker: "PROGRESSIVE DISCLOSURE",
    title: "저장소를 붙여넣지 말고, 읽을 경로를 알려줍니다",
    claim: "“AGENTS.md → workflow.md →\n이번 단계의 command와 policy를 읽어라.”",
    claimSize: 46,
    caption: "맥락을 줄이는 것이 아니라, 필요한 맥락을 찾는 길을 제공합니다.",
    sources: [urls.openaiHarness, urls.openaiAgents],
  },
  {
    type: "columns", section: "3 · PROMPT", time: "1분", kicker: "EVIDENCE STATE",
    title: "검증 상태를 단어로 고정하면 과장이 줄어듭니다",
    columns: [
      { label: "VERIFIED", head: "원문 확인", body: "페이지·절과 직접 지지" },
      { label: "ABSTRACT_ONLY", head: "예비 판단", body: "후보 분류만 가능" },
      { label: "VERIFY", head: "확인 필요", body: "근거 위치·메타데이터 부족" },
      { label: "EXCLUDED", head: "제외", body: "관련성·품질·중복 문제" },
    ],
    sources: [local("policies/citation_grounding_policy.md"), local("policies/reference_ranking_policy.md")],
  },
  {
    type: "steps", dark: true, section: "3 · PROMPT", time: "1분", kicker: "STAGE SEPARATION",
    title: "발견·생성·검증을 한 번에 섞지 않습니다",
    steps: [
      { head: "Discover", body: "폭넓게 후보를\n찾는다" },
      { head: "Generate", body: "구조와 대안을\n만든다" },
      { head: "Verify", body: "원문·데이터·규칙으로\n대조한다" },
    ],
    bottom: "같은 모델을 써도 역할을 분리하면 오류를 발견할 지점이 생깁니다.",
  },
  {
    type: "code", section: "3 · PROMPT", time: "55초", kicker: "STRUCTURED OUTPUT",
    title: "출력 구조가 다음 작업의 입력이 됩니다",
    code: `{\n  "claim_id": "C-014",\n  "sentence": "...",\n  "source": "paper_id",\n  "location": "p. 12 / Results",\n  "support_level": "full | partial | weak | missing | wrong",\n  "status": "verified | VERIFY"\n}`,
    codeSize: 21, codeHeight: 352,
    sources: [local("commands/10_audit_citations.md")],
  },
  {
    type: "compare", section: "3 · PROMPT", time: "1분", kicker: "TOOL BOUNDARY",
    title: "읽기와 쓰기의 권한을 분리해서 요청합니다",
    left: { label: "READ — 기본 허용", head: "자율 탐색", items: ["repo 파일 읽기", "공개 API 조회", "상태·diff 확인"] },
    right: { label: "WRITE — 경계 명시", head: "승인과 범위", items: ["workspace/만 생성", "원본 덮어쓰기 금지", "외부 전송·삭제는 승인"] },
    bottom: "최소 권한은 속도를 늦추는 장치가 아니라 실수의 반경을 줄이는 장치입니다.",
    sources: [urls.openaiBest],
  },
  {
    type: "code", dark: true, section: "3 · PROMPT", time: "1분", kicker: "ADVERSARIAL REVIEW",
    title: "AI에게 초안을 지지하지 말고 거절 사유를 찾게 합니다",
    code: `초안을 옹호하지 말고 reject risk를 먼저 찾아라.\n\n검사:\n- 인용이 없는 사실 주장\n- 출처보다 강한 overclaim\n- abstract_only를 verified처럼 쓴 문장\n- 관련은 있지만 직접 지지하지 않는 weak citation\n\n출력: claim_id · 위험 라벨 · 근거 · 수정안 · 사람 확인 지점`,
    codeSize: 20, codeHeight: 350,
    sources: [local("policies/manuscript_review_policy.md"), local("commands/10_audit_citations.md")],
  },
  {
    type: "steps", section: "3 · PROMPT", time: "1분", kicker: "PROMPT CHAIN",
    title: "각 프롬프트는 상태를 바꾸고 산출물을 넘깁니다",
    steps: [
      { head: "RQ", body: "01_research_question" },
      { head: "Search", body: "papers_raw.csv" },
      { head: "Rank", body: "literature_map" },
      { head: "Draft", body: "manuscript" },
      { head: "Audit", body: "citation_audit" },
    ],
    sources: [local("docs/harness/workflow.md")],
  },
  {
    type: "timeline", section: "3 · PROMPT", time: "1분", kicker: "REUSABLE PROMPT LIBRARY",
    title: "commands/00–10은 연구 생애주기를 하나의 언어로 만듭니다",
    items: [
      { time: "00–02", head: "Scope & Search", body: "상태·질문·검색" },
      { time: "03–05", head: "Evidence", body: "PDF·근거·분류" },
      { time: "06–08", head: "Create", body: "아이디어·초록·원고" },
      { time: "09–10", head: "Review", body: "점수·인용감사" },
    ],
    sources: [local("commands")],
  },
  {
    type: "bullets", dark: true, section: "3 · PROMPT", time: "4분", kicker: "HANDS-ON 1",
    title: "4분: 약한 프롬프트를 작업 계약으로 고쳐보세요",
    lead: "“AI 교육 관련 좋은 논문을 찾아서 정리해줘.”",
    items: ["Goal — 어떤 결과?", "Context — 무엇을 먼저 읽나?", "Constraints — 기간·출처·금지선?", "Done when — 어떤 파일과 검증?"],
    bottom: "옆 사람과 한 문장씩 교환해 모호한 단어를 표시합니다.",
  },
  {
    type: "code", section: "3 · PROMPT", time: "1분 10초", kicker: "DEBRIEF",
    title: "한 가지 가능한 답: 후보와 근거를 구분합니다",
    code: `workspace/01_research_question.md를 읽고 OpenAlex에서 2020–2026년 영어 논문 후보 50편을 수집하라.\n제목·초록 검색 필드와 실행일을 기록하고, 결과는 data/papers_raw.csv와 data/search_strategy.md에 저장하라.\n후보를 핵심 인용으로 확정하지 말고 abstract_only로 표시하라.\n완료 전에 행 수, 필수 열, 검색식, 기간, 언어, run_date를 검증하고 남은 결측을 보고하라.`,
    codeSize: 20, codeHeight: 330,
    sources: [local("notebooks/01_search_papers.ipynb"), local("policies/citation_grounding_policy.md")],
  },

  { type: "section", dark: true, section: "4 · LIVE LAB", num: "04", time: "30초", title: "Research-agent live lab:\n검색부터 인용 감사까지", subtitle: "실제 GitHub 저장소와 Jupyter 노트북으로 입력–산출물–검증–기록이 연결되는 모습을 봅니다." },
  {
    type: "claim", section: "4 · LIVE LAB", time: "45초", kicker: "PRACTICE TOPIC",
    title: "하나의 주제로 전체 파이프라인을 관통합니다",
    claim: "AI-supported formative feedback\nfor self-regulated learning",
    claimSize: 48,
    caption: "교육공학에서 AI 기반 형성적 피드백이 자기조절학습에 어떤 영향을 미치는가?",
    sources: [local("workspace/00_project_brief.md")],
  },
  {
    type: "columns", section: "4 · LIVE LAB", time: "1분", kicker: "9-STAGE PIPELINE",
    title: "검색이 끝이 아니라 검증 가능한 원고가 끝입니다",
    columns: [
      { label: "01–03", head: "Scope → Search → Score", body: "질문을 검색 계약으로 바꾸고\n후보를 수집해 읽을 순서를 정합니다.", headSize: 25 },
      { label: "04–06", head: "Rank → Ideate → Draft", body: "후보의 역할을 나누고\n연구 공백에서 원고를 만듭니다.", headSize: 25 },
      { label: "07–09", head: "Review → Audit → Update", body: "거절 위험과 인용을 감사하고\n발견한 실패를 규칙으로 환류합니다.", headSize: 25 },
    ],
    bottom: "모든 단계는 입력–산출물–검증–기록의 같은 계약을 공유합니다.",
    sources: [local("docs/harness/workflow.md")],
  },
  {
    type: "code", dark: true, section: "4 · LIVE LAB", time: "1분", kicker: "DEMO SETUP",
    title: "4개 명령으로 같은 환경을 엽니다",
    code: `$ git clone https://github.com/smilesjcha/research-agent.git\n$ cd research-agent\n$ pip install -r requirements.txt\n$ jupyter notebook`,
    codeSize: 25, codeHeight: 270,
    bottom: "실행 전 git status로 현재 변경 상태를 확인하고 원본 노트북을 덮어쓰지 않습니다.",
    sources: [urls.githubRepo, local("README.md")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분 10초", kicker: "NOTEBOOK 00",
    title: "첫 번째 노트북은 연구질문을 검색 계약으로 바꿉니다",
    image: img("notebook_screenshots/00_topic_scoping_full.png"), cropH: 418, fit: "cover",
    callout: "RQ · QUERY · KEYWORDS · YEAR · FIELD · LANGUAGE",
    sources: [local("notebooks/00_topic_scoping.ipynb")],
  },
  {
    type: "code", section: "4 · LIVE LAB", time: "50초", kicker: "FIRST ARTIFACT",
    title: "노트북의 출력은 다음 단계의 계약 파일이 됩니다",
    code: `TOPIC_KO=교육공학에서 AI 기반 형성적 피드백이 자기조절학습에 미치는 영향\nRESEARCH_QUESTION=How does AI-supported formative feedback influence SRL...?\nQUERY=AI feedback self-regulated learning educational technology\nFROM_YEAR=2020\nTO_YEAR=2026\nSEARCH_FIELD=title_and_abstract\nLANGUAGE=en`,
    codeSize: 19, codeHeight: 354,
    sources: [local("data/topic_keywords.txt")],
  },
  {
    type: "code", dark: true, section: "4 · LIVE LAB", time: "50초", kicker: "SCOPING PROMPT",
    title: "범위를 좁힐 때 선택과 trade-off를 요구합니다",
    code: `workspace/00_project_brief.md와 workspace/01_research_question.md를 읽어라.\n\n출력:\n- 연구 질문 후보 5개\n- 영어 검색 키워드\n- 너무 넓은 부분\n- 실행 가능성\n- 내가 선택해야 할 기준`,
    codeSize: 22, codeHeight: 332,
    sources: [local("commands/01_scope_research_question.md")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분 10초", kicker: "NOTEBOOK 01",
    title: "OpenAlex 호출은 검색식과 필터를 코드로 남깁니다",
    image: img("notebook_screenshots/01_search_papers_s02.jpg"), cropH: 418, fit: "cover",
    callout: "API · filter · cursor · per-page · run date",
    sources: [local("notebooks/01_search_papers.ipynb"), urls.openalexList],
  },
  {
    type: "columns", section: "4 · LIVE LAB", time: "1분", kicker: "SEARCH PROVENANCE",
    title: "재현성은 검색 결과가 아니라 검색 기록에서 시작합니다",
    columns: [
      { label: "WHAT", head: "Query", body: "키워드와 검색 필드" },
      { label: "WHEN", head: "Run date", body: "검색 실행 날짜" },
      { label: "WHERE", head: "Source", body: "OpenAlex Works API" },
      { label: "HOW", head: "Filters", body: "연도·언어·cursor" },
    ],
    sources: [urls.openalexWorks, local("data/search_strategy.md")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "55초", kicker: "SEARCH OUTPUT",
    title: "50편을 가져온 순간은 ‘완료’가 아니라 후보 풀의 시작입니다",
    image: img("notebook_screenshots/01_search_papers_s03.jpg"), cropH: 418, fit: "cover",
    callout: "50 papers fetched → papers_raw.csv",
    sources: [local("notebooks/01_search_papers.ipynb"), local("data/papers_raw.csv")],
  },
  {
    type: "compare", dark: true, section: "4 · LIVE LAB", time: "55초", kicker: "NOISE TRAP",
    title: "관련성은 품질도, 인용 가능성도 아닙니다",
    left: { label: "CANDIDATE", head: "메타데이터 단계", items: ["제목·초록 일치", "인용수·연도", "venue·OA 링크"] },
    right: { label: "EVIDENCE", head: "원문 단계", items: ["방법과 표본", "결과와 한계", "페이지·절 직접 지지"] },
    bottom: "검색 API는 후보를 만들고, 연구자가 근거를 확정합니다.",
    sources: [local("policies/citation_grounding_policy.md"), local("policies/reference_ranking_policy.md")],
  },
  {
    type: "columns", section: "4 · LIVE LAB", time: "1분 15초", kicker: "NOTEBOOK 02",
    title: "품질 점수는 읽을 순서를 정하는 투명한 휴리스틱입니다",
    columns: [
      { label: "25%", head: "인용 백분위", body: "cited_by_count" },
      { label: "25%", head: "연식 보정", body: "citations_per_year" },
      { label: "25%", head: "주제 관련성", body: "keyword hits" },
      { label: "25%", head: "기타", body: "최신성 15 + venue 5 + abstract 5" },
    ],
    bottom: "가중치는 연구 목적에 따라 조정하고, 최종 core 분류는 원문 검토로 덮어씁니다.",
    sources: [local("notebooks/02_score_quality.ipynb")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분", kicker: "RANKED OUTPUT",
    title: "상위 후보를 표로 보면 검토 우선순위가 선명해집니다",
    image: img("notebook_screenshots/02_score_quality_s02.jpg"), cropH: 418, fit: "cover",
    callout: "quality_score ≠ truth · reading priority",
    sources: [local("notebooks/02_score_quality.ipynb"), local("data/papers_scored.csv")],
  },
  {
    type: "chart", section: "4 · LIVE LAB", time: "1분", kicker: "LOCAL DATA",
    title: "50편은 세 역할의 후보로 분리됩니다",
    categories: ["core 후보", "supporting 후보", "background 후보"],
    values: [13, 18, 19],
    big: "50",
    bigLabel: "총 후보 논문",
    bottom: "screen_out 0\n현재 키워드가 넓어 배경 후보가 가장 많음",
    sources: [local("data/papers_scored.csv")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분 20초", kicker: "SILENT FAILURE",
    title: "실행 성공은 의도대로 작동했다는 뜻이 아닙니다",
    image: img("notebook_screenshots/02_score_quality_s01.jpg"), cropH: 418, fit: "cover",
    callout: "보이지 않는 제어문자 → word boundary 오작동 가능",
    sources: [local("notebooks/02_score_quality.ipynb")],
    note: "정규식의 \\b가 제어문자 U+0008로 저장된 현상을 설명한다. 코드 실행과 의미 검증의 차이를 강조한다.",
  },
  {
    type: "code", dark: true, section: "4 · LIVE LAB", time: "1분 10초", kicker: "HARNESS FIX",
    title: "실패를 발견하면 더 강한 프롬프트가 아니라 테스트를 추가합니다",
    code: `# invariant\nassert keyword_hits({"title": "AI tutoring", "abstract": ""}) == ["AI"]\n\n# CI gate\npython -m pytest\npython scripts/check_notebooks.py\ngit diff --exit-code data/search_strategy.md`,
    codeSize: 22, codeHeight: 332,
    bottom: "수정은 교육용 복제본에서 하고 원본 노트북은 보존합니다.",
    sources: [urls.openaiHarness, local("notebooks/02_score_quality.ipynb")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분", kicker: "NOTEBOOK 03",
    title: "최종 노트북은 후보를 구조화된 전달물로 바꿉니다",
    image: img("notebook_screenshots/03_export_to_claude_s01.jpg"), cropH: 418, fit: "cover",
    callout: "top 15 → markdown schema → next prompt",
    sources: [local("notebooks/03_export_to_claude.ipynb")],
  },
  {
    type: "screenshot", section: "4 · LIVE LAB", time: "55초", kicker: "EXPORT RESULT",
    title: "다음 AI에게도 같은 경고와 스키마를 넘깁니다",
    image: img("notebook_screenshots/03_export_to_claude_s03.jpg"), cropH: 418, fit: "cover",
    callout: "Do not treat ranking as final until full text is checked",
    sources: [local("data/papers_top_15.md")],
  },
  {
    type: "claim", dark: true, section: "4 · LIVE LAB", time: "50초", kicker: "HUMAN CHECKPOINT",
    title: "core는 점수로 확정하지 않습니다",
    claim: "Full text before core citation",
    caption: "초록 기반 점수는 읽을 순서를 정할 뿐, 방법·결과·한계·원문 위치를 확인해야 핵심 근거가 됩니다.",
    sources: [local("policies/citation_grounding_policy.md"), local("policies/reference_ranking_policy.md")],
  },
  {
    type: "steps", section: "4 · LIVE LAB", time: "55초", kicker: "PDF ROUTING",
    title: "PDF도 읽기 상태와 역할에 따라 이동합니다",
    steps: [
      { head: "00_inbox", body: "새 PDF" },
      { head: "10_core", body: "직접 읽고 핵심 인용" },
      { head: "20_supporting", body: "보조 근거" },
      { head: "30_\nbackground", body: "개념·맥락" },
      { head: "90_excluded", body: "검토 후 제외" },
    ],
    sources: [local("README.md"), local("references/README.md")],
  },
  {
    type: "code", section: "4 · LIVE LAB", time: "1분", kicker: "EVIDENCE RECORD",
    title: "근거는 claim 단위의 레코드로 남깁니다",
    code: `claim_id, source_id, evidence_type, page_or_section, excerpt_or_paraphrase, status\nC-014, P-003, empirical_result, p.12 Results, "...", verified\nC-015, P-007, theory, VERIFY, "...", abstract_only`,
    codeSize: 21, codeHeight: 300,
    bottom: "원문 위치가 없으면 VERIFY를 유지합니다. 빈칸을 허용하는 것이 허위 정밀도보다 안전합니다.",
    sources: [local("references/evidence/evidence_claims.template.csv"), local("policies/citation_grounding_policy.md")],
  },
  {
    type: "steps", dark: true, section: "4 · LIVE LAB", time: "50초", kicker: "CLAIM CHAIN",
    title: "한 문장이 근거까지 추적되어야 합니다",
    steps: [
      { head: "Sentence", body: "원고 문장" },
      { head: "Source", body: "논문·데이터" },
      { head: "Location", body: "페이지·절" },
      { head: "Support", body: "full / partial / weak" },
      { head: "Status", body: "verified / VERIFY" },
    ],
    sources: [local("policies/citation_grounding_policy.md")],
  },
  {
    type: "columns", section: "4 · LIVE LAB", time: "1분", kicker: "MANUSCRIPT REVIEW",
    title: "리뷰는 칭찬보다 reject risk와 수정 행동으로 끝냅니다",
    columns: [
      { label: "NOVELTY", head: "새로움", body: "기여가 기존 연구와 구분되는가" },
      { label: "RIGOR", head: "엄밀성", body: "방법과 논증이 질문에 맞는가" },
      { label: "GROUNDING", head: "근거성", body: "모든 사실 claim이 지지되는가" },
      { label: "COHERENCE", head: "일관성", body: "문단·구조·용어가 연결되는가" },
    ],
    sources: [local("policies/manuscript_review_policy.md"), local("workspace/07_review_scorecard.md")],
  },
  {
    type: "columns", dark: true, section: "4 · LIVE LAB", time: "1분 10초", kicker: "CITATION AUDIT",
    title: "오류 유형을 이름 붙이면 수정이 빨라집니다",
    columns: [
      { label: "MISSING", head: "인용 없음", body: "사실 주장에 source가 없음" },
      { label: "WEAK", head: "직접 지지 아님", body: "주제는 같지만 claim과 어긋남" },
      { label: "OVERCLAIM", head: "강도 초과", body: "출처보다 더 강하게 주장" },
      { label: "MISCITED+", head: "오인용·2차인용", body: "wrong / secondary / verified 구분" },
    ],
    sources: [local("policies/citation_grounding_policy.md"), local("workspace/08_citation_audit.md")],
  },
  {
    type: "bullets", section: "4 · LIVE LAB", time: "6분", kicker: "HANDS-ON 2",
    title: "6분: 하나를 실행하고 변경 이유를 설명합니다",
    lead: "00_topic_scoping.ipynb 또는 저장된 CSV를 선택합니다.",
    items: ["한 셀을 실행한다", "생긴 파일을 연다", "git status / git diff로 변경을 본다", "입력–산출물–검증을 한 문장으로 설명한다"],
    bottom: "네트워크가 막히면 data/의 저장 결과와 장표 캡처를 사용합니다.",
    sources: [local("README.md")],
  },
  {
    type: "columns", section: "4 · LIVE LAB", time: "50초", kicker: "DEMO FALLBACK",
    title: "라이브 데모는 실패를 전제로 이중화합니다",
    columns: [
      { label: "SCREEN", head: "화면 캡처", body: "각 핵심 코드·출력 장면" },
      { label: "DATA", head: "저장 결과", body: "raw·scored CSV와 markdown" },
      { label: "REPLAY", head: "결정적 재생", body: "네트워크 없는 후속 단계" },
    ],
    bottom: "데모의 목표는 API 성공이 아니라 하네스의 연결 구조를 이해시키는 것입니다.",
    sources: [local("data")],
  },

  { type: "section", dark: true, section: "5 · SAFE AX", num: "05", time: "30초", title: "Safe AX:\n자동화 범위는 위험과 증거 수준으로 결정합니다", subtitle: "공공 연구기관에서는 속도보다 책임성·투명성·되돌릴 수 있음이 먼저 설계되어야 합니다." },
  {
    type: "matrix", section: "5 · SAFE AX", time: "1분 20초", kicker: "RISK MATRIX",
    title: "영향이 크고 되돌리기 어려울수록 사람의 승인점을 앞당깁니다",
    cells: [
      ["공개 문헌 메타데이터", "코드·검색식 초안", "자동 외부 게시"],
      ["서식·용어 정리", "근거 요약·분석", "정책 권고 초안"],
      ["개인 메모 정리", "민감자료 처리", "IRB·채용·평가 결정"],
    ],
    xLabel: "되돌리기 어려움 · 외부 영향 →", yLabel: "민감도·영향 ↑",
    sources: [urls.nist, urls.unesco],
  },
  {
    type: "columns", section: "5 · SAFE AX", time: "1분 20초", kicker: "GREEN / YELLOW / RED",
    title: "AI 활용 범위를 세 색으로 합의할 수 있습니다",
    columns: [
      { label: "GREEN", color: C.green, head: "자동 실행 + 표본 검수", body: "공개 메타데이터\n형식 변환\n중복·결측 탐지" },
      { label: "YELLOW", color: C.yellow, head: "AI 초안 + 사람 승인", body: "검색식·코드\n근거 요약\n분석·초안" },
      { label: "RED", color: C.red, head: "AI에 최종 판단 위임 금지", body: "개인·IRB 결정\n핵심 인용 확정\n대외 정책 결론" },
    ],
  },
  {
    type: "imageText", section: "5 · SAFE AX", time: "1분 20초", kicker: "UNESCO",
    title: "교육·연구 AI는 인간 중심 검증과 지속 모니터링이 필요합니다",
    image: img("web_screenshots/unesco_genai_education.jpg"), imageLeft: true, imageWidth: 650, imageHeight: 380,
    head: "Human-centred\nEthics-by-design",
    body: "UNESCO는 교육적·윤리적 적합성을 도입 전에 검증하고, 사용 중에도 모니터링하며, 고위험 결정의 인간 책임을 AI에 넘기지 말 것을 권고합니다.",
    sourceCaption: "Source: UNESCO Guidance for GenAI in education and research",
    sources: [urls.unesco],
  },
  {
    type: "imageText", section: "5 · SAFE AX", time: "1분 10초", kicker: "NIST AI RMF",
    title: "위험 관리는 네 동사로 운영합니다",
    image: img("web_screenshots/nist_genai_rmf.jpg"), imageLeft: false, imageWidth: 610, imageHeight: 370,
    head: "Govern · Map\nMeasure · Manage",
    body: "NIST의 GenAI Profile은 조직의 목표와 위험 허용도에 맞춰 거버넌스, 맥락 파악, 측정, 대응을 전 생애주기에 적용하도록 제시합니다.",
    sourceCaption: "Source: NIST AI 600-1",
    sources: [urls.nist, "https://doi.org/10.6028/NIST.AI.600-1"],
  },
  {
    type: "governance", section: "5 · SAFE AX", time: "1분 40초", kicker: "KOREA · PUBLIC SECTOR",
    title: "국내 공공부문은 개인정보·도입절차·책임성을 함께 봅니다",
    items: [
      { image: img("web_screenshots/pipc_genai_privacy.jpg"), head: "개인정보위", body: "생성형 AI 수명주기별 개인정보 처리와 안전조치(2025.8)" },
      { image: img("web_screenshots/nia_public_ai_guide_2026.jpg"), head: "NIA 2026 가이드", body: "공통기반·예산·도입 절차·서비스 구현·운영·고도화" },
      { image: img("web_screenshots/korea_ai_data_admin_law.jpg"), head: "2026.08.28 시행", body: "공공기관 AI 활용의 공정성·투명성·책임성·안전성" },
    ],
    sources: [urls.pipc, urls.nia2026, urls.law],
    note: "법률 효력과 기관 내부 규정을 함께 확인해야 하며, 장표는 법률 자문이 아님을 설명한다.",
  },
  {
    type: "claim", dark: true, section: "5 · SAFE AX", time: "55초", kicker: "CITATION GROUNDING",
    title: "근거가 없을 때 비워두는 능력이 신뢰입니다",
    claim: "Claim → Source → Location → Support → Status",
    claimSize: 40,
    caption: "DOI·저자·연도·페이지를 추정하지 않고, 부족하면 VERIFY를 남깁니다.",
    sources: [local("policies/citation_grounding_policy.md"), local("AGENTS.md")],
  },
  {
    type: "columns", section: "5 · SAFE AX", time: "1분 20초", kicker: "THREAT MODEL",
    title: "연구 하네스가 다뤄야 할 여섯 가지 위험",
    columns: [
      { label: "DATA", head: "개인정보", body: "민감자료 입력·보관·전송" },
      { label: "IP", head: "저작권", body: "PDF·긴 발췌·재배포" },
      { label: "TRUTH", head: "환각·오인용", body: "허위 메타데이터·과장" },
      { label: "CONTROL", head: "주입·자동화 편향", body: "외부 지시·무비판 수용·권한 오용" },
    ],
    sources: [urls.nist, urls.pipc, local("policies/storage_policy.md")],
  },
  {
    type: "bullets", dark: true, section: "5 · SAFE AX", time: "1분 10초", kicker: "PREFLIGHT",
    title: "실행 전 여섯 질문이면 사고 반경이 줄어듭니다",
    items: ["데이터 — 공개·내부·개인·민감 중 무엇인가?", "출처 — 원문과 위치를 확인할 수 있는가?", "권한 — 읽기·쓰기·외부 전송 범위는?", "검증 — 자동 테스트와 사람 검토는 어디인가?", "복구 — 원본과 이전 버전으로 돌아갈 수 있는가?", "기록 — 누가 무엇을 승인했는가?"],
    bottom: "한 항목이라도 답이 없으면 자율성 수준을 낮춥니다.",
    sources: [urls.nist, urls.openaiBest],
  },

  { type: "section", dark: true, section: "6 · ACTION", num: "06", time: "30초", title: "KEDI action:\n작게 시작하고 검증 루프를 먼저 만듭니다", subtitle: "가장 위험한 업무가 아니라, 반복이 많고 실패를 되돌릴 수 있는 한 가지에서 출발합니다." },
  {
    type: "columns", section: "6 · ACTION", time: "2분 20초", kicker: "30 · 60 · 90 DAYS",
    title: "한 파일럿을 팀 표준으로 만드는 90일",
    columns: [
      { label: "DAY 0–30", head: "작은 파일럿", body: "반복 업무 1개\n입력·출력·승인 정의\n실패 사례 5개 수집" },
      { label: "DAY 31–60", head: "품질 게이트", body: "AGENTS.md·command\n테스트·표본 검수\nPR 템플릿" },
      { label: "DAY 61–90", head: "팀 표준", body: "성과·오류 측정\n권한·데이터 등급\n확대/중단 결정" },
    ],
    bottom: "추천 파일럿: 공개 문헌 모니터링 + 메타데이터 정리 + 사람이 승인하는 주간 브리프",
    sources: [urls.nia2026, urls.openaiBest],
  },
  {
    type: "claim", dark: true, section: "Q&A", time: "마무리 1분 + Q&A 15분", kicker: "CLOSE",
    title: "세 문장만 기억해 주세요",
    claim: "Humans steer.\nAgents execute.\nEvidence decides.",
    claimSize: 64,
    caption: "내일 시작할 한 가지: 반복 업무를 입력 → 산출물 → 검증 → 승인으로 그려보기\n\n질문을 받겠습니다.",
    sources: [urls.openaiHarness, local("policies/citation_grounding_policy.md")],
    note: "참가자에게 30일 파일럿 한 가지를 적게 한 뒤 질문을 받는다.",
    transition: "질문을 도구·연구방법·조직운영·윤리/법 네 범주로 묶어 답한다.",
  },
];

// 2026-08-06 KEDI 맞춤 업데이트: 공식 조직·업무 근거와 실제 서비스 프로토타입을
// 기존 90장 흐름 안에 삽입한다. 제목 기반 교체로 장수와 기존 노트북 실습을 보존한다.
function replaceSlide(title, next) {
  const index = specs.findIndex((spec) => spec.title === title);
  if (index < 0) throw new Error(`Slide not found for replacement: ${title}`);
  specs[index] = { ...specs[index], ...next };
}

replaceSlide("Codex 하네스 엔지니어링 기반\n연구 환경 AX 자동화", {
  subtitle: "GitHub·Jupyter·로컬 AI·Vercel 프리뷰로 디지털교육 연구를 ‘작동하는 서비스’까지 연결하는 법",
  speaker: "",
  speakerName: "차성재",
  speakerRole: "무신사 Agentic AI PM  /  서울시립대학교·아주대학교 AI 부문 겸임교수",
  note: "오늘은 논문 자동화뿐 아니라, 연구실의 문제를 대화로 화면과 파일럿으로 만드는 전 과정을 보여준다고 안내한다.",
});

replaceSlide("연구자의 경쟁력은 어디로 이동하는가?", {
  type: "columns", dark: false, kicker: "SPEAKER", time: "1분 20초",
  title: "현장의 AX를 연구자의 언어로 연결해 왔습니다",
  subtitle: "무신사 Agentic AI PM · 서울시립대학교 및 아주대학교 AI 부문 겸임교수",
  columns: [
    { label: "ROLE", head: "Developer → PM", body: "기술을 직접 구현하는 역할에서\n문제·제품·조직의 변화를 설계하는 역할로", headSize: 28 },
    { label: "INDUSTRY", head: "금융 → 의료 → 교육 → 이커머스", body: "규제·안전·학습·고객경험이 다른 현장에서\nAI가 실제 업무가 되는 조건을 경험", headSize: 25 },
    { label: "TECHNOLOGY", head: "ML → DL(CV) →\nLLM(자연어) → Agent", body: "예측·비전·자연어를 지나\n도구를 사용하고 일을 이어가는 AI로", headSize: 25 },
  ],
  bottom: "여러분을 개발자로 만드는 시간이 아니라, AI와 개발자에게 필요한 일을 설명하고 검증하는 힘을 나누는 시간입니다.",
  note: "경력을 나열하기보다 변화의 축 세 개를 설명한다. 서로 다른 산업과 기술 전환을 거치며 발견한 공통점은 ‘모델보다 업무 설계가 중요하다’는 점이라고 연결한다.",
  transition: "그래서 오늘 강의도 기술 목록이 아니라 업무 맥락–설계–실행–안전의 순서로 진행한다.",
  sources: ["None (speaker biography supplied by the presenter)."],
});

replaceSlide("100분은 촘촘하게, 15분은 질문에 남겨둡니다", {
  kicker: "SESSION MAP",
  title: "강의 일정 구분",
  subtitle: "개념을 듣고 끝내지 않고, KEDI 업무에 적용한 뒤 실제 화면으로 확인하고 파일럿 질문까지 도출합니다.",
  items: [
    { time: "15:00", head: "방향 맞추기", body: "KEDI 업무와\nAI Native 관점", color: C.cyan },
    { time: "15:18", head: "설계 원리", body: "Harness와\nPrompt 계약", color: C.blue },
    { time: "15:53", head: "눈으로 확인", body: "서비스 시안과\nResearch-agent", color: C.coral },
    { time: "16:21", head: "안전한 적용", body: "거버넌스와\n90일 파일럿", color: C.lime },
    { time: "16:45", head: "질의응답", body: "우리 연구실의\n다음 서비스", color: C.ink },
  ],
  note: "일정을 단순 시간표로 읽지 않는다. 각 구간이 ‘이해–설계–관찰–적용’의 학습 흐름이라는 점과 질문은 마지막 15분에 현장 사례 중심으로 다룬다고 안내한다.",
});

replaceSlide("오늘 끝날 때 네 가지를 직접 할 수 있습니다", {
  title: "AI Native는 코드를 많이 아는 상태가 아닙니다",
  subtitle: "연구자가 문제와 경계를 설명하고, AI의 작업을 확인하며, 결과에 책임지는 새로운 업무 방식입니다.",
  columns: [
    { label: "DESCRIBE", head: "업무를 말로 설명", body: "목표·사용자·입력·\n원하는 결과를 명확히" },
    { label: "PROTOTYPE", head: "작게 눈으로 확인", body: "로컬 시안과 샘플로\n만들기 전에 합의" },
    { label: "VERIFY", head: "근거와 오류를 검증", body: "출처·테스트·사람 검토로\n답변을 결과로 전환" },
    { label: "GOVERN", head: "권한과 책임을 설계", body: "데이터·승인·기록·\n중단 조건을 명시" },
  ],
  bottom: "오늘의 목표는 ‘AI 사용법’보다 여러분의 연구 환경을 AI와 협업 가능한 형태로 바꾸는 관점을 얻는 것입니다.",
  note: "비전공 연구자에게 가장 중요한 안심 메시지다. 구현을 모두 아는 것이 아니라 좋은 요청과 검증 구조를 설계하는 것이 AI Native 역량임을 강조한다.",
});

replaceSlide("AI는 좋은 프로세스와 나쁜 프로세스를 모두 증폭합니다", {
  type: "imageText", dark: true, kicker: "DEVELOPER HUMOR · OPERATIONS", time: "1분",
  title: "자동화는 운영이 시작될 때 완성됩니다",
  subtitle: "‘한 번 코딩하면 끝’이라는 기대와 달리 실제 업무에는 디버깅·변경·유지보수가 계속됩니다.",
  image: img("web_screenshots/xkcd_automation.png"), imageLeft: true, imageWidth: 470, imageHeight: 380, fit: "contain",
  head: "Theory\nvs Reality",
  body: "자동화의 가치는 코드를 만든 순간이 아니라 입력이 바뀌고 오류가 생겨도 결과를 확인하고 복구할 수 있을 때 발생합니다.\n\n따라서 모델보다 먼저 담당자·검증·로그·중단 조건을 설계합니다.",
  sourceCaption: "xkcd #1319 ‘Automation’ · CC BY-NC 2.5",
  sources: [urls.xkcdAutomation, urls.xkcdLicense],
  note: "잠깐 웃고 지나가되 메시지는 진지하게 회수한다. Research-agent의 테스트·GitHub·승인점이 바로 현실의 운영비용을 다루는 장치라고 연결한다.",
});

replaceSlide("이 실패에는 어떤 하네스 층이 빠졌습니까?", {
  type: "imageText", dark: false, kicker: "AUTOMATION ECONOMICS", time: "1분 15초",
  title: "자동화 후보는 절감시간과 유지비용으로 고릅니다",
  subtitle: "가능하다고 모두 자동화하지 않습니다. 반복 빈도·절감시간·오류비용·변경 가능성을 함께 봅니다.",
  image: img("web_screenshots/xkcd_is_it_worth_the_time.png"), imageLeft: false, imageWidth: 560, imageHeight: 400, fit: "contain",
  head: "먼저 묻습니다",
  body: "1. 얼마나 자주 반복되는가?\n2. 한 번에 얼마나 줄일 수 있는가?\n3. 틀렸을 때 비용은 얼마인가?\n4. 규칙이 얼마나 자주 바뀌는가?\n\n첫 파일럿은 ‘자주 반복되고, 위험이 낮고, 되돌릴 수 있는 일’이 적합합니다.",
  sourceCaption: "xkcd #1205 ‘Is It Worth the Time?’ · CC BY-NC 2.5",
  sources: [urls.xkcdWorthTime, urls.xkcdLicense],
  note: "표를 전부 읽지 않는다. 일 1회 반복하며 1분을 줄이는 일이라면 5년 기준 약 하루까지 개선에 투자할 수 있다는 예시만 짚고, 조직에서는 오류·유지비용까지 추가한다고 설명한다.",
});

replaceSlide("리더의 81%는 에이전트가 AI 전략에 들어올 것으로 봅니다", {
  type: "screenshot", kicker: "KEDI 공식 조직도", time: "1분 20초",
  title: "디지털교육연구실은 센터와 한 흐름에 있습니다",
  subtitle: "공식 조직도에서 디지털교육연구실 아래 온라인학습지원센터·디지털교육지원센터·방송중고운영센터가 연결됩니다.",
  image: img("web_screenshots/kedi_organization_digital.jpg"), cropH: 394, fit: "cover",
  callout: "연구실 → 센터 → 시스템·콘텐츠·운영",
  sourceCaption: "Source: 한국교육개발원 공식 조직도 (2026-08-06 확인)",
  sources: [urls.kediOrg],
  note: "조직도는 단순 소속 설명이 아니라 연구 결과가 실제 서비스와 운영으로 이어지는 구조임을 보여준다.",
});

replaceSlide("업무는 세 단계로 재편됩니다", {
  type: "columns", kicker: "업무 포트폴리오", time: "1분 15초",
  title: "연구·시스템·콘텐츠·운영이 동시에 움직입니다",
  subtitle: "직원 업무 안내에는 연구기획, 시스템·콘텐츠 총괄, 사업 운영, 학습지원 업무가 함께 나타납니다.",
  columns: [
    { label: "RESEARCH", head: "연구기획", body: "정책·사업 질문\n성과와 효과 검증\n근거 기반 개선" },
    { label: "SYSTEM", head: "시스템", body: "온라인 서비스\n사용 흐름·데이터\n장애·변경 관리" },
    { label: "CONTENT", head: "콘텐츠", body: "차시·대본·활동\n평가·접근성\n버전과 품질" },
    { label: "OPERATION", head: "운영·지원", body: "교사·학습자 지원\n문의·이슈\n관계기관 협업" },
  ],
  bottom: "따라서 AX 파일럿도 보고서 한 편보다 이 네 구간의 연결 비용을 줄여야 합니다.",
  sources: [urls.kediStaff],
});

replaceSlide("연구자는 ‘agent boss’처럼 네 가지 일을 하게 됩니다", {
  type: "columns", kicker: "온라인학습지원 포트폴리오", time: "1분 25초",
  title: "대상과 맥락이 다른 여러 서비스를 한 연구실이 지원합니다",
  columns: [
    { label: "SCHOOL FOR YOU", head: "건강장애 학생", body: "학습 지속·학습권\n진단 기반 맞춤 학습\n가족·진로 지원", headSize: 24 },
    { label: "HEART FOR YOU", head: "정신건강 입원 학생", body: "정규 교육과정 원격학습\n대본·활동·형성평가\nAI 아바타 활용 검토", headSize: 24 },
    { label: "E-SCHOOL", head: "학생선수", body: "학생선수 e-School\n학습·출결 지원\n운영·콘텐츠 관리", headSize: 24 },
    { label: "CREDIT / ONLINE", head: "학점·과목 이수 지원", body: "미이수 보충과정\n전·편입 미이수 과목\n학습권·중도탈락 예방", headSize: 23 },
  ],
  sources: [urls.kediStaff, urls.kediSchoolForYou, urls.kediHeartForYou, urls.kediCredit, urls.kediOnline],
  note: "사업마다 대상·위험·지원방식이 다르므로 하나의 만능 AI보다 공통 하네스와 작은 목적별 도구가 적합하다고 설명한다.",
});

replaceSlide("디지털교육 연구의 네 구간에서 바로 시작할 수 있습니다", {
  type: "columns", kicker: "업무 → 프로토타입", time: "1분 20초",
  title: "반복 문제 네 가지를 ‘보이는 도구’로 바꿔볼 수 있습니다",
  columns: [
    { label: "OPERATIONS", head: "운영 브리프", body: "집계·문의·지원 요청을\n주간 1쪽으로 요약" },
    { label: "LEARNING", head: "지원 신호 탐색", body: "비식별 샘플에서\n검토 후보와 이유 표시" },
    { label: "CONTENT", head: "콘텐츠 QA", body: "교육과정·접근성·평가\n체크와 수정 근거" },
    { label: "EVIDENCE", head: "근거 지도", body: "claim–source–location\nVERIFY와 감사 상태" },
  ],
  bottom: "공통 원칙: 자동 결정이 아니라 연구자가 더 잘 보고 검토하도록 만드는 증강 도구입니다.",
  sources: [urls.kediStaff, urls.kediSchoolForYou, urls.kediHeartForYou],
});

replaceSlide("도입 질문을 바꿉니다", {
  claim: "“AI로 무엇을 할까?”가 아니라\n“어떤 반복 문제를 화면으로 확인할까?”",
  caption: "말로 설명 → 로컬 시안 → 샘플 데이터 실험 → 사람 승인 → Vercel 프리뷰 → 필요할 때 API 연결",
  sources: [urls.kediStaff, urls.openaiHarness, urls.vercelCli],
});

replaceSlide("각 프롬프트는 상태를 바꾸고 산출물을 넘깁니다", {
  type: "code", kicker: "SERVICE PROMPT", time: "1분 10초",
  title: "코드를 몰라도 ‘원하는 도움’을 평소 말로 설명할 수 있습니다",
  code: `온라인학습지원센터의 이번 주 운영 현황을 한눈에 보고 싶어요.\n\n과정별 참여 현황, 콘텐츠 문의, 교사 지원 요청을 요약하고\n사람이 확인해야 할 항목을 따로 보여주세요.\n개인을 자동 평가하지는 않았으면 합니다.`,
  codeSize: 21, codeHeight: 316,
  bottom: "Codex는 이 말을 문제·사용자·입력·화면·승인점·데이터 안전선으로 되묻고 시안화할 수 있습니다.",
  sources: [local("workspace/lecture_20260807/prototype/index.html")],
});

replaceSlide("commands/00–10은 연구 생애주기를 하나의 언어로 만듭니다", {
  type: "steps", kicker: "FROM CONVERSATION TO SERVICE", time: "1분 10초",
  title: "대화가 곧바로 운영 서비스가 되는 것은 아닙니다",
  steps: [
    { head: "말로 요청", body: "문제·사용자\n원하는 화면" },
    { head: "로컬 시안", body: "가상 데이터\n외부 전송 없음" },
    { head: "AI 연결", body: "서버 키\n승인된 입력" },
    { head: "프리뷰 공유", body: "Vercel URL\n사용성 피드백" },
    { head: "작은 파일럿", body: "권한·로그\n평가 기준" },
  ],
  bottom: "각 단계에서 멈출 수 있고, 앞 단계로 되돌아갈 수 있어야 합니다.",
  sources: [urls.openaiQuickstart, urls.vercelCli, urls.vercelEnv],
});

replaceSlide("4분: 약한 프롬프트를 작업 계약으로 고쳐보세요", {
  type: "bullets", dark: true, kicker: "HANDS-ON 1 · SERVICE", time: "4분",
  title: "4분: 연구실에서 ‘보였으면 하는 화면’ 하나를 말로 적어보세요",
  lead: "“매주 반복하지만 파일·메일·사람 사이에서 흩어지는 일은?”",
  items: ["누가 쓰는가?", "무엇을 넣는가?", "어떤 화면·파일이 나오면 좋은가?", "사람이 반드시 확인할 지점은?", "절대 넣지 않을 데이터는?"],
  bottom: "완성된 서비스명이 없어도 됩니다. 불편과 원하는 장면부터 시작합니다.",
});

replaceSlide("한 가지 가능한 답: 후보와 근거를 구분합니다", {
  type: "code", kicker: "PROTOTYPE CONTRACT", time: "1분 10초",
  title: "한 문장을 1주 실험 계약으로 바꿉니다",
  code: `Goal: 주간 운영 이슈를 1쪽 브리프로 본다.\nUsers: 온라인학습지원센터 연구·운영 담당자.\nInput: 비식별·집계 샘플 CSV와 문의 유형.\nOutput: 변화 5개, 확인 필요 이슈, 회의용 브리프.\nHuman gate: 원자료 대조 후 공유 승인.\nDone when: 5명이 10분 안에 읽고 오류·누락을 표시한다.`,
  codeSize: 20, codeHeight: 340,
  sources: [local("workspace/lecture_20260807/prototype/README.md")],
});

replaceSlide("Research-agent live lab:\n검색부터 인용 감사까지", {
  title: "Two live labs:\n서비스 시안에서 연구 파이프라인까지",
  subtitle: "먼저 말로 만든 로컬 웹 시안을 보고, 이어서 GitHub와 Jupyter로 검색–검증–기록이 연결되는 모습을 봅니다.",
});

replaceSlide("하나의 주제로 전체 파이프라인을 관통합니다", {
  type: "steps", kicker: "LIVE LAB A", time: "1분",
  title: "로컬에서 먼저 보고, 필요할 때만 연결하고 공유합니다",
  subtitle: "비전공자에게는 서버·API보다 ‘어디에서 무엇이 움직이는지’가 먼저입니다.",
  steps: [
    { head: "내 컴퓨터", body: "화면·규칙·샘플만\n안전하게 시험" },
    { head: "AI API", body: "키는 서버에\n요약·분류 보조" },
    { head: "Vercel", body: "주소를 공유해\n동료 의견 수렴" },
    { head: "기관 파일럿", body: "보안·권한·로그\n성과 평가" },
  ],
  bottom: "API는 지능을 빌리는 통로, Vercel은 시안을 보여주는 임시 전시장으로 이해하면 됩니다.",
  sources: [urls.openaiQuickstart, urls.vercelFunctions, urls.vercelEnv],
});

replaceSlide("검색이 끝이 아니라 검증 가능한 원고가 끝입니다", {
  type: "screenshot", kicker: "LIVE UI", time: "1분 20초",
  title: "연구자가 말한 아이디어가 즉시 작동하는 화면이 됩니다",
  subtitle: "네 가지 KEDI 시나리오를 고르고, 평소 말로 필요를 설명하는 로컬 프로토타입입니다.",
  image: img("prototype_screenshots/kedi_lab_top.png"), cropH: 410, fit: "cover",
  callout: "말로 요청 → 1주 프로토타입 캔버스",
  sources: [local("workspace/lecture_20260807/prototype")],
  note: "브라우저에서 운영 브리프·지원 신호·콘텐츠 QA·근거 지도를 차례로 눌러 문장이 바뀌는 것을 보여준다.",
});

replaceSlide("4개 명령으로 같은 환경을 엽니다", {
  type: "screenshot", kicker: "VISIBLE OUTPUT", time: "1분 20초",
  title: "AI보다 먼저 사람 승인점과 데이터 안전선을 출력합니다",
  subtitle: "문제·사용자·입력·화면·1주 계획을 한 장에서 검토하므로 ‘만들기 전에’ 팀의 합의를 얻을 수 있습니다.",
  image: img("prototype_screenshots/kedi_lab_result.png"), cropH: 410, fit: "cover",
  callout: "자동 결정 없음 · 외부 전송 없음 · 승인점 명시",
  sources: [local("workspace/lecture_20260807/prototype/app.js")],
});

replaceSlide("라이브 데모는 실패를 전제로 이중화합니다", {
  type: "code", kicker: "VERCEL PREVIEW", time: "1분 10초",
  title: "세 명령이면 동료가 보는 프리뷰 주소까지 갑니다",
  code: `$ cd workspace/lecture_20260807/prototype\n$ vercel link\n$ vercel env add OPENAI_API_KEY preview   # AI 연결 시에만\n$ vercel --yes                            # 프리뷰 URL 생성`,
  codeSize: 22, codeHeight: 300,
  bottom: "Live: https://prototype-rose-mu.vercel.app · API 키는 브라우저가 아니라 Vercel 환경변수와 서버 함수에 둡니다.",
  sources: [urls.vercelCli, urls.vercelEnv, urls.vercelFunctions, urls.openaiQuickstart],
});

replaceSlide("한 파일럿을 팀 표준으로 만드는 90일", {
  title: "원하는 서비스 하나를 팀 표준으로 만드는 90일",
  columns: [
    { label: "DAY 0–30", head: "말로 만들기", body: "불편 인터뷰 5명\n로컬 시안 1개\n샘플 데이터 실험" },
    { label: "DAY 31–60", head: "안전하게 연결", body: "승인된 API·데이터\n권한·로그·평가\n오류 사례 10개" },
    { label: "DAY 61–90", head: "프리뷰 → 파일럿", body: "Vercel 사용성 검증\n효과·위험 비교\n확대/중단 결정" },
  ],
  bottom: "첫 후보: 온라인학습 운영 브리프 · 콘텐츠 QA · 연구 근거 지도 중 ‘반복이 많고 되돌릴 수 있는 것’ 하나",
  sources: [urls.kediStaff, urls.nia2026, urls.vercelCli, urls.openaiBest],
});

// 청중이 바로 이해할 수 있도록 영어식 꼬리표와 추상어를 줄이고,
// 제품명·파일명·실습 상태값처럼 실제 작업에 필요한 용어만 남긴다.
function applyPlainKoreanCopy() {
  const sectionMap = {
    OPENING: "시작",
    "1 · AX SHIFT": "1 · 업무 전환",
    "2 · HARNESS": "2 · 연구 환경 설계",
    "3 · PROMPT": "3 · 요청 설계",
    "4 · LIVE LAB": "4 · 실제 시연",
    "5 · SAFE AX": "5 · 안전한 활용",
    "6 · ACTION": "6 · 실행",
    "Q&A": "질의응답",
  };
  const kickerMap = {
    SPEAKER: "강사 소개",
    "SESSION MAP": "강의 흐름",
    "AI-NATIVE WORK": "AI 중심 업무",
    "DEVELOPER HUMOR · OPERATIONS": "잠깐 쉬어가기 · 자동화의 현실",
    "AGENTS.MD": "기본 작업 원칙",
    COMMANDS: "반복 업무 절차",
    POLICIES: "품질 판단 기준",
    NOTEBOOKS: "재현 가능한 실행",
    WORKSPACE: "작업 공간",
    "GITHUB CHANGE CONTROL": "변경 관리",
    "FEEDBACK LOOP": "개선 순환",
    "PROGRESSIVE DISCLOSURE": "필요한 만큼 안내",
    "DEFINITION OF DONE": "완료 기준",
    "AUTONOMY LADDER": "단계별 자율성",
    "AUTOMATION ECONOMICS": "자동화 우선순위",
    "PROMPT PATCH": "모호한 표현 고치기",
    "EVIDENCE STATE": "검증 상태",
    "STAGE SEPARATION": "단계 분리",
    "STRUCTURED OUTPUT": "출력 구조",
    "TOOL BOUNDARY": "도구 권한",
    "ADVERSARIAL REVIEW": "반대 관점 검토",
    "SERVICE PROMPT": "서비스 요청",
    "FROM CONVERSATION TO SERVICE": "대화에서 서비스까지",
    "HANDS-ON 1 · SERVICE": "실습 1 · 서비스 구상",
    "PROTOTYPE CONTRACT": "1주 실험 계획",
    "LIVE LAB A": "실제 시연 1",
    "LIVE UI": "실제 화면",
    "VISIBLE OUTPUT": "확인할 결과",
    "NOTEBOOK 00": "노트북 00",
    "FIRST ARTIFACT": "첫 산출물",
    "SCOPING PROMPT": "범위 설정 요청",
    "NOTEBOOK 01": "노트북 01",
    "SEARCH PROVENANCE": "검색 이력",
    "SEARCH OUTPUT": "검색 결과",
    "NOISE TRAP": "검색 잡음",
    "NOTEBOOK 02": "노트북 02",
    "RANKED OUTPUT": "검토 순위",
    "LOCAL DATA": "저장된 자료",
    "SILENT FAILURE": "보이지 않는 오류",
    "HARNESS FIX": "환경에 반영",
    "NOTEBOOK 03": "노트북 03",
    "EXPORT RESULT": "전달 결과",
    "HUMAN CHECKPOINT": "사람의 확인",
    "PDF ROUTING": "PDF 분류",
    "EVIDENCE RECORD": "근거 기록",
    "CLAIM CHAIN": "근거 연결",
    "MANUSCRIPT REVIEW": "원고 검토",
    "CITATION AUDIT": "인용 점검",
    "HANDS-ON 2": "실습 2",
    "VERCEL PREVIEW": "웹 공유",
    "RISK MATRIX": "위험 판단표",
    "GREEN / YELLOW / RED": "세 단계 활용 기준",
    UNESCO: "국제 기준 · UNESCO",
    "NIST AI RMF": "국제 기준 · NIST",
    "KOREA · PUBLIC SECTOR": "국내 공공부문",
    "CITATION GROUNDING": "인용 근거",
    "THREAT MODEL": "주요 위험",
    PREFLIGHT: "실행 전 확인",
    "30 · 60 · 90 DAYS": "90일 실행안",
    CLOSE: "마무리",
  };
  const labelMap = {
    ROLE: "직무",
    INDUSTRY: "산업 경험",
    TECHNOLOGY: "기술 변화",
    DESCRIBE: "설명",
    PROTOTYPE: "시안",
    VERIFY: "검증",
    GOVERN: "책임",
    AUTOMATE: "자동화",
    AUGMENT: "판단 보조",
    TRANSFORM: "업무 전환",
    RESEARCH: "연구",
    SYSTEM: "시스템",
    CONTENT: "콘텐츠",
    OPERATION: "운영·지원",
    "SCHOOL FOR YOU": "스쿨포유",
    "HEART FOR YOU": "하트포유",
    "E-SCHOOL": "학생선수 e-School",
    "CREDIT / ONLINE": "이수 지원",
    OPERATIONS: "운영",
    LEARNING: "학습지원",
    EVIDENCE: "근거",
    BEFORE: "기존",
    AFTER: "개선",
    "PROMPT ENGINEERING": "프롬프트 설계",
    "HARNESS ENGINEERING": "연구 환경 설계",
    REFERENCE: "문헌",
    REVIEW: "검토",
    ARTIFACT: "산출물",
    GOAL: "목표",
    CONTEXT: "맥락",
    CONSTRAINTS: "제약",
    "DONE WHEN": "완료 기준",
    RQ: "연구질문",
    BOUNDARY: "경계",
    "OUTPUT + VERIFY": "출력·검증",
    VERIFIED: "확인 완료",
    ABSTRACT_ONLY: "초록만 확인",
    EXCLUDED: "제외",
    WHAT: "검색 내용",
    WHEN: "실행 시점",
    WHERE: "검색 출처",
    HOW: "적용 조건",
    NOVELTY: "기여",
    RIGOR: "방법",
    GROUNDING: "근거",
    COHERENCE: "구성",
    MISSING: "인용 없음",
    WEAK: "약한 근거",
    OVERCLAIM: "과장",
    "MISCITED+": "오인용",
    GREEN: "낮은 위험",
    YELLOW: "주의 필요",
    RED: "높은 위험",
    DATA: "정보",
    IP: "권리",
    TRUTH: "사실",
    CONTROL: "통제",
    "DAY 0–30": "1–30일",
    "DAY 31–60": "31–60일",
    "DAY 61–90": "61–90일",
  };
  const headMap = {
    "Developer → PM": "개발자 → 제품 책임자(PM)",
    "Chat assistant": "대화형 도우미",
    "Tool-using agent": "도구를 쓰는 AI",
    "Human-led system": "사람이 이끄는 체계",
    Versioned: "변경 이력",
    Executable: "재실행",
    Observable: "상태 확인",
    Recoverable: "복구 가능",
    "Theory\nvs Reality": "기대와\n현실",
    Guidance: "안내 기준",
    "Procedure + Policy": "절차와 정책",
    "Run & Record": "실행과 기록",
    Question: "연구질문",
    "Map & Idea": "근거·아이디어",
    Draft: "초안",
    Review: "검토",
    Branch: "작업 분기",
    Commit: "변경 기록",
    "Pull request": "검토 요청",
    "Review & merge": "검토·반영",
    Rollback: "되돌리기",
    Intent: "의도",
    Action: "실행",
    Artifact: "산출물",
    Test: "자동 확인",
    "Rule update": "규칙 개선",
    Command: "재사용 명령",
    "Policy-backed": "정책과 연결",
    Discover: "후보 찾기",
    Generate: "구조 만들기",
    Verify: "근거 확인",
    Query: "검색식",
    "Run date": "실행일",
    Source: "출처",
    Filters: "검색 조건",
    Sentence: "원고 문장",
    Location: "원문 위치",
    Support: "지지 수준",
    Status: "검증 상태",
    "AI API": "AI 연결",
    "프리뷰 → 파일럿": "공유 시안 → 현장 실험",
  };

  for (const spec of specs) {
    if (sectionMap[spec.section]) spec.section = sectionMap[spec.section];
    if (kickerMap[spec.kicker]) spec.kicker = kickerMap[spec.kicker];
    if (spec.sourceCaption) spec.sourceCaption = spec.sourceCaption.replace(/^Source:/, "출처:");
    for (const groupName of ["columns", "steps", "items"]) {
      const group = spec[groupName];
      if (!Array.isArray(group)) continue;
      for (const item of group) {
        if (!item || typeof item !== "object") continue;
        if (labelMap[item.label]) item.label = labelMap[item.label];
        if (headMap[item.head]) item.head = headMap[item.head];
      }
    }
    for (const sideName of ["left", "right"]) {
      const side = spec[sideName];
      if (!side) continue;
      if (labelMap[side.label]) side.label = labelMap[side.label];
      if (headMap[side.head]) side.head = headMap[side.head];
    }
  }

  Object.assign(specs[0], {
    subtitle: "GitHub와 Jupyter로 연구 과정을 기록하고, 내 컴퓨터의 시안을 웹 서비스까지 연결하는 방법",
    meta: "2026.08.07(금) 15:00–17:00  ·  한국교육개발원 디지털교육연구실",
  });
  Object.assign(specs[2], {
    subtitle: "KEDI 업무를 함께 살펴보고, 설계 원리를 익힌 뒤 실제 화면과 90일 실행안으로 연결합니다.",
  });
  specs[2].items[0].body = "KEDI 업무와\nAI 중심 업무";
  specs[2].items[1].body = "연구 환경과\n요청 설계";
  specs[2].items[2].body = "서비스 시안과\nResearch-agent";
  Object.assign(specs[3], {
    title: "AI 중심 업무는 코드를 많이 아는 상태가 아닙니다",
    subtitle: "연구자가 문제와 경계를 설명하고, AI의 작업을 확인하며, 결과에 책임지는 업무 방식입니다.",
    bottom: "오늘의 목표는 AI 기능을 많이 아는 것이 아니라, 연구 환경을 AI와 협업할 수 있는 형태로 바꾸는 관점을 얻는 것입니다.",
  });
  specs[6].columns[2].body = "업무 단위와 승인 구조를 재설계\n예: 주장 단위 검증";
  specs[6].title = "자동화·판단 보조·업무 전환은 서로 다릅니다";
  Object.assign(specs[12], {
    title: "AI 중심 업무는 다시 실행하고 확인할 수 있어야 합니다",
  });
  Object.assign(specs[13], {
    title: "문서 중심에서 작업 흐름과 주장 단위로 이동합니다",
  });
  specs[13].right.head = "흐름과 주장이 단위";
  specs[9].kicker = "업무 구성";
  specs[10].kicker = "온라인학습지원 업무";
  specs[15].kicker = "업무를 화면으로";
  specs[15].columns[0].head = "운영 요약";
  specs[15].columns[2].head = "콘텐츠 점검";
  specs[15].columns[3].body = "주장–출처–원문 위치\n확인 필요와 점검 상태";
  specs[15].bottom = "공통 원칙: 자동 결정이 아니라 연구자가 더 잘 보고 검토하도록 만드는 보조 도구입니다.";
  Object.assign(specs[16], { head: "기대와\n현실" });
  specs[17].caption = "말로 설명 → 내 컴퓨터에서 시안 확인 → 샘플 자료로 시험 → 사람 승인 → 웹 공유 → 필요한 때 AI 연결";
  Object.assign(specs[18], {
    title: "AI가 안정적으로 일할 연구 환경을 설계합니다",
    subtitle: "좋은 모델을 고르는 데서 멈추지 않고, 같은 일을 반복해도 품질을 유지하도록 문서·도구·경계·검증을 연결합니다.",
  });
  Object.assign(specs[19], {
    title: "AI 운영 환경, 즉 하네스는 여섯 요소로 구성됩니다",
    claim: "모델 + 맥락 + 도구 + 경계\n+ 피드백 + 변경 기록",
    claimSize: 47,
  });
  Object.assign(specs[20], {
    title: "연구 환경의 신뢰도는 세 요소의 곱입니다",
    claim: "이해 가능성 × 경계 × 검증",
    claimSize: 56,
  });
  Object.assign(specs[21], {
    title: "좋은 요청은 한 번의 일을, 좋은 환경은 반복 업무를 개선합니다",
  });
  specs[21].right.items = ["지속되는 규칙과 도구", "검증 순환", "변경 이력과 점검 기록"];
  Object.assign(specs[22], {
    kicker: "여섯 가지 구성",
    title: "Research-agent는 여섯 가지 구성으로 이해할 수 있습니다",
  });
  specs[25].title = "commands/는 반복 업무를 실행 가능한 표준 절차로 바꿉니다";
  specs[26].columns[1].body = "핵심 / 보조 / 배경 / 제외";
  specs[26].columns[2].body = "새로움·엄밀성·근거성 등 6가지 기준";
  Object.assign(specs[27], { kicker: "재현 가능한 실행" });
  specs[30].title = "한 번의 답변을 다음 작업의 개선으로 이어갑니다";
  specs[31].kicker = "필요한 만큼 안내";
  specs[31].head = "짧은 AGENTS.md\n→ 필요한 안내 문서";
  specs[31].body = "OpenAI 사례는 거대한 단일 지침이 필요한 맥락을 가리고 빠르게 낡는다고 설명합니다. 짧은 목차에서 현재 작업에 필요한 문서로 들어가게 합니다.";
  Object.assign(specs[33], {
    title: "AI에 맡기는 범위는 단계적으로 넓혀야 합니다",
    kicker: "단계별 자율성",
  });
  specs[33].steps.forEach((step, index) => { step.head = `${index}단계 ${step.head.replace(/^L\d\s*/, "")}`; });
  Object.assign(specs[35], {
    title: "좋은 질문을 실행 가능한 작업 지시로 바꿉니다",
    subtitle: "좋은 작업 지시는 길어서 좋은 것이 아니라, 선택 기준과 검증 기준이 분명해야 합니다.",
  });
  specs[36].title = "좋은 요청은 팀이 다시 쓸 수 있는 절차로 남습니다";
  specs[36].steps[1].head = "작업 기준";
  Object.assign(specs[37], {
    title: "목표 · 맥락 · 제약 · 완료 기준",
  });
  Object.assign(specs[38], {
    title: "연구 요청에는 근거와 검증 기준을 먼저 씁니다",
  });
  specs[38].columns[0].head = "연구질문";
  specs[38].columns[1].head = "근거 범위";
  specs[38].columns[2].head = "금지와 권한";
  specs[38].columns[3].head = "출력과 확인";
  specs[40].title = "검색 범위·산출물·검증 기준을 한 번에 적습니다";
  specs[41].columns[3].head = "→ 완료 조건";
  specs[39].kicker = "모호한 요청";
  specs[40].kicker = "구체적인 요청";
  specs[41].columns[2].head = "→ 출력 형식";
  specs[41].columns[3].body = "행 수·검증·변경 비교\n남은 확인 필요 항목";
  specs[42].kicker = "필요한 만큼 안내";
  specs[42].claim = "“AGENTS.md → workflow.md →\n이번 단계의 명령과 정책 파일을 읽어라.”";
  specs[43].columns[0].body = "페이지·절과 직접 지지\n상태: verified";
  specs[43].columns[1].body = "후보 분류만 가능\n상태: abstract_only";
  specs[43].columns[2].label = "추가 확인";
  specs[43].columns[2].body = "근거 위치·정보 부족\n상태: VERIFY";
  specs[44].bottom = "같은 AI를 써도 역할을 나누면 오류를 발견할 지점이 생깁니다.";
  specs[45].title = "정해진 출력 형식이 다음 작업을 이어줍니다";
  specs[46].title = "AI가 읽을 범위와 쓸 범위를 나눕니다";
  specs[47].title = "초안을 지지하게 하지 말고, 틀릴 이유를 찾게 합니다";
  specs[48].bottom = "Codex는 이 말을 문제·사용자·입력·화면·승인 지점·데이터 안전선으로 다시 묻고 화면 초안으로 만들 수 있습니다.";
  specs[49].steps[1].head = "내 컴퓨터 시안";
  specs[49].steps[2].body = "서버에 보관한 키\n승인된 입력";
  specs[49].steps[3].head = "웹으로 공유";
  specs[49].steps[3].body = "웹 주소 공유\n사용성 의견";
  specs[49].steps[4].head = "작은 현장 실험";
  specs[51].title = "한 문장을 1주 실험 계획으로 바꿉니다";
  specs[51].code = `목표: 주간 운영 이슈를 1쪽으로 본다.\n사용자: 온라인학습지원센터 연구·운영 담당자.\n입력: 비식별 집계 샘플 CSV와 문의 유형.\n결과: 변화 5개, 확인할 이슈, 회의용 요약.\n사람 승인: 원자료 대조 후 공유.\n완료 기준: 5명이 10분 안에 읽고 오류·누락을 표시한다.`;
  Object.assign(specs[52], {
    title: "두 가지 실제 시연:\n서비스 시안에서 연구 과정까지",
    subtitle: "먼저 말로 만든 웹 시안을 보고, 이어서 GitHub와 Jupyter에서 검색·검증·기록이 이어지는 모습을 확인합니다.",
  });
  Object.assign(specs[53], {
    title: "먼저 내 컴퓨터에서 확인하고, 필요한 때만 연결·공유합니다",
    subtitle: "비전공자에게는 기술 이름보다 ‘어디에서 무엇이 움직이는지’를 이해하는 것이 먼저입니다.",
    bottom: "AI 연결은 필요한 판단을 돕는 통로이고, Vercel은 동료에게 시안을 보여주는 임시 웹 주소입니다.",
  });
  specs[53].steps[3].head = "기관 현장 실험";
  specs[54].title = "말로 설명한 아이디어가 바로 확인 가능한 화면이 됩니다";
  specs[54].subtitle = "네 가지 KEDI 사례 중 하나를 고르고, 평소 말로 필요한 도움을 설명하는 내 컴퓨터용 시안입니다.";
  specs[54].callout = "말로 요청 → 1주 실험 계획";
  specs[55].title = "AI 연결 전에 승인 지점과 데이터 안전선을 먼저 확인합니다";
  specs[56].title = "첫 노트북은 연구질문을 검색 조건으로 바꿉니다";
  specs[57].title = "노트북 결과는 다음 단계가 읽는 기준 파일이 됩니다";
  specs[58].title = "범위를 좁힐 때 선택 기준과 포기할 것을 함께 묻습니다";
  specs[59].title = "OpenAlex 검색 조건과 실행 기록을 코드로 남깁니다";
  specs[60].columns[3].body = "연도·언어·페이지 이동 조건";
  specs[63].title = "품질 점수는 읽을 순서를 정하는 참고 기준입니다";
  specs[63].bottom = "가중치는 연구 목적에 따라 조정하고, 최종 핵심 문헌 분류는 원문 검토로 확정합니다.";
  specs[65].bottom = "제외 후보 0편\n현재 키워드가 넓어 배경 후보가 가장 많음";
  specs[65].categories = ["핵심 후보", "보조 후보", "배경 후보"];
  specs[67].title = "실패를 발견하면 요청을 길게 쓰기보다 검증 절차를 추가합니다";
  specs[68].title = "마지막 노트북은 후보를 다음 사람이 읽을 자료로 정리합니다";
  specs[69].title = "다음 AI에도 같은 경고와 형식을 함께 전달합니다";
  specs[70].title = "핵심 문헌은 점수만으로 확정하지 않습니다";
  specs[70].claim = "핵심 인용은 원문을 읽은 뒤 확정합니다";
  specs[72].title = "근거는 주장별 기록으로 남깁니다";
  specs[72].bottom = "원문 위치가 없으면 ‘추가 확인(VERIFY)’으로 남깁니다. 빈칸을 허용하는 편이 근거 없는 정밀함보다 안전합니다.";
  specs[73].steps[3].body = "충분 / 일부 / 약함";
  specs[73].steps[4].body = "확인 완료 / 추가 확인";
  specs[74].title = "원고 검토는 칭찬보다 탈락 위험과 수정 행동을 남겨야 합니다";
  specs[74].columns[2].body = "모든 사실 주장이 근거로 지지되는가";
  specs[75].columns[0].body = "사실 주장에 출처가 없음";
  specs[75].columns[1].body = "주제는 같지만 주장을 직접 지지하지 않음";
  specs[75].columns[3].body = "잘못된 인용 / 2차 인용 / 확인 완료 구분";
  specs[77].title = "몇 가지 명령으로 동료가 볼 수 있는 웹 주소가 생깁니다";
  specs[77].bottom = "실행 주소: https://prototype-rose-mu.vercel.app · API 키는 브라우저가 아니라 Vercel 서버 환경에 둡니다.";
  Object.assign(specs[78], {
    title: "안전한 AI 활용은 위험과 근거 수준에 따라 범위를 정합니다",
    subtitle: "공공 연구기관에서는 속도보다 책임성·투명성·되돌릴 수 있는 구조를 먼저 마련해야 합니다.",
  });
  specs[80].title = "AI 활용 범위는 세 단계로 합의합니다";
  specs[81].head = "사람 중심\n윤리를 설계에 반영";
  specs[82].head = "관리 · 맥락 파악\n측정 · 대응";
  specs[82].body = "NIST의 생성형 AI 지침은 조직의 목표와 위험 허용도에 맞춰 관리, 맥락 파악, 측정, 대응을 전 과정에 적용하도록 제시합니다.";
  specs[84].title = "근거가 없을 때 비워 두는 것이 신뢰입니다";
  specs[84].claim = "주장 → 출처 → 원문 위치 → 지지 수준 → 확인 상태";
  specs[84].caption = "DOI·저자·연도·페이지를 추정하지 않고, 부족하면 ‘추가 확인’ 상태로 남깁니다.";
  specs[85].title = "연구 환경에서 먼저 다뤄야 할 네 가지 위험";
  specs[86].title = "실행 전 여섯 가지를 확인하면 사고 범위가 줄어듭니다";
  Object.assign(specs[87], {
    title: "KEDI 실행안:\n작게 시작하고 검증 기준부터 만듭니다",
    subtitle: "가장 위험한 업무가 아니라, 반복이 많고 실패를 되돌릴 수 있는 한 가지에서 시작합니다.",
  });
  specs[88].title = "서비스 하나를 팀의 표준 업무로 만드는 90일";
  specs[88].columns[0].body = "불편 인터뷰 5명\n내 컴퓨터 시안 1개\n샘플 자료 실험";
  specs[88].columns[1].body = "승인된 AI 연결과 데이터\n권한·기록·평가\n오류 사례 10개";
  specs[88].columns[2].body = "웹 공유 사용성 검증\n효과·위험 비교\n확대/중단 결정";
  specs[88].bottom = "첫 후보: 온라인학습 운영 요약 · 콘텐츠 점검 · 연구 근거 지도 중 ‘반복이 많고 되돌릴 수 있는 것’ 하나";
  Object.assign(specs[89], {
    claim: "사람이 방향을 정하고\nAI가 실행하며\n근거로 판단합니다.",
    claimSize: 58,
    caption: "내일 시작할 한 가지: 반복 업무를 입력 → 산출물 → 검증 → 승인으로 그려보기\n\n질문을 받겠습니다.",
  });

  // 발표 화면에서는 기술명과 실제 파일명만 영어로 남기고,
  // 메시지는 연구자가 바로 이해할 수 있는 한국어 문장으로 정리한다.
  specs[1].columns[2].head = "기계학습(ML) → 딥러닝(컴퓨터 비전) →\n대규모 언어모형(LLM) → 에이전트";
  specs[3].note = "비전공 연구자에게 가장 중요한 안심 메시지다. 구현을 모두 아는 것이 아니라 좋은 요청과 검증 구조를 설계하는 것이 AI 중심 업무 역량임을 강조한다.";
  specs[7].title = "대화형 도우미에서 사람이 이끄는 업무 체계로 발전합니다";
  specs[9].bottom = "따라서 첫 실험도 보고서 한 편을 더 만드는 데서 멈추지 않고, 이 네 구간의 연결 비용을 줄여야 합니다.";
  specs[10].note = "사업마다 대상·위험·지원 방식이 다르므로 하나의 만능 AI보다 공통 연구 환경과 작은 목적별 도구가 적합하다고 설명한다.";
  specs[16].left.label = "기준이 있을 때";
  specs[16].right.label = "기준이 없을 때";
  specs[17].title = "‘무엇을 할까’보다 ‘어떤 반복 문제를 확인할까’를 묻습니다";
  specs[19].title = "AI가 일하는 연구 환경은 여섯 요소로 구성됩니다";
  specs[19].caption = "한 번의 요청이 아니라 맥락, 도구, 경계, 검증, 변경 기록이 함께 작동합니다.";
  specs[21].left.label = "요청 설계";
  specs[21].right.label = "연구 환경 설계";
  specs[21].bottom = "좋은 요청은 연구 환경을 이루는 한 요소입니다.";
  specs[24].title = "짧은 운영 원칙이 AI의 기본 행동을 정합니다";
  specs[26].title = "품질 판단 기준을 AI와 사람이 함께 읽게 합니다";
  specs[31].title = "짧은 안내에서 필요한 문서로 연결합니다";
  specs[34].items = ["안내 원칙?", "작업 절차?", "판단 기준?", "실행 도구?", "산출물 상태?", "변경 관리?"];
  specs[34].bottom = "답: 실행 경로·인용 기준·쓰기 범위·변경 기록이 함께 필요합니다.";
  specs[36].steps[2].body = "반복 가능한 표준 절차";
  specs[41].columns[0].body = "제목·초록 검색\n영어\n2020–2026";
  specs[46].left.label = "읽기 — 기본 허용";
  specs[46].left.items = ["저장소 파일 읽기", "공개 자료 조회", "현재 상태와 변경 내용 확인"];
  specs[46].right.label = "쓰기 — 범위 명시";
  specs[46].right.items[0] = "workspace/ 아래에만 생성";
  specs[47].title = "반대 근거와 실패 가능성을 먼저 찾게 합니다";
  specs[48].steps[0].head = "연구질문";
  specs[48].steps[1].head = "검색";
  specs[48].steps[2].head = "우선순위";
  specs[48].steps[3].head = "초안 작성";
  specs[48].steps[4].head = "인용 점검";
  specs[48].bottom = "Codex는 이 말을 문제·사용자·입력·화면·승인 지점·데이터 보호 기준으로 다시 묻고 화면 시안으로 만들 수 있습니다.";
  specs[49].items[0].head = "범위·검색";
  specs[49].items[1].head = "근거 확인";
  specs[49].items[2].head = "초안 작성";
  specs[50].title = "4분: 연구실에서 실제로 필요했던 화면 하나를 말로 적어보세요";
  specs[52].title = "두 가지 실제 시연:\n서비스 시안과 연구 과정 자동화";
  specs[53].claim = "AI 기반 형성평가 피드백\n× 자기조절학습";
  specs[53].steps[1].head = "AI 기능 연결";
  specs[53].steps[2].body = "웹 주소를 공유해\n동료 의견 수렴";
  specs[53].bottom = "AI 기능은 판단을 돕는 통로이고, Vercel은 동료에게 시안을 보여주는 임시 웹 주소입니다.";
  specs[55].title = "AI를 연결하기 전에 사람 승인과 데이터 보호 기준을 정합니다";
  specs[56].callout = "연구질문 · 검색식 · 핵심어 · 연도 · 분야 · 언어";
  specs[58].title = "범위를 좁힐 때 선택 기준과 제외 범위를 함께 정합니다";
  specs[59].callout = "검색 조건 · 페이지 이동 · 실행일";
  specs[60].columns[2].body = "OpenAlex 논문 검색 API";
  specs[61].title = "50편을 가져온 순간은 완료가 아니라 문헌 후보 목록의 시작입니다";
  specs[61].callout = "50편 수집 → papers_raw.csv";
  specs[62].left.label = "후보 목록";
  specs[62].left.items[2] = "학술지·공개 원문 링크";
  specs[62].bottom = "논문 검색 서비스는 후보를 만들고, 연구자가 근거를 확정합니다.";
  specs[63].columns[0].body = "피인용 수\n(cited_by_count)";
  specs[63].columns[1].body = "연평균 인용\n(citations_per_year)";
  specs[63].columns[2].body = "핵심어 일치\n(keyword hits)";
  specs[63].columns[3].body = "최신성 15 + 학술지 5 + 초록 5";
  specs[64].callout = "품질 점수 ≠ 진실 · 읽기 우선순위";
  specs[65].title = "50편을 핵심·보조·배경 후보로 나눕니다";
  specs[66].callout = "보이지 않는 제어문자 → 단어 경계 판단 오류";
  specs[68].callout = "상위 15편 → 표 형식 → 다음 작업 지시";
  specs[69].title = "다른 AI에 넘길 때도 같은 경고와 출력 형식을 함께 보냅니다";
  specs[69].callout = "원문을 확인하기 전에는 순위를 최종 판단으로 사용하지 않음";
  specs[74].title = "원고 검토에서는 탈락 위험과 구체적인 수정안을 남깁니다";
  specs[77].columns[0].label = "화면";
  specs[77].columns[1].body = "원본·점수 CSV와 마크다운 문서";
  specs[77].columns[2].label = "재실행";
  specs[82].title = "위험 관리는 관리·파악·측정·대응의 네 단계로 운영합니다";
  specs[89].time = "마무리 1분 + 질의응답 15분";
  specs[40].code = `목표: 2020–2026년 영어 논문 후보 50편을 OpenAlex에서 수집한다.
맥락: workspace/01_research_question.md와 data/topic_keywords.txt를 먼저 읽는다.
제약: 제목·초록을 검색하고 실행일과 조건을 기록한다. 결과를 핵심 인용으로 확정하지 않는다.
산출물: data/papers_raw.csv와 data/search_strategy.md.
완료 기준: 50행과 필수 열을 확인하고 검색식·연도·언어·실행일을 기록한다. DOI 누락은 빈칸으로 둔다.`;
  specs[43].columns[0].body = "페이지·절과 직접 지지\n상태: 확인 완료";
  specs[43].columns[1].body = "후보 분류만 가능\n상태: 초록만 확인";
  specs[43].columns[2].body = "근거 위치·정보 부족\n상태: 추가 확인";
  specs[45].code = `{
  "주장_번호": "C-014",
  "문장": "...",
  "출처_번호": "P-003",
  "원문_위치": "12쪽 결과",
  "지지_수준": "충분 | 일부 | 약함 | 없음 | 오류",
  "확인_상태": "확인 완료 | 추가 확인"
}`;
  specs[47].code = `초안을 옹호하지 말고 탈락 위험을 먼저 찾아라.

검사:
- 인용이 없는 사실 주장
- 출처보다 강한 과장
- 초록만 확인한 문장을 원문 확인처럼 사용
- 관련은 있지만 직접 지지하지 않는 약한 인용

출력: 주장 번호 · 위험 유형 · 근거 · 수정안 · 사람 확인 지점`;
  specs[72].code = `주장 번호, 출처 번호, 근거 유형, 페이지·절, 발췌·요약, 확인 상태
C-014, P-003, 실증 결과, 12쪽 결과, "...", 확인 완료
C-015, P-007, 이론, 추가 확인, "...", 초록만 확인`;
  specs[72].bottom = "원문 위치가 없으면 ‘추가 확인’으로 남깁니다. 빈칸을 허용하는 편이 근거 없는 정밀함보다 안전합니다.";
  specs[84].caption = "DOI·저자·연도·페이지를 추정하지 않고, 부족하면 ‘추가 확인’ 상태로 남깁니다.";
}

applyPlainKoreanCopy();

function applyNominalSlideTitles() {
  const titles = [
    "Codex 하네스 엔지니어링 기반\n연구 환경 AX 자동화",
    "현장 AX와 연구 언어를 잇는 경험",
    "강의 일정 구분",
    "AI 중심 업무의 핵심: 코드보다 업무·검증·책임 설계",
    "연구 시간이 사라지는 지점",
    "AX의 본질:\n도구 도입이 아닌 업무 재설계",
    "자동화·판단 보조·업무 전환의 차이",
    "대화형 도우미에서 사람 중심 업무 체계로의 전환",
    "디지털교육연구실과 온라인학습지원센터의 연결",
    "연구·시스템·콘텐츠·운영의 동시 작동",
    "서로 다른 대상을 위한 온라인학습 지원 서비스",
    "GitHub의 확장된 역할: 코드 저장소에서 조직의 기억으로",
    "AI 중심 업무의 조건: 재실행·확인·복구",
    "업무 단위의 전환: 문서에서 작업 흐름과 주장으로",
    "AI 시대에도 남는 연구자의 책임",
    "반복 문제를 보이는 도구로 바꾸는 네 가지 기회",
    "자동화의 완성 조건: 운영·검증·유지",
    "도입 질문의 전환: AI 기능에서 반복 문제로",
    "AI가 일할 수 있는\n연구 환경 설계",
    "AI 연구 환경의 여섯 요소",
    "연구 환경 신뢰도의 세 요소",
    "요청 설계와 연구 환경 설계의 차이",
    "Research-agent의 여섯 구성 요소",
    "AI와 사람을 위한 저장소 구조",
    "AI의 기본 행동을 정하는 짧은 운영 원칙",
    "반복 업무를 표준 절차로 바꾸는 commands/",
    "AI와 사람이 함께 읽는 품질 판단 기준",
    "재현 가능한 연구 도구로서의 노트북",
    "연구 진행 상태를 담는 workspace/",
    "제안·검토·복구가 가능한 변경 관리",
    "답변을 다음 개선으로 잇는 피드백 순환",
    "짧은 안내와 단계적 정보 공개",
    "완료의 기준: 파일이 아닌 검증 증거",
    "AI 위임 범위의 단계적 확대",
    "자동화 우선순위: 절감시간과 유지비용",
    "질문을 작업 지시로 바꾸는\n네 가지 기준",
    "팀이 재사용하는 요청 구조",
    "작업 지시의 네 요소: 목표·맥락·제약·완료 기준",
    "연구 요청의 다섯 요소: 질문·근거·경계·출력·검증",
    "모호한 요청에서 빠진 것",
    "검색 범위·산출물·검증 기준을 갖춘 요청",
    "모호한 표현에서 운영 기준으로의 전환",
    "저장소 전체 대신 읽을 경로 제시",
    "과장을 줄이는 네 가지 검증 상태",
    "발견·생성·검증의 단계 분리",
    "다음 작업을 잇는 정형 출력",
    "읽기 범위와 쓰기 범위의 분리",
    "반대 근거와 실패 가능성 우선 검토",
    "평소 말로 설명하는 연구지원 서비스",
    "대화에서 운영 서비스까지의 다섯 단계",
    "4분 실습: 연구실에 필요한 화면 한 가지",
    "한 문장에서 1주 실험 계획으로의 구체화",
    "두 가지 실제 시연:\n서비스 시안과 연구 과정 자동화",
    "시안 검증의 네 단계: 내 컴퓨터에서 기관 현장까지",
    "말로 만든 아이디어의 화면 시안",
    "AI 연결 이전의 사람 승인과 데이터 보호",
    "연구질문을 검색 조건으로 바꾸는 첫 노트북",
    "다음 단계의 기준이 되는 노트북 산출물",
    "범위 축소를 위한 선택 기준과 제외 범위",
    "OpenAlex 검색 조건과 실행 기록",
    "재현성의 출발점: 검색 결과가 아닌 검색 기록",
    "50편 수집 이후: 문헌 후보 목록의 시작",
    "관련성·품질·인용 가능성의 구분",
    "품질 점수의 역할: 읽기 우선순위",
    "상위 후보의 검토 순서를 보여주는 표",
    "문헌 후보의 세 가지 역할: 핵심·보조·배경",
    "실행 성공과 의미 검증의 차이",
    "실패를 검증 절차로 바꾸는 환경 개선",
    "다음 사람이 읽을 수 있는 후보 자료",
    "다른 AI에 전달할 경고와 출력 형식",
    "핵심 문헌 확정의 조건: 점수가 아닌 원문",
    "읽기 상태와 역할에 따른 PDF 분류",
    "주장 단위의 근거 기록",
    "한 문장에서 원문 근거까지의 추적",
    "원고 검토의 초점: 탈락 위험과 구체적인 수정안",
    "빠른 수정을 위한 오류 유형",
    "6분 실습: 실행과 변경 이유 설명",
    "동료에게 공유하는 임시 웹 주소",
    "안전한 AI 활용의 기준:\n위험과 근거 수준",
    "영향도·복구 가능성에 따른 승인 시점",
    "AI 활용 범위의 세 단계",
    "교육·연구 AI의 원칙: 사람 중심 검증과 지속 점검",
    "위험 관리의 네 단계: 관리·파악·측정·대응",
    "국내 공공부문의 AI 활용 기준",
    "신뢰의 원칙: 근거 없으면 비워 두기",
    "연구 환경의 네 가지 주요 위험",
    "실행 전 여섯 가지 확인 사항",
    "KEDI 실행안:\n작은 시작과 검증 기준",
    "서비스 하나를 팀의 표준으로 정착시키는 90일",
    "세 문장으로 정리한 핵심",
  ];
  if (titles.length !== specs.length) throw new Error(`Expected ${specs.length} nominal titles, found ${titles.length}`);
  specs.forEach((spec, index) => { spec.title = titles[index]; });
}

applyNominalSlideTitles();

function applyStudentMvpUpdate() {
  specs[2].items[2].body = "학생지원 MVP와\nResearch-agent";

  specs[10] = {
    type: "columns", section: "1 · AX SHIFT", time: "1분 30초", kicker: "공개 사업 맥락",
    title: "서로 다른 학습 상황을 잇는 온라인 지원 포트폴리오",
    subtitle: "같은 ‘온라인 학습’이라도 학생이 처한 상황과 필요한 지원은 다르므로, 서비스별 문제·안전·성과를 따로 정의해야 합니다.",
    columns: [
      { label: "스쿨포유", head: "건강장애·장기결석 학생", body: "정규 교육과정 기반 원격수업\n학습권·학습 지속 지원\n2026 AI 디지털 클론 콘텐츠", headSize: 23, bodySize: 19 },
      { label: "하트포유", head: "정신건강 입원 학생", body: "정규 교육과정 원격수업\n사회정서교육 콘텐츠\n2026 AI 디지털 클론 콘텐츠", headSize: 23, bodySize: 19 },
      { label: "학생선수 e-School", head: "학업·운동 병행 학생", body: "수업결손 보충\n기초학력·학습권 지원\n학습·콘텐츠·운영", headSize: 23, bodySize: 19 },
      { label: "온라인 보충과정", head: "미이수 과목 학습자", body: "전·편입 등 미이수 보충\n과목 이수 기회\n고교학점제 학습지원", headSize: 23, bodySize: 19 },
    ],
    bottom: "공통 기반은 재사용하되 학생에게 보이는 기능과 안전 기준은 사업 맥락별로 다시 검증합니다.",
    sources: [urls.kediStaff, urls.kediSchoolForYou2026, urls.kediHeartForYou, urls.kediESchool, urls.kediOnline],
    note: "각 사업의 공개 목적을 간단히 짚는다. 특히 건강·정신건강 맥락의 서비스를 다른 사업과 같은 규칙으로 묶지 않는 것이 중요하다고 강조한다.",
  };

  specs[15] = {
    type: "compare", section: "1 · AX SHIFT", time: "1분 25초", kicker: "확인된 현재 · 제안하는 다음",
    title: "공개로 확인되는 AI 활용과 다음 실험 기회",
    subtitle: "현재 운영 사실과 강의 제안을 구분하면, 과장 없이도 다음 서비스의 가능성을 구체적으로 논의할 수 있습니다.",
    left: {
      label: "공개 자료로 확인",
      head: "AI 디지털 클론 기반 콘텐츠",
      items: ["스쿨포유·하트포유 원격수업 콘텐츠 제작", "강의교사의 얼굴·음성 모델링 활용", "해당 콘텐츠 개발·유지관리 범위로 명시"],
      color: C.blue,
    },
    right: {
      label: "강의에서 제안",
      head: "학생의 다음 행동을 돕는 MVP",
      items: ["목표·할 일·도움 요청·회고 연결", "가상 자료와 규칙 기반 로컬 시안부터", "자동 평가·위험 예측·진단은 비범위"],
      color: C.cyan,
    },
    bottom: "AI 아바타는 확인된 현재 사례 · ‘이번 주 학습 길잡이’는 검증이 필요한 강의 제안",
    sources: [urls.kediSchoolForYou2026, urls.kediHeartForYou, urls.kediAiClassroom, local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "‘현재 KEDI가 만드는 서비스’와 ‘다음으로 함께 실험할 수 있는 서비스’를 반드시 나눠 말한다. 공개 자료에서 대화형 학습 코치 운영은 확인하지 못했다고 밝힌다.",
  };

  specs[48] = {
    type: "columns", section: "3 · PROMPT", time: "1분 30초", kicker: "학생지원 서비스 후보",
    title: "함께 만들 수 있는 학생지원 MVP 네 가지",
    subtitle: "처음부터 거대한 플랫폼을 만들기보다, 한 학생 문제와 한 행동 변화를 2~4주 안에 확인할 수 있는 크기로 줄입니다.",
    columns: [
      { label: "01 · 추천", head: "이번 주\n학습 길잡이", body: "목표·할 일·다음 행동\n사람 도움 요청·회고\n자동 평가 없음", headSize: 27, bodySize: 19, color: C.blue },
      { label: "02", head: "쉬운 콘텐츠\n동행", body: "어려운 문장·용어·활동\n더 쉬운 설명과 대체 형식\n전문가 승인", headSize: 27, bodySize: 19 },
      { label: "03", head: "사람 도움\n연결 길잡이", body: "질문 유형과 맥락 정리\n교사·운영자에게 전달\n해결 상태 확인", headSize: 27, bodySize: 19 },
      { label: "04", head: "학생 목소리\n요약", body: "비식별 불편·만족 의견\n주제별 개선 후보\n원문과 함께 검토", headSize: 27, bodySize: 19 },
    ],
    bottom: "후보의 공통 원칙: 학생을 판단하는 AI보다 학생이 이해·선택·도움 요청을 더 잘하도록 만드는 지원 도구",
    sources: [urls.kediSchoolForYou2026, urls.kediHeartForYou, urls.kediESchool, urls.kediOnline, local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "네 후보를 기능 목록으로 읽지 않는다. 학생이 얻는 도움을 한 문장씩 설명하고, 첫 MVP는 4주 안에 학생 가치와 위험을 함께 확인할 수 있어야 한다고 연결한다.",
  };

  specs[49] = {
    type: "columns", section: "3 · PROMPT", time: "1분 20초", kicker: "MVP 선택 기준",
    title: "첫 MVP의 판단 기준: 가치·검증·안전·재사용",
    subtitle: "강의용 상대평가에서 ‘이번 주 학습 길잡이’가 첫 실험 후보로 가장 균형이 좋았습니다.",
    columns: [
      { label: "학생 가치", head: "오늘 바로\n도움이 되는가", body: "다음 행동이 선명해지고\n막힐 때 사람에게\n연결되는가", headSize: 27 },
      { label: "검증 가능성", head: "4주 안에\n확인 가능한가", body: "가상 자료 → 내부 5명 →\n승인된 소규모 사용성\n실험이 가능한가", headSize: 27 },
      { label: "안전성", head: "판단을\n최소화했는가", body: "자동 채점·위험 예측·\n민감정보 없이도\n가치를 확인할 수 있는가", headSize: 27 },
      { label: "재사용성", head: "공통 흐름을\n확장 가능한가", body: "목표·실행·도움·회고를\n사업별 맥락에 맞춰\n다시 설계할 수 있는가", headSize: 27 },
    ],
    bottom: "워크숍 점수 예시: 학습 길잡이 19/20 · 쉬운 콘텐츠 16/20 · 사람 도움 연결 15/20 · 학생 목소리 16/20",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "점수는 성과 측정값이 아니라 토론을 위한 설계 판단이라고 명시한다. 조직에서는 항목 가중치를 다시 합의하면 된다.",
  };

  specs[50] = {
    type: "claim", dark: true, section: "3 · PROMPT", time: "1분 10초", kicker: "추천 MVP",
    title: "이번 주 학습 길잡이",
    claim: "목표 → 작은 실행 → 사람 도움 → 회고",
    claimSize: 57,
    caption: "학생을 평가하는 화면이 아니라, ‘지금 무엇을 할지’와 ‘막히면 누구에게 물을지’를 함께 보여주는 화면",
    accent: C.blue,
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md"), local("workspace/lecture_20260807/prototype/student.html")],
    note: "학생 사용 장면으로 설명한다. 오늘 20분 활동이 부담스러우면 5분으로 줄이고, 질문이 생기면 사람에게 보낼 문장을 만든 뒤 학생이 최종 확인한다.",
  };

  specs[51] = {
    type: "columns", section: "3 · PROMPT", time: "1분 35초", kicker: "1쪽 PRD",
    title: "문제·가설·비범위·성공의 한 장 연결",
    subtitle: "PRD는 기능 요구서가 아니라, 무엇을 왜 만들고 어떤 변화와 위험으로 판단할지 합의하는 기준 문서입니다.",
    columns: [
      { label: "문제", head: "다음 행동과\n질문 경로의 분산", body: "학생이 지금 할 일과\n도움을 요청할 방법을\n찾는 데 추가 부담", headSize: 26 },
      { label: "가설", head: "작은 행동과\n사람 연결", body: "계획–실행–회고 순환과\n필요한 지원의 적시성을\n높일 가능성", headSize: 26 },
      { label: "비범위", head: "평가·예측·진단\n자동 조치 제외", body: "성적·순위·위험 낙인·\n건강 상담·민감정보 전송\n사람 승인 없는 조치 없음", headSize: 25 },
      { label: "성공", head: "완주·해결·이해\n안전의 동시 개선", body: "계획–실행–회고 완주\n도움 해결·명확성\n오류·접근성·안전", headSize: 25 },
    ],
    bottom: "핵심 기능은 문제와 지표를 연결하는 데 꼭 필요한 것만 남기고, 나머지는 이후 실험으로 미룹니다.",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "현대적인 제품 업무의 핵심은 기능보다 문제·성과·비범위를 먼저 합의하는 것이라고 설명한다. 기능을 제안할 때 연결되는 문제와 지표를 함께 묻는다.",
  };

  specs[52] = {
    type: "section", dark: true, section: "4 · LIVE LAB", num: "04", time: "30초",
    title: "서비스 시안과 PRD 기반\n성과관리",
    subtitle: "작동 화면은 끝이 아니라 가설을 시험하는 도구입니다. 학생 여정·성과지표·안전 기준을 함께 보며 다음 결정을 준비합니다.",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md"), local("workspace/lecture_20260807/prototype/student.html")],
    note: "이제 문서의 문제·지표가 실제 화면의 어떤 행동으로 구현되는지 보여준다고 전환한다.",
  };

  specs[53] = {
    type: "steps", section: "4 · LIVE LAB", time: "1분 15초", kicker: "학생 사용자 여정",
    title: "목표 선택에서 다음 주 개선까지의 일곱 날",
    subtitle: "추천 정확도보다 학생이 다음 행동을 이해하고, 필요한 순간에 사람에게 연결되는지가 먼저입니다.",
    steps: [
      { head: "목표 선택", body: "이번 주 한 가지\n학생이 직접 선택" },
      { head: "작은 활동", body: "5~20분 단위\n오늘 할 일" },
      { head: "다음 행동", body: "자신감에 맞춰\n시작 크기 조정" },
      { head: "사람 도움", body: "질문 문장 확인\n담당자 연결" },
      { head: "한 문장 회고", body: "잘된 점·바꿀 점\n다음 주 반영" },
    ],
    bottom: "화면마다 ‘학생 선택’과 ‘사람 연결’을 남기고, 자동 채점·등급·지원 자격 판단은 넣지 않습니다.",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "여정의 각 단계가 어떤 사용자 문제를 줄이는지 설명한다. 특히 도움 요청은 AI 답변으로 끝내지 않고 사람 연결로 끝난다는 점을 강조한다.",
  };

  specs[54] = {
    type: "screenshot", section: "4 · LIVE LAB", time: "1분 40초", kicker: "작동 시안",
    title: "학생에게 보이는 ‘이번 주 학습 길잡이’",
    subtitle: "목표·활동·다음 행동을 한 화면에 놓고, 규칙 기반 로컬 데모만으로 핵심 흐름과 문구를 먼저 검증합니다.",
    image: img("prototype_screenshots/student_mvp_top.png"), cropH: 410, fit: "cover",
    callout: "자동 평가 없음 · 실제 학생정보 없음 · 사람 도움 연결",
    sourceCaption: "강의 제안용 로컬 프로토타입 · KEDI의 현재 운영 서비스가 아님",
    sources: [local("workspace/lecture_20260807/prototype/student.html"), local("workspace/lecture_20260807/prototype/student.js"), local("workspace/lecture_20260807/prototype/student.css")],
    note: "브라우저에서 목표 라디오, 활동 완료, 자신감, 더 쉬운 설명, 도움 요청을 직접 눌러본다. AI를 연결하지 않아도 제품 가설의 대부분을 눈으로 확인할 수 있음을 보여준다.",
  };

  specs[55] = {
    type: "columns", section: "4 · LIVE LAB", time: "1분 35초", kicker: "성과·품질·안전 지표",
    title: "성공은 사용량 하나가 아니라 네 묶음으로 판단",
    subtitle: "결과가 좋아 보여도 품질이나 안전이 나빠지면 확대하지 않습니다. 지표의 분모·분자와 중단 조건을 PRD에 먼저 씁니다.",
    columns: [
      { label: "중심 지표", head: "계획–실행–회고\n주간 완주율", body: "목표 선택 + 활동 1개 이상 +\n한 문장 회고를 7일 안에\n모두 수행한 참여자 비율", headSize: 25, bodySize: 18 },
      { label: "결과", head: "학습 지속과\n도움 해결", body: "핵심 활동 완료 변화\n도움 요청 해결률·시간\n다음 할 일의 명확성", headSize: 26, bodySize: 18 },
      { label: "품질", head: "이해 가능성과\n접근성", body: "추천 문장 이해\n잘못된 다음 행동\n중대한 접근성 문제", headSize: 26, bodySize: 18 },
      { label: "안전선", head: "자동 판단 0\n사람 연결 100%", body: "실제 민감정보 0\n자동 불이익 조치 0\n모든 도움 시나리오에 사람 경로", headSize: 25, bodySize: 18 },
    ],
    bottom: "수치는 현재 성과가 아니라 파일럿 전에 합의할 측정 정의와 초기 통과 조건의 예시입니다.",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md")],
    note: "중심 지표의 분모와 분자를 읽어준다. 학생 성적이 아니라 서비스가 학습 순환을 돕는지 보는 지표이며, 품질·안전 지표를 함께 통과해야 한다고 강조한다.",
  };

  specs[77].code = `$ cd workspace/lecture_20260807/prototype\n$ npm run dev                    # 내 컴퓨터에서 확인\n$ open http://127.0.0.1:4173/student.html\n$ vercel --yes                   # 동료에게 프리뷰 공유`;
  specs[77].bottom = "실행 주소: https://prototype-rose-mu.vercel.app/student · AI API 없이도 학생지원 MVP의 핵심 흐름은 작동합니다.";
  specs[77].sources = [urls.vercelCli, urls.vercelEnv, urls.vercelFunctions, local("workspace/lecture_20260807/prototype/student.html")];

  specs[88] = {
    type: "columns", section: "6 · ACTION", time: "2분 30초", kicker: "PRD 기반 90일 운영",
    title: "문제 발견에서 확대·수정·중단 결정까지",
    subtitle: "현대적인 업무 방식은 계획서를 완성하는 일이 아니라, 같은 기준으로 작은 실험과 다음 결정을 반복하는 운영 체계입니다.",
    columns: [
      { label: "1–30일", head: "문제와\n성공 기준", body: "사용자 문제·현재 대안 확인\n1쪽 PRD·비범위 합의\n지표 정의·가상 자료 시안", headSize: 29 },
      { label: "31–60일", head: "사용성과\n안전 검증", body: "내부 5명 과업 시험\n접근성·문구·사람 연결\n권한·기록·중단 절차", headSize: 29 },
      { label: "61–90일", head: "제한된 실험과\n다음 결정", body: "승인된 2~4주 파일럿\n결과·품질·안전 함께 검토\n확대·수정·축소·중단", headSize: 28 },
    ],
    bottom: "GitHub 기준 문서: 문제 정의 → PRD → 지표 정의 → 실험 기록 → 결정 기록 → 다음 PRD",
    sources: [local("workspace/lecture_20260807/STUDENT_SERVICE_MVP_PRD_KO.md"), urls.githubRepo],
    note: "기능 출시가 90일의 목표가 아니다. 문제·성과·안전 기준을 갖춘 작은 검증과 명시적인 다음 결정을 만드는 것이 목표라고 정리한다.",
  };
}

applyStudentMvpUpdate();

function applyAudienceFirstSimplification() {
  const set = (n, next) => { specs[n - 1] = { ...specs[n - 1], ...next }; };

  set(1, {
    subtitle: "자료를 읽고, 근거를 확인하고, 다음 행동이 보이는 연구 환경 만들기",
    note: "기술 이름보다 참가자의 일에서 시작한다. 오늘은 코덱스를 잘 아는 사람이 되는 시간이 아니라, 한 가지 일을 편하게 부탁하고 함께 확인하는 방법을 배우는 시간이라고 안내한다.",
  });

  set(2, {
    title: "차성재, 현장 AX와 연구 언어를 잇는 경험",
    subtitle: "무신사 Agentic AI PM · 서울시립대학교 및 아주대학교 AI 부문 겸임교수",
    columns: [
      {
        label: "직무",
        head: "개발자 → 제품 책임자(PM)",
        body: "기술을 직접 구현하는 역할에서\n문제·제품·조직의 변화를 설계하는 역할로",
        headSize: 28,
      },
      {
        label: "산업 경험",
        head: "금융 → 의료 → 교육 → 이커머스",
        body: "규제·안전·학습·고객경험이 다른 현장에서\nAI가 실제 업무가 되는 조건을 경험",
        headSize: 25,
      },
      {
        label: "기술 변화",
        head: "기계학습 → 딥러닝 →\n언어모형 → 에이전트",
        body: "ML · 컴퓨터 비전 · LLM에서\n도구로 일을 이어가는 AI까지",
        headSize: 25,
      },
    ],
  });

  set(3, {
    subtitle: "한 번에 다 배우지 않습니다. 한 가지 부탁에서 시작해 실제 화면과 안전한 적용까지 차례로 확인합니다.",
    items: [
      { time: "15:00", head: "우리의 일", body: "KEDI 업무와\n반복되는 어려움", color: C.cyan },
      { time: "15:15", head: "한 가지 부탁", body: "가장 먼저 써볼\n코덱스 요청", color: C.blue },
      { time: "15:35", head: "안심할 틀", body: "자료·규칙·확인\n변경 기록", color: C.coral },
      { time: "15:55", head: "눈으로 확인", body: "학생 시안과\n연구 노트북", color: C.lime },
      { time: "16:45", head: "질의응답", body: "우리 업무의\n다음 한 가지", color: C.ink },
    ],
    note: "시간표를 낭독하지 않는다. ‘우리 일에서 시작해 한 가지 요청을 배우고, 실제 화면을 본 뒤 안전하게 적용한다’는 흐름만 설명한다.",
  });

  specs[3] = {
    type: "columns", section: "OPENING", time: "1분", kicker: "오늘 가져갈 것",
    title: "세 가지만 기억해도 충분합니다",
    subtitle: "코덱스와 클로드를 처음 쓰더라도, 다음 세 가지가 있으면 작은 일부터 함께 시작할 수 있습니다.",
    columns: [
      { label: "01", head: "평소 말로\n부탁하기", body: "무엇이 필요한지\n내가 쓰는 말로 설명", headSize: 30 },
      { label: "02", head: "파일과 근거로\n확인하기", body: "바뀐 내용·출처·\n남은 확인 사항 검토", headSize: 29 },
      { label: "03", head: "중요한 결정은\n사람이 하기", body: "인용·공유·학생 지원은\n연구자가 최종 판단", headSize: 29 },
    ],
    bottom: "완벽한 요청문보다 ‘원하는 결과’와 ‘확인할 지점’을 말하는 것이 먼저입니다.",
    sources: [urls.openaiPrompt, urls.openaiBest],
    note: "세 항목을 빠르게 읽고 안심시킨다. 코딩이나 전문 용어를 몰라도 된다는 점을 먼저 전달한다.",
  };

  set(5, {
    title: "연구 시간이 사라지는 익숙한 장면",
    lead: "연구 자체보다 자료를 다시 찾고, 맞추고, 같은 형식으로 정리하는 데 시간이 흐르곤 합니다.",
    items: ["여러 파일에서 필요한 내용 다시 찾기", "회의 전 핵심과 미확인 사항 다시 정리하기", "같은 형식의 표·목록·보고서 반복 작성", "출처·수정 이유·다음 담당자를 뒤늦게 확인"],
    bodySize: 24,
    bottom: "코덱스의 첫 역할은 연구자를 대신하는 일이 아니라, 흩어진 일을 다시 볼 수 있게 정리하는 일입니다.",
    note: "손들기나 짧은 질문으로 공감을 얻는다. ‘여기서 한 가지만 줄어도 충분히 가치가 있다’고 연결한다.",
  });

  set(6, {
    title: "첫 번째 변화:\n코덱스에게 한 가지 부탁하기",
    subtitle: "기능을 외우기보다, 매주 반복되는 자료 정리 한 가지를 함께 해보는 것이 가장 빠른 시작입니다.",
  });

  set(9, {
    kicker: "KEDI 업무의 연결",
    title: "디지털교육연구실의 일은 연구에서 서비스까지 이어집니다",
    subtitle: "연구 결과가 콘텐츠·시스템·운영으로 이어지고, 현장의 경험은 다시 다음 연구 질문으로 돌아옵니다.",
    callout: "연구 → 서비스 → 현장 경험 → 다음 연구",
    note: "조직도 명칭을 자세히 읽기보다 연구와 서비스가 연결된 구조만 짚는다. 그래서 코덱스도 보고서 한 편보다 이 연결을 돕는 방식이 적합하다고 설명한다.",
  });

  set(10, {
    title: "보고서·콘텐츠·시스템·운영의 한 흐름",
    subtitle: "서로 다른 업무처럼 보여도 공통으로 필요한 것은 자료를 읽고, 기준에 맞춰 정리하고, 다음 행동을 남기는 일입니다.",
    columns: [
      { label: "연구", head: "질문과 근거", body: "공개 자료·논문 검토\n연구 질문·결과 정리" },
      { label: "콘텐츠", head: "내용과 품질", body: "대본·활동·평가\n접근성·수정 근거" },
      { label: "시스템", head: "화면과 흐름", body: "사용 과정·오류\n변경 요청·확인" },
      { label: "운영", head: "현황과 다음 일", body: "문의·지원 요청\n회의·담당자·기한" },
    ],
    bottom: "공통 요청: 읽기 → 구분하기 → 정리하기 → 사람이 확인하기 → 다음 작업 남기기",
  });

  set(11, {
    title: "학생의 상황이 다르면 필요한 도움도 다릅니다",
    subtitle: "공통 기술을 쓸 수 있어도 학생에게 보이는 기능과 안전 기준은 서비스별로 다시 확인해야 합니다.",
  });

  specs[11] = {
    type: "claim", dark: true, section: "1 · 첫 부탁", time: "1분 40초", kicker: "가장 먼저 써볼 요청",
    title: "디지털교육연구실이 가장 먼저 체감할 코덱스 활용",
    claim: "“이 자료들을 읽고,\n확인된 사실 · 아직 확인할 내용 · 다음 행동을\n1쪽으로 정리해 주세요.”",
    claimSize: 43,
    caption: "원문 근거를 붙이고, 추정하지 말고, 제가 검토할 부분은 따로 표시해 주세요.",
    accent: C.blue,
    sources: [urls.kediStaff, urls.openaiPrompt, urls.openaiBest],
    note: "이 장표가 강의의 중심이다. 그대로 천천히 읽고, 연구·콘텐츠·운영·시스템 어느 업무에도 적용할 수 있음을 짧은 예로 설명한다.",
  };

  specs[12] = {
    type: "steps", section: "1 · 첫 부탁", time: "1분 20초", kicker: "한 요청의 결과",
    title: "이 한 가지 부탁이 만드는 다섯 단계",
    subtitle: "코덱스가 먼저 정리하고, 연구자는 중요한 부분을 확인한 뒤 다음 일을 이어갑니다.",
    steps: [
      { head: "자료 읽기", body: "정한 폴더와\n문서 확인" },
      { head: "내용 구분", body: "사실·해석·\n확인 필요" },
      { head: "1쪽 정리", body: "핵심·근거·\n다음 행동" },
      { head: "사람 검토", body: "틀린 곳·빠진 곳\n최종 판단" },
      { head: "다음 작업", body: "수정 파일·담당자\n기한 남기기" },
    ],
    bottom: "처음부터 자동화하지 않아도 됩니다. 첫 결과를 함께 고치는 과정 자체가 다음 업무의 기준이 됩니다.",
    sources: [urls.openaiPrompt, urls.openaiBest],
    note: "코덱스가 모든 단계를 결정하는 그림이 아님을 강조한다. 네 번째 단계에서 사람이 반드시 들어온다.",
  };

  set(15, {
    title: "코덱스가 대신하지 않는 세 가지",
    lead: "빠르게 정리할 수 있어도 연구자와 기관의 책임까지 옮겨가지는 않습니다.",
    items: ["무엇을 믿고 인용할지 결정하는 연구 판단", "학생에게 영향을 주는 평가·지원·상담 판단", "대외 공유·정책 결론·최종 승인"],
    bottom: "코덱스는 검토할 자료와 선택지를 준비하고, 중요한 결정은 사람이 내립니다.",
    note: "불안감을 키우는 경고가 아니라 역할을 명확히 나누는 안심의 메시지로 전달한다.",
  });

  set(16, {
    title: "지금 확인된 AI와 다음에 시험할 아이디어",
    subtitle: "현재 공개된 활용과 강의 제안을 구분하면, 과장 없이도 다음 가능성을 편하게 논의할 수 있습니다.",
  });

  set(18, {
    title: "첫 질문의 작은 전환",
    claim: "“무엇을 자동화할까?”보다\n“무엇이 보이면 일이 쉬워질까?”",
    caption: "원하는 화면이나 문서 한 가지를 말하면, 코덱스와 함께 작은 시안부터 만들 수 있습니다.",
    note: "기술 아이디어를 요구하지 않는다. 참가자가 평소 보고 싶었던 화면이나 문서를 떠올리게 한다.",
  });

  set(19, {
    title: "두 번째 변화:\n안심하고 맡길 수 있는 일의 틀",
    subtitle: "좋은 답 한 번보다, 같은 일을 다시 부탁해도 자료·범위·확인 방법이 흔들리지 않는 환경이 중요합니다.",
  });

  set(20, {
    title: "코덱스가 일을 이어가려면 필요한 여섯 가지",
    claim: "자료 · 할 일 · 도구 · 하지 않을 일\n· 확인 방법 · 변경 기록",
    claimSize: 48,
    caption: "어려운 기술 구조가 아니라, 동료에게 일을 맡길 때 필요한 기본 정보와 같습니다.",
  });

  set(22, {
    title: "한 번의 부탁과 팀의 일하는 법",
    left: { label: "한 번의 부탁", head: "오늘 필요한 결과", items: ["이번 작업의 목표", "참고할 자료", "원하는 결과 모양", "이번에 조심할 것"] },
    right: { label: "반복할 약속", head: "다음에도 지킬 기준", items: ["폴더와 파일 위치", "항상 따를 작업 순서", "품질·출처·보안 기준", "확인과 변경 기록"] },
    bottom: "좋았던 부탁을 팀의 약속으로 남기면, 매번 처음부터 설명하지 않아도 됩니다.",
  });

  set(23, {
    title: "Research-agent를 이루는 여섯 가지 약속",
    subtitle: "파일 이름보다 각 구성이 어떤 약속을 담는지 이해하면 충분합니다.",
    columns: [
      { label: "안내", head: "어디를 볼지", body: "폴더 구조와\n먼저 읽을 문서" },
      { label: "순서", head: "어떻게 할지", body: "검색·검토·작성의\n반복 절차" },
      { label: "기준", head: "무엇이 좋은지", body: "출처·품질·\n금지 사항" },
      { label: "실행", head: "무엇을 돌릴지", body: "노트북·명령·\n점검 도구" },
      { label: "결과", head: "어디에 남길지", body: "표·문서·\n확인 상태" },
      { label: "변경", head: "무엇이 달라졌는지", body: "비교·검토·\n되돌리기" },
    ],
    bottom: "이 여섯 가지가 있으면 코덱스는 저장소를 ‘일할 수 있는 연구 환경’으로 이해합니다.",
  });

  set(24, {
    title: "폴더 구조가 코덱스에게 주는 연구 지도",
    subtitle: "파일을 모두 설명하지 않아도, 어디에 무엇이 있고 어떤 순서로 이어지는지 보여줄 수 있습니다.",
    callout: "안내 · 순서 · 기준 · 실행 · 결과 · 변경",
  });

  set(25, {
    title: "AGENTS.md: 우리 팀이 지키는 짧은 약속",
    bottom: "길게 쓰기보다 ‘먼저 읽을 것·만들 위치·확인 방법·하지 않을 일’을 정확히 남깁니다.",
  });

  set(26, {
    title: "commands/: 자주 하는 일의 순서",
    lead: "매번 새로 묻지 않도록 반복 업무를 짧은 작업 순서로 남깁니다.",
    items: ["연구 질문 좁히기", "문헌 후보 찾기", "원문과 근거 확인하기", "초안 검토와 인용 점검하기"],
    bottom: "좋은 요청이 반복되면 긴 프롬프트보다 짧은 표준 절차가 됩니다.",
  });

  set(27, {
    title: "policies/: 좋은 결과인지 판단하는 기준",
    subtitle: "코덱스가 정답을 결정하는 것이 아니라, 사람과 같은 기준표를 보며 먼저 점검하게 합니다.",
  });

  set(28, {
    title: "notebooks/: 다시 실행할 수 있는 연구 과정",
    claim: "입력 + 실행 + 출력 + 설명",
    claimSize: 55,
    caption: "무엇을 넣고 무엇이 나왔는지 남기면, 다음 사람도 같은 과정을 확인할 수 있습니다.",
  });

  set(30, {
    title: "바뀐 내용은 확인하고, 비교하고, 되돌릴 수 있어야 합니다",
    subtitle: "GitHub는 잘못을 막는 벽이라기보다, 변경 이유를 남기고 함께 확인하는 안전장치입니다.",
  });

  set(31, {
    title: "같은 실수를 두 번 하면 다음 약속을 고칩니다",
    subtitle: "실패를 숨기지 않고 테스트·안내·기준에 반영하면, 사람과 코덱스가 함께 조금씩 나아집니다.",
  });

  set(33, {
    title: "완료의 기준: 만들었다보다 확인했다",
    columns: [
      { label: "결과", head: "파일이 생겼는가", body: "문서·표·코드·화면이\n요청한 위치에 존재" },
      { label: "내용", head: "요청과 맞는가", body: "범위·형식·핵심 내용이\n목적에 부합" },
      { label: "근거", head: "확인할 수 있는가", body: "출처·원문 위치·\n확인 필요 항목 표시" },
      { label: "작동", head: "다시 열리는가", body: "실행·화면·링크·\n기본 점검 통과" },
    ],
    bottom: "코덱스에게 ‘만들어줘’ 다음에 ‘직접 확인하고 남은 문제를 알려줘’를 붙입니다.",
  });

  set(36, {
    title: "세 번째 변화:\n평소 말로 부탁하고 함께 다듬기",
    subtitle: "첫 요청은 완벽하지 않아도 됩니다. 원하는 결과부터 말하고, 나온 것을 보며 한 가지씩 고치면 됩니다.",
  });

  set(38, {
    title: "처음에는 네 가지만 말해도 충분합니다",
    subtitle: "필요한 항목만 사용하면 됩니다. 빈칸을 모두 채우는 시험이 아닙니다.",
    columns: [
      { label: "무엇을", head: "원하는 결과", body: "무엇을 만들거나\n바꾸고 싶은가" },
      { label: "참고할 것", head: "필요한 자료", body: "어떤 폴더·문서·\n예시를 보면 되는가" },
      { label: "원하는 모양", head: "사용할 형태", body: "1쪽·표·PPT·화면 등\n누가 어떻게 쓸 것인가" },
      { label: "조심할 것", head: "경계와 확인", body: "바꾸지 않을 것·\n사람에게 물을 지점" },
    ],
    bottom: "공식 안내도 목표·맥락·출력·경계를 중심으로 필요한 만큼만 말할 것을 권합니다.",
    sources: [urls.openaiPrompt, urls.openaiBest],
    note: "영문 용어를 가르치기보다 네 가지 질문을 참가자의 말로 풀어준다.",
  });

  specs[38] = {
    type: "compare", section: "3 · 부탁의 구조", time: "1분 20초", kicker: "도구 선택을 쉽게",
    title: "클로드와 코덱스, 강의에서는 이렇게 나눠봅니다",
    subtitle: "둘이 겹치는 일도 많습니다. 처음에는 ‘대화로 생각을 다듬는가, 폴더에서 일을 이어가는가’만 구분해도 충분합니다.",
    left: {
      label: "대화로 생각을 다듬을 때",
      head: "클로드·대화형 AI",
      items: ["자료를 읽고 핵심 질문 만들기", "아이디어·문장·구성 비교하기", "첫 초안을 대화로 고치기"],
      color: C.coral,
    },
    right: {
      label: "폴더에서 일을 이어갈 때",
      head: "코덱스",
      items: ["여러 파일을 읽고 결과 파일 만들기", "노트북·웹 시안 실행하고 확인하기", "변경 내용과 검증 결과 남기기"],
      color: C.blue,
    },
    bottom: "도구 이름보다 원하는 결과를 먼저 말하면 됩니다. 필요하면 두 도구를 같은 흐름 안에서 이어 쓸 수 있습니다.",
    sources: [urls.openaiPrompt, urls.openaiBest, local("CLAUDE.md")],
    note: "우열 비교가 아니라 초보자를 위한 간단한 사용 구분이라고 밝힌다. 각 도구의 기능은 겹칠 수 있으며, 오늘은 코덱스의 폴더·실행·확인 흐름에 집중한다.",
  };

  set(40, {
    title: "어려운 요청: ‘좋은 논문을 찾아서 정리해줘’",
    claim: "무엇이 좋은가?\n어디까지 찾는가?\n무엇을 확인해야 하는가?",
    claimSize: 47,
    caption: "질문이 나쁜 것이 아니라, 중요한 선택을 코덱스가 추측해야 하는 상태입니다.",
  });

  set(41, {
    title: "조금 더 친절한 요청: 범위와 확인 방법까지",
    bottom: "요청이 길어서 좋은 것이 아니라, 중요한 선택과 완료 기준이 보여서 안정적입니다.",
  });

  set(44, {
    title: "결과에 붙이는 네 가지 확인 표지",
    subtitle: "모든 내용을 같은 확신으로 말하지 않으면, 연구자가 어디를 더 읽어야 하는지 바로 알 수 있습니다.",
    columns: [
      { label: "확인 완료", head: "원문 위치 확인", body: "페이지·절과 내용이\n직접 연결됨" },
      { label: "초록만 확인", head: "후보 단계", body: "핵심 인용으로 쓰기 전\n원문 확인 필요" },
      { label: "확인 필요", head: "정보 부족", body: "근거 위치나 메타데이터를\n추가로 확인" },
      { label: "제외", head: "이번 범위 밖", body: "제외 이유를 남겨\n같은 검토 반복 방지" },
    ],
    bottom: "모르는 내용을 그럴듯하게 채우지 않고, ‘확인 필요’로 남기는 것이 연구 품질을 지킵니다.",
  });

  specs[44] = {
    type: "steps", section: "3 · 부탁의 구조", time: "1분 10초", kicker: "함께 다듬는 대화",
    title: "첫 요청은 완벽하지 않아도 됩니다",
    subtitle: "평소 말로 시작하고, 나온 결과를 보며 구체적인 수정 한 가지씩 요청합니다.",
    steps: [
      { head: "평소 말", body: "원하는 결과부터\n짧게 설명" },
      { head: "첫 결과", body: "방향·누락·\n어려운 표현 확인" },
      { head: "고쳐 말하기", body: "‘더 짧게’ ‘근거 표시’\n‘표로 바꿔줘’" },
      { head: "최종 확인", body: "중요한 내용은\n사람이 읽고 승인" },
    ],
    bottom: "공식 안내도 첫 요청을 완벽하게 만들기보다 후속 대화로 결과를 다듬는 방식을 권합니다.",
    sources: [urls.openaiPrompt],
    note: "초보자가 가장 안심해야 할 장표다. 프롬프트 공식을 외우지 않아도 되고, 결과를 보며 수정하면 된다고 말한다.",
  };

  set(47, {
    title: "읽기는 넓게, 쓰기는 정한 곳에",
    subtitle: "처음에는 자료를 충분히 살펴보게 하되, 새 파일을 만들거나 기존 내용을 바꾸는 위치는 분명히 정합니다.",
    bottom: "예: ‘저장소는 읽어도 되지만, 새 결과는 workspace/ 아래에만 만들어 주세요.’",
  });

  set(48, {
    title: "마지막에는 ‘틀린 곳을 찾아주세요’",
    bottom: "좋은 초안을 만드는 요청과, 초안의 약점을 찾는 요청을 나누면 사람이 확인할 지점이 선명해집니다.",
  });

  set(49, {
    title: "학생에게 도움이 될 작은 시안 네 가지",
    subtitle: "거대한 플랫폼보다 한 학생 문제와 한 행동 변화를 짧은 기간 안에 확인할 수 있는 크기로 시작합니다.",
  });

  set(50, {
    title: "첫 시안은 네 가지 기준으로 선택합니다",
    subtitle: "학생에게 도움이 되고, 작게 확인할 수 있으며, 판단 위험이 낮고, 다른 사업에도 배울 점이 있어야 합니다.",
  });

  set(51, {
    title: "첫 추천: 이번 주 학습 길잡이",
    caption: "학생을 평가하지 않고, ‘지금 무엇을 할지’와 ‘막히면 누구에게 물을지’를 함께 보여주는 화면",
  });

  set(52, {
    title: "1쪽 PRD: 문제와 성공을 먼저 합의",
    subtitle: "기능을 많이 적기 전에 누구의 어떤 어려움을 줄이고, 무엇을 하지 않으며, 어떤 변화로 판단할지 정합니다.",
    columns: [
      { label: "문제", head: "다음 행동과\n질문 경로의 분산", body: "학생이 지금 할 일과\n도움을 요청할 방법을\n찾는 데 추가 부담" },
      { label: "작은 예상", head: "작은 행동과\n사람 연결", body: "계획–실행–회고 순환과\n필요한 지원의 적시성을\n높일 가능성" },
      { label: "하지 않을 일", head: "평가·예측·진단\n자동 조치 제외", body: "성적·순위·위험 낙인·\n건강 상담·민감정보 전송·\n사람 승인 없는 조치 없음" },
      { label: "확인할 변화", head: "완주·해결·이해·\n안전의 동시 개선", body: "계획–실행–회고 완주·\n도움 해결·명확성·\n오류·접근성·안전" },
    ],
  });

  set(53, {
    title: "두 가지 화면으로\n가능성을 확인합니다",
    subtitle: "먼저 학생지원 시안을 보고, 이어서 Research-agent에서 질문·검색·근거가 파일로 이어지는 모습을 확인합니다.",
  });

  set(54, {
    title: "학생 화면은 다섯 걸음만 담았습니다",
    subtitle: "목표·작은 활동·다음 행동·사람 도움·회고만 남겨, 학생이 한 번에 이해할 수 있는 흐름을 먼저 시험합니다.",
  });

  set(55, {
    title: "목표·오늘 할 일·다음 행동이 한 화면에",
    subtitle: "AI 기능을 연결하기 전에 가상 자료와 간단한 규칙만으로 화면의 순서와 문구부터 확인합니다.",
    callout: "학생 선택 · 작은 행동 · 사람에게 도움 요청",
  });

  set(56, {
    title: "성과는 완주·도움·이해·안전을 함께 봅니다",
    subtitle: "많이 눌렀는지만 보지 않고, 학생에게 실제 도움이 되었는지와 위험이 늘지 않았는지를 함께 확인합니다.",
  });

  set(57, {
    title: "연구 화면 1: 질문을 검색 조건으로 바꾸기",
    subtitle: "첫 노트북은 막연한 관심사를 연구질문·핵심어·기간·언어처럼 다시 확인할 수 있는 조건으로 정리합니다.",
  });

  set(58, {
    title: "다음 노트북이 읽을 짧은 기준 파일",
    bottom: "노트북마다 앞 단계의 결과를 파일로 넘기면, 사람과 코덱스가 같은 기준에서 다음 일을 시작합니다.",
  });

  set(60, {
    title: "연구 화면 2: 검색 조건과 실행 날짜 남기기",
    subtitle: "무엇을 어떻게 찾았는지 기록해야 결과가 달라져도 이유를 설명하고 다시 실행할 수 있습니다.",
  });

  set(61, {
    title: "검색 기록이 있어야 나중에 다시 설명할 수 있습니다",
    bottom: "결과 파일만 남기지 않고 검색식·기간·언어·실행일을 함께 남깁니다.",
  });

  set(62, {
    title: "50편은 답이 아니라 읽을 후보입니다",
    subtitle: "검색 서비스는 넓게 모으고, 연구자는 원문을 읽으며 핵심·보조·배경 문헌을 결정합니다.",
  });

  set(63, {
    title: "관련성·품질·인용 가능성은 서로 다릅니다",
    bottom: "제목이 비슷하다는 이유만으로 좋은 연구나 핵심 인용이 되는 것은 아닙니다.",
  });

  set(64, {
    title: "점수는 읽을 순서를 돕는 참고입니다",
    bottom: "점수는 시간을 배분하는 도구이고, 핵심 문헌 여부는 원문 검토로 결정합니다.",
  });

  set(65, {
    title: "표로 보면 다음에 읽을 논문이 보입니다",
    subtitle: "제목·연도·점수·초록·원문 링크를 한곳에 놓고 검토 순서를 정합니다.",
  });

  set(68, {
    title: "실패를 찾으면 요청보다 확인 절차를 보완합니다",
    bottom: "같은 오류가 반복되지 않도록 테스트와 기준 파일에 남기는 것이 연구 환경 개선입니다.",
  });

  set(69, {
    title: "후보를 다음 사람이 읽을 자료로 정리합니다",
    subtitle: "마지막 노트북은 상위 후보와 주의사항을 표로 정리해 다음 검토자가 바로 이어서 읽게 합니다.",
  });

  set(71, {
    title: "핵심 문헌은 반드시 원문을 읽고 결정합니다",
    claim: "점수는 읽을 순서\n원문은 인용의 근거",
    claimSize: 56,
    caption: "코덱스는 후보와 확인 목록을 만들고, 연구자가 원문 위치와 의미를 직접 확인합니다.",
  });

  set(72, {
    title: "PDF도 읽은 상태에 따라 정리합니다",
    bottom: "핵심·보조·배경·제외 폴더는 서열이 아니라 지금까지 확인한 역할과 상태를 보여줍니다.",
  });

  set(73, {
    title: "주장마다 출처와 원문 위치를 한 줄에",
    bottom: "원문 위치가 없으면 ‘확인 필요’로 남깁니다. 빈칸을 허용하는 편이 근거 없는 정밀함보다 안전합니다.",
  });

  set(74, {
    title: "한 문장도 근거까지 따라갈 수 있게",
    subtitle: "공동연구자와 검토자가 같은 문장의 출처·위치·지지 수준·확인 상태를 함께 볼 수 있습니다.",
  });

  set(77, {
    title: "6분 실습: 노트북 하나 실행하고 바뀐 파일 확인",
    lead: "정답을 맞히는 실습이 아니라, 입력과 출력이 어떻게 이어지는지 보는 실습입니다.",
    items: ["노트북 한 개를 위에서 아래로 실행", "새로 생기거나 바뀐 파일 이름 확인", "그 파일이 다음 단계에서 어떻게 쓰이는지 한 문장으로 설명"],
    bottom: "막히면 실행하지 않아도 됩니다. 장표의 캡처로 입력–실행–출력만 함께 확인합니다.",
  });

  set(78, {
    title: "동료에게 보여줄 임시 웹 주소 만들기",
    bottom: "실행 주소: https://prototype-rose-mu.vercel.app/student · 완성 서비스가 아니라 동료 의견을 받기 위한 시안입니다.",
  });

  set(79, {
    title: "네 번째 변화:\n사람이 결정할 경계 남기기",
    subtitle: "AI를 더 많이 쓰는 것보다, 어느 순간에 멈추고 사람에게 물을지 정하는 일이 먼저입니다.",
  });

  set(80, {
    title: "영향이 클수록 먼저 사람에게 묻습니다",
    subtitle: "틀렸을 때 학생·연구·기관에 미치는 영향이 크고 되돌리기 어려울수록 승인 시점을 앞당깁니다.",
  });

  set(81, {
    title: "세 가지 색으로 합의하는 AI 활용 범위",
    bottom: "초록은 자동 실행과 표본 확인, 노랑은 AI 초안과 사람 승인, 빨강은 사람이 직접 판단합니다.",
  });

  set(82, {
    title: "교육 AI의 기준: 사람 중심과 꾸준한 확인",
    body: "AI는 학습과 연구를 돕는 도구입니다. 사람의 권리·책임·다양성을 먼저 두고, 실제 사용 중에도 오류와 영향을 계속 살펴야 합니다.",
    note: "국제 지침 이름을 외우게 하지 않는다. 학생에게 영향을 주는 기술은 처음 한 번만 검사하는 것이 아니라 계속 확인해야 한다는 뜻만 전달한다.",
  });

  set(84, {
    title: "국내 공공기관이 함께 확인할 기준",
    subtitle: "개인정보·도입 절차·권한·기록·운영 책임을 서비스 설계 단계부터 함께 확인합니다.",
    items: specs[83].items.map((item, index) => index === 2 ? { ...item, head: "2026.08.28 시행 예정" } : item),
  });

  set(85, {
    title: "모르면 비워 두고 ‘확인 필요’로 남깁니다",
    claim: "주장 → 출처 → 원문 위치\n→ 지지 수준 → 확인 상태",
    claimSize: 52,
    caption: "그럴듯하게 채우는 것보다, 어디를 더 확인해야 하는지 보여주는 편이 신뢰를 지킵니다.",
  });

  set(86, {
    title: "먼저 막아야 할 네 가지 위험",
    columns: [
      { label: "개인정보", head: "필요 이상 수집", body: "학생·교사·참여자의\n식별·민감정보 노출" },
      { label: "근거", head: "확인하지 않은 주장", body: "읽지 않은 원문·\n없는 정보 추정" },
      { label: "권한", head: "의도하지 않은 변경", body: "공유·삭제·발송·\n원본 덮어쓰기" },
      { label: "자동 판단", head: "사람 검토 생략", body: "학생 평가·지원·\n정책 결론 자동화" },
    ],
    bottom: "첫 파일럿은 이 위험을 피할 수 있는 공개 자료·가상 자료·되돌릴 수 있는 업무에서 시작합니다.",
  });

  set(87, {
    title: "실행 전에 여섯 가지만 확인합니다",
    lead: "자료 · 출처 · 권한 · 사람 검토 · 되돌리기 · 기록",
    items: ["실제 학생·참여자 정보가 들어가는가?", "출처와 원문 위치를 확인할 수 있는가?", "읽기·쓰기·공유 범위가 정해졌는가?", "누가 최종 확인하고 승인하는가?", "잘못되면 중단하고 되돌릴 수 있는가?", "무엇을 바꿨는지 기록이 남는가?"],
    bodySize: 22,
    bottom: "여섯 질문에 답하기 어렵다면, 가상 자료와 로컬 시안 단계에 머물러도 괜찮습니다.",
  });

  set(88, {
    title: "다섯 번째 변화:\n작게 시작하고 함께 고치기",
    subtitle: "첫 시도의 목표는 큰 서비스를 완성하는 것이 아니라, 우리 팀에 맞는 한 가지 부탁과 확인 방법을 찾는 일입니다.",
  });

  set(89, {
    title: "90일의 목표는 서비스 완성이 아니라 다음 결정",
    subtitle: "문제를 확인하고, 작은 시안을 써보고, 계속할지 고칠지 멈출지를 근거로 결정합니다.",
    columns: [
      { label: "1–30일", head: "한 가지 문제", body: "반복 업무·사용자 확인\n1쪽 기준 문서\n가상 자료 시안" },
      { label: "31–60일", head: "함께 써보기", body: "내부 5명 사용\n이해·오류·안전 확인\n문구와 흐름 수정" },
      { label: "61–90일", head: "다음 결정", body: "승인된 작은 실험\n결과·품질·위험 검토\n확대·수정·중단" },
    ],
    bottom: "GitHub에 남길 것: 문제 한 문장 · 원하는 결과 · 확인 기준 · 실험 기록 · 다음 결정",
  });

  set(90, {
    title: "오늘의 핵심",
    claim: "한 번에 다 하지 않아도 됩니다.\n한 가지 부탁하고, 함께 확인하면 됩니다.",
    claimSize: 51,
    caption: "내일 시작할 한 문장: ‘이 자료를 읽고, 확인된 내용과 다음 행동을 1쪽으로 정리해 주세요.’\n\n질문을 받겠습니다.",
    note: "참가자가 내일 부탁해볼 자료 한 가지를 떠올리게 한 뒤 질문을 받는다. 질문도 도구 이름보다 ‘어떤 결과가 필요한가’에서 시작해 답한다.",
  });

  const sectionByRange = (n) => {
    if (n <= 5) return "OPENING";
    if (n <= 18) return "1 · 첫 부탁";
    if (n <= 33) return "2 · 연구 환경";
    if (n <= 52) return "3 · 부탁의 구조";
    if (n <= 78) return "4 · 화면으로 확인";
    if (n <= 87) return "5 · 안전한 경계";
    return "6 · 작은 시작";
  };

  const keep = [1,2,3,4,5,6,9,10,11,12,13,15,16,18,19,20,22,23,24,25,26,27,28,30,31,33,36,38,39,40,41,44,45,47,48,49,50,51,52,53,54,55,56,57,58,60,61,62,63,64,65,68,69,71,72,73,74,77,78,79,80,81,82,84,85,86,87,88,89,90];
  const selected = keep.map((n) => {
    const spec = specs[n - 1];
    spec.section = sectionByRange(n);
    if (!spec.note) spec.note = "전문 용어를 설명하기보다 참가자의 실제 업무 장면에 연결하고, 한 번에 한 가지 메시지만 전달한다.";
    return spec;
  });
  selected.splice(selected.length - 1, 0, {
    type: "columns",
    dark: true,
    section: "6 · 작은 시작",
    time: "1분 20초",
    kicker: "AGENTIC AI 핵심 철학",
    title: "방향 · 실행 · 근거의 역할 분담",
    subtitle: "사람이 방향을 정하고, 에이전트가 실행하며, 다음 판단은 근거에 둡니다.",
    columns: [
      {
        label: "HUMANS STEER",
        head: "인간이 방향을\n제시한다",
        body: "문제와 목표를 정의하고\n가드레일을 세우며\n최종 책임을 맡습니다.",
        headSize: 31,
      },
      {
        label: "AGENTS EXECUTE",
        head: "에이전트가\n실행한다",
        body: "정한 범위 안에서\n필요한 도구를 사용하고\n세부 작업을 이어갑니다.",
        headSize: 31,
      },
      {
        label: "EVIDENCE DECIDES",
        head: "증거가\n결정한다",
        body: "로그·실험 결과·평가 지표로\n성과와 다음 개선 방향을\n객관적으로 확인합니다.",
        headSize: 31,
      },
    ],
    bottom: "‘증거가 결정한다’는 결정권을 AI에 넘긴다는 뜻이 아니라, 사람의 판단 기준을 직관보다 근거에 둔다는 뜻입니다.",
    note: "영문 구호를 먼저 읽고 한국어로 풀어준다. 방향과 최종 책임은 사람에게 남고, 에이전트는 정한 범위에서 실행하며, 다음 결정은 로그·실험·평가 지표를 근거로 사람이 내린다는 구조를 강조한다.",
    sources: ["None (facilitation/original synthesis)."],
  });
  specs.splice(0, specs.length, ...selected);
  if (specs.length !== 71) throw new Error(`Expected 71 audience-first slides, found ${specs.length}`);
}

applyAudienceFirstSimplification();

function applyResearchProjectAudienceRefinement() {
  const set = (n, next) => { specs[n - 1] = { ...specs[n - 1], ...next }; };

  set(1, {
    subtitle: "연구사업의 기획·수행·검토를 연결하는 근거 중심 연구 환경",
  });

  set(2, {
    kicker: "강사 간단 소개",
    title: "현재 · 이력 · 연락처",
    subtitle: "",
    columns: [
      { label: "현재", head: "현업 · 부업", body: "현업  AI 서비스 기획·개발\n부업  AX · AI Native 강의·멘토링", headSize: 30, bodySize: 19 },
      { label: "이력", head: "직무 · 산업 · 기술", body: "개발자 → Agentic AI PM\n금융 → 의료 → 교육 → 이커머스\nML → CV → LLM → Agent", headSize: 27, bodySize: 18 },
      { label: "연락처", head: "AI 활용 문의", body: "LinkedIn  linkedin.com/in/smilechacha\nEmail  business.sjcha@gmail.com\nPhone  010-9562-9958", headSize: 30, bodySize: 17 },
    ],
    bottom: "AI 활용·업무 적용 관련 문의는 언제든 편하게 연락해 주세요.",
    note: "현재 활동, 주요 이력, 공개 연락처 순서로 간략히 소개한다. 현재 활동은 현업과 부업으로 나누고, 이력은 직무·산업·기술 변화만 압축한다.",
    transition: "디지털교육 연구사업의 기획·수행·검토 과정으로 바로 연결한다.",
    sources: ["Presenter-provided public contact details (profile website)."],
  });

  set(3, {
    subtitle: "연구사업의 기획·수행·검토 흐름에 따른 핵심 요청, 연구 환경, 실제 화면, 적용 기준",
    items: [
      { time: "15:00", head: "연구 업무", body: "사업 흐름과\n반복 병목", color: C.cyan },
      { time: "15:15", head: "핵심 요청", body: "자료·근거·\n다음 행동", color: C.blue },
      { time: "15:35", head: "연구 환경", body: "규칙·검증·\n변경 기록", color: C.coral },
      { time: "15:55", head: "실제 화면", body: "학생지원·\n연구 노트북", color: C.lime },
      { time: "16:45", head: "적용 기준", body: "승인·성과·\n위험", color: C.ink },
    ],
  });

  set(4, {
    title: "오늘의 세 가지 관점",
    subtitle: "연구사업의 산출물·근거·책임 구조에 코덱스를 연결하는 기준",
    columns: [
      { label: "01 · 연구 요청", head: "목표·자료·산출물", body: "연구 질문과\n완료 기준", headSize: 29 },
      { label: "02 · 근거 관리", head: "출처·검증·변경", body: "원문 위치와\n실행 기록", headSize: 29 },
      { label: "03 · 연구 책임", head: "판단·승인·공유", body: "연구자의\n최종 책임", headSize: 29 },
    ],
    bottom: "",
  });

  set(5, {
    title: "연구사업에서 누적되는 반복 업무",
    lead: "자료 탐색·정리·검토·보고 과정의 반복이 연구자의 판단 시간을 잠식합니다.",
    items: [
      "여러 저장소의 자료·메타데이터 재확인",
      "회의·중간보고 전 핵심과 미확인 쟁점 재정리",
      "표·목록·보고서 형식의 반복 변환",
      "출처·수정 이유·담당자·일정 추적",
    ],
    bottom: "첫 적용 대상: 빈도가 높고 기준이 명확하며 결과를 사람이 검토할 수 있는 업무",
  });

  set(6, {
    title: "첫 번째 변화:\n연구자료 정리의 구조화",
    subtitle: "자료 묶음을 근거·확인 과제·다음 행동으로 변환하는 요청에서 시작",
  });

  set(11, {
    title: "한 요청의 실행 구조",
    subtitle: "자료 확인부터 연구자 검토와 후속 작업 기록까지 다섯 단계로 구분",
    bottom: "첫 결과에서 발견한 오류와 누락을 다음 요청·기준 파일·검증 절차에 반영",
  });

  set(14, {
    title: "첫 질문의 전환",
    caption: "자동화 대상보다 연구 의사결정에 필요한 화면·문서·검토 항목을 먼저 정의",
  });

  set(15, {
    title: "두 번째 변화:\n반복 가능한 연구지원 환경",
    subtitle: "동일한 요청에 동일한 자료·범위·검증·기록 기준을 적용하는 구조",
  });

  set(16, {
    title: "연구지원 환경의 여섯 요소",
    caption: "자료 · 할 일 · 도구 · 하지 않을 일 · 확인 방법 · 변경 기록",
  });

  set(17, {
    title: "개별 요청과 연구실 표준의 구분",
    bottom: "검증된 요청을 표준 절차와 정책으로 전환해 설명 비용과 품질 편차를 축소",
  });

  set(18, {
    title: "Research-agent의 여섯 구성 요소",
    subtitle: "안내·절차·기준·실행·산출물·변경 관리의 결합",
    bottom: "저장소가 연구사업의 작업 맥락·품질 기준·현재 상태를 제공",
  });

  set(27, {
    title: "세 번째 변화:\n연구 요청의 구조화와 반복 개선",
    subtitle: "요청문 완성도가 아니라 목표·자료·산출물·검증 기준의 명료성이 핵심",
  });

  set(28, {
    title: "연구 요청의 네 가지 필수 항목",
    subtitle: "업무 성격에 따라 필요한 항목을 선택하되 중요한 판단 조건은 명시",
    columns: [
      { label: "목적", head: "원하는 결과", body: "무엇을 만들거나\n바꿀 것인가" },
      { label: "참고 자료", head: "근거와 현재 상태", body: "어떤 폴더·문서·\n예시를 볼 것인가" },
      { label: "산출물", head: "형식과 활용", body: "1쪽·표·PPT·화면 등\n누가 어떻게 쓸 것인가" },
      { label: "제약·검증", head: "경계와 완료 기준", body: "바꾸지 않을 것·\n확인·승인 지점" },
    ],
    bottom: "목표·맥락·출력·경계를 기준으로 요청을 구조화",
  });

  set(29, {
    title: "Claude와 Codex의 기본 활용 구분",
    subtitle: "대화 중심의 사고 정리와 저장소 중심의 실행·검증을 연구 흐름 안에서 조합",
    bottom: "도구 선택 기준: 필요한 산출물과 작업 환경",
  });

  set(30, {
    title: "범위가 불명확한 요청",
    caption: "연구 범위·선별 기준·확인 수준을 시스템이 임의로 추정하는 상태",
  });

  set(31, {
    title: "범위와 검증 기준을 포함한 요청",
    bottom: "핵심은 문장 길이가 아니라 선택 기준·산출물·완료 조건의 명시",
  });

  set(33, {
    title: "요청 품질의 반복 개선",
    subtitle: "첫 결과의 방향·누락·근거 상태를 검토하고 후속 요청으로 보완",
    steps: [
      { head: "초기 요청", body: "목표와 산출물\n우선 명시" },
      { head: "첫 결과", body: "방향·누락·\n근거 상태 검토" },
      { head: "보완 요청", body: "범위·형식·\n검증 기준 조정" },
      { head: "연구자 확인", body: "핵심 내용과\n대외 활용 승인" },
    ],
    bottom: "후속 요청은 결과를 기준에 맞게 수렴시키는 검토 과정",
  });

  set(34, {
    subtitle: "자료 탐색 범위와 파일 변경 범위를 분리",
  });

  set(35, {
    title: "생성 요청과 비판적 검토 요청의 분리",
    bottom: "초안 생성과 오류 탐지를 분리해 검토 편향과 누락 위험을 축소",
  });

  set(36, {
    title: "학생지원 서비스 후보군",
    subtitle: "학생 문제·검증 가능성·안전성·재사용성을 기준으로 MVP 범위를 비교",
  });

  set(41, {
    title: "학생 화면의 다섯 핵심 요소",
    subtitle: "목표·활동·다음 행동·사람 도움·회고로 학생지원 흐름을 구성",
  });

  set(58, {
    lead: "입력–실행–산출물–후속 활용의 연결 구조를 확인합니다.",
    bottom: "실행 환경이 제한되면 캡처를 사용해 동일한 구조를 검토",
  });

  set(59, {
    title: "검토자 공유를 위한 임시 웹 주소",
    bottom: "실행 주소: https://prototype-rose-mu.vercel.app/student · 내부 검토와 의견 수렴을 위한 강의용 시안",
  });

  set(60, {
    title: "네 번째 변화:\n사람 검토·승인 경계의 명시",
    subtitle: "영향도·복구 가능성·데이터 민감도에 따라 승인 시점을 설계",
  });

  set(61, {
    title: "영향도와 복구 가능성에 따른 승인 시점",
  });

  set(67, {
    title: "실행 전 여섯 가지 점검",
    bottom: "미확정 항목은 가상 자료·로컬 시안 단계에서 보완한 후 다음 단계로 이동",
  });

  set(68, {
    title: "다섯 번째 변화:\n작은 실험과 근거 기반의 다음 결정",
    subtitle: "첫 목표는 서비스 완성이 아니라 연구 문제·성과 기준·위험 통제의 검증",
  });

  set(71, {
    claim: "한 가지 반복 업무에서 시작\n실행 결과를 근거로 한 다음 범위 결정",
    claimSize: 49,
    caption: "첫 요청: ‘이 자료를 읽고, 확인된 내용·확인 과제·다음 행동을 1쪽으로 정리해 주세요.’\n\n질의응답",
  });
}

applyResearchProjectAudienceRefinement();

async function main() {
  if (specs.length !== 71) throw new Error(`Expected 71 slides, found ${specs.length}`);
  await fs.writeFile(path.join(OUT, "build/specs-current.json"), JSON.stringify(specs, null, 2), "utf8");
  const pres = Presentation.create({ slideSize: { width: W, height: H } });
  for (let i = 0; i < specs.length; i++) await renderSpec(pres, specs[i], i + 1);
  const pptx = await PresentationFile.exportPptx(pres);
  await pptx.save(FINAL);
  const inspect = await pres.inspect({ kind: "slide,textbox,shape,image,chart,notes", maxChars: 12000 });
  await fs.writeFile(path.join(OUT, "build/deck-inspect.ndjson"), inspect.ndjson, "utf8");
  console.log(`Saved ${FINAL}`);
  console.log(`Slides ${specs.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
