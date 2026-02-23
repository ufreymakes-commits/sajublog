"use client";

import React from "react"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Download, Sparkles, Heart, Briefcase, Activity, Star, ChevronDown, ChevronUp } from "lucide-react";
import type { SajuResult, PillarInfo } from "@/lib/saju/calculator";

// 오행별 색상 매핑 (새로운 팔레트)
const ELEMENT_COLORS: Record<string, string> = {
  "목": "bg-[#DBFA40] text-[#0D0D0D] border-[#c9e83a]",
  "화": "bg-[#FB4645] text-white border-[#e03e3d]",
  "토": "bg-[#ED7C30] text-white border-[#d56f2a]",
  "금": "bg-[#DBD8FF] text-[#0D0D0D] border-[#c8c5eb]",
  "수": "bg-[#7366AF] text-white border-[#655a9c]",
};

// 천간 오행 매핑
const STEM_ELEMENTS: Record<string, string> = {
  "갑": "목", "을": "목", "병": "화", "정": "화", "무": "토",
  "기": "토", "경": "금", "신": "금", "임": "수", "계": "수",
};

// 지지 오행 매핑
const BRANCH_ELEMENTS: Record<string, string> = {
  "자": "수", "축": "토", "인": "목", "묘": "목", "진": "토", "사": "화",
  "오": "화", "미": "토", "신": "금", "유": "금", "술": "토", "해": "수",
};

// 한자 매핑
const STEM_HANJA: Record<string, string> = {
  "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
  "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸",
};

const BRANCH_HANJA: Record<string, string> = {
  "자": "子", "축": "丑", "인": "寅", "묘": "卯", "진": "辰", "사": "巳",
  "오": "午", "미": "未", "신": "申", "유": "酉", "술": "戌", "해": "亥",
};

interface SectionData {
  title: string;
  content: string;
}

interface ReportData {
  headline: string;
  summary: string;
  sections: SectionData[];
  totalSections: number;
}

interface PremiumReportProps {
  userName: string;
  sajuResult: SajuResult;
  birthDate: string;
  birthTime: string;
  birthCountry: string;
  gender: string;
}

const CategorySection = ({
  sectionTitle,
  icon: Icon,
  content,
  color,
}: {
  sectionTitle: string;
  icon: React.ElementType;
  content: string;
  color: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // 본문을 문단으로 분리
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <div className="mb-10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 rounded-xl ${color} mb-4 transition-all hover:opacity-90`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <h3 className="text-[15px] font-bold leading-tight text-left">{sectionTitle}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
      </button>
      
      {isExpanded && (
        <div className="space-y-5 pl-2">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-[13px] text-[#DBD8FF]/90 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export function PremiumReport({ userName, sajuResult, birthDate, birthTime, birthCountry, gender }: PremiumReportProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 12운성 정보 수집
      const unseongInfo = sajuResult.pillars
        .map((p) => `${p.type}: ${p.unseong || "없음"}`)
        .join(", ");
      
      // 지장간 정보 수집
      const jijangganInfo = sajuResult.pillars
        .map((p) => `${p.type}(${p.branch}): ${p.hiddenStems?.join(",") || "없음"}`)
        .join(" | ");

      const response = await fetch("/api/saju/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          gender,
          fiveElements: sajuResult.fiveElementsAnalysis,
          dayMaster: sajuResult.ilGan,
          dayPillar: sajuResult.dayPillarFull || sajuResult.dayPillar,
          pillarYear: sajuResult.yearPillar,
          pillarMonth: sajuResult.monthPillar,
          pillarDay: sajuResult.dayPillar,
          pillarHour: sajuResult.hourPillar,
          ownedSipsung: sajuResult.tenGodsPresent,
          missingSipsung: sajuResult.tenGodsMissing,
          sinsal: sajuResult.sinsal,
          interactions: sajuResult.interactions?.join(", ") || "없음",
          unseong: unseongInfo,
          // 새로 추가된 데이터들
          birthSeason: sajuResult.birthSeason || "정보없음",
          strengthScore: sajuResult.strengthScore || 50,
          strengthType: sajuResult.strengthType || "중화",
          strengthDetail: sajuResult.strengthDetail || "정보없음",
          yongsin: sajuResult.yongsin || "정보없음",
          stemSynergies: sajuResult.stemSynergies || "없음",
          strategicStructures: sajuResult.strategicStructures || "없음",
          gyeok: sajuResult.gyeok || "정보없음",
          gongmang: sajuResult.gongmang || "정보없음",
          jijanggan: jijangganInfo,
          // 추가 분석 데이터
          pillarTenGods: sajuResult.pillarTenGods || "정보없음",
          tonggeun: sajuResult.tonggeun || "정보없음",
          ganyeojidong: sajuResult.ganyeojidong || "없음",
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        console.log("[v0] API Error:", data);
        const debugInfo = data.debug ? ` (${data.debug})` : "";
        setError(`${data.error || "레포트 생성에 실패했습니다."}${debugInfo}`);
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPillarDisplay = (pillar: PillarInfo, index: number) => {
    const titles = ["시주", "일주", "월주", "연주"];
    const titleHanja = ["時柱", "日柱", "月柱", "年柱"];
    const stemElement = STEM_ELEMENTS[pillar.stem] || "토";
    const branchElement = BRANCH_ELEMENTS[pillar.branch] || "토";

    return (
      <div key={index} className="flex flex-col text-center">
        <div className="bg-[#1a1a2e] py-2 text-[10px] font-bold text-[#a9a6c9] uppercase tracking-widest border-b border-[#3d3d5c]">
          {titles[index]}
          <span className="block text-[#7366AF] text-[8px]">{titleHanja[index]}</span>
        </div>
        {/* 천간 */}
        <div className={`${ELEMENT_COLORS[stemElement]} p-3 flex flex-col items-center border-b border-white/10`}>
          <span className="text-2xl font-bold mb-1">{pillar.stemHanja || STEM_HANJA[pillar.stem]}</span>
          <span className="text-[10px] font-medium leading-none">{pillar.stem}</span>
        </div>
        {/* 지지 */}
        <div className={`${ELEMENT_COLORS[branchElement]} p-3 flex flex-col items-center`}>
          <span className="text-2xl font-bold mb-1">{pillar.branchHanja || BRANCH_HANJA[pillar.branch]}</span>
          <span className="text-[10px] font-medium leading-none">{pillar.branch}</span>
        </div>
        {/* 12운성 & 지장간 */}
        <div className="py-2 px-1 text-[9px] leading-tight text-[#a9a6c9] bg-[#1a1a2e] flex flex-col gap-1 min-h-[50px] justify-center">
          <div className="font-semibold text-[#F3619C]">{pillar.unseong || "-"}</div>
          <div className="tracking-tighter text-[#a9a6c9]/60">{pillar.hiddenStems?.join(" ") || "-"}</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="border-[#3d3d5c] bg-[#1a1a2e]/90 backdrop-blur p-12">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#7366AF] to-[#B494F8] animate-pulse flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[#DBD8FF] text-lg">
                kumiho가 당신의 운명 구슬을 만들고 있습니다.. 조금만 기다려주세요!
              </p>
            </div>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#F3619C] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="border-[#FB4645]/30 bg-[#FB4645]/10 backdrop-blur p-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-[#FB4645]">오류가 발생했습니다</h3>
            <p className="text-[#DBD8FF]/80">{error}</p>
            <Button onClick={generateReport} className="bg-[#7366AF] hover:bg-[#8577c0] text-white">
              다시 시도
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* 상단 헤더 */}
      <div className="relative bg-gradient-to-b from-[#7366AF]/20 to-transparent p-8 text-center">
        <Badge className="bg-[#F3619C]/20 text-[#F3619C] border-[#F3619C]/30 mb-4">
          Premium Saju Report
        </Badge>
        <h1 className="text-xl font-bold text-[#DBD8FF] mb-2">{userName}님의 사주 레포트</h1>
        <p className="text-[#a9a6c9] text-[11px]">
          {birthDate} | {birthTime} | {birthCountry}
        </p>
      </div>

      {/* 사주 8글자 그리드 */}
      <div className="mx-4 mb-8">
        <Card className="border-[#3d3d5c] bg-[#1a1a2e]/90 backdrop-blur overflow-hidden">
          <div className="grid grid-cols-4 gap-0">
            {sajuResult.pillars.map((pillar, idx) => getPillarDisplay(pillar, idx))}
          </div>
        </Card>
      </div>

      {/* 주요 키워드 뱃지 */}
      <div className="px-6 mb-8 flex flex-wrap gap-2 justify-center">
        {sajuResult.interactions?.map((tag, i) => {
          let variant = "bg-[#7366AF]/30 text-[#DBD8FF] border-[#7366AF]/50";
          if (tag.includes("충")) variant = "bg-[#FB4645]/20 text-[#FB4645] border-[#FB4645]/50";
          else if (tag.includes("합")) variant = "bg-[#DBFA40]/20 text-[#DBFA40] border-[#DBFA40]/50";
          else if (tag.includes("원진")) variant = "bg-[#ED7C30]/20 text-[#ED7C30] border-[#ED7C30]/50";
          
          return (
            <Badge key={i} className={`${variant} border`}>
              #{tag}
            </Badge>
          );
        })}
        <Badge className="bg-[#B494F8]/20 text-[#B494F8] border-[#B494F8]/50 border">
          #{sajuResult.ilGan}일간
        </Badge>
      </div>

      {/* 레포트 헤드라인 */}
      <div className="px-8 mb-8">
        <div className="relative">
          <span className="absolute -top-6 -left-2 text-5xl text-[#7366AF]/30 font-serif">"</span>
          <h2 className="relative z-10 text-[16px] font-extrabold text-[#DBD8FF] leading-tight pt-2 text-balance">
            {report.headline}
          </h2>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-[#7366AF]/20 border border-[#7366AF]/30">
          <p className="text-[13px] text-[#DBD8FF]/90 leading-relaxed">
            <span className="text-[#F3619C] font-bold">{userName}</span>님, {report.summary}
          </p>
        </div>
      </div>

      {/* 13개 섹션 레포트 */}
      <div className="px-6">
        {report.sections.map((section, index) => {
          // 섹션별 색상과 아이콘 매핑
          const sectionStyles = [
            { color: "bg-[#7366AF] text-white", icon: Sparkles },      // 1. 타고난 기질
            { color: "bg-[#F3619C] text-white", icon: Heart },         // 2. 감정 패턴
            { color: "bg-[#B494F8] text-[#0D0D0D]", icon: Sparkles },  // 3. 대인관계
            { color: "bg-[#ED7C30] text-white", icon: Heart },         // 4. 연애 스타일
            { color: "bg-[#F3619C] text-white", icon: Heart },         // 5. 이상형과 궁합
            { color: "bg-[#DBFA40] text-[#0D0D0D]", icon: Briefcase }, // 6. 직업 적성
            { color: "bg-[#7366AF] text-white", icon: Briefcase },     // 7. 리더십과 팀워크
            { color: "bg-[#EDE986] text-[#0D0D0D]", icon: Briefcase }, // 8. 돈과 재물
            { color: "bg-[#FB4645] text-white", icon: Activity },      // 9. 건강 신호
            { color: "bg-[#B494F8] text-[#0D0D0D]", icon: Activity },  // 10. 스트레스 패턴
            { color: "bg-[#ED7C30] text-white", icon: Star },          // 11. 인생의 과제
            { color: "bg-[#DBFA40] text-[#0D0D0D]", icon: Star },      // 12. 숨겨진 잠재력
            { color: "bg-[#7366AF] text-white", icon: Star },          // 13. 개운 조언
          ];
          
          const style = sectionStyles[index % sectionStyles.length];
          
          return (
            <CategorySection
              key={index}
              sectionTitle={section.title}
              icon={style.icon}
              content={section.content}
              color={style.color}
            />
          );
        })}
      </div>

      {/* 하단 플로팅 버튼 */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-3">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-[#7366AF] hover:bg-[#8577c0] text-white shadow-2xl"
          onClick={() => window.print()}
        >
          <Download className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-[#1a1a2e] hover:bg-[#252538] text-[#DBD8FF] border border-[#3d3d5c] shadow-2xl"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${userName}님의 사주 레포트`,
                text: report.headline,
              });
            }
          }}
        >
          <Share2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
