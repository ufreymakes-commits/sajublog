import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { readingId, paymentId } = body;

    if (!readingId || !paymentId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 결제 상태 업데이트
    const { data, error } = await supabase
      .from("saju_readings")
      .update({
        payment_id: paymentId,
        payment_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", readingId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "결제 정보 업데이트 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // pillars와 interactions 재계산
    const pillars = [
      {
        type: "시주",
        stem: data.hour_pillar?.split(" ")[0]?.charAt(0) || "",
        branch: data.hour_pillar?.split(" ")[0]?.charAt(1) || "",
        stemHanja: data.hour_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(0) || "",
        branchHanja: data.hour_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(1) || "",
        hiddenStems: [],
        unseong: "",
      },
      {
        type: "일주",
        stem: data.day_pillar?.split(" ")[0]?.charAt(0) || "",
        branch: data.day_pillar?.split(" ")[0]?.charAt(1) || "",
        stemHanja: data.day_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(0) || "",
        branchHanja: data.day_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(1) || "",
        hiddenStems: [],
        unseong: "",
      },
      {
        type: "월주",
        stem: data.month_pillar?.split(" ")[0]?.charAt(0) || "",
        branch: data.month_pillar?.split(" ")[0]?.charAt(1) || "",
        stemHanja: data.month_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(0) || "",
        branchHanja: data.month_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(1) || "",
        hiddenStems: [],
        unseong: "",
      },
      {
        type: "연주",
        stem: data.year_pillar?.split(" ")[0]?.charAt(0) || "",
        branch: data.year_pillar?.split(" ")[0]?.charAt(1) || "",
        stemHanja: data.year_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(0) || "",
        branchHanja: data.year_pillar?.match(/\(([^)]+)\)/)?.[1]?.charAt(1) || "",
        hiddenStems: [],
        unseong: "",
      },
    ];

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
        pillars: data.pillars_data ? JSON.parse(data.pillars_data) : pillars,
        interactions: data.interactions_data ? JSON.parse(data.interactions_data) : [],
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
