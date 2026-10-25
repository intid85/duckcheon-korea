#!/usr/bin/env python3
"""
DUCKCHEON KOREA (dctrade.co.kr) Private Blog View Count Reporter
- Queries the invisible tracker namespace (dctrade_kr_priv_9616) on Abacus API
- Scans all .html files in /workspace/duckcheon-korea-site/blog/ automatically
- Reports Yesterday (KST), Today (KST), and Cumulative Total views per post and across the blog
"""

import argparse
import datetime
import glob
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from zoneinfo import ZoneInfo

NAMESPACE = "dctrade_kr_priv_9616"
API_BASE = "https://abacus.jasoncameron.dev"
BLOG_DIR = "/workspace/duckcheon-korea-site/blog"
KST = ZoneInfo("Asia/Seoul")


def fnv1a_hex8(s: str) -> str:
    h = 0x811c9dc5
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xffffffff
    return f"{h:08x}"


def short_slug(slug: str) -> str:
    clean = re.sub(r"[^a-z0-9_-]+", "-", (slug or "").lower()).strip("-") or "home"
    if len(clean) <= 44:
        return clean
    return f"{clean[:35]}_{fnv1a_hex8(clean)}"


def get_counter(key: str, retries: int = 2) -> int:
    url = f"{API_BASE}/get/{NAMESPACE}/{urllib.parse.quote(key)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "DCTrade-Stats-Reporter/1.0",
            "Accept": "application/json",
        },
    )
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=6) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    val = data.get("value", 0)
                    return int(val) if isinstance(val, (int, float)) else 0
                return 0
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return 0
            if e.code == 429 and attempt < retries:
                time.sleep(1.5 * (attempt + 1))
                continue
            return 0
        except Exception:
            if attempt < retries:
                time.sleep(0.5)
                continue
            return 0
    return 0


def extract_title(filepath: str) -> str:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read(8192)
        m_h1 = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.IGNORECASE | re.DOTALL)
        if m_h1:
            t = re.sub(r"<[^>]+>", "", m_h1.group(1)).strip()
            if t:
                return html.unescape(t)
        m_title = re.search(r"<title[^>]*>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
        if m_title:
            t = re.sub(r"\s*\|\s*DUCKCHEON KOREA.*$", "", m_title.group(1)).strip()
            if t:
                return html.unescape(t)
    except Exception:
        pass
    return os.path.basename(filepath)


def fetch_page_stats(slug: str, title: str, url: str, yesterday_str: str, today_str: str) -> dict:
    s_key = short_slug(slug)
    y_val = get_counter(f"day__{yesterday_str}__{s_key}")
    t_val = get_counter(f"day__{today_str}__{s_key}")
    tot_val = get_counter(f"total__{s_key}")
    # Ensure cumulative total is at least the sum of yesterday + today
    if tot_val < (y_val + t_val):
        tot_val = y_val + t_val
    return {
        "slug": slug,
        "short_key": s_key,
        "title": title,
        "url": url,
        "yesterday": y_val,
        "today": t_val,
        "total": tot_val,
    }


def main():
    parser = argparse.ArgumentParser(description="Check dctrade.co.kr blog pageviews (KST)")
    parser.add_argument("--json-only", action="store_true", help="Print JSON output only")
    args = parser.parse_args()

    now_kst = datetime.datetime.now(KST)
    today_str = now_kst.strftime("%Y-%m-%d")
    yesterday_str = (now_kst - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

    # 1. Main website home (dctrade.co.kr/)
    home_stats = fetch_page_stats(
        slug="home",
        title="DUCKCHEON KOREA 공식 홈페이지 메인 (dctrade.co.kr)",
        url="https://dctrade.co.kr/",
        yesterday_str=yesterday_str,
        today_str=today_str,
    )

    # 2. Blog index (dctrade.co.kr/blog/)
    blog_index_stats = fetch_page_stats(
        slug="blog-index",
        title="K-Beauty Blog 메인 목록 (/blog/)",
        url="https://dctrade.co.kr/blog/",
        yesterday_str=yesterday_str,
        today_str=today_str,
    )

    # 3. All individual blog post HTML files in /workspace/duckcheon-korea-site/blog/*.html
    html_files = sorted(
        glob.glob(os.path.join(BLOG_DIR, "*.html")),
        key=lambda p: os.path.getmtime(p),
        reverse=True,
    )

    posts = []
    for fpath in html_files:
        fname = os.path.basename(fpath)
        if fname.lower() == "index.html":
            continue
        slug = fname[:-5] if fname.lower().endswith(".html") else fname
        title = extract_title(fpath)
        url = f"https://dctrade.co.kr/blog/{fname}"
        st = fetch_page_stats(slug, title, url, yesterday_str, today_str)
        posts.append(st)
        time.sleep(0.08)

    # 4. Aggregate blog totals
    all_blog_y_key = get_counter(f"day__{yesterday_str}__all_blog")
    all_blog_t_key = get_counter(f"day__{today_str}__all_blog")
    all_blog_tot_key = get_counter("total__all_blog")

    sum_blog_y = blog_index_stats["yesterday"] + sum(p["yesterday"] for p in posts)
    sum_blog_t = blog_index_stats["today"] + sum(p["today"] for p in posts)
    sum_blog_tot = blog_index_stats["total"] + sum(p["total"] for p in posts)

    blog_totals = {
        "yesterday": max(all_blog_y_key, sum_blog_y),
        "today": max(all_blog_t_key, sum_blog_t),
        "total": max(all_blog_tot_key, sum_blog_tot),
    }

    report = {
        "checked_at_kst": now_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
        "yesterday_date": yesterday_str,
        "today_date": today_str,
        "namespace": NAMESPACE,
        "blog_totals": blog_totals,
        "home": home_stats,
        "blog_index": blog_index_stats,
        "posts_count": len(posts),
        "posts": posts,
    }

    if args.json_only:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return

    print("======================================================================")
    print(f"📊 [dctrade.co.kr 비공개 조회수 리포트] ({now_kst.strftime('%Y-%m-%d %H:%M')} KST 기준)")
    print("======================================================================")
    print(f"• 블로그 전체 조회수 : 어제({yesterday_str}) {blog_totals['yesterday']}회 | 오늘({today_str}) {blog_totals['today']}회 | 누적 {blog_totals['total']}회")
    print(f"• 공식 홈페이지 메인 : 어제({yesterday_str}) {home_stats['yesterday']}회 | 오늘({today_str}) {home_stats['today']}회 | 누적 {home_stats['total']}회")
    print(f"• 블로그 메인(/blog/): 어제 {blog_index_stats['yesterday']}회 | 오늘 {blog_index_stats['today']}회 | 누적 {blog_index_stats['total']}회")
    print("----------------------------------------------------------------------")
    print(f"📝 개별 영문 블로그 포스트별 조회수 (총 {len(posts)}건):")
    for idx, p in enumerate(posts, 1):
        short_title = p["title"] if len(p["title"]) <= 62 else p["title"][:59] + "..."
        print(f"  {idx}. {short_title}")
        print(f"     - 주소: {p['url']}")
        print(f"     - 조회수: 어제 {p['yesterday']}회 · 오늘 {p['today']}회 · 누적 {p['total']}회")
    print("======================================================================")
    print("\n---JSON---")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
