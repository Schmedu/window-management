// Name: Max out all Windows for current app

import "@johnlindquist/kit";
import {
    getFrontWindowsScreen,
    setActiveProcessWindowsBounds,
} from "../lib/window-management.js";

let activeScreen = await getFrontWindowsScreen();

await setActiveProcessWindowsBounds(
    activeScreen.workArea.x,
    activeScreen.workArea.y,
    activeScreen.bounds.width,
    activeScreen.bounds.height
);