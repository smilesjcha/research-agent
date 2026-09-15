const pptxgen = require("pptxgenjs");
const { mk } = require("./lib");
const part1 = require("./build_part1");
const part2 = require("./build_part2");
const part3 = require("./build_part3");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "차성재";
  pres.title = "AI와 함께 쓰는 공학 커뮤니케이션 — PNU 2026.09.15";
  const a = mk(pres);
  await part1(pres, a);
  await part2(pres, a);
  await part3(pres, a);
  const out = process.argv[2] || "/home/claude/pnu/PNU_공학커뮤니케이션_20260915.pptx";
  await pres.writeFile({ fileName: out });
  console.log("written", out);
})().catch((e) => { console.error(e); process.exit(1); });
