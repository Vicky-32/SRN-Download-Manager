# SRN static website

Production: https://srn-download-manager.pages.dev/

Serve dist/ with any static server. No install or build is required. The included
Manrope font, SRN artwork and sample-data app screenshots are served locally.
Run `node test-interactions.cjs` from website/ to check basic interactions.

Deploy the contents of dist/ with Cloudflare Pages Direct Upload, or use
`npx wrangler pages deploy dist --project-name srn-download-manager --branch main`
after authorizing the intended Cloudflare account. Never commit account tokens.

The versioned GitHub download URLs, file sizes and SHA-256 values are in
`dist/release.js`. Update these only after verifying a published release.
The public signed Windows update manifest is at `dist/updates/windows.json`.
The desktop app enables that source only after the user selects **Use SRN official
releases**. Startup checks are separately opt-in. The public key is safe to share;
private signing material is never included here. The publisher renews the signed
manifest before its expiry, even when the current release version is unchanged.
