# Security

This is a static personal site with no accounts, no user data, and no server-side code beyond Cloudflare's static hosting.

If you find a problem, email hello@kylepiontek.com. A `security.txt` with the same contact is served at https://kylepiontek.com/.well-known/security.txt. Please do not open a public issue for anything that could affect visitors, such as a header misconfiguration or a dependency vulnerability that reaches the shipped bundle.

Security headers are defined in `public/_headers` and checked by `tests/headers.test.js` and, after each deploy, by `scripts/verify-deploy.mjs`.
