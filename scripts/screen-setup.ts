// Name: Screen App-Windows Management
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";

import {
    organizeDisplay,
    setAppWindows,
    WindowAlignments,
} from "../lib/window-management";

if (process.platform !== "darwin") {
    throw new Error("This script only works on macOS");
}

let screens = await getScreens();

let defaultScreen =
    screens.length === 1
        ? screens[0]
        : screens.splice(
            screens.findIndex((screen) => screen.internal === true),
            1
        )[0];

// use helper script 'copy-app-name.js' to get the process names
if (screens.length === 0) {
    await setAppWindows("WebStorm", WindowAlignments.MAX, defaultScreen);
    await setAppWindows("Google Chrome", WindowAlignments.MAX, defaultScreen);
    await setAppWindows("Slack", WindowAlignments.MAX, defaultScreen);
    await setAppWindows("Mail", WindowAlignments.MAX, defaultScreen);
    await setAppWindows(
        "Sublime Text",
        WindowAlignments.ALMOST_MAX,
        defaultScreen
    );
    await organizeDisplay([
        {
            appAlignments: [
                {
                    app: "Sublime Text",
                    windowAlignment: WindowAlignments.ALMOST_MAX,
                },
                {
                    app: "WebStorm",
                    windowAlignment: WindowAlignments.LEFT_THIRD,
                }
            ],
            screen: defaultScreen,
        },
    ]);
} else if (screens.length === 1) {
    let secondScreen = screens[0];
    await setAppWindows(
        "Sublime Text",
        WindowAlignments.ALMOST_MAX,
        defaultScreen
    );
    await setAppWindows("WebStorm", WindowAlignments.LEFT_THIRD, secondScreen);
    await setAppWindows(
        "Google Chrome",
        WindowAlignments.CENTER_THIRD,
        secondScreen
    );
    await setAppWindows("Terminal", WindowAlignments.RIGHT_THIRD, secondScreen);
    await setAppWindows("Slack", WindowAlignments.LEFT_HALF, defaultScreen);
    await setAppWindows("Mail", WindowAlignments.RIGHT_HALF, defaultScreen);
}
