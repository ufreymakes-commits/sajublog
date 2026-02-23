import {
  stems,
  branches,
  stemToHanja,
  branchToHanja,
  stemElements,
  branchElements,
  hiddenStems,
  hourStemTable,
  monthStemTable,
  countryOffsets,
  tenGodsTable,
  elementToHanja,
} from "./constants";
import { getJeolgiMap, getMonthBranch } from "./jeolgi-data";

// 지장간 (Hidden Stems) - 한자 기반
const HIDDEN_STEMS_HANJA: Record<string, string[]> = {
  "子": ["壬", "癸"],
  "丑": ["癸", "辛", "己"],
  "寅": ["戊", "丙", "甲"],
  "卯": ["甲", "乙"],
  "辰": ["乙", "癸", "戊"],
  "巳": ["戊", "庚", "丙"],
  "午": ["丙", "己", "丁"],
  "未": ["丁", "乙", "己"],
  "申": ["戊", "壬", "庚"],
  "酉": ["庚", "辛"],
  "戌": ["辛", "丁", "戊"],
  "亥": ["戊", "甲", "壬"]
};

// 12운성 테이블 (Twelve Stages of Life) - 한자 기반
const UNSEONG_TABLE: Record<string, Record<string, string>> = {
  "甲": { "亥":"장생", "子":"목욕", "丑":"관대", "寅":"건록", "卯":"제왕", "辰":"쇠", "巳":"병", "午":"사", "未":"묘", "申":"절", "酉":"태", "戌":"양" },
  "乙": { "午":"장생", "巳":"목욕", "辰":"관대", "卯":"건록", "寅":"제왕", "丑":"쇠", "子":"병", "亥":"사", "戌":"묘", "酉":"절", "申":"태", "未":"양" },
  "丙": { "寅":"장생", "卯":"목욕", "辰":"관대", "巳":"건록", "午":"제왕", "未":"쇠", "申":"병", "酉":"사", "戌":"묘", "亥":"절", "子":"태", "丑":"양" },
  "丁": { "酉":"장생", "申":"목욕", "未":"관대", "午":"건록", "巳":"제왕", "辰":"쇠", "卯":"병", "寅":"사", "丑":"묘", "子":"절", "亥":"태", "戌":"양" },
  "戊": { "寅":"장생", "卯":"목욕", "辰":"관대", "巳":"건록", "午":"제왕", "未":"쇠", "申":"병", "酉":"사", "戌":"묘", "亥":"절", "子":"태", "丑":"양" },
  "己": { "酉":"장생", "申":"목욕", "未":"관대", "午":"건록", "巳":"제왕", "辰":"쇠", "卯":"병", "寅":"사", "丑":"묘", "子":"절", "亥":"태", "戌":"양" },
  "庚": { "巳":"장생", "午":"목욕", "未":"관대", "申":"건록", "酉":"제왕", "戌":"쇠", "亥":"병", "子":"사", "丑":"묘", "寅":"절", "卯":"태", "辰":"양" },
  "辛": { "子":"장생", "亥":"목욕", "戌":"관대", "酉":"건록", "申":"제왕", "未":"쇠", "午":"병", "巳":"사", "辰":"묘", "卯":"절", "寅":"태", "丑":"양" },
  "壬": { "申":"장생", "酉":"목욕", "戌":"관대", "亥":"건록", "子":"제왕", "丑":"쇠", "寅":"병", "卯":"사", "辰":"묘", "巳":"절", "午":"태", "未":"양" },
  "癸": { "卯":"장생", "寅":"목욕", "丑":"관대", "子":"건록", "亥":"제왕", "戌":"쇠", "酉":"병", "申":"사", "未":"묘", "午":"절", "巳":"태", "辰":"양" }
};

// 한글 -> 한자 변환 맵
const branchKorToHanja: Record<string, string> = {
  "자": "子", "축": "丑", "인": "寅", "묘": "卯", "진": "辰", "사": "巳",
  "오": "午", "미": "未", "신": "申", "유": "酉", "술": "戌", "해": "亥"
};

const stemKorToHanja: Record<string, string> = {
  "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
  "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸"
};

// 오행별 기운 강도 (득령 여부 계산용)
const SEASON_ELEMENT_STRENGTH: Record<string, Record<string, number>> = {
  "인": { "목": 30, "화": 10, "토": 0, "금": -10, "수": -10 }, // 봄
  "묘": { "목": 30, "화": 10, "토": 0, "금": -10, "수": -10 },
  "진": { "목": 10, "화": 10, "토": 15, "금": 0, "수": 0 },
  "사": { "목": -10, "화": 30, "토": 10, "금": -10, "수": -10 }, // 여름
  "오": { "목": -10, "화": 30, "토": 10, "금": -10, "수": -10 },
  "미": { "목": 0, "화": 10, "토": 15, "금": 10, "수": 0 },
  "신": { "목": -10, "화": -10, "토": 10, "금": 30, "수": 10 }, // 가을
  "유": { "목": -10, "화": -10, "토": 10, "금": 30, "수": 10 },
  "술": { "목": 0, "화": 10, "토": 15, "금": 10, "수": 0 },
  "해": { "목": 10, "화": -10, "토": 0, "금": -10, "수": 30 }, // 겨울
  "자": { "목": 10, "화": -10, "토": 0, "금": -10, "수": 30 },
  "축": { "목": 0, "화": 0, "토": 15, "금": 10, "수": 10 },
};

// 지지별 계절 매핑
const BRANCH_TO_SEASON: Record<string, string> = {
  "인": "봄", "묘": "봄", "진": "봄",
  "사": "여름", "오": "여름", "미": "여름",
  "신": "가을", "유": "가을", "술": "가을",
  "해": "겨울", "자": "겨울", "축": "겨울",
};

// 천간 시너지 조합
const STEM_SYNERGIES: Record<string, { name: string; description: string }> = {
  "병임": { name: "강휘상영", description: "바다 위 태양. 압도적 존재감, 대중 리더십" },
  "임병": { name: "강휘상영", description: "바다 위 태양. 압도적 존재감, 대중 리더십" },
  "신임": { name: "도세주옥", description: "보석을 맑은 물로 씻음. 미모와 명석한 두뇌" },
  "임신": { name: "도세주옥", description: "보석을 맑은 물로 씻음. 미모와 명석한 두뇌" },
  "경정": { name: "화룡진금", description: "원석이 명검으로. 대기만성형 영웅" },
  "정경": { name: "화룡진금", description: "원석이 명검으로. 대기만성형 영웅" },
  "을계": { name: "춘풍화우", description: "봄비 내리는 들꽃. 치유와 공감 능력" },
  "계을": { name: "춘풍화우", description: "봄비 내리는 들꽃. 치유와 공감 능력" },
  "무임": { name: "산명수수", description: "산 아래 흐르는 강. 명예와 부 동시에" },
  "임무": { name: "산명수수", description: "산 아래 흐르는 강. 명예와 부 동시에" },
};

// 월지 지장간 (정기 기준)
const MONTH_BRANCH_MAIN_STEM: Record<string, string> = {
  "인": "갑", "묘": "을", "진": "무", "사": "병", "오": "정", "미": "기",
  "신": "경", "유": "신", "술": "무", "해": "임", "자": "계", "축": "기",
};

// 지지간 상호작용 체크 함수
function checkInteractions(branchesKor: string[]): string[] {
  const results: string[] = [];
  const b = branchesKor.map(br => branchKorToHanja[br] || br);

  // 지지충 (Clashes)
  const clashes: Record<string, string> = { "子":"午", "丑":"未", "寅":"申", "卯":"酉", "辰":"戌", "巳":"亥" };
  
  // 지지합 (6가지 합)
  const combinations: Record<string, string> = { "子":"丑", "寅":"亥", "卯":"戌", "辰":"酉", "巳":"申", "午":"未" };

  // 원진살 (Conflict)
  const wonjin: Record<string, string> = { "子":"未", "丑":"午", "寅":"酉", "卯":"申", "辰":"亥", "巳":"戌" };

  for (let i = 0; i < b.length; i++) {
    for (let j = i + 1; j < b.length; j++) {
      // 충 확인
      if (clashes[b[i]] === b[j] || clashes[b[j]] === b[i]) {
        results.push(`${b[i]}${b[j]}충`);
      }
      // 합 확인
      if (combinations[b[i]] === b[j] || combinations[b[j]] === b[i]) {
        results.push(`${b[i]}${b[j]}합`);
      }
      // 원진 확인
      if (wonjin[b[i]] === b[j] || wonjin[b[j]] === b[i]) {
        results.push(`${b[i]}${b[j]}원진`);
      }
    }
  }

  return [...new Set(results)];
}

// 지장간 가져오기
function getHiddenStemsHanja(branchKor: string): string[] {
  const hanja = branchKorToHanja[branchKor];
  return hanja ? (HIDDEN_STEMS_HANJA[hanja] || []) : [];
}

// 12운성 가져오기
function getUnseong(dayStemKor: string, branchKor: string): string {
  const stemHanja = stemKorToHanja[dayStemKor];
  const branchHanja = branchKorToHanja[branchKor];
  if (stemHanja && branchHanja && UNSEONG_TABLE[stemHanja]) {
    return UNSEONG_TABLE[stemHanja][branchHanja] || "";
  }
  return "";
}

// 출생 계절 계산
function calculateBirthSeason(monthBranch: string): string {
  return BRANCH_TO_SEASON[monthBranch] || "정보없음";
}

// 신강/신약 점수 계산 (4단계 판단 로직)
function calculateStrengthScore(
  dayStem: string,
  monthBranch: string,
  dayBranch: string,
  yearBranch: string,
  hourBranch: string,
  yearStem: string,
  monthStem: string,
  hourStem: string
): { score: number; type: string; detail: string } {
  const dayElement = stemElements[dayStem];
  let score = 50; // 기본 점수
  const details: string[] = [];

  // 생극 관계 정의
  const generates: Record<string, string> = { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" };
  const generatedBy: Record<string, string> = { "목": "수", "화": "목", "토": "화", "금": "토", "수": "금" };
  const controls: Record<string, string> = { "목": "토", "화": "금", "토": "수", "금": "목", "수": "화" };
  const controlledBy: Record<string, string> = { "목": "금", "화": "수", "토": "목", "금": "화", "수": "토" };

  // ===== 1단계: 비겁+인성 vs 재관식상 개수 비교 =====
  let myTeam = 0; // 비겁 + 인성
  let otherTeam = 0; // 재성 + 관성 + 식상

  const allStems = [yearStem, monthStem, dayStem, hourStem].filter(Boolean);
  const allBranches = [yearBranch, monthBranch, dayBranch, hourBranch].filter(Boolean);

  // 천간 분류
  allStems.forEach(stem => {
    const el = stemElements[stem];
    if (el === dayElement) myTeam++; // 비겁
    else if (el === generatedBy[dayElement]) myTeam++; // 인성
    else otherTeam++; // 재관식상
  });

  // 지지 본기 분류
  allBranches.forEach(branch => {
    const el = branchElements[branch];
    if (el === dayElement) myTeam++; // 비겁
    else if (el === generatedBy[dayElement]) myTeam++; // 인성
    else otherTeam++; // 재관식상
  });

  const teamDiff = myTeam - otherTeam;
  score += teamDiff * 5; // 차이당 5점
  details.push(`1단계(비겁+인성:${myTeam} vs 재관식상:${otherTeam}): ${teamDiff > 0 ? '+' : ''}${teamDiff * 5}점`);

  // ===== 2단계: 월령 고려 (득령/실령) =====
  const monthElement = branchElements[monthBranch];
  let monthBonus = 0;
  
  if (monthElement === dayElement) {
    monthBonus = 15; // 같은 오행 = 득령
    details.push(`2단계(월령-득령): +15점`);
  } else if (monthElement === generatedBy[dayElement]) {
    monthBonus = 10; // 생해주는 오행
    details.push(`2단계(월령-상생): +10점`);
  } else if (monthElement === controlledBy[dayElement]) {
    monthBonus = -10; // 극하는 오행
    details.push(`2단계(월령-상극): -10점`);
  } else if (monthElement === generates[dayElement]) {
    monthBonus = -5; // 설기 (내가 생해줌)
    details.push(`2단계(월령-설기): -5점`);
  }
  score += monthBonus;

  // ===== 3단계: 통근 확인 (일간이 지지에 뿌리 내림) =====
  let tonggeunCount = 0;
  allBranches.forEach(branch => {
    const hidden = hiddenStems[branch];
    if (hidden && hidden.includes(dayStem)) {
      tonggeunCount++;
    }
  });
  
  const tonggeunBonus = tonggeunCount * 8; // 통근 하나당 8점
  score += tonggeunBonus;
  if (tonggeunCount > 0) {
    details.push(`3단계(통근 ${tonggeunCount}개): +${tonggeunBonus}점`);
  }

  // ===== 4단계: 십이운성 참고 (일지 기준) =====
  const unseong = getUnseong(dayStem, dayBranch);
  const strongUnseong = ["제왕", "건록", "관대", "장생"];
  const weakUnseong = ["사", "병", "쇠", "절", "묘"];
  
  let unseongBonus = 0;
  if (strongUnseong.includes(unseong)) {
    unseongBonus = 10;
    details.push(`4단계(12운성-${unseong}): +10점`);
  } else if (weakUnseong.includes(unseong)) {
    unseongBonus = -5;
    details.push(`4단계(12운성-${unseong}): -5점`);
  }
  score += unseongBonus;

  // 점수 범위 제한 (0-100)
  score = Math.max(0, Math.min(100, score));

  // 최종 판단 (경계값 처리)
  let type: string;
  if (score >= 60) type = "신강";
  else if (score >= 45) type = "중화";
  else type = "신약";

  return { score, type, detail: details.join(" | ") };
}

// 용신 계산
function calculateYongsin(strengthType: string, dayElement: string): string {
  // 신강: 설기(식상), 극기(관성), 소모(재성) 필요
  // 신약: 생조(인성), 방조(비겁) 필요
  
  const needsControl = strengthType === "신강";
  
  if (needsControl) {
    // 신강일 때 필요한 오행 (관성 = 나를 극하는 오행)
    const controlElements: Record<string, string> = {
      "목": "금(金) - 관성으로 제어",
      "화": "수(水) - 관성으로 제어",
      "토": "목(木) - 관성으로 제어",
      "금": "화(火) - 관성으로 제어",
      "수": "토(土) - 관성으로 제어",
    };
    return controlElements[dayElement] || "정보없음";
  } else {
    // 신약일 때 필요한 오행 (인성 = 나를 생해주는 오행)
    const supportElements: Record<string, string> = {
      "목": "수(水) - 인성으로 지지",
      "화": "목(木) - 인성으로 지지",
      "토": "화(火) - 인성으로 지지",
      "금": "토(土) - 인성으로 지지",
      "수": "금(金) - 인성으로 지지",
    };
    return supportElements[dayElement] || "정보없음";
  }
}

// 천간 시너지 계산
function calculateStemSynergies(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string
): string {
  const allStems = [yearStem, monthStem, dayStem, hourStem].filter(Boolean);
  const synergies: string[] = [];

  for (let i = 0; i < allStems.length; i++) {
    for (let j = i + 1; j < allStems.length; j++) {
      const combo = allStems[i] + allStems[j];
      if (STEM_SYNERGIES[combo]) {
        synergies.push(`${STEM_SYNERGIES[combo].name}: ${STEM_SYNERGIES[combo].description}`);
      }
    }
  }

  return synergies.length > 0 ? synergies.join(" | ") : "없음";
}

// 십성 전략 구조 계산
function calculateStrategicStructures(tenGodsPresent: string[]): string {
  const structures: string[] = [];

  const has = (god: string) => tenGodsPresent.includes(god);

  // 식상생재: 식신/상관 + 정재/편재
  if ((has("식신") || has("상관")) && (has("정재") || has("편재"))) {
    structures.push("식상생재: 재능을 수익으로 연결하는 능력");
  }

  // 식신제살: 식신 + 편관
  if (has("식신") && has("편관")) {
    structures.push("식신제살: 기술과 지혜로 압박 해결");
  }

  // 상관패인: 상관 + 정인/편인
  if (has("상관") && (has("정인") || has("편인"))) {
    structures.push("상관패인: 표현력에 권위를 더함");
  }

  // 재다신약 체크는 신강/신약과 함께 처리

  return structures.length > 0 ? structures.join(" | ") : "없음";
}

// 격국 계산
function calculateGyeok(
  monthBranch: string,
  yearStem: string,
  monthStem: string,
  hourStem: string,
  dayStem: string
): string {
  const mainStem = MONTH_BRANCH_MAIN_STEM[monthBranch];
  if (!mainStem) return "정보없음";

  // 월지 정기가 천간에 투출되었는지 확인
  const visibleStems = [yearStem, monthStem, hourStem];
  const isTouchul = visibleStems.includes(mainStem);

  // 일간 기준 십성 판단
  const god = tenGodsTable[dayStem]?.[mainStem];

  if (!god) return "정보없음";

  const gyeokMap: Record<string, string> = {
    "비견": "비견격 - 독립적인 개척자, 자수성가형",
    "겁재": "겁재격 - 경쟁심 강한 도전자",
    "식신": "식신격 - 크리에이티브 전문가, 표현의 달인",
    "상관": "상관격 - 아이디어 뱅크, 혁신가",
    "정재": "정재격 - 현실적인 전략가, 자산 관리자",
    "편재": "편재격 - 사업가 기질, 통제력 있는 리더",
    "정관": "정관격 - 완벽주의 리더, 질서 수호자",
    "편관": "편관격 - 카리스마 리더, 권위자",
    "정인": "정인격 - 통찰력 있는 지식인, 멘토",
    "편인": "편인격 - 전략 아카이버, 비밀스러운 지혜",
  };

  const gyeokName = gyeokMap[god] || god + "격";
  return isTouchul ? gyeokName + " (투출)" : gyeokName + " (암장)";
}

// 통근 여부 계산 (천간이 지지의 지장간에 뿌리를 내렸는지)
function calculateTonggeun(
  yearStem: string, yearBranch: string,
  monthStem: string, monthBranch: string,
  dayStem: string, dayBranch: string,
  hourStem: string, hourBranch: string
): string {
  const results: string[] = [];
  
  const checkRoot = (stem: string, pillarName: string, allBranches: string[]) => {
    if (!stem) return;
    const roots: string[] = [];
    
    allBranches.forEach((branch, idx) => {
      if (!branch) return;
      const hidden = hiddenStems[branch];
      if (hidden && hidden.includes(stem)) {
        const pillarNames = ["시지", "일지", "월지", "연지"];
        roots.push(pillarNames[idx]);
      }
    });
    
    if (roots.length > 0) {
      results.push(`${pillarName} ${stem}(${stemToHanja[stem]})→${roots.join(",")}`);
    }
  };
  
  const allBranches = [hourBranch, dayBranch, monthBranch, yearBranch];
  checkRoot(yearStem, "연간", allBranches);
  checkRoot(monthStem, "월간", allBranches);
  checkRoot(dayStem, "일간", allBranches);
  if (hourStem) checkRoot(hourStem, "시간", allBranches);
  
  return results.length > 0 ? results.join(" | ") : "통근 없음";
}

// 간여지동 계산 (천간과 지지가 같은 오행인 경우)
function calculateGanyeoJidong(
  yearStem: string, yearBranch: string,
  monthStem: string, monthBranch: string,
  dayStem: string, dayBranch: string,
  hourStem: string, hourBranch: string
): string {
  const results: string[] = [];
  
  const check = (stem: string, branch: string, pillarName: string) => {
    if (!stem || !branch) return;
    const stemElement = stemElements[stem];
    const branchElement = branchElements[branch];
    if (stemElement === branchElement) {
      results.push(`${pillarName}: ${stem}${branch}(${stemElement})`);
    }
  };
  
  check(yearStem, yearBranch, "연주");
  check(monthStem, monthBranch, "월주");
  check(dayStem, dayBranch, "일주");
  if (hourStem && hourBranch) check(hourStem, hourBranch, "시주");
  
  return results.length > 0 ? results.join(" | ") : "없음";
}

// 공망 계산
function calculateGongmang(dayStem: string, dayBranch: string): string {
  const gan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const zhi = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

  const dayGanIdx = gan.indexOf(dayStem);
  const dayZhiIdx = zhi.indexOf(dayBranch);

  if (dayGanIdx === -1 || dayZhiIdx === -1) return "정보없음";

  // 갑(甲)이 올 때까지 거슬러 올라가 순(旬)의 시작점을 찾음
  const diff = dayGanIdx;
  const startZhiIdx = ((dayZhiIdx - diff) % 12 + 12) % 12;

  // 순의 마지막 두 지지가 공망
  const gong1 = zhi[(startZhiIdx + 10) % 12];
  const gong2 = zhi[(startZhiIdx + 11) % 12];

  const gong1Hanja = branchKorToHanja[gong1];
  const gong2Hanja = branchKorToHanja[gong2];

  return `${gong1}${gong2} (${gong1Hanja}${gong2Hanja}) 공망`;
}

// 사주 기둥 정보 인터페이스
export interface PillarInfo {
  type: string;
  stem: string;
  branch: string;
  stemHanja: string;
  branchHanja: string;
  hiddenStems: string[];
  unseong: string;
  stemTenGod: string; // 천간 십성
  branchTenGod: string; // 지지 본기 십성
}

export interface SajuResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  fiveElementsAnalysis: string;
  sinsal: string;
  ilGan: string;
  tenGodsPresent: string;
  tenGodsMissing: string;
  pillars: PillarInfo[];
  interactions: string[];
  // 새로 추가된 필드들
  dayPillarFull: string; // 일주 60갑자 (예: "기미")
  birthSeason: string; // 출생 계절
  strengthScore: number; // 신강/신약 점수 (0-100)
  strengthType: string; // "신강", "중화", 또는 "신약"
  strengthDetail: string; // 신강/신약 판단 근거
  yongsin: string; // 용신
  stemSynergies: string; // 천간 시너지
  strategicStructures: string; // 전략 구조
  gyeok: string; // 격국
  gongmang: string; // 공망
  // 추가 분석 필드
  pillarTenGods: string; // 각 기둥별 십성 (연주/월주/일지/시주)
  tonggeun: string; // 통근 여부 (천간이 지지에 뿌리 내림)
  ganyeojidong: string; // 간여지동 (천간과 지지가 같은 오행)
}

export interface BirthInfo {
  name: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or "모름"
  birthCountry: string;
}

// 시간을 시간 인덱스로 변환 (0-11)
function getHourIndex(timeStr: string): number | null {
  if (!timeStr || timeStr === "모름") return null;
  
  // HH:mm 형식 파싱
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const hour = parseInt(match[1], 10);
    // 시간대별 지지 인덱스 계산
    // 자시(23-01), 축시(01-03), 인시(03-05), ...
    if (hour === 23 || hour === 0) return 0; // 자시
    return Math.floor((hour + 1) / 2);
  }
  return null;
}

// 대표 시간 얻기
function getRepresentativeHour(hourIdx: number | null): number {
  if (hourIdx === null) return 12; // 모르면 정오
  const repHours = [23, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  return repHours[hourIdx];
}

// 신살 계산 함수들
function checkDohwaSal(yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const dohwa = ["자", "오", "묘", "유"];
  return [yearBranch, monthBranch, dayBranch, hourBranch].some(b => dohwa.includes(b));
}

function checkYeokMaSal(yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const bs = [yearBranch, monthBranch, dayBranch, hourBranch];
  if ((bs.includes("신") || bs.includes("자") || bs.includes("진")) && bs.includes("인")) return true;
  if ((bs.includes("인") || bs.includes("오") || bs.includes("술")) && bs.includes("신")) return true;
  if ((bs.includes("사") || bs.includes("유") || bs.includes("축")) && bs.includes("해")) return true;
  if ((bs.includes("해") || bs.includes("묘") || bs.includes("미")) && bs.includes("사")) return true;
  return false;
}

function checkHwagaeSal(yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const bs = [yearBranch, monthBranch, dayBranch, hourBranch];
  if ((bs.includes("신") || bs.includes("자") || bs.includes("진")) && bs.includes("진")) return true;
  if ((bs.includes("인") || bs.includes("오") || bs.includes("술")) && bs.includes("술")) return true;
  if ((bs.includes("사") || bs.includes("유") || bs.includes("축")) && bs.includes("축")) return true;
  if ((bs.includes("해") || bs.includes("묘") || bs.includes("미")) && bs.includes("미")) return true;
  return false;
}

function checkMangSinSal(dayBranch: string, yearBranch: string, monthBranch: string, hourBranch: string): boolean {
  const mangsinMap: Record<string, string[]> = {
    "자": ["인", "신", "사", "해"], "오": ["인", "신", "사", "해"],
    "묘": ["인", "신", "사", "해"], "유": ["인", "신", "사", "해"],
    "인": ["자", "오", "묘", "유"], "신": ["자", "오", "묘", "유"],
    "사": ["자", "오", "묘", "유"], "해": ["자", "오", "묘", "유"],
    "진": ["진", "술", "축", "미"], "술": ["진", "술", "축", "미"],
    "축": ["진", "술", "축", "미"], "미": ["진", "술", "축", "미"]
  };
  const targetBranches = mangsinMap[dayBranch];
  if (!targetBranches) return false;
  const otherBranches = [yearBranch, monthBranch, hourBranch];
  return targetBranches.some(target => otherBranches.includes(target));
}

function checkWonJinSal(yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const wonjin = [["자", "미"], ["축", "오"], ["인", "유"], ["묘", "신"], ["진", "해"], ["사", "술"]];
  const bs = [yearBranch, monthBranch, dayBranch, hourBranch];
  return wonjin.some(pair => bs.includes(pair[0]) && bs.includes(pair[1]));
}

function checkGweGangSal(dayStem: string, dayBranch: string): boolean {
  const gwegang = [["무", "진"], ["경", "진"], ["경", "술"], ["임", "진"]];
  return gwegang.some(pair => pair[0] === dayStem && pair[1] === dayBranch);
}

function checkMunChangSal(dayStem: string, yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const munchangMap: Record<string, string> = {
    "갑": "사", "을": "오", "병": "신", "정": "유",
    "무": "신", "기": "유", "경": "해", "신": "자",
    "임": "인", "계": "묘"
  };
  const target = munchangMap[dayStem];
  return [yearBranch, monthBranch, dayBranch, hourBranch].includes(target);
}

function checkHyeonChimSal(dayBranch: string): boolean {
  return ["해", "묘", "미"].includes(dayBranch);
}

function checkJangSeongSal(dayStem: string, yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string): boolean {
  const jangseongMap: Record<string, string> = {
    "갑": "오", "을": "유", "병": "술", "정": "축",
    "무": "술", "기": "축", "경": "진", "신": "미",
    "임": "신", "계": "해"
  };
  const target = jangseongMap[dayStem];
  return [yearBranch, monthBranch, dayBranch, hourBranch].includes(target);
}

function checkHongYeomSal(dayBranch: string): boolean {
  return ["자", "오", "묘", "유"].includes(dayBranch);
}

function checkAllSinsal(yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string, dayStem: string): string {
  const sinsalList: string[] = [];
  if (checkDohwaSal(yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("도화살");
  if (checkYeokMaSal(yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("역마살");
  if (checkHwagaeSal(yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("화개살");
  if (checkMangSinSal(dayBranch, yearBranch, monthBranch, hourBranch)) sinsalList.push("망신살");
  if (checkWonJinSal(yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("원진살");
  if (checkGweGangSal(dayStem, dayBranch)) sinsalList.push("괴강살");
  if (checkMunChangSal(dayStem, yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("문창살");
  if (checkHyeonChimSal(dayBranch)) sinsalList.push("현침살");
  if (checkJangSeongSal(dayStem, yearBranch, monthBranch, dayBranch, hourBranch)) sinsalList.push("장성살");
  if (checkHongYeomSal(dayBranch)) sinsalList.push("홍염살");
  return sinsalList.length > 0 ? sinsalList.join(", ") : "없음";
}

// 오행 분석 (천간 4개 + 지지 본기 4개 = 8개, 지장간 제외)
function analyzeFiveElements(
  yearStem: string, yearBranch: string,
  monthStem: string, monthBranch: string,
  dayStem: string, dayBranch: string,
  hourStem: string, hourBranch: string
): string {
  const counts: Record<string, number> = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
  
  // 천간 오행 카운트 (4개)
  [yearStem, monthStem, dayStem, hourStem].forEach(stem => {
    const element = stemElements[stem];
    if (element) counts[element]++;
  });
  
  // 지지 본기 오행 카운트 (4개) - 지장간 제외
  [yearBranch, monthBranch, dayBranch, hourBranch].forEach(branch => {
    const element = branchElements[branch];
    if (element) counts[element]++;
  });
  
  const result = Object.entries(counts)
    .map(([element, count]) => `${element}(${elementToHanja[element]}): ${count}`)
    .join(", ");
  
  // 가장 많은/적은 오행 찾기
  const maxElement = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const minElement = Object.entries(counts).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  
  // 0인 오행 찾기 (완전 결핍)
  const missingElements = Object.entries(counts).filter(([_, count]) => count === 0).map(([el]) => el);
  const missingInfo = missingElements.length > 0 ? ` | 결핍: ${missingElements.join(", ")}` : " | 오행구족";
  
  return `${result} | 최강: ${maxElement}(${elementToHanja[maxElement]}), 최약: ${minElement}(${elementToHanja[minElement]})${missingInfo}`;
}

// 십성 분석
function analyzeTenGods(
  dayStem: string,
  yearStem: string, monthStem: string, hourStem: string,
  yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string
): { present: string; missing: string; ilGan: string } {
  const foundGods = new Set<string>();
  
  // 천간에서 십성 찾기 (일간 자신 제외)
  [yearStem, monthStem, hourStem].forEach(stem => {
    const god = tenGodsTable[dayStem]?.[stem];
    if (god) foundGods.add(god);
  });
  
  // 지지의 장간에서 십성 찾기
  [yearBranch, monthBranch, dayBranch, hourBranch].forEach(branch => {
    const hidden = hiddenStems[branch];
    if (hidden) {
      hidden.forEach(hiddenStem => {
        const god = tenGodsTable[dayStem]?.[hiddenStem];
        if (god) foundGods.add(god);
      });
    }
  });
  
  const allTenGods = ["비견", "겁재", "식신", "상관", "정재", "편재", "정관", "편관", "정인", "편인"];
  const missingGods = allTenGods.filter(g => !foundGods.has(g));
  
  const element = stemElements[dayStem];
  const ilGan = `${dayStem}${element} (${stemToHanja[dayStem]})`;
  
  return {
    present: [...foundGods].join(", ") || "없음",
    missing: missingGods.join(", ") || "없음",
    ilGan
  };
}

// 메인 사주 계산 함수
export function calculateSaju(birthInfo: BirthInfo): SajuResult {
  const jeolgiMap = getJeolgiMap();
  
  // 날짜 파싱
  const [yearVal, monthVal, dayVal] = birthInfo.birthDate.split("-").map(Number);
  
  // 시간 인덱스 계산
  const hourIdx = getHourIndex(birthInfo.birthTime);
  const hourForCalc = getRepresentativeHour(hourIdx);
  
  // UTC 타임스탬프 생성
  const neutralTimestampMs = Date.UTC(yearVal, monthVal - 1, dayVal, hourForCalc, 0, 0, 0);
  
  // KST 변환
  const utcOffset = countryOffsets[birthInfo.birthCountry] ?? 0;
  const kstTimestampMs = neutralTimestampMs + (utcOffset * 60 * 60 * 1000);
  const kstDate = new Date(kstTimestampMs);
  
  const year = kstDate.getUTCFullYear();
  
  // 연주 계산 (입춘 기준)
  let sajuYear = year;
  const jeolgiList = jeolgiMap[year];
  if (jeolgiList && jeolgiList.length > 0) {
    const ipchun = jeolgiList.find(j => j.name === "입춘");
    if (ipchun && kstDate < ipchun.date) {
      sajuYear = year - 1;
    }
  }
  
  const yearIndex = ((sajuYear - 4) % 60 + 60) % 60;
  const yearStem = stems[yearIndex % 10];
  const yearBranch = branches[yearIndex % 12];
  const yearStemIndex = yearIndex % 10;
  
  // 월주 계산
  let monthStem = "";
  let monthBranch = "";
  
  if (jeolgiList) {
    let currentJeolgi = jeolgiList[0];
    for (let i = 0; i < jeolgiList.length; i++) {
      if (kstDate >= jeolgiList[i].date) {
        currentJeolgi = jeolgiList[i];
      } else {
        break;
      }
    }
    
    monthBranch = getMonthBranch(currentJeolgi.name);
    if (monthBranch) {
      const monthBranchIndex = branches.indexOf(monthBranch);
      monthStem = monthStemTable[yearStemIndex][monthBranchIndex];
    }
  }
  
  // 일주 계산 (1984-01-31 = 갑자일 기준)
  const baseDate = new Date(Date.UTC(1984, 0, 31, 0, 0, 0, 0));
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  
  // KST 기준 날짜 계산
  const kstDateOnly = new Date(Date.UTC(
    kstDate.getUTCFullYear(),
    kstDate.getUTCMonth(),
    kstDate.getUTCDate()
  ));
  
  const dayDiff = Math.floor((kstDateOnly.getTime() - baseDate.getTime()) / MS_PER_DAY);
  const dayIndex = ((dayDiff % 60) + 60) % 60;
  const dayStem = stems[dayIndex % 10];
  const dayBranch = branches[dayIndex % 12];
  
  // 시주 계산
  let hourStem = "";
  let hourBranch = "";
  
  if (hourIdx !== null) {
    hourBranch = branches[hourIdx];
    hourStem = hourStemTable[dayStem][hourIdx];
  }
  
  // 오행 분석
  const fiveElementsAnalysis = analyzeFiveElements(
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem || dayStem, hourBranch || dayBranch
  );
  
  // 신살 분석
  const sinsal = checkAllSinsal(yearBranch, monthBranch, dayBranch, hourBranch || dayBranch, dayStem);
  
  // 십성 분석
  const tenGodsResult = analyzeTenGods(
    dayStem,
    yearStem, monthStem, hourStem || dayStem,
    yearBranch, monthBranch, dayBranch, hourBranch || dayBranch
  );
  
  // 주 형식 지정
  const formatPillar = (stem: string, branch: string) => {
    if (!stem || !branch) return "미정";
    return `${stem}${branch} (${stemToHanja[stem]}${branchToHanja[branch]})`;
  };
  
  // 각 기둥별 십성 계산 함수
  const getStemTenGod = (stem: string) => {
    if (!stem || stem === dayStem) return "비견";
    return tenGodsTable[dayStem]?.[stem] || "";
  };
  
  const getBranchMainTenGod = (branch: string) => {
    if (!branch) return "";
    const mainStem = MONTH_BRANCH_MAIN_STEM[branch];
    if (!mainStem) return "";
    return tenGodsTable[dayStem]?.[mainStem] || "";
  };

  // 사주 기둥 정보 구성
  const pillars: PillarInfo[] = [
    {
      type: "시주",
      stem: hourStem || "",
      branch: hourBranch || "",
      stemHanja: hourStem ? stemToHanja[hourStem] : "",
      branchHanja: hourBranch ? branchToHanja[hourBranch] : "",
      hiddenStems: hourBranch ? getHiddenStemsHanja(hourBranch) : [],
      unseong: hourBranch ? getUnseong(dayStem, hourBranch) : "",
      stemTenGod: hourStem ? getStemTenGod(hourStem) : "",
      branchTenGod: hourBranch ? getBranchMainTenGod(hourBranch) : "",
    },
    {
      type: "일주",
      stem: dayStem,
      branch: dayBranch,
      stemHanja: stemToHanja[dayStem],
      branchHanja: branchToHanja[dayBranch],
      hiddenStems: getHiddenStemsHanja(dayBranch),
      unseong: getUnseong(dayStem, dayBranch),
      stemTenGod: "비견", // 일간은 항상 비견(나)
      branchTenGod: getBranchMainTenGod(dayBranch),
    },
    {
      type: "월주",
      stem: monthStem,
      branch: monthBranch,
      stemHanja: stemToHanja[monthStem],
      branchHanja: branchToHanja[monthBranch],
      hiddenStems: getHiddenStemsHanja(monthBranch),
      unseong: getUnseong(dayStem, monthBranch),
      stemTenGod: getStemTenGod(monthStem),
      branchTenGod: getBranchMainTenGod(monthBranch),
    },
    {
      type: "연주",
      stem: yearStem,
      branch: yearBranch,
      stemHanja: stemToHanja[yearStem],
      branchHanja: branchToHanja[yearBranch],
      hiddenStems: getHiddenStemsHanja(yearBranch),
      unseong: getUnseong(dayStem, yearBranch),
      stemTenGod: getStemTenGod(yearStem),
      branchTenGod: getBranchMainTenGod(yearBranch),
    },
  ];

// 지지간 상호작용 체크
  const branchesForInteraction = [hourBranch || dayBranch, dayBranch, monthBranch, yearBranch];
  const interactions = checkInteractions(branchesForInteraction);

  // 새로 추가된 계산들
  const dayPillarFull = `${dayStem}${dayBranch}`;
  const birthSeason = calculateBirthSeason(monthBranch);
  const dayElement = stemElements[dayStem];
  const strengthResult = calculateStrengthScore(
    dayStem, monthBranch, dayBranch, yearBranch, hourBranch || dayBranch,
    yearStem, monthStem, hourStem || ""
  );
  const yongsin = calculateYongsin(strengthResult.type, dayElement);
  const stemSynergies = calculateStemSynergies(yearStem, monthStem, dayStem, hourStem || "");
  const tenGodsPresentArray = tenGodsResult.present.split(", ").filter(g => g !== "없음");
  const strategicStructures = calculateStrategicStructures(tenGodsPresentArray);
  const gyeok = calculateGyeok(monthBranch, yearStem, monthStem, hourStem || "", dayStem);
  const gongmang = calculateGongmang(dayStem, dayBranch);
  
  // 각 기둥별 십성 문자열 생성
  const pillarTenGods = pillars.map(p => 
    `${p.type}: ${p.stemTenGod || "-"}(천간) / ${p.branchTenGod || "-"}(지지)`
  ).join(" | ");
  
  // 통근 계산
  const tonggeun = calculateTonggeun(
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem || "", hourBranch || ""
  );
  
  // 간여지동 계산
  const ganyeojidong = calculateGanyeoJidong(
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem || "", hourBranch || ""
  );
  
  return {
    yearPillar: formatPillar(yearStem, yearBranch),
    monthPillar: formatPillar(monthStem, monthBranch),
    dayPillar: formatPillar(dayStem, dayBranch),
    hourPillar: hourIdx !== null ? formatPillar(hourStem, hourBranch) : "시간 미입력",
    fiveElementsAnalysis,
    sinsal,
    ilGan: tenGodsResult.ilGan,
    tenGodsPresent: tenGodsResult.present,
    tenGodsMissing: tenGodsResult.missing,
    pillars,
    interactions,
    // 새로 추가된 필드들
    dayPillarFull,
    birthSeason,
    strengthScore: strengthResult.score,
    strengthType: strengthResult.type,
    strengthDetail: strengthResult.detail,
    yongsin,
    stemSynergies,
    strategicStructures,
    gyeok,
    gongmang,
    // 추가 분석 필드
    pillarTenGods,
    tonggeun,
    ganyeojidong,
  };
}
