import { TObjective, v5Requirement } from "@/app/lib/interfaces";
import { PencilSquareIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import ParseTime from "@/app/lib/parse-time";

export default function v5ObjectiveDisplay({ objectives, req, onEdit, onComplete, highlighted }: { objectives: Array<TObjective[]>, req: v5Requirement[], onEdit: (id: number, group: number) => void, onComplete: (id: number, group: number) => void, highlighted: number[] }) {
    // const active = objectives.filter(obj => obj.time === 0);
    // const complete = objectives.filter(obj => !!obj.time && obj.time > 0);
    // const goMode = complete.length >= req;
    const groups = ["A", "B", "C", "D", "E"];

    function displayReqs(req:v5Requirement) {
        const result = [];
        for (const [key, val] of Object.entries(req)) {
            result.push(<p className="m-1 text-xs" key={key + val}>{key}:{val}</p>)
        }
        return result;
    }

    return (
        <div className="flex flex-col z-10 relative pt-5">
            <div className="flex justify-between">
                <p className="font-bold text-lg">Objectives</p>
                {/* <p className="font-bold font-[family-name:var(--font-geist-mono)]">Required: {req}</p> */}
            </div>
            {objectives.map((obj, index) => {
                const active = obj.filter(obj => obj.time === 0);
                const complete = obj.filter(obj => !!obj.time && obj.time > 0);
                return (
                    <div key={`obj-group-${groups[index]}`}>
                        <div className={`flex justify-between ${Object.keys(req[index]).length > 3 ? 'flex-col' : ''}`}>
                            <p className="font-bold text-yellow-300">Group {groups[index]}</p>
                            <div className="flex font-bold text-xs font-[family-name:var(--font-geist-mono)]">
                                {displayReqs(req[index])}
                            </div>
                        </div>
                        
                        {active.map(obj => {
                            return (
                                <div key={obj.label} className={`flex items-center hover:bg-slate-800 ml-3 ${highlighted[0] === index && highlighted[1] === obj.id ? "highlighted" : ""}`}>
                                    <p className="mr-3 font-semibold">{obj.label}</p>
                                    {obj.random && <button onClick={() => onEdit(obj.id, index)}><p className="invisible w-0 h-0">Edit Objective {obj.id}</p><PencilSquareIcon className="size-6 text-yellow-400" /></button>}
                                    <button onClick={() => onComplete(obj.id, index)}><p className="invisible w-0 h-0">Complete Objective {obj.id}</p><CheckCircleIcon className="size-6 text-green-400" /></button>
                                    {/* {(goMode && obj.label.indexOf('Zeromus') < 0) && <p className="ml-3 text-sm bg-yellow-600 pr-2 pl-2 font-bold text-black">Not required</p>} */}
                                </div>
                            );
                        })}
                        {complete.length > 0 && <div className="border"></div>}
                        {complete.map(obj => {
                            if (!!obj.time) return (
                                <div key={obj.label} className="flex justify-between items-center">
                                    <div className="flex items-center hover:bg-slate-800">
                                        <p className="mr-3">{obj.label}</p>
                                        {obj.random && <button onClick={() => onEdit(obj.id, index)}><PencilSquareIcon className="size-6 text-yellow-400" /></button>}
                                        <button onClick={() => onComplete(obj.id, index)}><p className="invisible w-0 h-0">Undo Objective {obj.id}</p><XCircleIcon className="size-6 text-red-400" /></button>
                                    </div>
                                    {obj.time > 1 ? <p className="bg-slate-300 text-black w-20 text-center font-bold font-[family-name:var(--font-geist-mono)] text-xs ">{ParseTime(obj.time)}</p> : null}
                                    
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}