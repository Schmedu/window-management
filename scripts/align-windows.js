// Name: Move current apps windows
// Author: Eduard Uffelmann
// Twitter: @schmedu_
// Example cli usage: ~/.kit/kar window-management/align-windows 'ALL' 'LEFT_HALF'

import "@johnlindquist/kit";

import {
    getFrontWindowsScreen,
    setActiveProcessWindowsBounds,
    WindowAlignments,
    Windows
} from "../lib/window-management.js";

let windowMode =
    Windows[
        await arg(
            "Which window(s) to move?",
            Object.keys(Windows).map((key) => {
                return {
                    name: Windows[key],
                    value: key,
                };
            })
        )
    ];

let windowAlignment =
    WindowAlignments[
        await arg(
            "Window Alignment",
            Object.keys(WindowAlignments).map((key) => {
                return {
                    name: WindowAlignments[key].name,
                    value: key,
                };
            })
        )
    ];

let activeScreen = await getFrontWindowsScreen();
let nextScreen;
if (windowAlignment === WindowAlignments.NEXT_SCREEN) {
    let screens = await getScreens();
    let nextScreens = screens.filter((screen) => screen.id > activeScreen.id);
    nextScreen = nextScreens.length === 0 ? screens[0] : nextScreens[0];
}

let workArea =
    windowAlignment === WindowAlignments.NEXT_SCREEN ?
    windowAlignment.workArea(nextScreen) :
    windowAlignment.workArea(activeScreen);

if (windowMode === Windows.ALL) {
    await setActiveProcessWindowsBounds(workArea);
} else {
    await setActiveAppPosition({
        x: workArea.x,
        y: workArea.y,
    });
    await setActiveAppSize({
        width: workArea.width,
        height: workArea.height,
    });
}