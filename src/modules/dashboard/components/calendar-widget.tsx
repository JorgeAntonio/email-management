"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-[#1A1A1A]">
            febrero 2026
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
          className="border-0 shadow-none w-full"
          tileClassName={({ date: tileDate }) => {
            const day = tileDate.getDate();
            if (day === 16) {
              return "bg-[#00D26A] text-white rounded-full";
            }
            return "";
          }}
        />
      </CardContent>
    </Card>
  );
}
