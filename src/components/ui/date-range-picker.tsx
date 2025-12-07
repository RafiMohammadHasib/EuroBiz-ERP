
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "./separator"

type DateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
    onUpdate: (values: { range?: DateRange }) => void,
    initialDateFrom?: Date | string,
    initialDateTo?: Date | string,
    align?: "start" | "center" | "end",
    locale?: string
}

export function DateRangePicker({
    className,
    onUpdate,
    initialDateFrom,
    initialDateTo,
    align = "end",
}: DateRangePickerProps) {

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: initialDateFrom ? new Date(initialDateFrom) : undefined,
        to: initialDateTo ? new Date(initialDateTo) : undefined,
    })

    const handleUpdate = (range: DateRange | undefined) => {
        setDate(range);
        onUpdate({range});
    }

    const handleReset = () => {
        setDate(undefined);
        onUpdate({range: undefined});
    }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleUpdate}
            numberOfMonths={2}
          />
           <Separator />
          <div className="p-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleReset}><X className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
