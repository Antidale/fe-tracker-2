import { entrySubmit } from "@/app/lib/actions";

export default function Form() {


  return (
    <form action={entrySubmit} className="w-full">
      <div className="flex flex-col m-5 w-full items-center">
        <label htmlFor="flags">Flags</label>
        <textarea
          id="flags"
          name="flags"
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
      <div className="flex flex-col m-5 w-full items-center">
        <label>Autotracking Port</label>
        <input
          id="port"
          name="port"
          className="text-slate-950"
          type="number"
          placeholder="leave blank to not autotrack"
        ></input>
      </div>
      <div className="flex justify-center m-5 w-full">
        <button type="submit" className="bg-slate-700 p-3 rounded hover:bg-slate-600">Go!</button>
      </div>

    </form>
  )
}

