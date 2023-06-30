import { Display } from "../../../../.kit/types/electron";

export async function getActiveProcess() {
    return await applescript(`
        tell application "System Events"
            set processName to name of first application process whose frontmost is true as text
        end tell`);
}

export async function getNonBackgroundProcesses() {
    return (
        await applescript(String.raw`
                tell application "System Events"
                    set listOfProcesses to (name of every process where background only is false)
                end tell
            `)
    )
        .split(",")
        .map((process) => process.trim());
}

export const IRREGULAR_PROCESSES = {};

interface AppWindowConfig {
    app: string;
    windowAlignment: WindowAlignment;
}

export async function organizeDisplay(displayManagements: DisplayManagement[]) {
    for (let displayManagement of displayManagements) {
        for (let appAlignment of displayManagement.appAlignments) {
            await setAppWindows(
                appAlignment.app,
                appAlignment.windowAlignment,
                displayManagement.screen
            );
        }
    }
}

export async function setAppWindows(
    app,
    windowAlignment,
    screen,
    delay = 0,
    waitForFirstWindow = false
) {
    let process = IRREGULAR_PROCESSES[app] || app;
    let processes = (await getNonBackgroundProcesses()).map((p) =>
        p.toLowerCase()
    );
    if (!processes.includes(process.toLowerCase())) {
        await applescript(`tell application "${app}" to activate`);
        if (waitForFirstWindow) {
            await applescript(`
                tell application "System Events"
                    repeat while true
                        set x to exists (window 1 of process "${app}")
                        if x is true then exit repeat
                    end repeat
                end tell
            `);
        }
        await wait(delay);
    }
    let workArea = windowAlignment.workArea(screen);
    await setProcessWindowsWorkArea(process, workArea);
}

export async function setProcessWindowsWorkArea(process, workArea) {
    await applescript(`
        tell application "System Events"
          tell process "${process}" to set the position of every window to {${workArea.x}, ${workArea.y}}
          tell process "${process}" to set the size of every window to {${workArea.width}, ${workArea.height}}
          set the frontmost of process "${process}" to true
        end tell
    `);
}

export async function setActiveProcessWindowsBounds({ x, y, width, height }) {
    let process = await getActiveProcess();
    await setProcessWindowsWorkArea(process, { x, y, width, height });
}

export async function getActiveProcessFrontMostWindowPosition() {
    let positionStr = await applescript(String.raw`
        tell application "System Events"
            set processName to name of first application process whose frontmost is true as text
            tell process processName to get position of window 1
        end tell
    `);
    let positionArray = positionStr.split(",").map((str) => parseInt(str.trim()));
    return {
        x: positionArray[0],
        y: positionArray[1],
    };
}

export async function getFrontWindowsScreen() {
    let position = await getActiveProcessFrontMostWindowPosition();
    let screens = await getScreens();
    return (
        screens.find((screen) => {
            return (
                position.x >= screen.bounds.x &&
                position.x <= screen.bounds.x + screen.bounds.width &&
                position.y >= screen.bounds.y &&
                position.y <= screen.bounds.y + screen.bounds.height
            );
        }) ?? screens[0]
    );
}

export async function getScreenById(id) {
    let screens = await getScreens();
    return screens.find((screen) => screen.id === id);
}

export async function getDefaultScreen() {
    let screens = await getScreens();
    return screens.find((screen) => screen.internal === true);
}

export const Windows = {
    FRONTMOST: "frontmost",
    ALL: "all",
};

interface DisplayManagement {
    appAlignments: AppAlignment[];
    screen: Display;
}

interface AppAlignment {
    app: string;
    windowAlignment: WindowAlignment;
}

interface WindowAlignment {
    name: string;
    workArea: (screen: Screen) => WorkArea;
}

interface WorkArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const WindowAlignments = {
    LEFT_HALF: {
        name: "left half",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width / 2,
            height: screen.bounds.height,
        }),
    },
    LEFT_THIRD: {
        name: "left third",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height,
        }),
    },
    LEFT_TWO_THIRDS: {
        name: "first / left two thirds",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: (screen.bounds.width / 3) * 2,
            height: screen.bounds.height,
        }),
    },
    RIGHT_HALF: {
        name: "right half",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 2,
            y: screen.bounds.y,
            width: screen.bounds.width / 2,
            height: screen.bounds.height,
        }),
    },
    RIGHT_THIRD: {
        name: "right third",
        workArea: (screen) => ({
            x: screen.bounds.x + (screen.bounds.width / 3) * 2,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height,
        }),
    },
    RIGHT_TWO_THIRDS: {
        name: "last / right two thirds",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 3,
            y: screen.bounds.y,
            width: (screen.bounds.width / 3) * 2,
            height: screen.bounds.height,
        }),
    },
    CENTER_THIRD: {
        name: "center third",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 3,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height,
        }),
    },
    TOP_HALF: {
        name: "top half",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width,
            height: screen.bounds.height / 2,
        }),
    },
    TOP_THIRD: {
        name: "top third",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width,
            height: screen.bounds.height / 3,
        }),
    },
    TOP_TWO_THIRDS: {
        name: "top two thirds",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width,
            height: (screen.bounds.height / 3) * 2,
        }),
    },
    BOTTOM_HALF: {
        name: "bottom half",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_THIRD: {
        name: "bottom third",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y + (screen.bounds.height / 3) * 2,
            width: screen.bounds.width,
            height: screen.bounds.height / 3,
        }),
    },
    BOTTOM_TWO_THIRDS: {
        name: "bottom two thirds",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y + screen.bounds.height / 3,
            width: screen.bounds.width,
            height: (screen.bounds.height / 3) * 2,
        }),
    },
    TOP_LEFT: {
        name: "top left quarter",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width / 2,
            height: screen.bounds.height / 2,
        }),
    },
    TOP_RIGHT: {
        name: "top right quarter",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 2,
            y: screen.bounds.y,
            width: screen.bounds.width / 2,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_LEFT: {
        name: "bottom left quarter",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width / 2,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_RIGHT: {
        name: "bottom right quarter",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 2,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width / 2,
            height: screen.bounds.height / 2,
        }),
    },
    CENTERED: {
        name: "centered",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 6,
            y: screen.bounds.y + screen.bounds.height / 6,
            width: (screen.bounds.width * 2) / 3,
            height: (screen.bounds.height * 2) / 3,
        }),
    },
    FIRST_FOURTH: {
        name: "first fourth",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width / 4,
            height: screen.bounds.height,
        }),
    },
    SECOND_FOURTH: {
        name: "second fourth",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 4,
            y: screen.bounds.y,
            width: screen.bounds.width / 4,
            height: screen.bounds.height,
        }),
    },
    THIRD_FOURTH: {
        name: "third fourth",
        workArea: (screen) => ({
            x: screen.bounds.x + (screen.bounds.width / 4) * 2,
            y: screen.bounds.y,
            width: screen.bounds.width / 4,
            height: screen.bounds.height,
        }),
    },
    FOURTH_FOURTH: {
        name: "fourth fourth",
        workArea: (screen) => ({
            x: screen.bounds.x + (screen.bounds.width / 4) * 3,
            y: screen.bounds.y,
            width: screen.bounds.width / 4,
            height: screen.bounds.height,
        }),
    },
    FIRST_THREE_FOURTHS: {
        name: "first three fourths",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: (screen.bounds.width / 4) * 3,
            height: screen.bounds.height,
        }),
    },
    LAST_THREE_FOURTHS: {
        name: "last three fourths",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 4,
            y: screen.bounds.y,
            width: (screen.bounds.width / 4) * 3,
            height: screen.bounds.height,
        }),
    },
    TOP_LEFT_SIXTH: {
        name: "top left sixth",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    TOP_MIDDLE_SIXTH: {
        name: "top middle sixth",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 3,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    TOP_RIGHT_SIXTH: {
        name: "top right sixth",
        workArea: (screen) => ({
            x: screen.bounds.x + (screen.bounds.width / 3) * 2,
            y: screen.bounds.y,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_LEFT_SIXTH: {
        name: "bottom left sixth",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_MIDDLE_SIXTH: {
        name: "bottom middle sixth",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 3,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    BOTTOM_RIGHT_SIXTH: {
        name: "bottom right sixth",
        workArea: (screen) => ({
            x: screen.bounds.x + (screen.bounds.width / 3) * 2,
            y: screen.bounds.y + screen.bounds.height / 2,
            width: screen.bounds.width / 3,
            height: screen.bounds.height / 2,
        }),
    },
    MAX: {
        name: "max",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width,
            height: screen.bounds.height,
        }),
    },
    ALMOST_MAX: {
        name: "almost maximize",
        workArea: (screen) => ({
            x: screen.bounds.x + screen.bounds.width / 24,
            y: screen.bounds.y + screen.bounds.height / 24,
            width: (screen.bounds.width * 11) / 12,
            height: (screen.bounds.height * 11) / 12,
        }),
    },
    NEXT_SCREEN: {
        name: "next screen",
        workArea: (screen) => ({
            x: screen.bounds.x,
            y: screen.bounds.y,
            width: screen.bounds.width,
            height: screen.bounds.height,
        }),
    },
};
