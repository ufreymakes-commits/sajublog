import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateSaju } from "@/lib/saju/calculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthCountry } = body;

    // 입력 검증
    if (!name || !email || !birthDate || !birthCountry) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 사주 계산
    const sajuResult = calculateSaju({
      name,
      email,
      birthDate,
      birthTime: birthTime || "모름",
      birthCountry,
    });

    // 데이터베이스에 저장
    const { data, error } = await supabase
      .from("saju_readings")
      .insert({
        name,
        email,
        birth_date: birthDate,
        birth_time: birthTime || "모름",
        birth_country: birthCountry,
        year_pillar: sajuResult.yearPillar,
        month_pillar: sajuResult.monthPillar,
        day_pillar: sajuResult.dayPillar,
        hour_pillar: sajuResult.hourPillar,
        five_elements_analysis: sajuResult.fiveElementsAnalysis,
        sinsal: sajuResult.sinsal,
        il_gan: sajuResult.ilGan,
        ten_gods_present: sajuResult.tenGodsPresent,
        ten_gods_missing: sajuResult.tenGodsMissing,
        pillars_data: JSON.stringify(sajuResult.pillars),
        interactions_data: JSON.stringify(sajuResult.interactions),
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "데이터 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      readingId: data.id,
      message: "사주 정보가 저장되었습니다. 결제를 진행해주세요.",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 결제 완료 후 사주 결과 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const readingId = searchParams.get("id");

    if (!readingId) {
      return NextResponse.json(
        { error: "조회 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("saju_readings")
      .select("*")
      .eq("id", readingId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "사주 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 결제 완료된 경우만 결과 반환
    if (data.payment_status !== "completed") {
      return NextResponse.json(
        { error: "결제가 완료되지 않았습니다.", needsPayment: true, readingId: data.id },
        { status: 402 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        name: data.name,
        yearPillar: data.year_pillar,
        monthPillar: data.month_pillar,
        dayPillar: data.day_pillar,
        hourPillar: data.hour_pillar,
        fiveElementsAnalysis: data.five_elements_analysis,
        sinsal: data.sinsal,
        ilGan: data.il_gan,
        tenGodsPresent: data.ten_gods_present,
        tenGodsMissing: data.ten_gods_missing,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
