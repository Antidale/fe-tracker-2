// @flow

import { quests, bosses } from '@/app/lib/default-data';
import { FlagObject } from '@/app/lib/interfaces';

const parseFlags = (flagString: string) => {
    if (!flagString || typeof flagString !== 'string') {
        return {
            objectives: [],
            required: 0
        };
    }

    const flagObj:FlagObject = {
        objectives: [],
        required: 0,
    }
    // check set objectives (non-custom)
    if (flagString.indexOf('dkmatter') >= 0 ) {
        flagObj.objectives.push({
            id: flagObj.objectives.length,
            label: 'Turn in 30 Dark Matters to Kory',
            time: 0,
        });
    }

    if (flagString.indexOf('classicforge') >= 0 ) {
        flagObj.objectives.push({
            id: flagObj.objectives.length,
            label: 'Forge the Crystal',
            time: 0,
        });
    }

    if (flagString.indexOf('classicgiant') >= 0 ) {
        flagObj.objectives.push({
            id: flagObj.objectives.length,
            label: 'Complete the Giant of Bab-il',
            time: 0,
        });
    }

    if (flagString.indexOf('fiends') >= 0 ) {
        const fiendList = ['Milon', 'Milon Z', 'Kainazzo', 'Valvalis', 'Rubicant', 'Elements'];
        for (const fiend of fiendList) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `Defeat ${fiend}`,
                time: 0,
            });
        }
    }

    // custom -- character obtain

    const characters = ['Cecil', 'Kain', 'Rydia', 'Tellah', 'Edward', 'Rosa', 'Yang', 'Palom', 'Porom', 'Cid', 'Edge', 'FuSoYa']

    for (const char of characters) {
        if (flagString.indexOf(`char_${char.toLowerCase()}`) >= 0 ) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `Get ${char}`,
                time: 0,
            });
        }
    }

    // custom - boss hunt
    
    for (const boss of bosses) {
        if (flagString.indexOf(`boss_${boss.slug}`) >= 0 ) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `Defeat ${boss.title}`,
                time: 0,
            });
        }
    }

    // custom quests

    for (const quest of quests) {
        if (flagString.indexOf(`quest_${quest.slug}`) >= 0 ) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: quest.title,
                time: 0,
            });
        }
    }

    

    // grunthack: mode KI
    const modeKIindex = flagString.indexOf(`ki`);
    if (modeKIindex >= 0) {
        const digit1 = parseInt(flagString.charAt(modeKIindex + 2));
        // if (isNaN(digit1)) return;
        if (digit1 === 1) {
            const digit2 = parseInt(flagString.charAt(modeKIindex + 3));
            if (isNaN(digit2)) {
                flagObj.objectives.push({
                    id: flagObj.objectives.length,
                    label: `Obtain ${digit1} key item`,
                    time: 0,
                })
            } else {
                flagObj.objectives.push({
                    id: flagObj.objectives.length,
                    label: `Obtain ${digit1}${digit2} key items`,
                    time: 0,
                })
            }
        }
        if (digit1 > 1) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `Obtain ${digit1} key items`,
                time: 0,
            })
        }
    }

    // don't forget the z-fight
    if (flagString.indexOf('win:game') < 0) {
        flagObj.objectives.push({
            id: flagObj.objectives.length,
            label: 'Defeat Zeromus',
            time: 0,
        })
    }

    // random objectives
    const randomIndex = flagString.indexOf(`random:`);
    if (randomIndex >= 0) {
        for (let i = 0; i < parseInt(flagString.charAt(randomIndex + 7)); i++) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `Random objective ${i + 1}`,
                time: 0,
                random: true,
            });
        }
    }

    // galeswift -- include second objective set
    const random2Index = flagString.indexOf(`random2:`);
    if (random2Index >= 0) {
        for (let i = 0; i < parseInt(flagString.charAt(random2Index + 8)); i++) {
            flagObj.objectives.push({
                id: flagObj.objectives.length,
                label: `2nd set Random objective ${i + 1}`,
                time: 0,
                random: true,
            });
        }
    }

    // required objective number
    if (flagString.indexOf('req:') >= 0 && flagString.indexOf('req:all') < 0) {
        flagObj.required = parseInt(flagString.charAt(flagString.indexOf('req:') + 4));
    } else if (flagString.indexOf('req:') >= 0 && flagString.indexOf('req:all') >= 0) {
        flagObj.required = flagString.indexOf('win:game') < 0 ? flagObj.objectives.length - 1 : flagObj.objectives.length;
    }

    return flagObj;
}

export default parseFlags;