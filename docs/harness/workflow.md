# Paper Harness Workflow

## 1. Topic Scoping

`notebooks/00_topic_scoping.ipynb`에서 교육공학 주제를 연구 질문과 영어 검색 키워드로 좁힙니다.

## 2. Literature Search

`notebooks/01_search_papers.ipynb`에서 OpenAlex Works API를 사용해 2020-2026년 영어 논문을 검색합니다.

## 3. Quality Scoring

`notebooks/02_score_quality.ipynb`에서 인용수, 연식 보정 인용수, 최신성, venue, abstract, topic relevance를 결합해 점수화합니다.

## 4. Claude Export

`notebooks/03_export_to_claude.ipynb`에서 상위 후보 15편을 `data/papers_top_15.md`로 내보냅니다.

## 5. Reference Ranking

`commands/05_rank_references.md`를 사용해 core, supporting, background, excluded로 다시 정렬합니다.

## 6. Idea to Manuscript

문헌 공백을 `workspace/03_idea_backlog.md`에 정리하고, 선택 아이디어를 초록과 outline으로 발전시킵니다.

## 7. Review and Citation Audit

초안을 점수화한 뒤 모든 claim이 실제 논문 원문과 맞는지 `workspace/08_citation_audit.md`에서 검증합니다.
