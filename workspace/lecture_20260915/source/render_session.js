// Claude Code 세션 기록(JSONL) → Claude Desktop Code 탭 스타일 HTML → PNG
// 사용: node render_session.js <jsonl> <out.png> '<json options>'
// options: { title, turn (0-based, 기본 마지막), sessions: [{label, active}], project, model, effort, height }
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { marked } = require("marked");
const sharp = require("sharp");

const [,, jsonlPath, outPng, optJson] = process.argv;
const opt = Object.assign({ turn: -1, project: "my-career", model: "Claude Fable 5.1", effort: "노력 높음", height: 1000, width: 1600 }, JSON.parse(optJson || "{}"));
const KIT = "/Users/sungjae-cha/Documents/research-agent/workspace/lecture_20260915/practice_kit/my-career/";

const LEC = "/Users/sungjae-cha/Documents/research-agent/workspace/lecture_20260915/";
function rel(p) { return typeof p === "string" ? p.replace(KIT, "").replace(LEC, "../../") : ""; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

// ── 파싱: 사용자 텍스트 메시지 기준으로 턴을 나눈다
const lines = fs.readFileSync(jsonlPath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const turns = [];
for (const d of lines) {
  if (d.type !== "user" && d.type !== "assistant") continue;
  const m = d.message; const cont = m.content;
  if (d.type === "user") {
    if (typeof cont === "string") { turns.push({ user: cont, items: [] }); continue; }
    const texts = cont.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    if (texts.trim()) turns.push({ user: texts, items: [] });
    // tool_result 는 무시 (도구 결과는 칩으로만 표현)
  } else {
    const t = turns[turns.length - 1]; if (!t) continue;
    for (const b of cont) {
      if (b.type === "text" && b.text.trim()) t.items.push({ kind: "text", text: b.text });
      else if (b.type === "tool_use") t.items.push({ kind: "tool", name: b.name, input: b.input });
    }
  }
}
const idx = opt.turn < 0 ? turns.length + opt.turn : opt.turn;
const turn = turns[idx];
if (!turn) { console.error("no turn", idx, "of", turns.length); process.exit(1); }

function chip(it) {
  const i = it.input || {};
  let label = it.name, detail = "";
  if (it.name === "Read") { label = "Read"; detail = rel(i.file_path); }
  else if (it.name === "Write") { label = "Write"; detail = rel(i.file_path); }
  else if (it.name === "Edit") { label = "Edit"; detail = rel(i.file_path); }
  else if (it.name === "Bash") { label = "Bash"; detail = (i.description || i.command || "").replace(KIT, "").slice(0, 70); }
  else if (it.name === "Glob" || it.name === "Grep") { detail = i.pattern || ""; }
  else detail = JSON.stringify(i).slice(0, 60);
  const cls = it.name === "Write" || it.name === "Edit" ? "chip write" : "chip";
  return `<div class="${cls}"><span class="ck">${esc(label)}</span><span class="cv">${esc(detail)}</span><span class="ok">✓</span></div>`;
}

// 도구 호출을 연속 그룹으로 묶고, 텍스트는 마크다운 렌더
let body = "";
let group = [];
const flush = () => { if (group.length) { body += `<div class="chips">${group.map(chip).join("")}</div>`; group = []; } };
for (const it of turn.items) {
  if (it.kind === "tool") group.push(it);
  else { flush(); body += `<div class="md">${marked.parse(it.text)}</div>`; }
}
flush();

const sessions = opt.sessions || [{ label: opt.title, active: true }];
const prev = idx > 0 ? `<div class="prev">이전 대화 ${idx}개 접힘 · 같은 세션에서 이어서 요청</div>` : "";

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #F7F7F5; font-family: "NanumGothic", -apple-system, "Apple SD Gothic Neo", sans-serif; color: #1F1F1E; }
  .app { display: grid; grid-template-columns: 250px 1fr; height: ${opt.height}px; width: ${opt.width}px; overflow: hidden; }
  .side { background: #F0EFEA; border-right: 1px solid #E3E1DA; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; }
  .dots { display: flex; gap: 7px; padding: 4px 4px 8px; } .dots i { width: 12px; height: 12px; border-radius: 50%; display: block; }
  .tabs { display: flex; gap: 4px; background: #E6E4DD; border-radius: 10px; padding: 4px; font-size: 12.5px; }
  .tabs span { flex: 1; text-align: center; padding: 6px 0; border-radius: 8px; color: #5F5E58; }
  .tabs span.on { background: #FFFFFF; color: #1F1F1E; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
  .newbtn { margin-top: 6px; border: 1px solid #D9D7CF; background: #FFF; border-radius: 10px; padding: 9px 12px; font-size: 13px; font-weight: 700; color: #1F1F1E; }
  .proj { margin-top: 10px; font-size: 11px; color: #8A8880; letter-spacing: .04em; text-transform: uppercase; padding: 0 6px; }
  .pname { font-size: 13px; font-weight: 700; padding: 6px 6px 2px; color: #1F1F1E; }
  .ppath { font-size: 11px; color: #8A8880; padding: 0 6px 6px; font-family: Menlo, monospace; }
  .sess { font-size: 13px; padding: 8px 10px; border-radius: 8px; color: #3B3A36; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sess.on { background: #FFFFFF; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .main { display: flex; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; }
  .top { height: 52px; border-bottom: 1px solid #E8E6DF; display: flex; align-items: center; padding: 0 22px; gap: 12px; background: #FBFBF9; }
  .top .t { font-size: 14.5px; font-weight: 700; } .top .p { font-size: 12px; color: #8A8880; font-family: Menlo, monospace; }
  .top .sp { flex: 1; }
  .pill { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: #E6F1EB; color: #134536; font-weight: 700; border: 1px solid #C9E2D5; }
  .pill.gray { background: #EFEEE9; color: #5F5E58; border-color: #E0DED6; }
  .chat { flex: 1; min-height: 0; overflow: hidden; padding: 22px 34px 0; position: relative; }
  .fade { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; background: linear-gradient(rgba(247,247,245,0), #F7F7F5); pointer-events: none; }
  .prev { font-size: 12px; color: #8A8880; text-align: center; margin-bottom: 12px; }
  .user { margin-left: auto; max-width: 78%; background: #E9EEF4; border-radius: 16px 16px 4px 16px; padding: 12px 16px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; margin-bottom: 18px; color: #1F1F1E; }
  .asst { display: grid; grid-template-columns: 28px 1fr; gap: 12px; }
  .av { width: 28px; height: 28px; border-radius: 50%; background: #1F6B52; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
  .chips { display: flex; flex-direction: column; gap: 4px; margin: 4px 0 12px; }
  .chip { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; background: #FFFFFF; border: 1px solid #E6E4DD; border-radius: 8px; padding: 5px 10px; width: fit-content; max-width: 100%; font-family: Menlo, monospace; color: #3B3A36; }
  .chip .ck { font-weight: 700; color: #5F5E58; } .chip.write .ck { color: #1F6B52; }
  .chip .ok { color: #1F6B52; font-weight: 700; margin-left: 2px; }
  .md { font-size: 14px; line-height: 1.6; color: #1F1F1E; }
  .md p { margin: 0 0 10px; } .md h1, .md h2, .md h3 { font-size: 15px; margin: 12px 0 6px; }
  .md ul, .md ol { margin: 0 0 10px; padding-left: 22px; } .md li { margin: 2px 0; }
  .md code { background: #EFEEE9; padding: 1px 5px; border-radius: 4px; font-family: Menlo, monospace; font-size: 12.5px; }
  .md table { border-collapse: collapse; margin: 6px 0 12px; font-size: 13px; }
  .md th, .md td { border: 1px solid #E3E1DA; padding: 5px 10px; text-align: left; vertical-align: top; }
  .md th { background: #F0EFEA; font-weight: 700; }
  .md strong { font-weight: 700; }
  .composer { margin: 10px 34px 18px; background: #FFFFFF; border: 1px solid #DEDCD4; border-radius: 14px; padding: 12px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.05); }
  .composer .ph { font-size: 13.5px; color: #A09E96; }
  .composer .row { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 12px; color: #5F5E58; }
  .composer .row .sp { flex: 1; }
  .send { width: 28px; height: 28px; border-radius: 8px; background: #1F6B52; }
</style></head><body><div class="app">
  <div class="side">
    <div class="dots"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i></div>
    <div class="tabs"><span>Chat</span><span>Cowork</span><span class="on">Code</span></div>
    <div class="newbtn">＋ 새 세션</div>
    <div class="proj">프로젝트</div>
    <div class="pname">${esc(opt.project)}</div>
    <div class="ppath">practice_kit/${esc(opt.project)}</div>
    ${sessions.map((s) => `<div class="sess ${s.active ? "on" : ""}">${esc(s.label)}</div>`).join("")}
  </div>
  <div class="main">
    <div class="top"><span class="t">${esc(opt.title)}</span><span class="p">${esc(opt.project)}</span><span class="sp"></span><span class="pill">${esc(opt.model)}</span><span class="pill gray">${esc(opt.effort)}</span></div>
    <div class="chat">
      ${prev}
      <div class="user">${esc(turn.user)}</div>
      <div class="asst"><div class="av">C</div><div>${body}</div></div>
      <div class="fade"></div>
    </div>
    <div class="composer"><div class="ph">후속 요청을 입력하세요… (예: 표만 남기고 각 행 한 줄로 줄여줘)</div><div class="row"><span>＋</span><span>${esc(opt.model)}</span><span>·</span><span>${esc(opt.effort)}</span><span class="sp"></span><span class="send"></span></div></div>
  </div>
</div></body></html>`;

const outAbs = path.resolve(outPng);
const tmpHtml = outAbs.replace(/\.png$/, ".html");
fs.writeFileSync(tmpHtml, html);
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const raw = outAbs.replace(/\.png$/, ".raw.png");
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${opt.width},${opt.height}`, `--screenshot=${raw}`, "file://" + tmpHtml], { stdio: "ignore" });
sharp(raw).png({ compressionLevel: 9 }).toFile(outAbs).then(() => { fs.unlinkSync(raw); console.log("rendered", outPng, "turn", idx + 1, "/", turns.length); });
