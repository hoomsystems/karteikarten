"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date = new Date(), setDate }: DatePickerProps) {
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = React.useState<number>(date.getMonth())
  const [selectedYear, setSelectedYear] = React.useState<number>(date.getFullYear())

  // Generar años desde hace 100 años hasta el año actual
  const startYear = currentYear - 100
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  )

  // Nombres de los meses en español
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value))
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3 border-b">
          <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={new Date(selectedYear, selectedMonth)}
          onMonthChange={(date) => {
            setSelectedMonth(date.getMonth())
            setSelectedYear(date.getFullYear())
          }}
          initialFocus
          locale={es}
          fromYear={startYear}
          toYear={currentYear}
          classNames={{
            nav_button: "hidden",
            head_cell: "font-normal whitespace-nowrap",
            table: "w-full border-collapse",
            cell: "text-center p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            day_today: "bg-orange-100 text-orange-900 font-semibold",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            row: "flex w-full mt-2",
          }}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  )
} 