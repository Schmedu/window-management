// Name:  Current apps windows on left half

import "@johnlindquist/kit";
import {
    getFrontWindowsScreen,
    setActiveProcessWindowsBounds,
} from "../lib/window-management.js";

let activeScreen = await getFrontWindowsScreen();

await setActiveProcessWindowsBounds(
    activeScreen.workArea.x,
    activeScreen.workArea.y,
    activeScreen.workArea.width / 2,
    activeScreen.workArea.height
);