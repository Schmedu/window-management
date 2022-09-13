export async function getActiveProcess() {
    return await applescript(String.raw`
        tell application "System Events"
          set processName to name of first application process whose frontmost is true as text
        end tell
`);
}

export async function setProcessWindowsBounds(process, x, y, width, height) {
    await applescript(String.raw`
        tell application "System Events"
          tell process "${process}" to set the position of every window to {${x}, ${y}}
          tell process "${process}" to set the size of every window to {${width}, ${height}}      
        end tell
    `);
}

export async function setActiveProcessWindowsBounds(x, y, width, height) {
    let process = await getActiveProcess();
    await setProcessWindowsBounds(process, x, y, width, height);
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
    return screens.find((screen) => {
        return (
            position.x >= screen.bounds.x &&
            position.x <= screen.bounds.x + screen.bounds.width &&
            position.y >= screen.bounds.y &&
            position.y <= screen.bounds.y + screen.bounds.height
        );
    });
}