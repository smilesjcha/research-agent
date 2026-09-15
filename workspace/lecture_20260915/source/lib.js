// 디자인 시스템 헬퍼 — PNU 공학커뮤니케이션 2026-09-15
// 팔레트: 네이비 0B1F3A · 딥 에메랄드 1F6B52 (다크 배경에서는 accentLight 8FCBB0)
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");

const W = 13.333, H = 7.5, M = 0.7;
const CW = W - 2 * M; // 11.933
const FONT = process.env.DECK_FONT || "NanumGothic"; // PDF 변환용: DECK_FONT="Apple SD Gothic Neo"
const MONO = "Courier New";

const C = {
  navy: "0B1F3A", navy2: "142C4F", ink: "111827", muted: "5B6573", faint: "8A94A6",
  line: "E3E8EF", panel: "F3F5F9", white: "FFFFFF", paper: "FFFFFF",
  accent: "1F6B52", accentSoft: "E6F1EB", accentInk: "134536", accentLight: "8FCBB0",
  teal: "1F6F78", tealSoft: "E4F1F2",
  navySoft: "E8EDF5",
  red: "B94A48", redSoft: "F8E5E4",
  green: "2F7D5B", greenSoft: "E3F1EA",
  amber: "B07A12", amberSoft: "FBF3DC",
  darkLine: "26395A", darkMuted: "9AA7BC", darkPanel: "142C4F",
};

const iconCache = new Map();
async function iconPng(name, color = "#FFFFFF", size = 256) {
  const key = `${name}|${color}`;
  if (iconCache.has(key)) return iconCache.get(key);
  const Cmp = Fi[name];
  if (!Cmp) throw new Error("no icon " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Cmp, { color, size, strokeWidth: 2 }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache.set(key, data);
  return data;
}

function mk(pres) {
  const api = {};
  let slideNo = 0;
  let current = null;

  api.slide = (dark = false) => {
    const s = pres.addSlide();
    s.background = { color: dark ? C.navy : C.paper };
    s._dark = dark;
    slideNo += 1;
    s._no = slideNo;
    current = s;
    return s;
  };

  api.text = (s, text, x, y, w, h, o = {}) => {
    const dark = s._dark;
    return s.addText(text, {
      x, y, w, h, isTextBox: true, margin: 0,
      fontFace: o.font || FONT,
      fontSize: o.size || 14,
      color: o.color || (dark ? C.white : C.ink),
      bold: !!o.bold,
      italic: !!o.italic,
      align: o.align || "left",
      valign: o.valign || "top",
      lineSpacingMultiple: o.lsm || 1.15,
      charSpacing: o.cs,
      fit: o.fit,
      paraSpaceAfter: o.psa,
      ...(o.link ? { hyperlink: { url: o.link } } : {}),
      ...(o.extra || {}),
    });
  };

  // rich text: array of runs
  api.rich = (s, runs, x, y, w, h, o = {}) => {
    const dark = s._dark;
    const arr = runs.map((r) => ({
      text: r.text,
      options: {
        fontFace: r.font || o.font || FONT,
        fontSize: r.size || o.size || 14,
        color: r.color || o.color || (dark ? C.white : C.ink),
        bold: !!r.bold, italic: !!r.italic,
        breakLine: !!r.br,
        bullet: r.bullet,
        paraSpaceAfter: r.psa,
        ...(r.link ? { hyperlink: { url: r.link } } : {}),
      },
    }));
    return s.addText(arr, { x, y, w, h, isTextBox: true, margin: 0, align: o.align || "left", valign: o.valign || "top", lineSpacingMultiple: o.lsm || 1.15, paraSpaceAfter: o.psa });
  };

  api.rect = (s, x, y, w, h, fill, o = {}) => {
    const line = o.line ? { color: o.line, width: o.lineW || 0.75 } : { color: fill, width: 0 };
    if (o.round) {
      return s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill, transparency: o.tr }, line, rectRadius: o.round, shadow: o.shadow });
    }
    return s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill, transparency: o.tr }, line, shadow: o.shadow });
  };

  api.hline = (s, x, y, w, color, pt = 0.75) => s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color, width: pt } });
  api.vline = (s, x, y, h, color, pt = 0.75) => s.addShape(pres.ShapeType.line, { x, y, w: 0, h, line: { color, width: pt } });

  api.circle = (s, x, y, d, fill, o = {}) =>
    s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: o.line || fill, width: o.lineW || 0 } });

  api.icon = async (s, name, x, y, d, color) => {
    const data = await iconPng(name, "#" + color);
    return s.addImage({ data, x, y, w: d, h: d });
  };

  // 원형 배경 위 아이콘
  api.iconBadge = async (s, name, x, y, d, bg, fg) => {
    api.circle(s, x, y, d, bg);
    const id = d * 0.5;
    await api.icon(s, name, x + (d - id) / 2, y + (d - id) / 2, id, fg);
  };

  api.numBadge = (s, n, x, y, d, bg, fg, size) => {
    api.circle(s, x, y, d, bg);
    api.text(s, String(n), x, y, d, d, { size: size || 13, bold: true, color: fg, align: "center", valign: "middle" });
  };

  // 이미지(캡처) 삽입: 경로 또는 base64 data, 테두리 프레임 포함
  api.image = (s, path, x, y, w, h, o = {}) => {
    if (o.frame !== false) api.rect(s, x - 0.04, y - 0.04, w + 0.08, h + 0.08, o.frameColor || C.line, { round: 0.06 });
    return s.addImage({ path, x, y, w, h, sizing: o.sizing || { type: "contain", w, h }, rounding: false });
  };

  api.shadow = () => ({ type: "outer", color: "0B1F3A", blur: 6, offset: 1.5, angle: 90, opacity: 0.08 });

  api.header = (s, kicker, title, subtitle, o = {}) => {
    const dark = s._dark;
    api.text(s, kicker, M, 0.55, CW, 0.28, { size: 12, bold: true, color: dark ? C.accentLight : C.accent, cs: 1 });
    const len = [...title].length;
    const auto = len <= 26 ? 30 : len <= 31 ? 27 : len <= 36 ? 24 : 22;
    api.text(s, title, M, 0.88, CW, 0.7, { size: o.titleSize || auto, bold: true, color: dark ? C.white : C.ink, lsm: 1.05, valign: "middle" });
    if (subtitle) api.text(s, subtitle, M, 1.62, CW, 0.45, { size: 15, color: dark ? C.darkMuted : C.muted });
  };

  api.footer = (s, section) => {
    const dark = s._dark;
    api.hline(s, M, 6.95, CW, dark ? C.darkLine : C.line, 0.5);
    api.text(s, section, M, 7.02, 6, 0.25, { size: 9.5, color: dark ? C.darkMuted : C.faint });
    api.text(s, String(s._no).padStart(2, "0"), W - M - 0.6, 7.02, 0.6, 0.25, { size: 9.5, bold: true, color: dark ? C.darkMuted : C.faint, align: "right" });
    api.text(s, "PNU 공학커뮤니케이션 · 2026.09.15", W / 2 - 2, 7.02, 4, 0.25, { size: 9.5, color: dark ? C.darkMuted : C.faint, align: "center" });
  };

  api.notes = (s, { intent, time, next, sources }) => {
    const lines = [
      `발표 의도: ${intent}`,
      `권장 시간: ${time}`,
      `전환 문장: ${next}`,
      `[Sources] ${sources || "None (facilitation/original synthesis)"}`,
    ];
    s.addNotes(lines.join("\n"));
  };

  // 카드: 소프트 틴트 배경 + 번호/아이콘 + 제목 + 본문
  api.card = async (s, x, y, w, h, { n, icon, title, body, fill, iconBg, iconFg, titleColor, bodySize, titleSize }) => {
    api.rect(s, x, y, w, h, fill || C.panel, { round: 0.08 });
    let ty = y + 0.28;
    const pad = 0.28;
    if (icon) {
      await api.iconBadge(s, icon, x + pad, y + 0.26, 0.5, iconBg || C.navy, iconFg || C.white);
      ty = y + 0.92;
    } else if (n !== undefined) {
      api.numBadge(s, n, x + pad, y + 0.26, 0.42, iconBg || C.accent, iconFg || C.white, 12);
      ty = y + 0.84;
    }
    api.text(s, title, x + pad, ty, w - 2 * pad, 0.4, { size: titleSize || 15, bold: true, color: titleColor || C.ink });
    if (body) api.text(s, body, x + pad, ty + 0.46, w - 2 * pad, h - (ty - y) - 0.6, { size: bodySize || 12, color: C.muted, lsm: 1.3 });
  };

  // 프리미엄 표: 세로선 없음, 얇은 가로 구분선, 헤더 네이비, 세로 가운데 정렬
  api.table = (s, x, y, colW, rows, o = {}) => {
    const dark = s._dark;
    const headFill = o.headFill || C.navy;
    const headColor = o.headColor || C.white;
    const bodySize = o.size || 12;
    const lineColor = o.lineColor || C.line;
    const zebra = o.zebra !== false;
    const data = rows.map((row, ri) => {
      const isHead = ri === 0 && o.header !== false;
      const isLast = ri === rows.length - 1;
      return row.map((cell, ci) => {
        const c = typeof cell === "object" && cell !== null && !Array.isArray(cell) ? cell : { text: String(cell) };
        const border = [
          { type: "none" },
          { type: "none" },
          isLast ? { type: "solid", pt: 0.75, color: isHead ? headFill : lineColor } : { type: "solid", pt: isHead ? 0 : 0.75, color: isHead ? headFill : lineColor },
          { type: "none" },
        ];
        if (isHead) border[2] = { type: "solid", pt: 0.5, color: headFill };
        const zebraFill = zebra && !isHead && ri % 2 === 0 ? (o.zebraFill || "F8FAFC") : (o.bodyFill || C.white);
        return {
          text: c.text,
          options: {
            fontFace: c.font || FONT,
            fontSize: isHead ? (o.headSize || 11.5) : (c.size || bodySize),
            bold: isHead ? true : !!c.bold || (ci === 0 && o.firstBold !== false),
            color: isHead ? headColor : (c.color || (ci === 0 ? C.ink : C.muted)),
            fill: { color: c.fill || (isHead ? headFill : zebraFill) },
            align: c.align || (o.aligns ? o.aligns[ci] : "left"),
            valign: c.valign || "middle",
            margin: c.margin || [0.05, 0.1, 0.05, 0.1],
            border,
            italic: !!c.italic,
            ...(c.link ? { hyperlink: { url: c.link } } : {}),
          },
        };
      });
    });
    return s.addTable(data, { x, y, w: colW.reduce((a, b) => a + b, 0), colW, rowH: o.rowH, autoPage: false });
  };

  // 채팅형 요청문 카드 (Claude Desktop 입력창 느낌)
  api.promptCard = (s, x, y, w, h, { label, lines, fill, labelColor }) => {
    api.rect(s, x, y, w, h, fill || C.white, { round: 0.08, line: C.line, shadow: api.shadow() });
    api.text(s, label || "요청문", x + 0.28, y + 0.2, w - 0.56, 0.25, { size: 10.5, bold: true, color: labelColor || C.accent, cs: 1 });
    const runs = [];
    lines.forEach((l, i) => {
      if (typeof l === "string") runs.push({ text: l, size: 12.5, color: C.ink, br: i < lines.length - 1 });
      else runs.push({ text: l.text, size: 12.5, bold: !!l.bold, color: l.color || C.ink, br: i < lines.length - 1 });
    });
    api.rich(s, runs, x + 0.28, y + 0.52, w - 0.56, h - 0.7, { lsm: 1.35 });
  };

  // 태그(라벨 + 값) 한 줄
  api.tag = (s, text, x, y, w, h, fill, color, size = 10.5) => {
    api.rect(s, x, y, w, h, fill, { round: 0.06 });
    api.text(s, text, x, y, w, h, { size, bold: true, color, align: "center", valign: "middle" });
  };

  // 화살표 (얇은 셰브론 대용 선)
  api.arrow = (s, x, y, w, color) => s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color, width: 1, endArrowType: "triangle" } });

  api.section = (s, num, title, desc, question, sectionLabel) => {
    api.text(s, num, M, 1.7, 3, 1.2, { size: 72, bold: true, color: C.accentLight, lsm: 1 });
    api.text(s, title, M, 3.0, CW, 0.9, { size: 36, bold: true, color: C.white, lsm: 1.1 });
    api.text(s, desc, M, 3.95, CW - 2, 0.6, { size: 16, color: C.darkMuted });
    if (question) {
      api.rect(s, M, 5.0, CW, 0.9, C.darkPanel, { round: 0.08 });
      api.text(s, "이 절에서 답할 질문", M + 0.3, 5.15, 3, 0.25, { size: 10.5, bold: true, color: C.accentLight, cs: 1 });
      api.text(s, question, M + 0.3, 5.42, CW - 0.6, 0.4, { size: 14, color: C.white });
    }
    api.footer(s, sectionLabel);
  };

  return api;
}

module.exports = { mk, C, W, H, M, CW, FONT, MONO, iconPng };
