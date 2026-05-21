# Citation Audit Prompt

```text
아래 manuscript의 사실 claim과 citation을 하나씩 검사해줘.

입력:
1. manuscript
2. reference notes
3. evidence table

출력:
claim_id, manuscript sentence, citation, source page/section, support level, issue, fix.

support level:
full / partial / weak / missing / wrong

원문 위치가 없으면 verified로 표시하지 마.
```
