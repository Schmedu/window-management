// Name: Screen App-Windows Management
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";

import {
    setAppsWindows,
    WindowAlignments
} from "../lib/window-management.js";

let screens = await getScreens();
let defaultScreen =
    screens.length === 1 ?
    screens[0] :
    screens.splice(
        screens.findIndex((screen) => screen.internal === true),
        1
    )[0];

// use helper script 'copy-app-name.js' to get the process names
await setAppsWindows("Spotify", WindowAlignments.MAX, defaultScreen);
await setAppsWindows(
    "Centered",
    WindowAlignments.CENTERED,
    defaultScreen,
    2000
);

if (screens.length === 0) {
    await setAppsWindows("WebStorm", WindowAlignments.MAX, defaultScreen);
    await setAppsWindows(
        "Google Chrome",
        WindowAlignments.MAX,
        defaultScreen
    );
    await setAppsWindows("Slack", WindowAlignments.MAX, defaultScreen);
    await setAppsWindows(
        "Mail",
        WindowAlignments.MAX,
        defaultScreen
    );
} else if (screens.length === 1) {
    let secondScreen = screens[0];
    await setAppsWindows("WebStorm", WindowAlignments.LEFT_THIRD, secondScreen);
    await setAppsWindows(
        "Google Chrome",
        WindowAlignments.CENTER_THIRD,
        secondScreen
    );
    await setAppsWindows("Terminal", WindowAlignments.RIGHT_THIRD, secondScreen);
    await setAppsWindows("Slack", WindowAlignments.LEFT_HALF, defaultScreen);
    await setAppsWindows(
        "Mail",
        WindowAlignments.RIGHT_HALF,
        defaultScreen
    );
}