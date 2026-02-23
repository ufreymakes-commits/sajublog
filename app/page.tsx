"use client";

import { useState } from "react";
import { SajuForm } from "@/components/saju/saju-form";
import { PayPalButton } from "@/components/saju/paypal-button";
import { SajuResultDisplay } from "@/components/saju/saju-result";
import { PremiumReport } from "@/components/saju/premium-report";
import { Button } from "@/components/ui/button";
import type { SajuResult } from "@/lib/saju/calculator";

type Step = "form" | "payment" | "result";

interface FormData {
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthCountry: string;
}

export default function SajuPage() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "오류가 발생했습니다.");
      }

      setFormData(data);
      setReadingId(result.readingId);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/saju/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, paymentId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "결제 확인 중 오류가 발생했습니다.");
      }

      setSajuResult(result.result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // [DEV ONLY] 무료로 결과 보기 - 배포 시 삭제
  const handleFreeView = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/saju/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, paymentId: "FREE_TEST_MODE" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "오류가 발생했습니다.");
      }

      setSajuResult(result.result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (err: Error) => {
    setError(`결제 오류: ${err.message}`);
  };

  const handleReset = () => {
    setStep("form");
    setFormData(null);
    setReadingId(null);
    setSajuResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7366AF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B494F8]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#DBD8FF] mb-4">
            사주 팔자
          </h1>
          <p className="text-[#a9a6c9] text-lg max-w-2xl mx-auto">
            四柱八字 - 당신의 타고난 운명과 기운을 알아보세요
          </p>
          <div className="flex justify-center gap-2 mt-6 text-sm text-[#a9a6c9]/60">
            <span className={step === "form" ? "text-[#F3619C]" : ""}>
              1. 정보 입력
            </span>
            <span>{">"}</span>
            <span className={step === "payment" ? "text-[#F3619C]" : ""}>
              2. 결제
            </span>
            <span>{">"}</span>
            <span className={step === "result" ? "text-[#F3619C]" : ""}>
              3. 결과 확인
            </span>
          </div>
        </header>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-lg mx-auto mb-6 p-4 bg-[#FB4645]/20 border border-[#FB4645]/50 rounded-lg text-[#FB4645] text-center">
            {error}
          </div>
        )}

        {/* 단계별 컨텐츠 */}
        {step === "form" && (
          <SajuForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {step === "payment" && readingId && (
          <div className="space-y-6">
            <PayPalButton
              amount="9.99"
              readingId={readingId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            {/* [DEV ONLY] 무료로 보기 버튼 - 배포 시 삭제 */}
            <div className="text-center border-2 border-dashed border-[#7366AF]/40 rounded-lg p-4 bg-[#7366AF]/10">
              <p className="text-xs text-[#a9a6c9]/70 mb-2">[개발자 테스트용]</p>
              <Button
                onClick={handleFreeView}
                disabled={isLoading}
                className="bg-[#DBFA40] hover:bg-[#c9e83a] text-[#0D0D0D] font-semibold"
              >
                {isLoading ? "로딩 중..." : "무료로 결과 보기"}
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-[#a9a6c9] hover:text-[#DBD8FF]"
              >
                처음으로 돌아가기
              </Button>
            </div>
          </div>
        )}

        {step === "result" && sajuResult && formData && (
          <div className="space-y-8">
            {/* 기본 사주 정보 */}
            <SajuResultDisplay result={sajuResult} name={formData.name} />
            
            {/* AI 프리미엄 레포트 */}
            <PremiumReport
              userName={formData.name}
              sajuResult={sajuResult}
              birthDate={formData.birthDate}
              birthTime={formData.birthTime}
              birthCountry={formData.birthCountry}
              gender={formData.gender}
            />
            
            <div className="text-center">
              <Button
                onClick={handleReset}
                className="bg-[#7366AF] hover:bg-[#8577c0] text-white"
              >
                새로운 사주 보기
              </Button>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <footer className="mt-16 text-center text-[#a9a6c9]/50 text-sm">
          <p>사주 팔자 분석 서비스</p>
          <p className="mt-1">동양 철학에 기반한 운명 분석</p>
        </footer>
      </div>
    </main>
  );
}
