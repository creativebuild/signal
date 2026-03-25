"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showWeekNumber,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(defaultClassNames.root),
        months: cn("calendar-months", defaultClassNames.months),
        month: cn("calendar-month", defaultClassNames.month),
        nav: cn("calendar-nav", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "calendar-nav-btn",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "calendar-nav-btn",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "calendar-month-caption",
          defaultClassNames.month_caption
        ),
        dropdowns: cn("calendar-dropdowns", defaultClassNames.dropdowns),
        dropdown_root: cn(
          "calendar-dropdown-root",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("calendar-dropdown", defaultClassNames.dropdown),
        caption_label: cn(
          "calendar-caption-label",
          captionLayout === "label"
            ? "calendar-caption-label--label"
            : "calendar-caption-label--dropdown",
          defaultClassNames.caption_label
        ),
        weekdays: cn("calendar-weekdays", defaultClassNames.weekdays),
        weekday: cn("calendar-weekday", defaultClassNames.weekday),
        week: cn("calendar-week", defaultClassNames.week),
        week_number_header: cn(
          "calendar-week-number-header",
          defaultClassNames.week_number_header
        ),
        week_number: cn("calendar-week-number", defaultClassNames.week_number),
        day: cn("calendar-day", defaultClassNames.day),
        range_start: cn("calendar-range-start", defaultClassNames.range_start),
        range_middle: cn(
          "calendar-range-middle",
          defaultClassNames.range_middle
        ),
        range_end: cn("calendar-range-end", defaultClassNames.range_end),
        today: cn("calendar-today", defaultClassNames.today),
        outside: cn("calendar-outside", defaultClassNames.outside),
        disabled: cn("calendar-disabled", defaultClassNames.disabled),
        hidden: cn("calendar-hidden", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              data-week-numbers={showWeekNumber ? "true" : undefined}
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("calendar-chevron", className)}
                {...props}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("calendar-chevron", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn("calendar-chevron", className)}
              {...props}
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="calendar-week-number-inner">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn("calendar-day-button", defaultClassNames.day, className)}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
