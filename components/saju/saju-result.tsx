"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SajuResult } from "@/lib/saju/calculator";

interface SajuResultDisplayProps {
  result: SajuResult;
  name: string;
}

export function SajuResultDisplay({ result, name }: SajuResultDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">
          {name}님의 사주 팔자
        </h2>
        <p className="text-amber-200/70">四柱八字 - 당신의 운명을 담은 네 기둥</p>
      </div>

      {/* 사주 팔자 표시 (지장간, 12운성 포함) */}
      <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-amber-100 text-center">사주 팔자 (四柱八字)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 text-center">
            {result.pillars.map((pillar, idx) => {
              const isDay = pillar.type === "일주";
              const isEmpty = !pillar.stem || !pillar.branch;
              const typeLabels: Record<string, string> = {
                "시주": "時柱",
                "일주": "日柱 (본인)",
                "월주": "月柱",
                "연주": "年柱"
              };
              
              return (
                <div key={pillar.type} className="space-y-2">
                  <div className="text-sm text-amber-200/60">{pillar.type}</div>
                  <div className={`rounded-lg p-3 border ${
                    isDay 
                      ? "bg-amber-700/30 border-2 border-amber-500/50" 
                      : "bg-amber-900/30 border-amber-800/50"
                  }`}>
                    {/* 천간 */}
                    <div className="text-2xl font-bold text-amber-100">
                      {isEmpty ? "?" : pillar.stemHanja}
                    </div>
                    <div className="text-xs text-amber-200/50 mb-2">
                      {isEmpty ? "-" : pillar.stem}
                    </div>
                    
                    {/* 지지 */}
                    <div className="text-2xl font-bold text-amber-100">
                      {isEmpty ? "?" : pillar.branchHanja}
                    </div>
                    <div className="text-xs text-amber-200/50">
                      {isEmpty ? "-" : pillar.branch}
                    </div>
                  </div>
                  
                  {/* 지장간 */}
                  <div className="bg-amber-950/60 rounded p-2 border border-amber-900/30">
                    <div className="text-xs text-amber-300/60 mb-1">지장간</div>
                    <div className="text-sm text-amber-100 font-medium">
                      {isEmpty ? "-" : (pillar.hiddenStems.length > 0 ? pillar.hiddenStems.join(" ") : "-")}
                    </div>
                  </div>
                  
                  {/* 12운성 */}
                  <div className="bg-amber-950/60 rounded p-2 border border-amber-900/30">
                    <div className="text-xs text-amber-300/60 mb-1">12운성</div>
                    <div className="text-sm text-amber-100 font-medium">
                      {isEmpty ? "-" : (pillar.unseong || "-")}
                    </div>
                  </div>
                  
                  <div className="text-xs text-amber-300/50">{typeLabels[pillar.type]}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 지지 상호작용 (충, 합, 원진) */}
      {result.interactions && result.interactions.length > 0 && (
        <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100">지지 상호작용 (충/합/원진)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.interactions.map((interaction, idx) => {
                let bgColor = "bg-amber-900/40 text-amber-200 border-amber-700/50";
                if (interaction.includes("충")) {
                  bgColor = "bg-red-900/40 text-red-200 border-red-700/50";
                } else if (interaction.includes("합")) {
                  bgColor = "bg-emerald-900/40 text-emerald-200 border-emerald-700/50";
                } else if (interaction.includes("원진")) {
                  bgColor = "bg-orange-900/40 text-orange-200 border-orange-700/50";
                }
                return (
                  <span
                    key={idx}
                    className={`px-4 py-2 rounded-lg text-sm border ${bgColor}`}
                  >
                    {interaction}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-amber-200/50 space-y-1">
              <p><span className="text-red-300">충(衝)</span>: 서로 충돌하는 관계로 변화와 갈등을 의미</p>
              <p><span className="text-emerald-300">합(合)</span>: 서로 조화로운 관계로 협력과 결합을 의미</p>
              <p><span className="text-orange-300">원진(怨嗔)</span>: 서로 꺼리는 관계로 불화와 멀어짐을 의미</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 일간 정보 */}
      <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-amber-100">일간 (日干) - 나의 본성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="inline-block bg-amber-800/40 rounded-xl px-8 py-4 border border-amber-700/50">
              <div className="text-3xl font-bold text-amber-100">{result.ilGan}</div>
            </div>
            <p className="text-amber-200/60 mt-3 text-sm">
              일간은 사주에서 자신을 나타내는 핵심 요소입니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 오행 분석 */}
      <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-amber-100">오행 분석 (五行分析)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {result.fiveElementsAnalysis.split("|")[0].split(",").map((item) => {
              const [element, count] = item.trim().split(":");
              const elementName = element.split("(")[0];
              const hanja = element.match(/\(([^)]+)\)/)?.[1];
              const colors: Record<string, string> = {
                "목": "bg-green-900/50 border-green-700/50 text-green-200",
                "화": "bg-red-900/50 border-red-700/50 text-red-200",
                "토": "bg-yellow-900/50 border-yellow-700/50 text-yellow-200",
                "금": "bg-gray-600/50 border-gray-500/50 text-gray-200",
                "수": "bg-blue-900/50 border-blue-700/50 text-blue-200",
              };
              return (
                <div
                  key={elementName}
                  className={`rounded-lg p-3 text-center border ${colors[elementName] || "bg-amber-900/30"}`}
                >
                  <div className="text-2xl font-bold">{hanja}</div>
                  <div className="text-sm">{elementName}</div>
                  <div className="text-lg font-semibold mt-1">{count?.trim()}</div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-amber-200/70 text-sm">
            {result.fiveElementsAnalysis.split("|")[1]?.trim()}
          </div>
        </CardContent>
      </Card>

      {/* 십성 분석 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100">보유 십성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.tenGodsPresent.split(",").map((god) => (
                <span
                  key={god}
                  className="px-3 py-1 bg-emerald-900/40 text-emerald-200 rounded-full text-sm border border-emerald-700/50"
                >
                  {god.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100">결여 십성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.tenGodsMissing.split(",").map((god) => (
                <span
                  key={god}
                  className="px-3 py-1 bg-rose-900/40 text-rose-200 rounded-full text-sm border border-rose-700/50"
                >
                  {god.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 신살 분석 */}
      <Card className="border-amber-900/30 bg-amber-950/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-amber-100">신살 (神煞)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.sinsal.split(",").map((sal) => (
              <span
                key={sal}
                className="px-4 py-2 bg-purple-900/40 text-purple-200 rounded-lg text-sm border border-purple-700/50"
              >
                {sal.trim()}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
