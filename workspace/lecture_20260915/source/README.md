# PNU 공학커뮤니케이션 덱 빌드 소스 (2026-09-15)

- `npm install` 후 `node build.js [출력경로]` 로 `PNU_공학커뮤니케이션_20260915.pptx` 를 재생성합니다. (pptxgenjs, react-icons, sharp, qrcode, marked)
- `lib.js` — 디자인 시스템: 팔레트(네이비 0B1F3A · 딥 에메랄드 1F6B52 · 다크 배경용 8FCBB0), 헤더 자동 크기, 프리미엄 표, 카드·요청문 카드·아이콘 배지, 하이퍼링크(`link`), 이미지 프레임(`image`).
- `build_part1.js` — 시작 · GitHub 하네스 저장소(QR) · 01 채용 시장 · 02 직무 리서치 (1–18)
- `build_part2.js` — 03 기술 문서 · 04 자기소개 (19–32)
- `build_part3.js` — 05 Claude Code 실습(카드 A·B·C + 실제 실행 화면 6장) · 06 경계 · 마무리 (33–49)
- `render_session.js` — Claude Code 세션 기록(JSONL) → Claude Desktop Code 탭 스타일 화면 PNG. `../assets/practice_*.png` 생성. Google Chrome 헤드리스 사용.

```bash
node render_session.js ../practice_runs/transcripts/A_1e5c085e.jsonl ../assets/practice_A.png '{"title":"실습 A · 채용공고 → 역량 매트릭스","turn":0}'
```

`assets/practice_*.png` 가 없으면 해당 화면 장표는 건너뜁니다.
