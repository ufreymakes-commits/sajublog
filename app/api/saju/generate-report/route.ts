// 하이브리드 방식: 우리 DB에서 키포인트 추출 + AI가 문장 연결
import { generateText } from "ai";
import {
  DAY_PILLAR_METAPHOR,
  DAY_PILLAR_DUALITY,
  PRACTICAL_ADVICE,
  ELEMENT_HANJA,
} from "@/lib/saju/report-sections/section1-data";

// 일간 오행 매핑
const ILGAN_TO_ELEMENT: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

// 일간 한자 매핑
const ILGAN_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

// 일간 자연물 매핑
const ILGAN_NATURE: Record<string, string> = {
  갑: "큰 나무", 을: "덩굴/풀", 병: "태양", 정: "촛불",
  무: "산/바위", 기: "밭/흙", 경: "바위/쇠", 신: "보석/칼",
  임: "바다/큰물", 계: "이슬/빗물",
};

// 지지 한자 매핑
const JIJI_HANJA: Record<string, string> = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳",
  오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
};

interface SajuReportInput {
  userName: string;
  gender: string;
  fiveElements: string;
  dayMaster: string;
  dayPillar: string;
  pillarYear: string;
  pillarMonth: string;
  pillarDay: string;
  pillarHour: string;
  birthSeason: string;
  strengthScore: number;
  strengthType: string;
  strengthDetail: string;
  yongsin: string;
  ownedSipsung: string;
  missingSipsung: string;
  sinsal: string;
  interactions: string;
  jijanggan: string;
  unseong: string;
  stemSynergies: string;
  strategicStructures: string;
  gyeok: string;
  gongmang: string;
  pillarTenGods: string;
  tonggeun: string;
  ganyeojidong: string;
}

// 오행 분포 파싱
function parseFiveElements(str: string): Record<string, number> {
  const result: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const matches = str.match(/(목|화|토|금|수)[^:]*:\s*(\d+)/g);
  if (matches) {
    for (const m of matches) {
      const el = m.match(/(목|화|토|금|수)/)?.[1];
      const num = m.match(/(\d+)/)?.[1];
      if (el && num) result[el] = parseInt(num, 10);
    }
  }
  return result;
}

// 일주 파싱 (한자 제거)
function parseDayPillar(str: string): string {
  if (!str) return "";
  const match = str.match(/^([가-힣]{2})/);
  return match ? match[1] : str.substring(0, 2);
}

// 키포인트 추출 함수
function extractKeyPoints(data: SajuReportInput) {
  const dayPillar = parseDayPillar(data.dayPillar || data.pillarDay);
  const ilgan = data.dayMaster.charAt(0);
  const ilji = dayPillar.charAt(1);
  const ilganElement = ILGAN_TO_ELEMENT[ilgan] || "토";
  const fiveElements = parseFiveElements(data.fiveElements);
  
  // 과다/부족 오행 찾기
  const sortedEl = Object.entries(fiveElements).sort((a, b) => b[1] - a[1]);
  const maxEl = sortedEl[0];
  const minEl = sortedEl.filter(([el]) => el !== ilganElement).sort((a, b) => a[1] - b[1])[0];
  
  // 오행 환경 묘사
  const envDesc: Record<string, string> = {
    수: "거대한 물바다가 펼쳐진",
    목: "빽빽한 숲이 우거진",
    화: "뜨거운 불길이 타오르는",
    토: "넓은 대지가 펼쳐진",
    금: "날카로운 쇠붙이가 도사린",
  };
  
  // 신살 파싱 (전체 목록 유지)
  const sinsals = data.sinsal?.split(/[,\s]+/).filter(s => s.trim()) || [];
  
  // 주요 신살 그룹 분류 (AI가 참고할 수 있도록)
  const positiveSinsals = sinsals.filter(s => 
    s.includes("귀인") || s.includes("천덕") || s.includes("월덕") || s.includes("문창") || s.includes("학당")
  );
  const negativeSinsals = sinsals.filter(s => 
    s.includes("귀문") || s.includes("백호") || s.includes("양인") || s.includes("망신")
  );
  const charmSinsals = sinsals.filter(s => 
    s.includes("도화") || s.includes("홍염") || s.includes("역마")
  );
  const spiritualSinsals = sinsals.filter(s => 
    s.includes("화개") || s.includes("현침")
  );
  
  // 메타포와 이중성
  const metaphor = DAY_PILLAR_METAPHOR[dayPillar] || `${ILGAN_NATURE[ilgan]}의 기운을 가진 존재`;
  const duality = DAY_PILLAR_DUALITY[dayPillar] || { outer: "독특한", inner: "깊이 있는" };
  
  // 신살 특수 관계 확인
  const hasDohwa = charmSinsals.includes("도화");
  const hasYeokma = charmSinsals.includes("역마");
  const hasGwimun = negativeSinsals.includes("귀문");
  const hasWonjin = positiveSinsals.includes("천덕");
  const hasChung = charmSinsals.includes("홍염");
  const hasHwagae = spiritualSinsals.includes("화개");
  
  return {
    // 기본 정보
    userName: data.userName,
    gender: data.gender,
    dayPillar,
    dayPillarHanja: `${ILGAN_HANJA[ilgan]}${JIJI_HANJA[ilji]}`,
    ilgan,
    ilganHanja: ILGAN_HANJA[ilgan],
    ilganElement,
    ilganNature: ILGAN_NATURE[ilgan],
    ilji,
    iljiHanja: JIJI_HANJA[ilji],
    
    // 오행 분포
    fiveElements,
    fiveElementsStr: data.fiveElements,
    maxElement: maxEl[0],
    maxCount: maxEl[1],
    minElement: minEl?.[0] || "목",
    minCount: minEl?.[1] || 0,
    environment: maxEl[1] >= 3 ? envDesc[maxEl[0]] : "다양한 기운이 어우러진",
    
    // 메타포/이중성
    metaphor,
    outerPersonality: duality.outer,
    innerPersonality: duality.inner,
    
    // 신강/신약
    strengthType: data.strengthType,
    strengthScore: data.strengthScore,
    
    // 신살/상호작용
    sinsals: sinsals.join(", "),
    positiveSinsals: positiveSinsals.join(", ") || "없음",
    negativeSinsals: negativeSinsals.join(", ") || "없음", 
    charmSinsals: charmSinsals.join(", ") || "없음",
    spiritualSinsals: spiritualSinsals.join(", ") || "없음",
    interactions: data.interactions,
    
    // 기타 데이터
    yongsin: data.yongsin,
    gyeok: data.gyeok,
    ownedSipsung: data.ownedSipsung,
    missingSipsung: data.missingSipsung,
    tonggeun: data.tonggeun,
    unseong: data.unseong,
    jijanggan: data.jijanggan,
    pillarYear: data.pillarYear,
    pillarMonth: data.pillarMonth,
    pillarHour: data.pillarHour,
    birthSeason: data.birthSeason,
    gongmang: data.gongmang,
    pillarTenGods: data.pillarTenGods,
    ganyeojidong: data.ganyeojidong,
  };
}

// AI 프롬프트 생성
function createSection1Prompt(kp: ReturnType<typeof extractKeyPoints>): string {
  return `당신은 20년 경력의 사주명리 전문가입니다. 아래 데이터를 바탕으로 깊이 있는 성격 분석 문단을 작성해주세요.

## 사용자 사주 원국
- 이름: ${kp.userName}
- 성별: ${kp.gender}
- 일주: ${kp.dayPillar}(${kp.dayPillarHanja})
- 일간: ${kp.ilgan}${kp.ilganElement}(${kp.ilganHanja}) - ${kp.ilganNature}의 기운
- 연주: ${kp.pillarYear}
- 월주: ${kp.pillarMonth}
- 시주: ${kp.pillarHour}

## 22개 분석 데이터
1. 오행 분포: ${kp.fiveElementsStr}
2. 최강 오행: ${kp.maxElement}(${kp.maxCount}개)
3. 최약 오행: ${kp.minElement}(${kp.minCount}개)
4. 신강/신약: ${kp.strengthType} (${kp.strengthScore}점)
5. 용신: ${kp.yongsin}
6. 격국: ${kp.gyeok}
7. 보유 십성: ${kp.ownedSipsung}
8. 결여 십성: ${kp.missingSipsung}
9. 신살 전체: ${kp.sinsals}
   - 귀인/길신: ${kp.positiveSinsals}
   - 흉살/주의: ${kp.negativeSinsals}
   - 매력/이동: ${kp.charmSinsals}
   - 영적/예술: ${kp.spiritualSinsals}
10. 지지 상호작용(충/합/원진 등): ${kp.interactions}
11. 지장간: ${kp.jijanggan}
12. 12운성: ${kp.unseong}
13. 통근: ${kp.tonggeun}
14. 간여지동: ${kp.ganyeojidong}
15. 공망: ${kp.gongmang}
16. 기둥별 십성: ${kp.pillarTenGods}
17. 출생 계절: ${kp.birthSeason}
18. 일주 메타포: ${kp.metaphor}
19. 이중성: 겉(${kp.outerPersonality}), 속(${kp.innerPersonality})
20. 환경: ${kp.environment}

참고: 9번 신살과 10번 지지 상호작용에 모든 특수 관계가 포함되어 있습니다. 이 데이터들을 적극 활용하세요.

## 일간별 정확한 자연물 비유 (반드시 지켜야 함!)
- 갑목(甲木) = 큰 나무, 거목, 대들보 (바위/섬 X)
- 을목(乙木) = 덩굴, 풀, 넝쿨, 화초 (나무 X)
- 병화(丙火) = 태양, 햇빛 (촛불 X)
- 정화(丁火) = 촛불, 등불, 난롯불 (태양 X)
- 무토(戊土) = 산, 바위, 큰 땅덩이 (밭 X)
- 기토(己土) = 밭흙, 논바닥, 습한 땅, 정원 (바위/섬 X)
- 경금(庚金) = 바위, 쇠, 칼, 도끼 (보석 X)
- 신금(辛金) = 보석, 장신구, 바늘 (바위 X)
- 임수(壬水) = 바다, 큰 강, 호수 (이슬 X)
- 계수(癸水) = 이슬, 빗물, 샘물, 안개 (바다 X)

현재 ${kp.userName}님의 일간은 ${kp.ilgan}${kp.ilganElement}(${kp.ilganHanja})이므로, 반드시 "${kp.ilganNature}"에 해당하는 비유만 사용하세요!

## 일간별 십성 매핑 (오행 해석 시 반드시 참고!)
${kp.ilgan}${kp.ilganElement}(${kp.ilganHanja}) 기준:
- 비겁(나 자신/형제/경쟁): ${kp.ilganElement}
- 식상(창의성/표현력/아이디어): ${kp.ilganElement === "목" ? "화" : kp.ilganElement === "화" ? "토" : kp.ilganElement === "토" ? "금" : kp.ilganElement === "금" ? "수" : "목"}
- 재성(돈/재물/아버지): ${kp.ilganElement === "목" ? "토" : kp.ilganElement === "화" ? "금" : kp.ilganElement === "토" ? "수" : kp.ilganElement === "금" ? "목" : "화"}
- 관성(직장/규율/명예): ${kp.ilganElement === "목" ? "금" : kp.ilganElement === "화" ? "수" : kp.ilganElement === "토" ? "목" : kp.ilganElement === "금" ? "화" : "토"}
- 인성(학문/지식/어머니): ${kp.ilganElement === "목" ? "수" : kp.ilganElement === "화" ? "목" : kp.ilganElement === "토" ? "화" : kp.ilganElement === "금" ? "토" : "금"}

오행 해석 예시 (${kp.ilgan}${kp.ilganElement} 기준):
- ${kp.maxElement}(${kp.maxCount}개) 과다 = ${kp.maxElement === kp.ilganElement ? "비겁 과다 (자기주장 강함, 경쟁심)" : 
  (kp.ilganElement === "목" && kp.maxElement === "화") || (kp.ilganElement === "화" && kp.maxElement === "토") || (kp.ilganElement === "토" && kp.maxElement === "금") || (kp.ilganElement === "금" && kp.maxElement === "수") || (kp.ilganElement === "수" && kp.maxElement === "목") ? "식상 과다 (표현력/창의성 강함)" :
  (kp.ilganElement === "목" && kp.maxElement === "토") || (kp.ilganElement === "화" && kp.maxElement === "금") || (kp.ilganElement === "토" && kp.maxElement === "수") || (kp.ilganElement === "금" && kp.maxElement === "목") || (kp.ilganElement === "수" && kp.maxElement === "화") ? "재성 과다 (재물욕/현실감각 강함)" :
  (kp.ilganElement === "목" && kp.maxElement === "금") || (kp.ilganElement === "화" && kp.maxElement === "수") || (kp.ilganElement === "토" && kp.maxElement === "목") || (kp.ilganElement === "금" && kp.maxElement === "화") || (kp.ilganElement === "수" && kp.maxElement === "토") ? "관성 과다 (규율/책임감 강함)" :
  "인성 과다 (학문욕/생각 많음)"}
- 창의성/표현력 관련 직업 추천 시 → 식상(${kp.ilganElement === "목" ? "화" : kp.ilganElement === "화" ? "토" : kp.ilganElement === "토" ? "금" : kp.ilganElement === "금" ? "수" : "목"}) 기운 언급
- 재물/사업 관련 → 재성 기운 언급
- 학문/연구 관련 → 인성 기운 언급

## 필수 작성 구조 (4단계)
1단계 - 한마디 정의 (1-2문장):
"${kp.userName}님을 한마디로 표현하자면 [자연물 비유]와 같습니다."
- 일주(${kp.dayPillar})를 ${kp.ilganNature}에 기반한 자연물로 비유
- 주변 오행 환경을 묘사 (${kp.maxElement}이 ${kp.maxCount}개로 많음)

2단계 - 근거 설명 (2-3문장):
"이런 해석이 나오는 이유는 바로 일주의 '${kp.dayPillar}(${kp.dayPillarHanja})'과 [다른 기둥] 때문입니다."
- 반드시 사주 글자를 구체적으로 언급 (예: "월지의 OO와 일지의 OO 사이에서")
- ${kp.ilgan}${kp.ilganElement}은 ${kp.ilganNature}을 상징
- 원진은 반드시 두 글자만 언급 (예: "자미 원진", "축오 원진" - 세 글자 이상 X)
- 충/합도 두 글자만 (예: "자오충", "사신합")

3단계 - 명리학적 해석 (2-3문장):
"명리학적으로 보면..."
- 신강/신약(${kp.strengthType}) 해석
- 특수 신살의 영향 (${kp.sinsals})
- 겉(${kp.outerPersonality})과 속(${kp.innerPersonality})의 대비

4단계 - 현실적 조언 (2-3문장):
"현실적인 조언을 드리자면..."
- 구체적인 액션 아이템 (단순히 "동쪽으로 가라"가 아닌 직업/능력 관련)
- 현대적 표현 활용 ("존버", "레이더", "승화" 등)
- 희망적 마무리

## 참고 예시 (이 문장과 동일하면 안 됨!)
"박유진님을 한마디로 표현하자면 척박한 자갈밭이나 바위틈에서도 기어이 뿌리를 내리고 꽃을 피워내는 '강인한 넝쿨장미'와 같습니다. 겉모습은 바람에 하늘거리는 꽃처럼 여리여리하고 부드러워 보이지만, 그 뿌리는 바위를 뚫을 정도로 집요하고 생존력이 강합니다. 이런 해석이 나오는 이유는 바로 일주의 '을축(乙丑)'과 시주의 '갑신(甲申)'이라는 글자 구성 때문입니다. 을목은 끈질긴 생명력을 상징하고, 축토는 차가운 동토를 의미하는데, 춥고 힘든 환경에서도 기어이 싹을 틔우는 형상입니다. 게다가 주변에 나를 극하는 기운들이 도사리고 있어 삶의 긴장감이 팽팽합니다. 명리학적으로 보면 일간인 을목이 월지의 오화와 일지의 축토 사이에서 발생하는 '축오 원진'과 '귀문관살'의 영향을 강하게 받습니다. 이는 뜨거운 열기와 차가운 냉기가 충돌하며 만들어내는 예민한 감각을 의미하며, 남들이 보지 못하는 것을 캐치하는 천재성과 신경질적인 면모를 동시에 부여합니다.현실적인 조언을 드리자면, 본인이 가진 예민함은 '결함'이 아니라 남다른 '레이더'입니다. 남들보다 스트레스를 잘 받는 것은 그만큼 상황 파악이 빠르다는 뜻이니, 이 예민함을 예술이나 기획, 혹은 디테일한 업무 능력으로 승화시켜야 합니다. '존버'는 박유진님의 타고난 재능이니, 당장 성과가 안 보여도 결국 끝까지 살아남아 승자가 될 것입니다."

## 주의점 (매우 중요!)
1. 일간별 자연물 비유를 정확히 지키세요! ${kp.ilgan}${kp.ilganElement}은 "${kp.ilganNature}"입니다. (다른 비유 사용 금지)
2. 원진/충은 반드시 두 글자로만 표기 (예: "자미 원진" O, "미자원진" X, "미자인 원진" X)
3. 반드시 사주 글자를 구체적으로 언급하세요 (예: "월지의 오화", "일지의 축토")
4. "이런 해석이 나오는 이유는..." 근거 설명을 반드시 포함하세요
5. 현대적 표현(존버, 레이더, 승화, 가스라이팅 등)을 적절히 활용하세요
6. 위 예시와 동일한 표현/비유는 사용하지 마세요
7. 8-12문장으로 자연스럽게 연결되는 하나의 문단으로 작성하세요

위 데이터와 구조를 바탕으로 섹션 1 문단을 작성해주세요:`;
}

export async function POST(req: Request) {
  try {
    const data: SajuReportInput = await req.json();
    
    // 1. 키포인트 추출 (우리 DB 활용)
    const keyPoints = extractKeyPoints(data);
    
    // 2. AI 프롬프트 생성
    const section1Prompt = createSection1Prompt(keyPoints);
    
    // 3. AI 호출 (문장 연결만)
    const response = await generateText({
      model: "anthropic/claude-3-5-sonnet-20241022",
      prompt: section1Prompt,
      maxOutputTokens: 2000,
      temperature: 0.8,
    });
    
    const section1Content = response.text.trim();
    
    // 섹션 1 구성
    const section1 = {
      title: `${keyPoints.userName}님, 당신은 이런 사람이에요`,
      content: section1Content,
    };

    // 나머지 섹션들은 placeholder
    const placeholderSections = [
      { title: "아마 이런 고민이 있겠네요", content: "섹션 2 - 준비 중입니다..." },
      { title: `${data.userName}의 아슬아슬한 장단점`, content: "섹션 3 - 준비 중입니다..." },
      { title: "평소 이런 말 듣고 사시죠?", content: "섹션 4 - 준비 중입니다..." },
      { title: `이런 일, ${data.userName}에게 정말 잘 맞을수도`, content: "섹션 5 - 준비 중입니다..." },
      { title: `${data.userName}에게 사랑이란 이렇겠군요`, content: "섹션 6 - 준비 중입니다..." },
      { title: `${data.userName}을 둘러싼 가족, 그리고 친구`, content: "섹션 7 - 준비 중입니다..." },
      { title: `${data.userName}의 운이 상승하려면`, content: "섹션 8 - 준비 중입니다..." },
      { title: `${data.userName}, 당신은 정말 멋진 사람이에요!`, content: "섹션 9 - 준비 중입니다..." },
    ];

    const allSections = [section1, ...placeholderSections];

    return Response.json({
      success: true,
      report: {
        headline: `${data.dayMaster}의 기운을 타고난 ${data.userName}`,
        summary: section1Content.substring(0, 200) + "...",
        sections: allSections,
        totalSections: allSections.length,
      },
    });
  } catch (error) {
    console.error("Report Generation Error:", error);
    return Response.json(
      { 
        success: false, 
        error: "레포트 생성 중 오류가 발생했습니다.", 
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
