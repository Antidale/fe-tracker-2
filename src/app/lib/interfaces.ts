interface KeyItems {
    crystal: boolean;
    pass: boolean;
    hook: boolean;
    darkness: boolean;
    earth: boolean;
    harp: boolean;
    package: boolean;
    sandruby: boolean;
    baron: boolean;
    magma: boolean;
    tower: boolean;
    luca: boolean;
    adamant: boolean;
    legend: boolean;
    pan: boolean;
    spoon: boolean;
    rat: boolean;
    pink: boolean;

}
// zones: 0 = overworld, 1 = underground, 2 = moon
interface Location {
    id: number;
    title: string;
    type: string;
    zone: number;
    dependencies: string[];
    cleared: boolean;
    available: boolean;
    miab?: number;
}

interface Boss {
    title: string;
    slug: string;
    id: number;
    iconGray?: string;
    iconFile: string;
    toggle: boolean;
}

interface TObjective {
    id: number;
    label: string;
    time?: number;
    random?: boolean;
}

interface FlagObject {
    objectives: TObjective[];
    required: number;
    isV5: boolean;
    v5Objectives: Array<TObjective[]>;
    v5Required: v5Requirement[];
}

interface v5Requirement {
    1?: string;
    2?: string;
    3?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    8?: string;
    9?: string;
    10?: string;
    all?: string;
}

interface v5QuestReward {
    slug: string;
    display: string;
}

interface V5FlagObject {
    objectives: Array<TObjective[]>,
    required: v5Requirement[];
    isV5: boolean;
}

interface Quest {
    slug: string;
    title: string;
    buttonText: string;
}

interface Character {
    slug: string;
    title: string;
    iconActive: string;
}

interface KIObjectives {
    ki: string;
    objectives: string[];
    images: string[];
}

interface Kit {
    flag: string;
    title: string;
}

interface FlagBadge {
    title: string;
    type: string;
    key: string;
}

interface TimerState {
    startTime: number;
    currentTime: number;
    pauseTime: number;
    isActive: boolean;
}

interface SeedMetadata {
    version: string,
    flags: string,
    seed: string,
    objectives: string[]
}

export type { KeyItems, Boss, TObjective, FlagObject, Quest, Location, Character, KIObjectives, Kit, FlagBadge, TimerState, V5FlagObject, v5Requirement, v5QuestReward, SeedMetadata };