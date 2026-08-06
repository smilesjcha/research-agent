# KEDI 연구 환경 AX 강의 패키지

## 바로 열기

- `KEDI_Codex_Research_AX_20260807.pptx` — 71장 본 강의 자료, 장표별 발표자 노트와 `[Sources]` 포함
- `KEDI_Codex_Research_AX_20260807.pdf` — 화면 공유·배포용 71쪽 PDF
- `lecture_runbook.md` — 100분 강의·5분 전환·15분 질의응답 운영안
- `PPT_PRODUCTION_GUIDE_KO.md` — 장표 표현·구조·시각·톤앤매너 제작 지침
- `STUDENT_SERVICE_MVP_PRD_KO.md` — 학생지원 MVP의 문제·비범위·핵심 기능·성과지표·90일 실험안
- `prompt_cards.md` — 연구·서비스 요청문 카드
- `exercise_worksheet.md` — 참가자용 서비스 발굴·위험 판정 워크시트
- `prototype/` — 내 컴퓨터·AI 기능·Vercel 흐름을 보여주는 교육용 웹 시안
- `notebooks/` — 실제 실습용 Research-agent Jupyter 노트북 4개
- `requirements.txt` — 노트북 실행용 Python 의존성
- `assets/notebook_screenshots/` — Research-agent 노트북 데모 백업 화면
- `assets/prototype_screenshots/` — 서비스 프로토타입 데모 백업 화면
- `source/` — PPT 재생성용 JavaScript와 장표 설계·최종 명세 파일

## 강의 전 5분 점검

```bash
cd /Users/sungjae-cha/Documents/research-agent/workspace/lecture_20260807/prototype
npm run dev
```

1. <http://127.0.0.1:4173/student.html>에서 활동 완료·쉬운 설명·도움 요청을 눌러본다.
2. <http://127.0.0.1:4173>에서 연구자용 서비스 시안도 확인한다.
3. <https://prototype-rose-mu.vercel.app/student>가 열리는지 확인한다.
4. Jupyter에서 기존 노트북 네 개가 열리는지 확인한다.
5. 네트워크 장애 시 42·44·46·48·51·53번 장표와 `assets/` 캡처를 사용한다.

## 데이터 보호 기준

강의용 시안에는 샘플 문구만 사용한다. 이름·연락처·건강정보·실제 학생 식별정보·IRB 민감자료를 입력하지 않는다. AI는 학생 지원, 연구 근거, 정책 결론을 자동 확정하지 않으며 사람의 검토와 승인 지점을 유지한다.
