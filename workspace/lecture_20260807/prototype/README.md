# KEDI Digital Learning Lab

디지털교육연구실 연구원이 평소 말로 연구지원 서비스 아이디어를 설명하고, 1주 프로토타입 캔버스로 바꾸어 보는 교육용 웹 시안입니다.

`prd.html`에는 문제·사용자·비범위·성과지표·검증·90일 실행을 연결한 **이번 주 학습 길잡이 MVP PRD**가, `student.html`에는 이 문서를 바탕으로 만든 학생지원 화면이 포함되어 있습니다. 두 자료는 KEDI의 현재 운영 서비스가 아니라, 스쿨포유·하트포유·학생선수 e-School·온라인 보충과정의 학습 지속 맥락에서 검증해볼 수 있는 강의 제안입니다. 규칙 기반 샘플로만 작동하며 자동 채점·학생 등급화·건강 또는 심리 진단을 하지 않습니다.

## 로컬 실험

```bash
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. 기본 `로컬 데모`는 외부 네트워크나 API 키 없이 동작합니다.

- 연구자용 시안: `http://127.0.0.1:4173/`
- MVP PRD: `http://127.0.0.1:4173/prd.html`
- 학생지원 MVP: `http://127.0.0.1:4173/student.html`

## AI API 연결

1. `.env.example`을 참고해 서버 환경변수 `OPENAI_API_KEY`를 설정합니다.
2. 실제 학생·교직원 식별정보, 건강정보, IRB 민감자료를 입력하지 않습니다.
3. 화면에서 `AI 연결`을 선택합니다. 키는 브라우저로 전달되지 않습니다.

## Vercel 프리뷰

```bash
vercel link
vercel env add OPENAI_API_KEY preview
vercel --yes
```

API 키 없이 배포해도 로컬 데모는 정상 작동합니다. 실제 업무 파일럿 전에는 기관 보안·개인정보·접근성·기록 보존 기준을 별도로 검토해야 합니다.

현재 강의용 배포본: <https://prototype-rose-mu.vercel.app>

MVP PRD 배포 후 경로: <https://prototype-rose-mu.vercel.app/prd>

학생지원 MVP 배포본: <https://prototype-rose-mu.vercel.app/student>
