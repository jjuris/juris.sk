#!/usr/bin/env python3
"""Check the actual Hugo output without dependencies or network requests."""

import argparse
from collections import Counter
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.meta = {}
        self.canonical = []
        self.links = []
        self.ids = []
        self.assets = []
        self.h1 = 0
        self.title = ""
        self.graphs = []
        self.in_title = False
        self.in_schema = False
        self.schema = ""
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "meta":
            key = attrs.get("name", attrs.get("property"))
            self.meta[key] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        if tag == "link" and attrs.get("rel") in ("stylesheet", "icon"):
            self.assets.append(attrs.get("href"))
        if tag in ("img", "script") and "src" in attrs:
            self.assets.append(attrs["src"])
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.in_title = True
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema = ""

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_schema:
            self.graphs.append(json.loads(self.schema))
            self.in_schema = False

    @property
    def indexable(self):
        return "noindex" not in self.meta.get("robots", "").lower()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", nargs="?", default="docs")
    parser.add_argument("--base-url", default="https://juris.sk/")
    args = parser.parse_args()
    root = Path(args.directory).resolve()
    base = args.base_url.rstrip("/") + "/"
    origin = urlsplit(base).netloc
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    pages = {}
    for path in sorted(root.rglob("*.html")):
        rel = path.relative_to(root).as_posix()
        url = urljoin(base, rel.removesuffix("index.html"))
        try:
            pages[url] = Page(path)
        except (ValueError, OSError) as error:
            errors.append(f"{rel}: {error}")
    check(bool(pages), "No HTML pages found")
    indexable = {url: page for url, page in pages.items() if page.indexable}
    descriptions = Counter(page.meta.get("description") for page in indexable.values())
    titles = Counter(page.title for page in indexable.values())

    def local_target(href, current):
        url = urlsplit(urljoin(current, href))
        if url.scheme not in ("http", "https") or url.netloc != origin:
            return None, None
        path = root / unquote(url.path).lstrip("/")
        if path.is_dir():
            path = path / "index.html"
        return path, url

    for url, page in pages.items():
        name = page.path.relative_to(root).as_posix()
        check(page.h1 == 1, f"{name}: expected one H1, found {page.h1}")
        check(len(page.ids) == len(set(page.ids)), f"{name}: duplicate HTML IDs")
        if page.indexable:
            check(page.canonical == [url], f"{name}: canonical does not match its URL")
            check(
                bool(page.title) and titles[page.title] == 1,
                f"{name}: missing or duplicate title",
            )
            description = page.meta.get("description")
            check(
                bool(description) and descriptions[description] == 1,
                f"{name}: missing or duplicate description",
            )
            check(len(page.graphs) == 1, f"{name}: expected one JSON-LD graph")
            for graph in page.graphs:
                check(
                    graph.get("@context") == "https://schema.org",
                    f"{name}: invalid schema context",
                )
                nodes = graph.get("@graph", [])
                ids = [node.get("@id") for node in nodes]
                check(
                    all(ids) and len(ids) == len(set(ids)),
                    f"{name}: missing or duplicate schema IDs",
                )
                types = {node.get("@type") for node in nodes}
                check({"Person", "WebSite"} <= types, f"{name}: missing identity graph")
                if url == base:
                    profile = next(
                        (n for n in nodes if n.get("@type") == "ProfilePage"),
                        {},
                    )
                    check(
                        profile.get("mainEntity", {}).get("@id") in ids,
                        f"{name}: missing profile mainEntity",
                    )

                def references(value):
                    if isinstance(value, dict):
                        if set(value) == {"@id"}:
                            check(
                                value["@id"] in ids,
                                f"{name}: unresolved schema reference "
                                f"{value['@id']}",
                            )
                        for item in value.values():
                            references(item)
                    elif isinstance(value, list):
                        for item in value:
                            references(item)

                references(graph)
            check(
                page.meta.get("twitter:card") == "summary_large_image",
                f"{name}: missing Twitter Card",
            )
            check(page.meta.get("og:url") == url, f"{name}: inconsistent OG URL")
            check(
                bool(page.meta.get("og:image:alt")),
                f"{name}: missing social image alt text",
            )
        for href in page.links + page.assets + [page.meta.get("og:image", "")]:
            if not href:
                continue
            path, target = local_target(href, url)
            if path is None:
                continue
            check(path.is_file(), f"{name}: broken local URL {href}")
            if target.fragment and path.is_file() and path.suffix == ".html":
                target_url = target._replace(fragment="", query="").geturl()
                target_page = pages.get(target_url)
                check(
                    target_page is not None
                    and unquote(target.fragment) in target_page.ids,
                    f"{name}: missing fragment {href}",
                )

    sitemap = ET.parse(root / "sitemap.xml").getroot()
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locations = [node.text for node in sitemap.findall("s:url/s:loc", namespace)]
    check(len(locations) == len(set(locations)), "Duplicate sitemap URLs")
    check(set(locations) == set(indexable), "Sitemap and indexable HTML pages differ")
    for node in sitemap.findall("s:url/s:lastmod", namespace):
        modified = datetime.fromisoformat(node.text.replace("Z", "+00:00"))
        check(
            modified <= datetime.now(timezone.utc),
            "Sitemap contains a future lastmod",
        )
    robots = (root / "robots.txt").read_text()
    check(
        f"Sitemap: {base}sitemap.xml" in robots,
        "Missing robots.txt sitemap declaration",
    )
    check(
        not re.search(r"^Disallow:\s*/\s*$", robots, re.M),
        "robots.txt blocks the site",
    )
    llms = (root / "llms.txt").read_text()
    for href in re.findall(r"\]\(([^)]+)\)", llms):
        path, _ = local_target(href, base)
        if path is not None:
            check(path.is_file(), f"llms.txt: broken local URL {href}")

    reached = {base}
    pending = [base]
    while pending:
        url = pending.pop()
        page = pages.get(url)
        if page is None:
            continue
        for href in page.links:
            target = (
                urlsplit(urljoin(url, href))
                ._replace(fragment="", query="")
                .geturl()
            )
            if target in pages and target not in reached:
                reached.add(target)
                pending.append(target)
    check(
        set(indexable) <= reached,
        f"Pages unreachable from homepage: {sorted(set(indexable) - reached)}",
    )
    if (root / "CNAME").exists():
        check(
            (root / "CNAME").read_text().strip() == origin,
            "CNAME does not match the production domain",
        )
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)
    print(
        f"PASS: {len(pages)} HTML pages, {len(indexable)} indexable pages, "
        "valid JSON-LD, sitemap, metadata, and local links"
    )


if __name__ == "__main__":
    main()
