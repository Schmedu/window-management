// Name:  Current apps windows on right half
// Author: Eduard Uffelmann

import "@johnlindquist/kit";
import {
    getFrontWindowsScreen,
    setActiveProcessWindowsBounds,
} from "../lib/window-management.js";

let activeScreen = await getFrontWindowsScreen();

await setActiveProcessWindowsBounds(
    activeScreen.workArea.x + activeScreen.workArea.width / 2,
    activeScreen.workArea.y,
    activeScreen.bounds.width / 2,
    activeScreen.bounds.height
);