// Name: Get Active Processes
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";

let processes = (
    await applescript(`
tell application "System Events"
    set listOfProcesses to (name of every process where background only is false)
end tell
`)
)
    .split(",")
    .map((process) => process.trim());

await copy(await arg("Select a process", processes));