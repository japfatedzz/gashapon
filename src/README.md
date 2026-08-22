# GashaponFun — live source snapshot

Unpacked from a Supabase CSV export of `ui_assets` and `web_assets`.
This is the code that production actually runs.

## Layout

    base-ui/body.html   the page markup
    base-ui/base.css    the base stylesheet
    base-ui/base.js     the base application code
    web-assets/         the modular CSS/JS, prefixed by load order
    MANIFEST.json       asset keys, load order, enabled flags, checksum

`base-ui/` came from the row `gashaponfun-v9` in `ui_assets`, stored as
gzipped JSON in base64. Files prefixed `DISABLED-` are the failed capsule
animation experiments. They are switched off in production. Leave them off.

## Load order at runtime

Vercel serves a shell that runs `/loader.js`, which:
1. fetches the `gashaponfun-v9` payload, decompresses it, injects body + base CSS
2. imports `base.js`
3. injects enabled CSS assets, then imports enabled JS assets, in `sort_order`

## Restoring

Paste a file's contents back into the matching `content` cell in
`web_assets`. For `base-ui/`, the three files must be re-packed into
`{body, css, js}` JSON, gzipped, base64-encoded, and written back to
`ui_assets.payload` — not pasted directly.
