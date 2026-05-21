# Research Agent

논문을 탐색하고, 정리하고, 아이디어를 얻어서, 논문을 작성 및 심사까지 해보는 harness engineering repo입니다.

현재 실습 주제는 **교육공학**입니다.

> AI-supported formative feedback for self-regulated learning in educational technology

## 바로 실행

```bash
pip install -r requirements.txt
jupyter lab
```

노트북은 아래 순서로 실행합니다.

```text
notebooks/00_topic_scoping.ipynb
notebooks/01_search_papers.ipynb
notebooks/02_score_quality.ipynb
notebooks/03_export_to_claude.ipynb
```

실행 결과는 `data/`에 저장됩니다.

- `data/topic_keywords.txt`: 교육공학 검색 키워드
- `data/search_strategy.md`: OpenAlex 검색식과 실행 로그
- `data/papers_raw.csv`: OpenAlex 논문 후보 50편
- `data/papers_scored.csv`: 점수화 결과
- `data/papers_top_15.md`: Claude Desktop/Codex에 붙여넣을 상위 후보

## 구조

```text
research-agent/
├── AGENTS.md                  # Codex 운영 지침
├── CLAUDE.md                  # Claude Desktop 운영 지침
├── notebooks/                 # 교육공학 논문 검색 실습 코드
├── data/                      # 검색 결과와 Claude export
├── commands/                  # 반복 작업 command
├── policies/                  # 인용, 근거, 심사 정책
├── prompts/research/          # 연구 프롬프트
├── skills/research/           # 연구 harness skill
├── references/                # PDF, 메타데이터, 논문 노트, evidence
└── workspace/                 # 연구 질문, 문헌 지도, 아이디어, 초안, 평가
```

## Workflow

| 단계 | 산출물 |
|---|---|
| 1. Topic scoping | 연구 질문과 영어 검색 키워드 |
| 2. Literature search | OpenAlex 후보 논문 목록 |
| 3. Quality scoring | core/supporting/background 후보 분류 |
| 4. Reference ranking | 주요 논문 기반 정렬 |
| 5. Idea discovery | 신규 논문 아이디어 |
| 6. Abstract and outline | 초록과 논문 구조 |
| 7. Manuscript drafting | 초안 |
| 8. Review scoring | 논문 점수와 수정 backlog |
| 9. Citation audit | claim별 사실/인용 검증 |

## PDF 저장

참조 논문 PDF는 `references/pdfs/` 아래에 저장합니다.

- `00_inbox`: 새로 받은 PDF
- `10_core`: 반드시 직접 읽고 인용할 핵심 논문
- `20_supporting`: 보조 근거 논문
- `30_background`: 배경/용어 논문
- `90_excluded`: 검토했지만 제외한 논문

PDF와 파싱 텍스트는 기본적으로 git에 올리지 않습니다.

## 원칙

- abstract만 본 논문은 핵심 인용으로 확정하지 않습니다.
- 모든 핵심 주장은 `claim -> source -> page/section -> quote/paraphrase -> verification status`로 추적합니다.
- AI는 논문을 대신 읽는 주체가 아니라, 사람이 읽은 흔적을 구조화하고 검증하는 harness입니다.
