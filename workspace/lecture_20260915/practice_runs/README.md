# practice_runs — 카드 A · B · C 실제 실행 기록

2026-09-15, Claude Desktop에 번들된 Claude Code 2.1.270을 `practice_kit/my-career`에서 헤드리스로 실행한 기록입니다. 공고 파일을 실제 기업(삼성전자 DS · LG에너지솔루션 · 한화에어로스페이스) 요약으로, 경험정리·자소서의 캡스톤 예시를 폐용매 증류 회수 개선으로 바꾼 뒤 A·B·C를 모두 다시 실행한 기록입니다.
모델 `claude-fable-5-1`, `--effort high`, 권한 모드 `acceptEdits`.

| 실행 | 요청문 | 세션 | 턴 | 소요 | 생성 파일 |
|---|---|---|---|---|---|
| A1 | 카드 A | `6dc3b28f` | 7 | 3분 53초 | `outputs/역량매트릭스.md` |
| A2 | 후속: '하'인 #8 데이터 분석 → 30일 계획 | 같은 세션 | +1 | 2분 19초 | `outputs/30일계획_데이터분석.md` |
| B1 | 카드 B | `359941f4` | 7 | 2분 06초 | `outputs/검토_보고서.md` |
| B2 | 후속: 측정 로그로 반박 | 같은 세션 | +1 | 37초 | (파일 미수정 — 조건 8개만 답변) |
| C1 | 카드 C | `b234b073` | 5 | 1분 17초 | `outputs/면접질문.md` |
| C2 | 후속: C1 질문에 60초 답변 | 같은 세션 | +1 | 23초 | (꼬리질문 + 구조·근거 피드백) |

- `*.txt` — 각 턴에 입력한 요청문 원문
- `*.json` — Claude Code `--output-format json` 결과 (session_id · 비용 · 최종 답변)
- `transcripts/*.jsonl` — 세션 전체 기록 (도구 호출 포함). `source/render_session.js`가 이 파일로 PPT 화면을 만든다.
- `outputs/` — 실행이 만든 결과 파일. 학생용 `04_outputs/`는 비워 두었으므로 비교용으로 쓴다.
- `run.sh` — 재실행 스크립트. `./run.sh <이름> <요청문파일> [session_id]`

세션을 Claude Code 터미널에서 이어 보려면:

```bash
cd ../practice_kit/my-career && claude --resume 6dc3b28f-817b-4652-b5b7-8003b74c7b2e
```
