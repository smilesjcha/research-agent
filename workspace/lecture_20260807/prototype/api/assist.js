const MAX_LENGTH = 1200;
const sensitive = /(주민등록|전화번호|휴대전화|이름\s*[:=]|주소\s*[:=]|건강정보|진단명|환자|IRB\s*(자료|원문)|실제\s*학생\s*(명단|이름))/i;

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "POST 요청만 지원합니다." });
  const prompt = String(request.body?.prompt || "").trim();
  if (!prompt || prompt.length > MAX_LENGTH) return response.status(400).json({ error: "요청은 1~1,200자로 작성해 주세요." });
  if (sensitive.test(prompt)) return response.status(400).json({ error: "개인·건강·IRB 민감자료로 보이는 표현이 있습니다. 비식별 샘플로 바꿔 주세요." });
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: "서버에 OPENAI_API_KEY가 설정되지 않았습니다." });

  const instructions = `당신은 공공 교육연구기관의 서비스 디자이너다. 사용자의 아이디어를 1주 안에 샘플·비식별 데이터로 검증할 수 있는 작은 프로토타입으로 바꿔라. 자동 학생평가·자동 정책결정·개인정보 사용을 제안하지 말고, 사람 승인점을 명시하라. 반드시 JSON만 출력하라. 키는 icon,name,problem,users,inputs,outputs,approval,week,boundary이며 week는 정확히 4개의 짧은 문자열 배열이다.`;
  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.6", store: false, instructions, input: prompt, text: { format: { type: "json_object" } } })
    });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(payload.error?.message || "OpenAI API 응답 오류");
    const outputText = payload.output_text || payload.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
    const result = JSON.parse(outputText);
    result.icon = result.icon || ({ brief: "01", signal: "02", content: "03", evidence: "04" }[request.body?.example] || "AX");
    return response.status(200).json(result);
  } catch (error) {
    return response.status(502).json({ error: `AI 시안 생성 실패: ${error.message}` });
  }
}
