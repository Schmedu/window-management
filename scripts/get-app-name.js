// Name: Get App Name
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";

let {
    choices
} = await db(kitPath("db", "apps.json"));

await copy(
    await arg(
        "Select an app",
        choices.map((c) => c.name)
    )
);