# Authentic Motorcars HTTPS / Domain Issue (Heroku)

## Summary
The site works at `https://www.authenticmotorcars.com`, but visiting `https://authenticmotorcars.com` (no `www`) shows an “HTTPS-only / Secure Site Not Available” error in the browser.

This happens because the **apex/root domain** (`authenticmotorcars.com`) is **not serving HTTPS**. The Express redirect can only run **after a request reaches the app**, but HTTPS-only browsers fail *before* the request reaches the Node process if the TLS certificate/DNS setup is not correct.

## What we changed in the app
We added production-only middleware in `server.js` to:

- Enable `trust proxy` (required on Heroku)
- Redirect any request arriving as HTTP (detected via `x-forwarded-proto`) to HTTPS
- Set an HSTS header on secure requests

This solves the "HTTP is not secure" complaint *for any hostname that already has working HTTPS*.

## Why the apex domain still fails
Heroku Automated Certificate Management (ACM) must validate DNS for each custom domain. Heroku showed:

- `www.authenticmotorcars.com`: **OK** (CNAME -> `www.authenticmotorcars.com.herokudns.com`)
- `authenticmotorcars.com`: **failing validation** / “Unable to resolve DNS”

From `heroku domains -a a-m-c`:

- `authenticmotorcars.com` requires **ALIAS or ANAME** -> `graceful-hawthorn-g74ug36esxdydz8wrfmk71nu.herokudns.com`
- `www.authenticmotorcars.com` uses **CNAME** -> `www.authenticmotorcars.com.herokudns.com`

Many DNS providers (including some Media Temple setups) do **not** support ALIAS/ANAME (or apex CNAME flattening), which prevents pointing the **root/apex** domain at a Heroku `herokudns.com` target.

## Correct fix (recommended)
### 1) Fix DNS for the apex domain
In the DNS provider for `authenticmotorcars.com`, create/update the root record:

- **Name/Host**: `@` (root)
- **Type**: `ALIAS` or `ANAME` (depending on provider)
- **Target/Value**: `graceful-hawthorn-g74ug36esxdydz8wrfmk71nu.herokudns.com`

Also remove conflicting apex records:

- **A** records pointing to old IPs
- **AAAA** records
- any non-Heroku target that would cause the apex to resolve elsewhere

### 2) Refresh Heroku ACM
After DNS propagates:

- In the Heroku dashboard, click **Refresh ACM Status**
- Wait for `authenticmotorcars.com` to show **Ok**

Once ACM is OK, `https://authenticmotorcars.com` will work.

### 3) Optional: enforce a single canonical hostname
After both `www` and apex work over HTTPS, optionally redirect the apex to `www` (or vice versa) to avoid duplicate domains.

## Workaround (not ideal): remove apex from Heroku
You *can* remove `authenticmotorcars.com` from the Heroku custom domains list and keep only `www`.

However:

- This does **not** make `https://authenticmotorcars.com` work.
- Browsers in HTTPS-only mode may still fail when users omit `www`.

To make "no-www" safe, the apex must have valid HTTPS or reliably redirect at a layer that can serve HTTPS for the apex.

## Question: if we moved off Heroku, could Media Temple DNS work?
**Maybe, but it depends on what Media Temple DNS supports and what the new hosting platform requires.**

### Key point
The hard part is the apex domain (`@`). If your DNS provider only supports **A records** at the apex (no ALIAS/ANAME/flattening), then you need a hosting setup that can be reached via **static IP address(es)**.

### When switching platforms can help
If you move to infrastructure where you get one or more stable IPs (for example a VPS, a dedicated server, or a load balancer with fixed IPs), you can set:

- `@` -> **A record** -> static IP

And then manage TLS certificates on that server/load balancer.

### When switching platforms does *not* help
Many modern PaaS platforms (similar to Heroku) still require:

- `www` as a CNAME
- `@` as ALIAS/ANAME (or a DNS provider that supports apex flattening)

So if you keep Media Temple DNS without ALIAS/ANAME support, you may run into the *same apex limitation* again.

### Practical recommendation
- Keep the app on Heroku.
- Move DNS hosting to a provider that supports apex aliasing/flattening (commonly **Cloudflare** or **Route53**).

This is usually faster/safer than re-platforming the application.
