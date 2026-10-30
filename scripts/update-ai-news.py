#!/usr/bin/env python3
"""Build a small, database-free AI news digest from publishers' public RSS feeds.

Run from repository root: python3 scripts/update-ai-news.py
The output is a static JSON file for GitHub Pages, capped at the latest 50 links.
Uses only the Python standard library; it doesn't scrape article bodies.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "ai-news.json"
MAX_ARTICLES = 50
MAX_PER_SOURCE = 15
MAX_AGE_DAYS = 45
TIMEOUT = 14

# Publisher feeds, not search snippets. Failures are isolated per source.
SOURCES = (
    ("The Verge", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"),
    ("TechCrunch", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    ("VentureBeat", "https://venturebeat.com/category/ai/feed/"),
    ("MIT Technology Review", "https://www.technologyreview.com/topic/artificial-intelligence/feed/"),
    ("WIRED", "https://www.wired.com/feed/tag/ai/latest/rss"),
    ("Google AI", "https://blog.google/technology/ai/rss/"),
    ("OpenAI", "https://openai.com/news/rss.xml"),
    ("Google DeepMind", "https://deepmind.google/blog/rss.xml"),
    ("Hugging Face", "https://huggingface.co/blog/feed.xml"),
)

ATOM = "{http://www.w3.org/2005/Atom}"
DC_DATE = "{http://purl.org/dc/elements/1.1/}date"

# Some publisher AI-category RSS feeds include unrelated promotional posts.
# Trust specialist blogs, but check headlines from general-interest outlets.
SPECIALIST_SOURCES = {"OpenAI", "Google AI", "Google DeepMind", "Hugging Face"}
AI_HEADLINE = re.compile(
    r"\\b(?:AI|A\\.I\\.|LLMs?|AGI|ChatGPT|Claude|Gemini|Copilot|OpenAI|Anthropic|DeepMind|"
    r"GPT(?:-\\d+)?|Sora|Grok|Perplexity|Mistral|Midjourney|Veo|"
    r"chatbots?|robots?|robotics|neural|inference|generative|agents?|models?)\\b|"
    r"artificial intelligence|machine learning|large language",
    flags=re.IGNORECASE,
)


def is_ai_story(title: str, source: str) -> bool:
    return source in SPECIALIST_SOURCES or AI_HEADLINE.search(title) is not None


def clean_title(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", html.unescape(value))).strip()[:210]


def normalize_url(value: str) -> str:
    parts = urlsplit(value.strip())
    if parts.scheme != "https" or not parts.netloc:
        return ""
    filtered = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True)
                if not k.lower().startswith("utm_") and k.lower() not in ("fbclid", "gclid")]
    return urlunsplit(("https", parts.netloc.lower(), parts.path or "/", urlencode(filtered), ""))


def parse_date(raw: str | None) -> datetime | None:
    if not raw:
        return None
    try:
        parsed = parsedate_to_datetime(raw)
    except (TypeError, ValueError, IndexError):
        try:
            parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def extract_entries(xml_data: bytes, source: str, now: datetime) -> list[dict]:
    root = ET.fromstring(xml_data)
    nodes = root.findall(".//item") or root.findall(f".//{ATOM}entry")
    records = []
    oldest = now - timedelta(days=MAX_AGE_DAYS)
    for node in nodes:
        title = clean_title("".join(node.find("title").itertext()) if node.find("title") is not None
                            else "".join(node.find(f"{ATOM}title").itertext()) if node.find(f"{ATOM}title") is not None
                            else "")
        link = (node.findtext("link") or "").strip()
        if not link:
            for alternate in node.findall(f"{ATOM}link"):
                if alternate.get("rel", "alternate") == "alternate" and alternate.get("href"):
                    link = alternate.get("href", "")
                    break
        url = normalize_url(link)
        published = parse_date(node.findtext("pubDate") or node.findtext(f"{DC_DATE}")
                               or node.findtext(f"{ATOM}published") or node.findtext(f"{ATOM}updated"))
        if not title or not url or not published or not is_ai_story(title, source) or not oldest <= published <= now + timedelta(days=1):
            continue
        records.append({
            "id": hashlib.sha1(url.encode("utf-8")).hexdigest()[:16],
            "title": title,
            "url": url,
            "source": source,
            "publishedAt": published.isoformat(timespec="seconds").replace("+00:00", "Z"),
        })
        if len(records) >= MAX_PER_SOURCE:
            break
    return records


def load_previous() -> dict:
    try:
        payload = json.loads(OUTPUT.read_text(encoding="utf-8"))
        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        pass
    return {"updatedAt": None, "items": []}


def refresh() -> bool:
    now = datetime.now(timezone.utc)
    previous = load_previous()
    fetched = []
    succeeded = 0
    for source, url in SOURCES:
        try:
            request = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; VibeCoderNews/1.0; RSS reader)",
                "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml",
            })
            with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
                xml_data = response.read(2_000_000)
            items = extract_entries(xml_data, source, now)
            if items:
                fetched.extend(items)
                succeeded += 1
                print(f"{source}: {len(items)} stories")
        except (OSError, ValueError, ET.ParseError) as error:
            print(f"Feed unavailable ({source}): {error}", file=sys.stderr)

    if not succeeded:
        print("No feeds were usable; preserving the last published digest.", file=sys.stderr)
        return False

    previous_items = previous.get("items", [])
    combined = (previous_items if isinstance(previous_items, list) else []) + fetched
    unique = {}
    earliest = now - timedelta(days=MAX_AGE_DAYS)
    for item in combined:
        if not isinstance(item, dict):
            continue
        url = normalize_url(str(item.get("url", "")))
        date = parse_date(str(item.get("publishedAt", "")))
        title = clean_title(str(item.get("title", "")))
        source = str(item.get("source", ""))[:80]
        if not url or not title or not source or not date or not is_ai_story(title, source) or not earliest <= date <= now + timedelta(days=1):
            continue
        unique[url] = {
            "id": hashlib.sha1(url.encode("utf-8")).hexdigest()[:16],
            "title": title, "url": url, "source": source,
            "publishedAt": date.isoformat(timespec="seconds").replace("+00:00", "Z"),
        }

    # Retain the 50 newest stories total, automatically dropping older items.
    recent = sorted(unique.values(), key=lambda item: (item["publishedAt"], item["id"]), reverse=True)[:MAX_ARTICLES]
    if not recent:
        print("Feeds returned no recent stories; preserving published digest.", file=sys.stderr)
        return False

    payload = {"updatedAt": now.isoformat(timespec="seconds").replace("+00:00", "Z"), "items": recent}
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(recent)} AI stories from {succeeded} sources to {OUTPUT}")
    return True


if __name__ == "__main__":
    refresh()
