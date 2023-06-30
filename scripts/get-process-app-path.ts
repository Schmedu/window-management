// Name: 
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit"


let a = await applescript(`
    tell application "System Events"
        set thisApp to application process "sublime_text"
        set applicationFile to (application file of thisApp) as «class furl»
    end tell
    
    set appPath to POSIX path of applicationFile
`)

await getWindows()