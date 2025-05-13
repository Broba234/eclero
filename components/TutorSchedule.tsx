"use client";

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import clsx from "clsx";
import { motion } from "framer-motion";

type View = "month" | "day";
type Slots = Record<string, number[]>; // e.g. { "2025-05-10": [9,10,14] }

// Monday‑first order to align with Monday‑based calendar calculation
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

/* date helpers */
const toISO = (d: Date) => d.toISOString().split("T")[0];           // 2025-05-10
const addDays = (d: Date, i: number) => new Date(d.getTime()+i*864e5);
const getMonthMatrix = (year: number, m: number) => {
  const first = new Date(year, m, 1);
  const start = new Date(first);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7); // Adjust to the start of the week
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
  );
};

const isPastDate = (d: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);          // normalize to midnight
  return d < today;
};

const rangesEqual = (a: [number, number][], b: [number, number][]) =>
  JSON.stringify(a) === JSON.stringify(b);

export default function TutorSchedule() {
  // Remove setView, use constant
  const view: View = "month";
  const [current, setCurrent]   = useState<Date>(new Date());       // anchor date
  const [slots, setSlots]       = useState<Slots>({});
  const drag = useRef(false);

  // Add refs & state for multi‑day drag
  const weekGridRef = useRef<HTMLDivElement>(null);
  const [dragStartDay, setDragStartDay] = useState<number | null>(null);

  // Add state for slider values
  const [startValue, setStartValue] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [resizing, setResizing] = useState<{ iso: string; index: number; edge: "start" | "end" } | null>(null);

  // Remove selectedDay state & related logic

  const [rangesByDate, setRangesByDate] = useState<Record<string, [number, number][]>>({});
  const [workingRanges, setWorkingRanges] = useState<[number, number][]>([]);
  const [savedFlag, setSavedFlag] = useState(true);        // default "saved"
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // 2. Add isSelecting state for click-and-drag selection
  const [isSelecting, setIsSelecting] = useState<boolean | null>(null); // true=adding, false=removing

  // hover-state for week view availability slot
  const [hoverSlot, setHoverSlot] = useState<{ iso: string; idx: number } | null>(null);
  const currentISO = toISO(current);

  const trackRef = useRef<HTMLDivElement>(null);
const TOTAL_STEPS = 96; // 96 × 15‑minute intervals in 24 h
const HEADER_H = 0; // no internal column header

const QUARTER_H = 12;               // px per 15‑minute row
const HOUR_H    = QUARTER_H * 4;    // 48px per hour
const TOTAL_HEIGHT = 24 * HOUR_H;   // full ruler height in px (1152)

const noOverlap = (ranges: [number, number][], test: [number, number], skipLast = false) =>
  ranges.slice(0, skipLast ? -1 : undefined).every(([s,e]) => test[1] <= s || test[0] >= e);
  const snapToQuarter = (pct: number) =>
    Math.round(pct * TOTAL_STEPS) / TOTAL_STEPS;

  // ───────── Upcoming card state ─────────
  const [upView, setUpView] = useState<"week" | "month">("week");
  const getMonday = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
  const [upStart, setUpStart] = useState<Date>(getMonday(new Date()));

  const nextWeek  = () => setUpStart(addDays(upStart, 7));
  const prevWeek  = () => setUpStart(addDays(upStart, -7));
  const upNextMonth = () => setUpStart(new Date(upStart.getFullYear(), upStart.getMonth() + 1, 1));
  const upPrevMonth = () => setUpStart(new Date(upStart.getFullYear(), upStart.getMonth() - 1, 1));

  const getWeekDates = (monday: Date) =>
    Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  /* ───────── drill helpers ───────── */
  // Remove goMonth/goDay, just prev/next month
  const prevMonth = () => {
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    if (newDate >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      setCurrent(newDate);
    }
  };

  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  // (Removed unused slot toggling logic for week/day views)

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  // 1. **State for drag context**
  const [dragDayIso, setDragDayIso] = useState<string | null>(null);
  const [dragStartPct, setDragStartPct] = useState<number | null>(null);
  const [dragCreated, setDragCreated] = useState(false);

  // 2. **Per‑day pointer handlers**
  const startDrag = (e: React.PointerEvent, iso: string, col: HTMLDivElement) => {
    const rect = col.getBoundingClientRect();
    const y    = e.clientY - rect.top - HEADER_H;
    if (y < 0) return;                                   // above ruler
    const pct  = snapToQuarter(clamp(y / (rect.height - HEADER_H), 0, 1));
    if (!noOverlap(rangesByDate[iso] ?? [], [pct, pct])) return;
    setDragDayIso(iso);
    setDragStartPct(pct);
    setDragCreated(false);
    setDragging(true);
  };

  const moveDrag = (e: React.PointerEvent, iso: string, col: HTMLDivElement) => {
    if (!dragging || dragDayIso !== iso || dragStartPct === null) return;
    const rect = col.getBoundingClientRect();
    const y    = e.clientY - rect.top - HEADER_H;
    const pct  = snapToQuarter(clamp(y / (rect.height - HEADER_H), 0, 1));

    setRangesByDate(prev => {
      let arr = [...(prev[iso] ?? [])];

      // create on first meaningful move
      if (!dragCreated && Math.abs(pct - dragStartPct) >= 1 / TOTAL_STEPS) {
        const initial: [number, number] =
          dragStartPct < pct ? [dragStartPct, pct] : [pct, dragStartPct];
        if (!noOverlap(arr, initial)) {
          return prev; // overlap: do nothing
        }
        arr = [...arr, initial];
        setDragCreated(true);
      } else if (dragCreated) {
        // update last range
        const newRange: [number, number] =
          dragStartPct < pct ? [dragStartPct, pct] : [pct, dragStartPct];
        if (!noOverlap(arr, newRange, true)) return prev;
        arr[arr.length - 1] = newRange;
      }
      return { ...prev, [iso]: arr };
    });
  };

  const endDrag = () => {
    if (dragging && dragDayIso && dragStartPct !== null && dragCreated) {
      setRangesByDate(prev => {
        const arr = [...(prev[dragDayIso] ?? [])];
        if (arr.length && Math.abs(arr[arr.length - 1][1] - arr[arr.length - 1][0]) < 1 / TOTAL_STEPS) {
          arr.pop(); // remove zero-length slot
        }
        return { ...prev, [dragDayIso]: arr };
      });
    }
    setDragging(false);
    setDragDayIso(null);
    setDragStartPct(null);
    setDragCreated(false);
  };

  // Attach global pointer‑up:
  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    return () => window.removeEventListener("pointerup", endDrag);
  }, []);

  // Remove old handlers: handlePointerDown, handlePointerMove, handlePointerUp (obsolete)

  const handleResizeDown = (iso: string, idx: number, edge: "start" | "end") => (e: React.PointerEvent) => {
    e.stopPropagation();
    setResizing({ iso, index: idx, edge });
    setDragging(true);
  };

  // Stub for resize move (activates when user drags after handleResizeDown)
  const handleResizeMove = (e: React.PointerEvent) => {
    if (!dragging || !resizing) return;
    const { iso, index, edge } = resizing;
    // find the correct column
    const col = weekGridRef.current?.querySelector(`[data-iso="${iso}"]`) as HTMLElement;
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pct = snapToQuarter(clamp(y / rect.height, 0, 1));

    setRangesByDate(prev => {
      const arr = [...(prev[iso] ?? [])] as [number, number][];
      const [s, eEnd] = arr[index];
      let newRange: [number, number];
      if (edge === "start") {
        newRange = [Math.min(pct, eEnd - 1 / TOTAL_STEPS), eEnd];
      } else {
        newRange = [s, Math.max(pct, s + 1 / TOTAL_STEPS)];
      }
      // prevent overlapping
      const overlap = arr.some((r, i) => i !== index && newRange[0] < r[1] && newRange[1] > r[0]);
      if (overlap) return prev;
      arr[index] = newRange;
      return { ...prev, [iso]: arr };
    });
  };

  // Stub for resize up (ends resizing)
  const handleResizeUp = (e?: any) => {
    setResizing(null);
    setDragging(false);
  };

  // Listen for global pointermove/up when resizing
  useEffect(() => {
    if (!resizing) return;
    window.addEventListener("pointermove", handleResizeMove as any);
    window.addEventListener("pointerup", handleResizeUp as any);
    return () => {
      window.removeEventListener("pointermove", handleResizeMove as any);
      window.removeEventListener("pointerup", handleResizeUp as any);
    };
  }, [resizing]);

  const pctToTime = (pct:number) => {
    const totalMinutes = Math.round(pct * 24 * 60);
    const h = Math.floor(totalMinutes / 60).toString().padStart(2,"0");
    const m = (totalMinutes % 60).toString().padStart(2,"0");
    return `${h}:${m}`;
  };

  // ───────── Upcoming Week helper (Monday‑Sunday) ─────────
  const getUpcomingWeekDates = () => {
    const today = new Date();
    const monday = addDays(today, -((today.getDay() + 6) % 7)); // back to Monday
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  };

  const saveAvailability = () => {
    if (savedFlag || !selectedDays.length) return;
    setRangesByDate(prev => {
      const next = { ...prev };
      selectedDays.forEach(day => { next[day] = workingRanges; });
      return next;
    });
    setSavedFlag(true);
    setSelectedDays([]);
  };

  // Remove view logic, just update workingRanges for single/multi select
  useEffect(() => {
    if (selectedDays.length === 1) {
      setWorkingRanges(rangesByDate[selectedDays[0]] ?? []);
    }
    if (selectedDays.length > 1) {
      setWorkingRanges([]);
    }
  }, [selectedDays, rangesByDate]);

  useEffect(() => {
    if (selectedDays.length > 0) {
      setSavedFlag(
        rangesEqual(
          workingRanges,
          rangesByDate[selectedDays[0]] ?? []
        )
      );
    } else {
      setSavedFlag(true);
    }
  }, [workingRanges, rangesByDate, selectedDays]);

  // 2. Global pointerup to end selection
  useEffect(() => {
    const endSelect = () => setIsSelecting(null);
    window.addEventListener("pointerup", endSelect);
    return () => window.removeEventListener("pointerup", endSelect);
  }, []);

  // Auto-save availability to Supabase whenever rangesByDate changes
  useEffect(() => {
    const save = async () => {
      // Get current user session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return;
      const user = session.user;
      if (!user) return;
      // Format availability: [{ day: "2025-05-10", slots: [[0.375,0.5], ...] }, ...]
      const availability = Object.entries(rangesByDate).map(([day, ranges]) => ({
        day,
        slots: ranges,
      }));
      const { error: updateError } = await supabase
        .from("users")
        .update({ availability })
        .eq("id", user.id);
      if (updateError) console.error("Auto-save error:", updateError);
    };
    save();
  }, [rangesByDate]);

  /* ───────── UI blocks ───────── */
  return (
    <div className="space-y-10">
      {/* ───────── Upcoming overview ───────── */}
      <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
        {/* TAB BAR */}
        <div className="flex gap-4 border-b pb-2">
          {["Week", "Month"].map(label => (
            <button
              key={label}
              onClick={() => setUpView(label.toLowerCase() as "week" | "month")}
              className={clsx(
                "px-2 pb-1 font-semibold",
                upView === label.toLowerCase()
                  ? "border-b-2 border-blue-600 text-black"
                  : "text-black hover:text-blue-600"
              )}
            >
              {label}
            </button>
          ))}

          {/* quick jump to Today */}
          <button
            onClick={() => { setUpView("week"); setUpStart(getMonday(new Date())); }}
            className="ml-auto text-sm text-black hover:text-blue-600"
          >
            Today
          </button>
        </div>

        {/* NAV BAR */}
        <div className="flex items-center justify-between">
          <button
            className="px-2 py-1 bg-white border border-black text-black hover:bg-gray-100"
            onClick={() => upView === "week" ? prevWeek() : upPrevMonth()}
          >←</button>

          <h3 className="text-lg font-bold text-black">
            {upView === "week"
              ? (() => {
                  const weekEnd = addDays(upStart, 6);
                  return `${upStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
                })()
              : upStart.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h3>

          <button
            className="px-2 py-1 bg-white border border-black text-black hover:bg-gray-100"
            onClick={() => upView === "week" ? nextWeek() : upNextMonth()}
          >→</button>
        </div>

        {/* CONTENT */}
        {upView === "week" ? (
          /* ------- WEEK VIEW (vertical timeline) ------- */
          <>
            {/* week header row */}
            <div className="grid grid-cols-8 gap-2 mb-1">
              <div></div> {/* empty for hour axis */}
              {getWeekDates(upStart).map(d => (
                <div key={d.toISOString()} className="text-center font-semibold text-black">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}<br/>
                  {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              ))}
            </div>
            <div
              ref={weekGridRef}
              className="grid grid-cols-8 gap-2"
            >
              {/* hour axis */}
              <div className="flex flex-col">
                {Array.from({ length: 25 }).map((_, h) => (
                  <div key={h} style={{ height: `${HOUR_H}px` }} className="text-[12px] text-right pr-1 text-black">
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* day columns */}
              {getWeekDates(upStart).map((d, dayIndex) => {
                const iso = toISO(d);
                const dayAv = rangesByDate[iso] ?? [];
                return (
                  <div
                    key={iso}
                    data-iso={iso}
                    className="relative border rounded bg-blue-50 select-none"
                    onPointerDown={e => startDrag(e, iso, e.currentTarget)}
                    onPointerMove={e => moveDrag(e, iso, e.currentTarget)}
                  >
                    {/* 15‑minute grid lines */}
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-x-0 border-t border-blue-100"
                        style={{ top: `${i * QUARTER_H}px`, zIndex: 0 }}
                      />
                    ))}

                    {/* availability bars */}
                    {dayAv.map(([s, e], idx) => {
                      const isHover = hoverSlot?.iso === iso && hoverSlot.idx === idx;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoverSlot({ iso, idx })}
                          onMouseLeave={() => setHoverSlot(null)}
                          onPointerDown={(e) => {
                            // detect vertical edge drag (top/bottom)
                            const box = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - box.top;
                            const h = box.height;
                            if (y < 8) {
                              handleResizeDown(iso, idx, "start")(e);
                            } else if (y > h - 8) {
                              handleResizeDown(iso, idx, "end")(e);
                            }
                          }}
                          className={clsx(
                            "absolute left-1 right-1 bg-blue-300 rounded text-[10px] text-black flex items-center justify-center transition-all hover:cursor-ns-resize",
                            isHover ? "border-2 border-white" : "border border-white"
                          )}
                          style={{
                            top: `${s * TOTAL_HEIGHT}px`,
                            height: `${Math.max((e - s), 1 / TOTAL_STEPS) * TOTAL_HEIGHT}px`,
                            zIndex: 2
                          }}
                        >
                          {pctToTime(s)} – {pctToTime(e)}

                          {/* delete button */}
                          {isHover && (
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setRangesByDate(prev => {
                                  const arr = [...(prev[iso] ?? [])];
                                  arr.splice(idx, 1);
                                  return { ...prev, [iso]: arr };
                                });
                                setHoverSlot(null);
                              }}
                              className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-600 text-white text-[10px] leading-4"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* ------- MONTH VIEW (select week) ------- */
          <div className="grid grid-cols-1 gap-2">
            {getMonthMatrix(upStart.getFullYear(), upStart.getMonth()).map((week, wi) => {
              const weekStart = getMonday(week[0]);
              const weekEnd   = addDays(weekStart, 6);
              return (
                <button
                  key={wi}
                  className="w-full text-left p-3 border rounded hover:bg-blue-50 text-black"
                  onClick={() => { setUpView("week"); setUpStart(weekStart); }}
                >
                  <span className="font-medium text-black">
                    {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {" – "}
                  <span className="font-medium text-black">
                    {weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}