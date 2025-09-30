from __future__ import annotations

import time
import re
from html import unescape
from typing import Any, Dict, Generator, Optional, Tuple
from urllib.parse import urlencode

import requests


_TAG_RE = re.compile(r"<[^>]+>")


def strip_html_to_text(html: str) -> str:
    text = _TAG_RE.sub(" ", unescape(html or ""))
    return re.sub(r"\s+", " ", text).strip()


class TTLCache:
    def __init__(self, ttl_sec: int = 60, max_items: int = 256) -> None:
        self.ttl = ttl_sec
        self.max_items = max_items
        self.store: Dict[str, Tuple[float, Any, Dict[str, str]]] = {}

    def get(self, key: str) -> Optional[Tuple[Any, Dict[str, str]]]:
        now = time.time()
        entry = self.store.get(key)
        if not entry:
            return None
        ts, val, meta = entry
        if now - ts < self.ttl:
            return val, meta
        self.store.pop(key, None)
        return None

    def set(self, key: str, value: Any, meta: Dict[str, str]) -> None:
        if len(self.store) >= self.max_items:
            self.store.pop(next(iter(self.store)))
        self.store[key] = (time.time(), value, meta)


class CourseAPIClient:
    BASE = "https://servuswebshop.oesterreichinstitut.com"

    def __init__(self, location_id: int = 8, rps: float = 2.0, timeout: float = 8.0, ttl: int = 60) -> None:
        self.location_id = location_id
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "oei-live-agent/0.1"})
        self.timeout = timeout
        self.sleep = 1.0 / max(0.5, rps)
        self.cache = TTLCache(ttl_sec=ttl)

    def _cached_get(self, path: str, params: Dict[str, Any]) -> Any:
        key = f"{path}?{urlencode(sorted(params.items()), doseq=True)}"
        cached = self.cache.get(key)
        headers: Dict[str, str] = {}
        if cached:
            _, meta = cached
            if meta.get("etag"):
                headers["If-None-Match"] = meta["etag"]
            if meta.get("last_modified"):
                headers["If-Modified-Since"] = meta["last_modified"]
        time.sleep(self.sleep)
        resp = self.session.get(f"{self.BASE}{path}", params=params, headers=headers, timeout=self.timeout)
        if resp.status_code == 304 and cached:
            return cached[0]
        resp.raise_for_status()
        meta = {
            "etag": resp.headers.get("ETag", ""),
            "last_modified": resp.headers.get("Last-Modified", ""),
        }
        data = resp.json()
        self.cache.set(key, data, meta)
        return data

    def get_courses_page(self, page: int = 1, location_id: Optional[int] = None) -> Dict[str, Any]:
        loc = self.location_id if location_id is None else int(location_id)
        return self._cached_get("/api/courses", {"location_ids": loc, "page": page})

    def iter_courses(self, max_pages: int = 1, location_id: Optional[int] = None) -> Generator[Dict[str, Any], None, None]:
        page = 1
        while page <= max_pages:
            data = self.get_courses_page(page, location_id=location_id)
            for c in data.get("courses", []):
                if "description" in c:
                    c["description_plain"] = strip_html_to_text(c["description"])  # normalize
                yield c
            pagy = data.get("pagy") or {}
            nxt = pagy.get("next")
            if not nxt:
                break
            page = int(nxt)

    def get_course_detail(self, course_id: int, location_id: Optional[int] = None) -> Dict[str, Any]:
        loc = self.location_id if location_id is None else int(location_id)
        data = self._cached_get(f"/api/courses/{course_id}", {"location_ids[]": loc})
        if isinstance(data, dict) and "description" in data:
            data["description_plain"] = strip_html_to_text(data["description"])  # normalize
        return data

    def get_placement_tests(self, location_id: Optional[int] = None) -> Dict[str, Any]:
        loc = self.location_id if location_id is None else int(location_id)
        return self._cached_get("/api/courses/placement_tests", {"location_ids": loc})


