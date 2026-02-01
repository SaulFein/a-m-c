# DNS Migration Progress Tracker

**Domain:** authenticmotorcars.com
**Goal:** Fix HTTPS issue on apex domain (non-www)
**Started:** January 31, 2025

---

## Phase 1: Cloudflare Setup ✅ COMPLETE

- [x] Created Cloudflare account
- [x] Added domain to Cloudflare (Free plan)
- [x] Deleted old A records pointing to `173.201.189.160`
- [x] Added CNAME for root (`@`) → `graceful-hawthorn-g74ug36esxdydz8wrfmk71nu.herokudns.com` (DNS only)
- [x] Verified `www` CNAME → `www.authenticmotorcars.com.herokudns.com` (DNS only)
- [x] Kept email/Microsoft records (autodiscover, email, MX, TXT, SRV, etc.)
- [x] Got Cloudflare nameservers

**Cloudflare Nameservers:**
```
nico.ns.cloudflare.com
wanda.ns.cloudflare.com
```

---

## Phase 2: Update Nameservers at Media Temple ⏳ WAITING

- [x] Sent email to Sean (Media Temple account holder) - January 31, 2025
- [ ] Receive response from Sean
- [ ] Log into Media Temple (or Sean makes the change)
- [ ] Change nameservers from:
  - `ns1.mediatemple.net` → `nico.ns.cloudflare.com`
  - `ns2.mediatemple.net` → `wanda.ns.cloudflare.com`
- [ ] Save changes
- [ ] Click "I updated my nameservers" in Cloudflare

---

## Phase 3: Verification ⏳ PENDING

- [ ] Wait for Cloudflare to show "Active" status (can take minutes to 24 hours)
- [ ] Refresh Heroku ACM in dashboard (Settings → Domains → Refresh ACM)
- [ ] Verify `authenticmotorcars.com` shows "OK" in Heroku
- [ ] Test `https://authenticmotorcars.com` works (no HTTPS error)
- [ ] Test `https://www.authenticmotorcars.com` still works
- [ ] Test HTTP redirects to HTTPS for both

---

## Quick Reference

**Cloudflare Dashboard:** https://dash.cloudflare.com
**Media Temple Login:** https://ac.mediatemple.net
**Heroku Dashboard:** https://dashboard.heroku.com/apps/a-m-c

**Current Status:** Waiting for Media Temple account holder response

---

## Notes

- Domain registration stays at Media Temple (only DNS management moves to Cloudflare)
- The www version of the site will continue working throughout the migration
- Email services should not be affected (records were preserved)
- If anything goes wrong, can revert by changing nameservers back to Media Temple
