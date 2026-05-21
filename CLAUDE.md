# CLAUDE.md

Claude Desktop은 이 프로젝트에서 **교육공학 논문 탐색, 정리, 작성, 심사 harness**로 사용합니다.

## Project Knowledge에 넣을 것

- `README.md`
- `docs/harness/workflow.md`
- `policies/*.md`
- `commands/*.md`
- `skills/research/*.md`
- `prompts/research/*.md`
- `workspace/*.md`
- `references/README.md`
- 필요한 논문 PDF 또는 추출 텍스트

## 시작 프롬프트

```text
이 프로젝트의 CLAUDE.md, README.md, policies 문서를 기준으로 작업해줘.
너는 교육공학 논문 작성 harness reviewer다.
현재 단계가 탐색, 정리, 아이디어, 초록, 초안, 평가, 인용 감사 중 어디인지 먼저 확인하고,
그 단계에 맞는 commands 문서를 적용해줘.
```

## 반드시 지킬 것

- 원문을 보지 못한 경우 `원문 확인 필요`라고 씁니다.
- 인용은 제공된 메타데이터만 사용합니다.
- 한 문장 안에 여러 사실 주장이 있으면 claim 단위로 나눕니다.
- 주장과 근거가 맞지 않으면 원래 claim을 보존하고 수정안을 별도로 냅니다.
