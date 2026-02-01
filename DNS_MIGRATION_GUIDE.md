# DNS Migration Guide: Media Temple → Cloudflare

## The Problem
- `https://www.authenticmotorcars.com` works ✓
- `https://authenticmotorcars.com` (no www) fails ✗

**Root cause:** Media Temple DNS doesn't support ALIAS/ANAME records at the apex (root) domain. Heroku requires this for HTTPS to work on the apex domain.

## The Solution
Migrate DNS management to **Cloudflare** (free tier). Cloudflare supports "CNAME flattening" which solves this problem. The domain stays registered at Media Temple - we're only moving DNS.

---

## Before You Start

### What You'll Need
- [ ] Access to Media Temple account (requires 2FA from domain owner)
- [ ] A free Cloudflare account (you can create this now)
- [ ] Access to Heroku dashboard for the app

### Important Notes
- **Domain registration stays at Media Temple** - we're only changing where DNS is managed
- **There will be minimal downtime** if done correctly (usually none)
- **DNS propagation takes 1-48 hours** (usually fast with low TTLs)

---

## Step-by-Step Guide

### Phase 1: Preparation (You can do this alone)

#### Step 1: Create Cloudflare Account
1. Go to https://cloudflare.com
2. Click "Sign Up"
3. Create account with your email

#### Step 2: Add Domain to Cloudflare
1. In Cloudflare dashboard, click "Add a Site"
2. Enter `authenticmotorcars.com`
3. Select the **Free** plan
4. Cloudflare will scan existing DNS records

#### Step 3: Review DNS Records in Cloudflare
Cloudflare will import existing records. Verify and configure:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | `@` (root) | `graceful-hawthorn-g74ug36esxdydz8wrfmk71nu.herokudns.com` | DNS only (gray cloud) |
| CNAME | `www` | `www.authenticmotorcars.com.herokudns.com` | DNS only (gray cloud) |

**Important:**
- Delete any old A records pointing to IP addresses
- Delete any AAAA records
- Keep proxy status as "DNS only" (gray cloud) for now - Heroku handles SSL

#### Step 4: Note Cloudflare's Nameservers
Cloudflare will show you two nameservers like:
```
ada.ns.cloudflare.com
bob.ns.cloudflare.com
```
**Write these down** - you'll need them for Phase 2.

---

### Phase 2: Update Nameservers (Requires Media Temple Access)

This is the part that requires the domain owner's help with 2FA.

#### Option A: You Do It (with 2FA help)
1. Call/text the domain owner
2. Ask them to provide the 2FA code when you log in
3. Follow Step 5 below

#### Option B: Send Instructions to Domain Owner
Copy and send these instructions:

---

**Instructions for Domain Owner:**

Hi! I need to update the DNS nameservers for authenticmotorcars.com to fix an HTTPS issue. This won't affect the domain registration - just where DNS is managed.

Please do the following:

1. Log into Media Temple at https://ac.mediatemple.net
2. Go to **Domains** → **authenticmotorcars.com**
3. Find **Nameservers** or **DNS Settings**
4. Change nameservers FROM Media Temple's nameservers TO:
   - `ada.ns.cloudflare.com` (or the first one I give you)
   - `bob.ns.cloudflare.com` (or the second one I give you)
5. Save changes

That's it! Let me know when done.

---

#### Step 5: Change Nameservers in Media Temple
1. Log into Media Temple (https://ac.mediatemple.net)
2. Navigate to **Domains** section
3. Click on `authenticmotorcars.com`
4. Find **Nameservers** settings (might be under "DNS" or "Domain Settings")
5. Change from Media Temple nameservers to Cloudflare's:
   - Nameserver 1: `[your-cloudflare-ns1].ns.cloudflare.com`
   - Nameserver 2: `[your-cloudflare-ns2].ns.cloudflare.com`
6. Save changes

---

### Phase 3: Verify & Complete (After nameserver change)

#### Step 6: Wait for Cloudflare Activation
1. Go back to Cloudflare dashboard
2. Click "Check nameservers"
3. Wait for status to show "Active" (can take minutes to hours)
4. You'll get an email when active

#### Step 7: Verify DNS is Working
Test that the site still works:
```bash
# Check www (should work)
curl -I https://www.authenticmotorcars.com

# Check apex (may take time to work)
curl -I https://authenticmotorcars.com
```

#### Step 8: Refresh Heroku ACM
1. Go to Heroku Dashboard → a-m-c app → Settings
2. Scroll to "Domains"
3. Click "Refresh ACM" or check domain status
4. Wait for `authenticmotorcars.com` to show **OK**

#### Step 9: Test Everything
- [ ] `https://www.authenticmotorcars.com` loads correctly
- [ ] `https://authenticmotorcars.com` loads correctly (no HTTPS error!)
- [ ] `http://authenticmotorcars.com` redirects to HTTPS
- [ ] `http://www.authenticmotorcars.com` redirects to HTTPS

---

## Rollback Plan
If something goes wrong:
1. Go back to Media Temple
2. Change nameservers back to Media Temple's defaults
3. Wait for propagation

The www version will continue working throughout.

---

## Timeline Estimate
- Phase 1 (Preparation): 15-30 minutes (you alone)
- Phase 2 (Nameserver change): 5-10 minutes (needs 2FA access)
- Phase 3 (Propagation & verification): 1-24 hours (mostly waiting)

---

## FAQ

**Q: Will the site go down during migration?**
A: No, if done correctly. The www version will work throughout. The apex might have a brief window where it doesn't work, but it doesn't work now anyway.

**Q: Is Cloudflare free?**
A: Yes, the free tier includes DNS management with CNAME flattening.

**Q: Does this affect my domain registration?**
A: No. The domain stays registered at Media Temple. We're only changing where DNS queries are answered.

**Q: Can I use Cloudflare's proxy/CDN features?**
A: Yes, but start with "DNS only" mode. You can enable the proxy later for caching/security benefits.

**Q: What if the domain owner can't help right away?**
A: Complete Phase 1 now. Phase 2 only takes 5 minutes once you have access.
