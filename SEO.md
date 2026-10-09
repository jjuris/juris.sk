# SEO and GEO maintenance

The active theme is `juris`. SEO changes do not require a Blowfish npm build.
The production base URL is `https://juris.sk/` in `hugo.toml`.

## Content and identity

- Give every indexable page a specific `description` in front matter.
- Use `seoTitle` only when the search title should differ from the visible title.
- Keep project `date` values as their historical project dates. They determine
  display order and the project year; they are not publication dates.
- Update `lastmod` when the main content or metadata actually changes. Do not
  update it automatically on every build. The sitemap and JSON-LD use this field.
- Maintain the verified `github` and `blog` URLs in `data/portfolio.toml`.
- Keep professional claims and metrics factual. The kiosk case study records the
  2013 rollout; its present operational status has not been verified.

The JSON-LD uses stable `#person`, `#website`, and `#webpage` identifiers. The
homepage is a `ProfilePage` whose `mainEntity` is the person. Project pages
describe authored case studies as `CreativeWork`; they do not invent publication
dates, employers, credentials, or measurements.

The optional `/llms.txt` is generated from page descriptions and actual project
URLs. It is an experimental resource for consumers that support it. It is not
required for Google Search or its generative features and does not guarantee AI
citations. See Google's [AI search guidance][ai-guide] and its
[profile-page documentation][profile-schema].

## URL and indexing policy

- `/projects/` is the primary project overview.
- All seven `/project/<slug>/` case studies keep their existing URLs.
- `/project/` remains available for existing links, has `noindex, follow`, and
  points its canonical to `/projects/`.
- `/authors/`, `/categories/`, `/series/`, and `/tags/` remain available, have
  `noindex, follow`, and are excluded from the sitemap.
- The 404 page has `noindex` and no canonical or JSON-LD. GitHub Pages should
  return HTTP 404 for nonexistent URLs; HTML alone cannot set that status.
- `robots.txt` allows crawling, including crawling of pages with `noindex`, and
  declares the sitemap. No AI crawler is intentionally blocked.

## Validate and export

Run from the repository root. The resource cache and build output stay outside
the checkout during validation:

```sh
HUGO_RESOURCEDIR=/tmp/juris-seo-resources hugo --minify --noBuildLock \
  --cacheDir /tmp/juris-seo-cache \
  --destination /tmp/juris-seo-preview --cleanDestinationDir
python3 scripts/check-seo.py /tmp/juris-seo-preview
```

The checker reads the generated site and validates canonical URLs, unique titles
and descriptions, one H1 per page, JSON-LD references, social image resources,
internal links and fragments, homepage reachability, sitemap coverage, robots.txt,
and the generated `llms.txt`. It uses only the Python standard library.

After validation, refresh the committed GitHub Pages export while preserving the
custom domain:

```sh
rsync -a --delete --exclude=/CNAME /tmp/juris-seo-preview/ docs/
python3 scripts/check-seo.py docs
git diff --check
```

The checker assumes a domain-root deployment. For a different domain, override
the Hugo base URL and the checker's `--base-url` together. A preview must not
accidentally replace the production `docs/` export.

## Hosting and post-deployment checks

These changes prepare the branch and static export. They do not change DNS,
GitHub Pages settings, or Search Console, and do not publish the branch.

The audit on 9 October 2026 found that HTTP served the site without redirecting
to HTTPS and that the certificate for `www.juris.sk` did not cover that hostname.
Before considering those issues resolved:

1. Verify the custom domain and DNS in GitHub Pages settings, including `www`.
2. Provision a valid certificate for both names and enable **Enforce HTTPS**.
3. Confirm HTTP and the `www` alias redirect to `https://juris.sk/`, preserving
   paths. See [GitHub Pages HTTPS documentation][https-guide].
4. Confirm deployed canonical URLs, robots.txt, sitemap.xml, and a real HTTP 404.
5. Validate the deployed profile with the [Rich Results Test][rich-results] and
   use Search Console URL Inspection to check Google's selected canonical and
   indexing. Submit the sitemap there.
6. Measure mobile and desktop performance, including opening cards and scrolling.
   Keep laboratory results separate from real-user Core Web Vitals. The audit's
   PageSpeed API calls returned HTTP 429; no field performance result was obtained.

Good Core Web Vitals thresholds at the 75th percentile of real visits are
LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1. A small asset budget or a successful
local browser check is not proof that these thresholds are met.

## Implementation validation on 9 October 2026

- Production build passed with Hugo 0.163.3.
- The output checker passed for 18 HTML pages and 12 indexable content pages.
- Browser checks at 1440 × 900 and 390 × 844 confirmed identical section
  dimensions, no horizontal overflow, functional project links, and disclosures
  both with animation and with JavaScript disabled.
- The original portrait and content URLs were retained. The GitHub link next to
  the blog is the only added homepage label.
- Controlled local mobile measurements used Chromium, a 390 × 844 viewport,
  4× CPU slowdown, 150 ms simulated latency, 1.6 Mbps download throughput, no
  browser cache, and blocked external analytics. Three samples per version gave
  median LCP 532 ms before and 560 ms after, with CLS 0 in both. The maximum
  observed interaction event duration had a median of 48 ms in both versions.
  These values are laboratory observations, not Lighthouse scores, field INP,
  or evidence of production Core Web Vitals compliance.

[ai-guide]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[profile-schema]: https://developers.google.com/search/docs/appearance/structured-data/profile-page
[https-guide]: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
[rich-results]: https://search.google.com/test/rich-results
