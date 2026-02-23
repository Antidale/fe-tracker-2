'use client';

import { entrySubmit } from "@/app/lib/actions";
import presets from '@/app/lib/presets';
import { useState } from "react";

export default function Form() {

  const [flags, setFlags] = useState("")

  
  return (
    <>
      <form action={entrySubmit} className="w-full">
        <div className="flex flex-col m-5 w-full items-center">
          <label htmlFor="flags">Flags</label>
          <textarea 
            id="flags"
            name="flags"
            value={flags}
            onChange={(e => setFlags(e.target.value))}
            rows={6} 
            className="min-w-96 w-3/4 text-slate-950"
          ></textarea>
        </div>
        <div className="flex flex-col m-5 w-full items-center">
          <label>Background Color</label>
          <input
            id="bg-color"
            name="bg-color"
            className="text-slate-950"
          ></input>
        </div>
        <div className="flex justify-center m-5 w-full">
          <button type="submit" className="bg-slate-700 p-3 rounded hover:bg-slate-600">Go!</button>
        </div>
      </form>
      <div className="flex flex-col">
        <h2 className="text-center text-2xl text-bold m-5">Presets</h2>
        {presets.map(group => {
          return (
            <div className="flex"  key={`preset-group-${group.groupTitle}`}>
              <div className="bg-blue-800 w-32 p-3">
                <p className="font-bold">{group.groupTitle}</p>
              </div>
              
              {group.flags.map((preset, index) => {
                return (
                  <button
                    key={`preset-${group.groupTitle}-${preset.title}`}
                    onClick={() => setFlags(preset.flags)}
                    className={`bg-slate-${index % 2 > 0 ? "700" : "800"} p-2 hover:bg-slate-400`}
                  >
                    {preset.title}
                  </button>
                );
              })}
            </div>
          );
        })}
        <p className="m-5 text-center">Warning: Megaflare Rally has objective groups D and E removed in order to fit on the display.</p>
      </div>
    </>
  )
}

