/* ───────── components/ScheduleFlowPicker.tsx ───────── */
"use client";

import React, { useState, useRef } from "react";
import clsx from "clsx";

type View = "month" | "week" | "day";
type Slots = Record<string, number[]>; // e.g. { "2025-05-10": [9,10,14] }

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* date helpers */
const toISO = (d: Date) => d.toISOString().split("T")[0];           // 2025-05-10
const addDays = (d: Date, i: number) => new Date(d.getTime()+i*864e5);
const getMonthMatrix = (year: number, m: number) => {
  const first = new Date(year, m, 1);
  const start = addDays(first, -first.getDay());                    // Sunday before
  return Array.from({length:6},(_,w)=>                             // 6 weeks grid
    Array.from({length:7},(_,d)=>addDays(start,w*7+d)));
};

export default function ScheduleFlowPicker() {
  const [view, setView]         = useState<View>("week");
  const [current, setCurrent]   = useState<Date>(new Date());       // anchor date
  const [slots, setSlots]       = useState<Slots>({});
  const drag = useRef(false);

  /* ───────── drill helpers ───────── */
  const goMonth = () => setView("month");
  const goWeek  = (d: Date) => { setCurrent(d); setView("week"); };
  const goDay   = (d: Date) => { setCurrent(d); setView("day");  };
  const goBack  = () => setView(view==="day" ? "week" : "month");

  /* ───────── slot toggle for day view ───────── */
  const toggleHour = (h: number) => {
    const key = toISO(current);
    setSlots(prev=>{
      const set = new Set(prev[key]??[]);
      set.has(h) ? set.delete(h) : set.add(h);
      return { ...prev, [key]: Array.from(set).sort((a,b)=>a-b) };
    });
  };

  /* ───────── UI blocks ───────── */
  return (
    <div className="space-y-4">

      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {view==="month" && current.toLocaleString("default",{month:"long",year:"numeric"})}
          {view==="week"  && `Week of ${current.toLocaleDateString()}`}
          {view==="day"   && current.toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})}
        </h2>

        {view!=="month" && (
          <button
            className="text-sm px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={goBack}
          >
            ↖︎ Back
          </button>
        )}
      </div>

      {/* month grid */}
      {view==="month" && (
        <div className="grid grid-cols-7 gap-px bg-gray-300 text-center select-none">
          {days.map(d=>(
            <div key={d} className="bg-white py-1 font-semibold">{d}</div>
          ))}
          {getMonthMatrix(current.getFullYear(),current.getMonth()).flat().map(d=>{
            const iso = toISO(d);
            const has = Boolean(slots[iso]?.length);
            return (
              <div
                key={iso}
                className={clsx(
                  "bg-white h-16 cursor-pointer flex flex-col items-center justify-center",
                  d.getMonth()!==current.getMonth() && "text-gray-400",
                  has && "bg-blue-100"
                )}
                onClick={()=>goWeek(d)}
              >
                <span>{d.getDate()}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* week row */}
      {view==="week" && (
        <div className="grid grid-cols-7 gap-px bg-gray-300 select-none">
          {Array.from({length:7}).map((_,i)=>{
            const d = addDays(current,-current.getDay()+i);
            const iso = toISO(d);
            const has = Boolean(slots[iso]?.length);
            return (
              <div
                key={iso}
                className={clsx(
                  "bg-white h-28 p-2 cursor-pointer",
                  has && "bg-blue-100"
                )}
                onClick={()=>goDay(d)}
              >
                <div className="font-semibold">{days[i]}</div>
                <div className="text-sm">{d.getDate()}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* day timeline */}
      {view==="day" && (
        <div className="space-y-px select-none">
          {Array.from({length:24}).map((_,h)=>{
            const active = slots[toISO(current)]?.includes(h);
            return (
              <div
                key={h}
                className={clsx(
                  "h-8 border px-2 flex items-center cursor-pointer",
                  active ? "bg-blue-500/70 text-white" : "bg-white"
                )}
                onMouseDown={()=>{drag.current=true; toggleHour(h);}}
                onMouseUp  ={()=>{drag.current=false;}}
                onMouseEnter={()=>{if(drag.current) toggleHour(h);}}
                onTouchStart={()=>toggleHour(h)}
              >
                {h.toString().padStart(2,"0")}:00
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}