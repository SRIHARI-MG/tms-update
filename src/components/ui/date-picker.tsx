import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  readOnly?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  readOnly = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            readOnly && "bg-primary/5 text-gray-700 cursor-default"
          )}
          disabled={readOnly}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      {!readOnly && (
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
