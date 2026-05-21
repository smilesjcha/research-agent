# Paper Search Harness

## 목적

교육공학 주제를 검색 가능한 영어 키워드와 논문 후보 목록으로 바꿉니다.

## 절차

1. `00_topic_scoping.ipynb`에서 질문과 키워드를 확정합니다.
2. `01_search_papers.ipynb`에서 OpenAlex를 검색합니다.
3. 검색식, 날짜, 결과 수를 기록합니다.
4. `papers_raw.csv`를 확인해 노이즈가 많으면 검색어를 좁힙니다.

## 출력

- `data/papers_raw.csv`
- `data/search_strategy.md`
