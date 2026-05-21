# Citation Grounding Policy

## Claim 단위 원칙

- 한 문장에 사실 주장이 2개 이상 있으면 claim을 분리합니다.
- 각 claim은 최소 하나의 source, page 또는 section, 원문 발췌나 정확한 paraphrase와 연결합니다.
- abstract만 본 논문은 `abstract_only`로 표시하고 핵심 인용으로 확정하지 않습니다.

## 위험 라벨

| label | meaning |
|---|---|
| missing | 인용이 없음 |
| weak | 관련은 있으나 주장을 직접 지지하지 않음 |
| overclaim | 논문보다 더 강하게 주장함 |
| miscited | 다른 내용을 말하는 논문을 인용함 |
| secondary | 원문이 아니라 2차 인용에 의존함 |
| verified | 원문 위치까지 확인됨 |
