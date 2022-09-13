// Description: All Front App Windows 2 Next Screen

import "@johnlindquist/kit";
import {
    getFrontWindowsScreen,
    setActiveProcessWindowsBounds,
} from "../lib/window-management.js";

let activeScreen = await getFrontWindowsScreen();
let screens = await getScreens();

if (screens.length === 1) {
    await notify("Only one screen");
    exit();
}

let nextScreens = screens.filter((screen) => screen.id > activeScreen.id);
let nextScreen = nextScreens.length === 0 ? screens[0] : nextScreens[0];

await setActiveProcessWindowsBounds(
    nextScreen.workArea.x,
    nextScreen.workArea.y,
    nextScreen.bounds.width,
    nextScreen.bounds.height
);