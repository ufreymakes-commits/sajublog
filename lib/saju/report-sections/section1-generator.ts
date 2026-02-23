// 섹션 1: 일주 및 성격 핵심 분석 - 문장 생성기 (경쟁사 수준 - 모든 일주 대응)

import {
  getElementType,
  DAY_PILLAR_METAPHOR,
  FIVE_ELEMENTS_ENVIRONMENT,
  SINSAL_TENSION,
  DAY_PILLAR_DUALITY,
  SINSAL_MYEONGRI_INTERPRETATION,
  ILGAN_TONGGEUN,
  ELEMENT_PATTERN_SENTENCES,
  PRACTICAL_ADVICE,
  ILGAN_ELEMENT_STRENGTH,
} from "./section1-data";

// 입력 데이터 타입
export interface Section1Input {
  userName: string;
  dayPillar: string;
  ilgan: string;
  ilganElement: string;
  fiveElements: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  sinsals: string[];
  strengthType: string;
  strengthScore: number;
  tonggeunInfo?: string;
  interactions?: string;
  pillarYear?: string;
  pillarMonth?: string;
  pillarHour?: string;
}

// 섹션 1 결과 타입
export interface Section1Result {
  title: string;
  content: string;
  paragraphs: string[];
}

// 한자 매핑
const ILGAN_HANJA: Record<string, string> = {
  "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
  "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸",
};

const ILGAN_FULL: Record<string, string> = {
  "갑": "갑목(甲木)", "을": "을목(乙木)", "병": "병화(丙火)", "정": "정화(丁火)", "무": "무토(戊土)",
  "기": "기토(己土)", "경": "경금(庚金)", "신": "신금(辛金)", "임": "임수(壬水)", "계": "계수(癸水)",
};

const JIJI_HANJA: Record<string, string> = {
  "자": "子", "축": "丑", "인": "寅", "묘": "卯", "진": "辰", "사": "巳",
  "오": "午", "미": "未", "신": "申", "유": "酉", "술": "戌", "해": "亥",
};

const JIJI_FULL: Record<string, string> = {
  "자": "자수(子水)", "축": "축토(丑土)", "인": "인목(寅木)", "묘": "묘목(卯木)", 
  "진": "진토(辰土)", "사": "사화(巳火)", "오": "오화(午火)", "미": "미토(未土)", 
  "신": "신금(申金)", "유": "유금(酉金)", "술": "술토(戌土)", "해": "해수(亥水)",
};

const ELEMENT_HANJA: Record<string, string> = { "목": "木", "화": "火", "토": "土", "금": "金", "수": "水" };

// 오행별 자연물 이미지
const ELEMENT_NATURE: Record<string, string> = {
  "목": "푸른 나무", "화": "타오르는 불", "토": "든든한 대지", "금": "날카로운 쇠", "수": "흐르는 물",
};

// 오행 과다 시 환경 묘사
const ELEMENT_EXCESS_ENV: Record<string, string> = {
  "수": "거대한 물바다가 펼쳐져 있습니다. 이 많은 물을 혼자서 감당해야 하니",
  "목": "빽빽한 숲이 사방을 둘러싸고 있습니다. 나무들 사이에서 자기 자리를 찾아야 하니",
  "화": "불길이 사방에서 타오르고 있습니다. 이 열기를 다스려야 하니",
  "토": "두꺼운 흙이 겹겹이 쌓여 있습니다. 이 무거운 흙 속에서 숨 쉬어야 하니",
  "금": "날카로운 쇠붙이가 곳곳에 도사리고 있습니다. 이 칼날들 사이를 지나야 하니",
};

// 오행 부족/전무 시 의미
const ELEMENT_LACK_MEANING: Record<string, string> = {
  "목": "성장과 규율의 기운이 부족하여 자유분방하지만 방향이 흔들릴 수 있고",
  "화": "표현과 열정의 기운이 부족하여 존재감이 약해 보일 수 있지만 내면은 깊고",
  "토": "중심과 안정의 기운이 부족하여 흔들리기 쉽지만 유연하게 적응하며",
  "금": "결단과 실행의 기운이 부족하여 우유부단해 보이지만 신중하게 판단하고",
  "수": "지혜와 유연함의 기운이 부족하여 경직되기 쉽지만 원칙이 뚜렷하고",
};

// 일간별 핵심 키워드
const ILGAN_KEYWORDS: Record<string, { essence: string; strength: string; weakness: string }> = {
  "갑": { essence: "큰 나무", strength: "곧고 당당하며 리더십이 강한", weakness: "고집스럽고 융통성이 부족한" },
  "을": { essence: "덩굴", strength: "유연하고 적응력이 뛰어난", weakness: "의존적이고 우유부단한" },
  "병": { essence: "태양", strength: "밝고 카리스마 넘치는", weakness: "성급하고 자기중심적인" },
  "정": { essence: "촛불", strength: "따뜻하고 섬세한", weakness: "예민하고 집착이 강한" },
  "무": { essence: "큰 산", strength: "듬직하고 책임감 있는", weakness: "고집스럽고 변화를 싫어하는" },
  "기": { essence: "옥토", strength: "포용력 있고 현실적인", weakness: "걱정 많고 소심한" },
  "경": { essence: "강철", strength: "결단력 있고 추진력 강한", weakness: "냉정하고 독선적인" },
  "신": { essence: "보석", strength: "섬세하고 완벽주의적인", weakness: "예민하고 비판적인" },
  "임": { essence: "바다", strength: "지혜롭고 포용력 있는", weakness: "변덕스럽고 우울한" },
  "계": { essence: "이슬", strength: "깊고 직관력 뛰어난", weakness: "불안하고 소심한" },
};

// 메인 생성 함수
export function generateSection1(input: Section1Input): Section1Result {
  const paragraph1 = generateParagraph1(input);
  const paragraph2 = generateParagraph2(input);
  const paragraph3 = generateParagraph3(input);

  return {
    title: "첫번째 구슬: 사주로 본 당신은 이런 사람이군요!",
    content: [paragraph1, paragraph2, paragraph3].join("\n\n"),
    paragraphs: [paragraph1, paragraph2, paragraph3],
  };
}

// 1문단: 한마디 정의 + 반전 매력 (경쟁사 스타일)
function generateParagraph1(input: Section1Input): string {
  const { dayPillar, fiveElements, sinsals, userName, ilgan, ilganElement, strengthType, pillarYear, pillarMonth, pillarHour } = input;
  
  const ilji = dayPillar.charAt(1);
  const metaphor = DAY_PILLAR_METAPHOR[dayPillar] || `${ILGAN_KEYWORDS[ilgan]?.essence || "독특한 존재"}`;
  const duality = DAY_PILLAR_DUALITY[dayPillar] || { outer: "차분해 보이는", inner: "내면에 열정을 품은" };
  const ilganKeyword = ILGAN_KEYWORDS[ilgan] || { essence: "독특한 기운", strength: "개성 있는", weakness: "독특한" };
  
  // 가장 강한/약한 오행
  const sortedElements = Object.entries(fiveElements).sort((a, b) => b[1] - a[1]);
  const maxEl = sortedElements[0];
  const minEl = sortedElements[sortedElements.length - 1];
  
  // 주변 환경 (사주의 글자들)
  const surroundingElements: string[] = [];
  if (pillarYear) surroundingElements.push(pillarYear);
  if (pillarMonth) surroundingElements.push(pillarMonth);
  if (pillarHour) surroundingElements.push(pillarHour);
  
  // 과다 오행 환경
  let environmentDesc = "";
  const excessElement = sortedElements.find(([el, count]) => count >= 3);
  if (excessElement) {
    environmentDesc = ELEMENT_EXCESS_ENV[excessElement[0]] || "";
  }
  
  // 부족/전무 오행 영향
  let lackDesc = "";
  if (minEl[1] === 0) {
    lackDesc = ELEMENT_LACK_MEANING[minEl[0]] || "";
  }
  
  // 신살 기반 특수 묘사
  let sinsalDesc = "";
  const positiveSinsals = sinsals.filter(s => 
    ["천을귀인", "태극귀인", "문창귀인", "학당귀인", "복성귀인", "천덕귀인", "월덕귀인"].includes(s)
  );
  const specialSinsals = sinsals.filter(s => 
    ["도화살", "역마살", "화개살", "현침살"].includes(s)
  );
  
  if (positiveSinsals.length > 0) {
    sinsalDesc = "하늘이 내린 귀인의 복이 있어 위기 때마다 도움의 손길이 나타나고, ";
  }
  if (specialSinsals.includes("도화살")) {
    sinsalDesc += "이성을 끌어당기는 묘한 매력이 있으며, ";
  }
  if (specialSinsals.includes("역마살")) {
    sinsalDesc += "한 곳에 머무르지 못하는 역동적인 기운이 감돌며, ";
  }
  
  // 외유내강 / 내유외강 판단
  const innerOuterType = strengthType === "신강" 
    ? "'외유내강'의 끝판왕" 
    : strengthType === "신약" 
      ? "섬세하면서도 강인한 '내유외강'의 소유자"
      : "균형 잡힌 중용의 미덕을 가진 사람";

  // 문장 조합
  const sentences = [
    `${userName}님을 한마디로 정의하자면 ${metaphor}와도 같습니다.`,
    `겉으로는 ${duality.outer} 모습을 보이지만, 내면에는 ${duality.inner} 반전 매력의 소유자시네요.`,
    `남들이 볼 때는 ${ilganKeyword.weakness} 면이 보여도, 생존 본능과 생활력 하나는 타의 추종을 불허하는 ${innerOuterType}입니다.`,
    `이런 해석이 나온 이유는 본인을 상징하는 일주가 '${dayPillar}(${ILGAN_HANJA[ilgan]}${JIJI_HANJA[ilji]})'이기 때문입니다.`,
    `${ILGAN_FULL[ilgan]}은 ${ilganKeyword.essence}의 기운인데, 사주 주변에는 ${environmentDesc || `다양한 오행이 조화를 이루고 있습니다.`}`,
    environmentDesc ? `삶의 난이도가 결코 낮지 않지만, 그만큼 성취했을 때의 보상도 확실한 구조입니다.` : "",
    sinsalDesc ? `게다가 ${sinsalDesc.slice(0, -2)}합니다.` : "",
  ].filter(s => s.length > 0);

  return sentences.join(" ");
}

// 2문단: 명리학적 분석 (경쟁사 스타일)
function generateParagraph2(input: Section1Input): string {
  const { dayPillar, ilgan, ilganElement, fiveElements, sinsals, strengthType, strengthScore, tonggeunInfo, interactions } = input;
  
  const ilji = dayPillar.charAt(1);
  const ilganKeyword = ILGAN_KEYWORDS[ilgan] || { essence: "독특한 기운", strength: "개성 있는", weakness: "독특한" };
  
  // 신강/신약 해석
  const strengthKey = `${ilgan}_${strengthType}`;
  const strengthDesc = ILGAN_ELEMENT_STRENGTH[strengthKey] || 
    `${ILGAN_FULL[ilgan]} 일간이 ${strengthType}하여 ${strengthType === "신강" ? "자기 주장이 뚜렷합니다" : strengthType === "신약" ? "주변의 영향을 많이 받습니다" : "균형 잡힌 기운을 가지고 있습니다"}.`;

  // 오행 구조 분석
  const sortedElements = Object.entries(fiveElements).sort((a, b) => b[1] - a[1]);
  const maxEl = sortedElements[0];
  const minEl = sortedElements[sortedElements.length - 1];
  
  // 특수 구조 판단 (재다신약, 비겁과다 등)
  let structureAnalysis = "";
  
  // 재성 과다 + 신약 = 재다신약
  const 재성오행 = ilganElement === "목" ? "토" : ilganElement === "화" ? "금" : ilganElement === "토" ? "수" : ilganElement === "금" ? "목" : "화";
  if (fiveElements[재성오행 as keyof typeof fiveElements] >= 3 && strengthType === "신약") {
    structureAnalysis = `재성(${ELEMENT_NATURE[재성오행]})이 과다하여 '재다신약'의 기운이 감돕니다. 돈이나 기회는 많이 보이지만 이를 온전히 내 것으로 만들기 위한 내공이 필요합니다.`;
  }
  // 비겁 과다 = 경쟁심
  else if (fiveElements[ilganElement as keyof typeof fiveElements] >= 3) {
    structureAnalysis = `비겁(比劫)이 강하여 자립심과 경쟁심이 뛰어납니다. 다만 너무 자기 것만 챙기려다 주변과 마찰이 생길 수 있으니 나누는 연습이 필요합니다.`;
  }
  // 무관 사주 (목 없음)
  else if (fiveElements["목"] === 0) {
    structureAnalysis = `목(木)이 없어 '무관(無官)' 사주입니다. 나를 통제하는 규칙이 없어 자유분방하지만, 그만큼 스스로 방향을 잡아야 합니다.`;
  }
  
  // 원진/충/합 분석 - 구체적인 지지 언급
  let interactionAnalysis = "";
  if (interactions) {
    // 원진 분석 (구체적 글자 추출 시도)
    const wonJinMatch = interactions.match(/([가-힣]{2})\s*원진/);
    if (interactions.includes("원진")) {
      if (wonJinMatch) {
        interactionAnalysis = `사주에 '${wonJinMatch[1]} 원진살'이 끼어 있어 예민함과 직관력이 동시에 발달했습니다. 가까운 사람과 애증의 감정이 생기기 쉬우니 적당한 거리 유지가 필요합니다.`;
      } else {
        interactionAnalysis = `사주에 '원진살'이 끼어 있어 예민함과 직관력이 동시에 발달했습니다. 가까운 사람과 애증의 감정이 생기기 쉬우니 적당한 거리 유지가 필요합니다.`;
      }
    } else if (interactions.includes("충")) {
      const chungMatch = interactions.match(/([가-힣]{2})\s*충/);
      if (chungMatch) {
        interactionAnalysis = `사주에 '${chungMatch[1]} 충(冲)'이 있어 변화와 역동성이 강합니다. 한 곳에 머무르기보다 끊임없이 움직이며 발전합니다.`;
      } else {
        interactionAnalysis = `사주에 '충(冲)'이 있어 변화와 역동성이 강합니다. 한 곳에 머무르기보다 끊임없이 움직이며 발전합니다.`;
      }
    }
  }
  
  // 신살 심화 분석
  let sinsalAnalysis = "";
  if (sinsals.includes("귀문관살")) {
    sinsalAnalysis = `'귀문관살'의 영향으로 남들이 못 보는 것을 감지하는 촉이 있지만, 그만큼 상처받기 쉽고 걱정이 많습니다.`;
  } else if (sinsals.includes("화개살")) {
    sinsalAnalysis = `'화개살'의 영향으로 영적 감수성이 풍부하고 예술적 재능이 있습니다.`;
  } else if (sinsals.includes("현침살")) {
    sinsalAnalysis = `'현침살'의 영향으로 디테일을 꿰뚫는 눈이 있어 전문직에서 두각을 나타냅니다.`;
  }
  
  // 일지 역할 분석
  const 토지지 = ["축", "진", "미", "술"];
  let iljiAnalysis = "";
  if (토지지.includes(ilji)) {
    iljiAnalysis = `일지의 ${JIJI_FULL[ilji]}가 든든한 제방 역할을 해주고 있어 위기를 기회로 바꾸는 능력이 탁월합니다.`;
  }

  const sentences = [
    `명리학적으로 보면 ${strengthDesc}`,
    structureAnalysis,
    interactionAnalysis,
    sinsalAnalysis,
    iljiAnalysis,
    `이러한 구조가 ${input.userName}님의 성격과 삶의 방식에 깊이 영향을 미치고 있습니다.`,
  ].filter(s => s.length > 0);

  return sentences.join(" ");
}

// 3문단: 현실적 조언 (경쟁사 스타일)
function generateParagraph3(input: Section1Input): string {
  const { fiveElements, sinsals, strengthType, ilgan, ilganElement, userName } = input;
  
  // 가장 부족한 오행 (본인 오행 제외)
  const sortedElements = Object.entries(fiveElements)
    .filter(([el]) => el !== ilganElement) // 본인 오행은 제외
    .sort((a, b) => a[1] - b[1]);
  const minEl = sortedElements[0] || ["목", 0]; // fallback
  const minType = getElementType(minEl[1]);
  const adviceKey = `${minEl[0]}${minType}`;
  
  // 실용적 조언
  const advices = PRACTICAL_ADVICE[adviceKey] || PRACTICAL_ADVICE["default"];
  
  // 신강/신약 기반 핵심 조언
  let coreAdvice = "";
  if (strengthType === "신약") {
    coreAdvice = "감정의 파도에 휩쓸리지 않는 것이 개운의 핵심입니다. 주변 상황이나 타인의 말에 예민하게 반응하기보다는, 본인만의 '마이웨이'를 뚝심 있게 밀고 나가세요.";
  } else if (strengthType === "신강") {
    coreAdvice = "타고난 추진력을 믿되, 때로는 한 발 물러서 주변을 살피는 여유가 필요합니다. 혼자 다 하려 하지 말고 적절히 위임하고 나누세요.";
  } else {
    coreAdvice = "균형 잡힌 기운을 잘 활용하되, 너무 중립적이어서 존재감이 약해지지 않도록 자신만의 색깔을 뚜렷이 하세요.";
  }
  
  // 오행별 구체적 개운법
  const elementAdvice: Record<string, string> = {
    "목": "아침에 일찍 일어나 산책하고, 동쪽 방향으로 활동 범위를 넓히세요. 나무나 숲과 가까이 하면 기운이 보충됩니다.",
    "화": "밝은 조명과 따뜻한 색깔을 활용하고, 남쪽 방향에서 활동하면 좋습니다. 사람들 앞에서 자신을 표현하는 연습을 하세요.",
    "토": "규칙적인 생활과 안정적인 환경이 중요합니다. 등산이나 산책으로 땅을 밟는 활동을 자주 하세요.",
    "금": "결단력을 키우기 위해 작은 결정부터 빠르게 내리세요. 흰색, 금색 계열을 활용하고 서쪽 방향이 유리합니다.",
    "수": "명상이나 독서로 내면의 깊이를 더하세요. 물가에서 시간을 보내거나 검은색, 파란색을 활용하면 도움이 됩니다.",
  };
  
  // 현대적 표현 추가
  let modernAdvice = "";
  if (sinsals.includes("귀문관살") || sinsals.includes("원진살")) {
    modernAdvice = `본인이 가진 예민함은 '결함'이 아니라 남다른 '레이더'입니다. 남들보다 스트레스를 잘 받는 것은 그만큼 상황 파악이 빠르다는 뜻이니, 이 예민함을 예술이나 기획, 혹은 디테일한 업무 능력으로 승화시켜야 합니다.`;
  } else if (strengthType === "신약") {
    modernAdvice = `'존버'는 ${userName}님의 타고난 재능입니다. 당장 성과가 안 보여도 결국 끝까지 살아남아 승자가 될 것입니다.`;
  }
  
  // 마무리 메시지
  const closingMessage = minEl[1] <= 1
    ? `${minEl[0]}(${ELEMENT_HANJA[minEl[0]]})의 기운을 채워주는 것이 개운의 핵심입니다.`
    : `오행의 균형을 잘 유지하면서 자신의 장점을 극대화하세요.`;
  
  // 스펙 관련 조언 (재다신약인 경우)
  const 재성오행 = ilganElement === "목" ? "토" : ilganElement === "화" ? "금" : ilganElement === "토" ? "수" : ilganElement === "금" ? "목" : "화";
  let specAdvice = "";
  if (fiveElements[재성오행 as keyof typeof fiveElements] >= 3 && strengthType === "신약") {
    specAdvice = `${ELEMENT_NATURE[재성오행]}이 많다는 건 재물과 기회입니다. 다만 이를 가둘 튼튼한 댐을 쌓기 위해 자기계발이나 자격증 취득 등 본인의 스펙을 단단하게 만드는 과정이 반드시 필요합니다. 그래야 들어오는 돈과 기회를 모두 내 것으로 만들 수 있습니다.`;
  }

  // advices에서 elementAdvice와 중복되지 않게 처리
  const filteredAdvices = advices.filter(a => !elementAdvice[minEl[0]]?.includes(a.substring(0, 10)));
  
  const sentences = [
    `현실적인 조언을 드리자면, ${coreAdvice}`,
    elementAdvice[minEl[0]] || "",
    specAdvice,
    modernAdvice,
    closingMessage,
  ].filter(s => s.length > 0);

  return sentences.join(" ");
}
