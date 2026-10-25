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
The site does not activate the application's separately signed update feed.
