'use client'

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react";
import KIDisplay from "../ui/ki/ki-display";
import BossDisplay from "@/app/ui/bosses/boss-display";
import ObjectiveDisplay from "@/app/ui/objectives/obj-display";
import V5ObjectiveDisplay from "@/app/ui/objectives/obj-display-v5";
import LocationDisplay from "@/app/ui/locations/location-display";
import TimerDisplay from "@/app/ui/timer/timer-display";
import ObjectiveEditor from "@/app/ui/right-panel/objective-editor";
import Info from "@/app/ui/right-panel/info";
import { defaultKI, bosses, locations } from "@/app/lib/default-data";
import parseFlags from "../lib/parse-flags";
import initLocations from "../lib/init-locations";
import { FlagObject, KeyItems, Boss, Location } from "../lib/interfaces";
import { toggleKI, toggleBoss, isAvailable, clearLocation } from "../lib/controls/toggler";
import { beginTimer, endTimer, resetTimer } from "../lib/controls/time-controls";
import { beginObjectiveEdit, beginv5ObjectiveEdit ,editObjective, editV5Objective, completeObjective, completeV5Objective } from "../lib/controls/objective-controle";
import TimeControlsDisplay from "@/app/ui/timer/timer-controls-display";
import { getPropertySection } from "../lib/parse-flag-section";

export default function Page() {

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams)

    const flags = params.get("flags");
    const bgColor = params.get("bgColor");
    const color:string = bgColor !== null ? bgColor : "black";
    const assuredFlags:string = flags ? flags : "";
    const parsedObjectives:FlagObject = parseFlags(assuredFlags);

    enum Mode {
        Info,
        ObjectiveEdit
    }

    const Kflags = getPropertySection(assuredFlags, 'K');
    const isMiab = Kflags.indexOf('miab') >= 0;
    const isChar = Kflags.indexOf('char') >= 0;
    const Kforge = Kflags.indexOf('forge') >= 0;

    const Cflags = getPropertySection(assuredFlags, 'C');
    const noGiant = Cflags.indexOf('nogiant') >= 0;
    const Cnofree = Cflags.indexOf('nofree') >= 0;
    const Cwishes = Cflags.indexOf('wishes') >= 0;

    const [objectives, setObjectives] = useState(parsedObjectives.objectives);
    const [v5objectives, setv5Objectives] = useState(parsedObjectives.v5Objectives);
    const [objectiveEdit, setObjEdit] = useState(-1);
    const [groupEdit, setGroupEdit] = useState(-1);
    const [mode, setMode] = useState<Mode>(Mode.Info);
    const [ki, setKI] = useState<KeyItems>(defaultKI);
    const [bossList, setBossList] = useState<Boss[]>(bosses);
    const [locationList, setLocationList] = useState(initLocations(Kflags, locations));
    const [timer, setTimer] = useState({
        startTime: 0,
        currentTime: 0,
        pauseTime: 0,
        isActive: false,
    });

    let objectiveCount = 0;
    v5objectives.forEach(objSet => objectiveCount += objSet.length);
    const isV5:boolean = assuredFlags.indexOf("OA") >= 0;

    const currentTimer = useRef<ReturnType<typeof setInterval>>();
    useEffect(() => {
        const current = currentTimer.current;
        return () => clearInterval(current);
    }, []);

    // adjust locations for every KI change
    useEffect(() => {
        const newLocList:Location[] = [];
        locationList.forEach(loc => {
            const newLoc:Location = {
                ...loc,
                available: isAvailable(loc, ki, assuredFlags)
            };
            newLocList.push(newLoc)
        })
        setLocationList(newLocList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ki, assuredFlags])
    
    return (
        <div className="flex" style={{ backgroundColor: color }}>
            <div className="w-120 border-2 border-double h-screen flex flex-col justify-between font-[family-name:var(--font-geist-sans)] p-1">
                <div>
                    <div className="flex">
                        <div className="layout-ki"><KIDisplay ki={ki} toggleKI={(target: string) => toggleKI(target, setKI)} isV5={isV5}/></div>
                        <div className="layout-bosses"><BossDisplay bosses={bossList} toggleBoss={(id: number, val: boolean) => toggleBoss(id, val, setBossList, bossList)} /></div>
                    </div>
                    <div className="mb-3">
                        {
                            parsedObjectives.isV5 ? 
                            <V5ObjectiveDisplay
                                objectives={v5objectives}
                                req={parsedObjectives.v5Required}
                                onEdit={(id:number, group:number) => beginv5ObjectiveEdit(id, group, setObjEdit, setMode, setGroupEdit)}
                                onComplete = {(id:number, group:number) => completeV5Objective(id, group, v5objectives, setv5Objectives, timer)}
                                highlighted={[groupEdit, objectiveEdit]}
                            /> : 
                            <ObjectiveDisplay
                                objectives={objectives}
                                req={parsedObjectives.required}
                                onEdit={(id:number) => beginObjectiveEdit(id, setObjEdit, setMode)}
                                onComplete = {(id:number) => completeObjective(id, objectives, setObjectives, timer)}
                            />
                        }
                    </div>
                    <div>
                            
                        {objectiveCount < 10 ? <LocationDisplay 
                            locations={locationList}
                            onSelect={(id: number) => clearLocation(id, locationList, setLocationList)}
                            isMiab={isMiab}
                            isChar={isChar}
                            noGiant={noGiant}
                            Cnofree={Cnofree}
                            Cwishes={Cwishes}
                            Kforge={Kforge}
                        /> : null}
                    </div>
                </div>
                <div>
                    <TimerDisplay 
                        currentTime={timer.currentTime}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between w-1/2">
                <div className="font-[family-name:var(--font-geist-sans)]">
                    {mode === Mode.Info && <Info flags={assuredFlags} />}
                    {mode === Mode.ObjectiveEdit && <ObjectiveEditor 
                        id={objectiveEdit}
                        group={groupEdit}
                        objLen={objectives.length}
                        onSelect={(id: number, title:string, group: number) => 
                        {
                            if (v5objectives.length && group >= 0) {
                                editV5Objective(id, group, title, v5objectives, setv5Objectives, setObjEdit, setMode, setGroupEdit)    
                            }
                            editObjective(id, title, objectives, setObjectives, setObjEdit, setMode)
                        }}
                        isDone={() => setMode(Mode.Info)} 
                        />}
                </div>
                < TimeControlsDisplay 
                    isActive={timer.isActive}
                    startTimer={() => beginTimer(timer, setTimer, currentTimer)}
                    stopTimer={() => endTimer(timer, setTimer, currentTimer)}
                    resetTimer={() => resetTimer(setTimer)}
                />
            </div>
            
        </div>
    )
}