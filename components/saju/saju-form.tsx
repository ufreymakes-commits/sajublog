"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { countryOffsets } from "@/lib/saju/constants";

interface SajuFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthCountry: string;
}

const countries = Object.keys(countryOffsets).sort();

const timeOptions = [
  { value: "모름", label: "모름" },
  { value: "00:00", label: "00:00 - 00:59 (자시)" },
  { value: "01:00", label: "01:00 - 02:59 (축시)" },
  { value: "03:00", label: "03:00 - 04:59 (인시)" },
  { value: "05:00", label: "05:00 - 06:59 (묘시)" },
  { value: "07:00", label: "07:00 - 08:59 (진시)" },
  { value: "09:00", label: "09:00 - 10:59 (사시)" },
  { value: "11:00", label: "11:00 - 12:59 (오시)" },
  { value: "13:00", label: "13:00 - 14:59 (미시)" },
  { value: "15:00", label: "15:00 - 16:59 (신시)" },
  { value: "17:00", label: "17:00 - 18:59 (유시)" },
  { value: "19:00", label: "19:00 - 20:59 (술시)" },
  { value: "21:00", label: "21:00 - 22:59 (해시)" },
  { value: "23:00", label: "23:00 - 23:59 (자시)" },
];

export function SajuForm({ onSubmit, isLoading }: SajuFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    gender: "",
    birthDate: "",
    birthTime: "모름",
    birthCountry: "South Korea",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-[#3d3d5c] bg-[#1a1a2e]/90 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#DBD8FF]">사주 정보 입력</CardTitle>
        <CardDescription className="text-[#a9a6c9]">
          정확한 사주 분석을 위해 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#DBD8FF]">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] placeholder:text-[#a9a6c9]/50 focus:border-[#7366AF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#DBD8FF]">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] placeholder:text-[#a9a6c9]/50 focus:border-[#7366AF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-[#DBD8FF]">성별</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              required
            >
              <SelectTrigger className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] focus:border-[#7366AF]">
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#3d3d5c]">
                <SelectItem
                  value="남성"
                  className="text-[#DBD8FF] focus:bg-[#7366AF]/30 focus:text-[#DBD8FF]"
                >
                  남성
                </SelectItem>
                <SelectItem
                  value="여성"
                  className="text-[#DBD8FF] focus:bg-[#7366AF]/30 focus:text-[#DBD8FF]"
                >
                  여성
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-[#DBD8FF]">생년월일</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
              min="1920-01-01"
              max="2030-12-31"
              className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] focus:border-[#7366AF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime" className="text-[#DBD8FF]">태어난 시간</Label>
            <p className="text-xs text-[#a9a6c9]/70">
              Please use standard time (Exclude DST; Daylight Saving Time)
            </p>
            <Select
              value={formData.birthTime}
              onValueChange={(value) => setFormData({ ...formData, birthTime: value })}
            >
              <SelectTrigger className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] focus:border-[#7366AF]">
                <SelectValue placeholder="시간 선택" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#3d3d5c]">
                {timeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[#DBD8FF] focus:bg-[#7366AF]/30 focus:text-[#DBD8FF]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthCountry" className="text-[#DBD8FF]">태어난 국가/지역</Label>
            <Select
              value={formData.birthCountry}
              onValueChange={(value) => setFormData({ ...formData, birthCountry: value })}
            >
              <SelectTrigger className="bg-[#252538] border-[#3d3d5c] text-[#DBD8FF] focus:border-[#7366AF]">
                <SelectValue placeholder="국가 선택" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#3d3d5c] max-h-60">
                {countries.map((country) => (
                  <SelectItem
                    key={country}
                    value={country}
                    className="text-[#DBD8FF] focus:bg-[#7366AF]/30 focus:text-[#DBD8FF]"
                  >
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7366AF] hover:bg-[#8577c0] text-white font-semibold py-6 text-lg"
          >
            {isLoading ? "처리 중..." : "결제 후 사주 보기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
