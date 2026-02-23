"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PayPalButtonProps {
  amount: string;
  onSuccess: (orderId: string) => void;
  onError: (error: Error) => void;
  readingId: string;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: {
          layout?: string;
          color?: string;
          shape?: string;
          label?: string;
          height?: number;
        };
        createOrder: (
          data: unknown,
          actions: {
            order: {
              create: (order: {
                purchase_units: Array<{
                  amount: { value: string; currency_code: string };
                  description: string;
                  custom_id?: string;
                }>;
              }) => Promise<string>;
            };
          }
        ) => Promise<string>;
        onApprove: (
          data: { orderID: string },
          actions: {
            order: {
              capture: () => Promise<{
                status: string;
                id: string;
              }>;
            };
          }
        ) => Promise<void>;
        onError: (err: Error) => void;
      }) => {
        render: (container: HTMLElement | string) => void;
      };
    };
  }
}

export function PayPalButton({ amount, onSuccess, onError, readingId }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error("PayPal Client ID is not configured");
      return;
    }

    // PayPal SDK 스크립트 로드
    const existingScript = document.getElementById("paypal-sdk");
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => onError(new Error("PayPal SDK 로드 실패"));
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [onError]);

  useEffect(() => {
    if (!isLoaded || !paypalRef.current || isRendered) return;
    if (!window.paypal) return;

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
          height: 50,
        },
        createOrder: async (_data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: "USD",
                },
                description: "사주 팔자 분석 서비스",
                custom_id: readingId,
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          if (details.status === "COMPLETED") {
            onSuccess(details.id);
          }
        },
        onError: (err) => {
          onError(err);
        },
      })
      .render(paypalRef.current);

    setIsRendered(true);
  }, [isLoaded, amount, onSuccess, onError, readingId, isRendered]);

  return (
    <Card className="w-full max-w-lg mx-auto border-amber-900/30 bg-background/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-amber-100">결제하기</CardTitle>
        <CardDescription className="text-amber-200/70">
          사주 분석 서비스 이용료: ${amount} USD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={paypalRef} className="min-h-[150px] flex items-center justify-center">
          {!isLoaded && (
            <div className="text-amber-200/60">PayPal 로딩 중...</div>
          )}
        </div>
        <p className="text-xs text-amber-200/50 mt-4 text-center">
          결제 완료 후 즉시 사주 분석 결과를 확인하실 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
