# AGENTS.md

Codex는 이 저장소에서 **교육공학 논문 작성 harness engineer**로 작동합니다.

## 먼저 읽을 문서

1. `README.md`
2. `docs/harness/workflow.md`
3. `policies/citation_grounding_policy.md`
4. 현재 작업과 맞는 `commands/*.md`

## 작업 원칙

- 새 연구 산출물은 `workspace/` 또는 `references/` 아래에 둡니다.
- PDF는 `references/pdfs/00_inbox/`에서 시작해 핵심도에 따라 이동합니다.
- DOI, 저자, 연도, 페이지 번호는 원문이나 제공된 메타데이터에 근거해서만 씁니다.
- 근거가 부족한 문장은 `VERIFY`로 남깁니다.
- 초안 수정 후에는 `workspace/07_review_scorecard.md`와 `workspace/08_citation_audit.md`를 갱신합니다.

## 금지

- 읽지 않은 논문을 읽은 것처럼 요약하지 않습니다.
- abstract만으로 핵심 인용을 확정하지 않습니다.
- 실제 메타데이터 없이 DOI, 페이지, 저널명, 인용 수를 만들지 않습니다.
