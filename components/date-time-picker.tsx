"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (date) {
      const [hours, minutes] = e.target.value.split(":")
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours))
      newDate.setMinutes(parseInt(minutes))
      setDate(newDate)
    }
  }

  return (
    <div className="grid gap-2">
      <DatePicker
        date={date}
        setDate={setDate}
      />
      <div className="grid gap-2">
        <Label htmlFor="time">Hora</Label>
        <Input
          id="time"
          type="time"
          value={date ? format(date, "HH:mm") : ""}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  )
} 