# PNU 공학커뮤니케이션 — AI와 함께 쓰는 공학 커뮤니케이션 (2026-09-15)

부산대학교 공학커뮤니케이션 강의 자료입니다. 50분 진행, Claude Code 실습 포함. 대상: 화공·화학·소재·재료공학 계열 학생.

## 바로 열기

- `PNU_공학커뮤니케이션_20260915.pptx` — 50장 본 강의 자료. 장표별 발표자 노트(의도 · 시간 · 전환 문장 · Sources)
- `PNU_공학커뮤니케이션_20260915.pdf` — 배포용 PDF
- `prompt_cards.md` — 요청문 카드 A · B · C, 후속 요청, 답변 예시
- `practice_guide.md` — 강사용 실습 시뮬레이션 가이드 (턴별 입력 · Claude가 하는 일 · 확인할 것 · 막혔을 때)
- `practice_kit/my-career/` — 학생 배포용 실습 프로젝트 (`CLAUDE.md` 규칙 포함)
- `practice_runs/` — 카드 A · B · C를 Claude Code(Fable 5.1 · 높음)로 실제 실행한 기록 · 결과 파일 · 세션 JSONL
- `assets/practice_*.png` — 실제 세션 기록을 Claude Desktop Code 탭 화면으로 렌더링한 이미지 (PPT 37~45번 장표)
- `source/` — PPT 재생성 소스 (`node build.js`) 와 세션 화면 렌더러 (`render_session.js`)

## 50분 타임테이블

| 분 | 절 | 장표 | 내용 |
|---|---|---|---|
| 00–05 | 시작 | 1–7 | 표지 · 강사 · 50분 흐름 · GitHub 하네스 저장소 · 같은 방법 다른 도구(Claude Code · Codex · NotebookLM) · 오늘의 약속 · 공감 장면 |
| 05–11 | 01 채용 시장 | 8–13 | 기업이 보는 세 가지 · 일의 흐름 · 요청·검증·책임 · 요청의 네 요소 · Claude Desktop 한눈에 |
| 11–19 | 02 직무 리서치 | 14–19 | 역량 매트릭스(삼성전자 DS · LG에너지솔루션 · 한화에어로스페이스 실제 직무소개 기반) · 기술 자료 1쪽 정리 · 확인 표지 · 카드 A · 30일 계획 |
| 19–27 | 03 기술 문서 | 20–26 | 결론 먼저 · Before/After · 캡스톤 1쪽 · 카드 B · 근거 사슬 · 실험 결과 발표 10장 |
| 27–35 | 04 자기소개 | 27–33 | 경험 인벤토리 · 문제·제약·결정·결과·배움 · 분업 · AI 티 · README · 카드 C |
| 35–46 | 05 실습 | 34–45 | 준비 3분 → 카드 A · B · C (각 카드 뒤에 실제 실행 화면 2장) → 실습 정리 |
| 46–50 | 06 경계 · 마무리 | 46–50 | 세 가지 경계 · 판단표 · 30일 계획 · 오늘의 한 문장 |

실습 11분은 카드 A를 전원이 실행하고, B 또는 C는 시간에 따라 택 1로 진행합니다. 실제 실행 화면 장표(37 · 38 · 40 · 41 · 43 · 44)는 학생 실습이 막히거나 네트워크가 불안정할 때 대체 시연용으로 씁니다.

## 강의 전 5분 점검

1. Claude Desktop → Code 탭에서 `practice_kit/my-career`가 열리고, 새 세션에서 Fable 5.1 · 높음이 선택되는지
2. `practice_kit/my-career/04_outputs/`가 비어 있는지 (지난 실행 결과는 `practice_runs/outputs/`에 있음)
3. PPT 4번 장표의 QR이 저장소 강의 폴더로 열리는지
4. 학생 안내: 저장소 ZIP 내려받기 → Code 탭 → 폴더 열기

## 재생성

```bash
cd source && npm install && node build.js ../PNU_공학커뮤니케이션_20260915.pptx
```

배포용 PDF는 PowerPoint에서 **파일 → 내보내기 → PDF**로 만드는 것이 가장 정확합니다(NanumGothic 그대로).
저장소의 PDF는 LibreOffice 변환본이며, 이 환경에서 LibreOffice가 NanumGothic 정규체를 찾지 못해 `DECK_FONT=AppleGothic`으로 빌드한 변형을 변환했습니다. 글꼴 폭 차이로 일부 줄바꿈이 PPTX와 다를 수 있습니다.

```bash
cd source && DECK_FONT=AppleGothic node build.js /tmp/pdfbuild.pptx && soffice --headless --convert-to pdf --outdir .. /tmp/pdfbuild.pptx
```

세션 화면 이미지를 다시 만들려면 `practice_runs/transcripts/*.jsonl`을 `render_session.js`에 넣습니다. 실제 Claude Desktop 창 캡처가 있으면 `assets/practice_*.png`를 같은 이름으로 덮어쓴 뒤 빌드하면 PPT에 반영됩니다.

## 디자인

네이비 `0B1F3A` · 딥 에메랄드 `1F6B52` (다크 배경 강조는 `8FCBB0`) · NanumGothic. 팔레트와 헬퍼는 `source/lib.js`.
