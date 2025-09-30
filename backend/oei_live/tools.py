from __future__ import annotations

from typing import Any, Dict, List, Optional
from langchain_core.tools import tool

from .client import CourseAPIClient
from .parsing import normalize_course_summary, normalize_course_detail
from .locations import ID_TO_CITY, COUNTRIES, ID_TO_COUNTRY_NAME
import threading

_client = CourseAPIClient(location_id=8)


@tool("list_locations", return_direct=False)
def list_locations() -> Dict[str, Any]:
    """List supported countries and cities with location_ids and onsite availability notes."""
    countries = {}
    for cname, country in COUNTRIES.items():
        countries[cname] = {
            "code": country.code,
            "onsite_note": country.onsite_note,
            "cities": [{"id": c.id, "name": c.name, "timezone": c.timezone, "onsite_available": c.onsite_available} for c in country.cities],
        }
    return {"countries": countries}


@tool("search_courses_live", return_direct=False)
def search_courses_live(query: Optional[str] = None, max_pages: int = 1, location_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """Search live courses for a location_id (default 8=Warsaw). Lightweight by default (1 page)."""
    q = (query or "").lower().strip()
    out: List[Dict[str, Any]] = []
    effective_loc = _client.location_id if location_id is None else int(location_id)
    for c in _client.iter_courses(max_pages=max_pages, location_id=effective_loc):
        hay = " ".join([
            str(c.get("title", "")), str(c.get("levels", "")), str(c.get("status", "")), str(c.get("status_text", ""))
        ]).lower()
        if q and q not in hay:
            continue
        item = normalize_course_summary(c)
        try:
            cid = int(item.get("id")) if item.get("id") is not None else None
        except Exception:
            cid = None
        if cid is not None:
            web = f"https://servuswebshop.oesterreichinstitut.com/en/courses/{effective_loc}/{cid}"
            item["web_url"] = web
            item["link_markdown"] = f"[{item.get('title', 'Course')}]({web})"
        out.append(item)
    return out


@tool("course_detail_live", return_direct=False)
def course_detail_live(course_id: int, location_id: Optional[int] = None) -> Dict[str, Any]:
    """Fetch a live course detail for a given course_id and location_id."""
    effective_loc = _client.location_id if location_id is None else int(location_id)
    raw = _client.get_course_detail(int(course_id), location_id=effective_loc)
    detail = normalize_course_detail(raw)
    try:
        cid = int(detail.get("id")) if detail.get("id") is not None else None
    except Exception:
        cid = None
    if cid is not None:
        web = f"https://servuswebshop.oesterreichinstitut.com/en/courses/{effective_loc}/{cid}"
        detail["web_url"] = web
        detail["link_markdown"] = f"[{detail.get('title', 'Course')}]({web})"
    return detail


@tool("placement_tests_live", return_direct=False)
def placement_tests_live(location_id: Optional[int] = None) -> Dict[str, Any]:
    """Fetch live placement tests for a given location_id."""
    return _client.get_placement_tests(location_id=location_id)


@tool("parallel_search_courses_live", return_direct=False)
def parallel_search_courses_live(query: Optional[str] = None, location_ids: Optional[List[int]] = None, max_pages: int = 1) -> Dict[str, Any]:
    """Run live course searches in parallel across multiple location_ids and return grouped by country.

    Defaults to all known locations if none provided. Lightweight by default (1 page each).
    """
    q = (query or "").lower().strip()
    ids = location_ids or sorted(ID_TO_CITY.keys())
    results_lock = threading.Lock()
    grouped: Dict[str, List[Dict[str, Any]]] = {}

    def work(loc_id: int) -> None:
        items: List[Dict[str, Any]] = []
        for c in _client.iter_courses(max_pages=max_pages, location_id=loc_id):
            hay = " ".join([
                str(c.get("title", "")), str(c.get("levels", "")), str(c.get("status", "")), str(c.get("status_text", ""))
            ]).lower()
            if q and q not in hay:
                continue
            item = normalize_course_summary(c)
            try:
                cid = int(item.get("id")) if item.get("id") is not None else None
            except Exception:
                cid = None
            if cid is not None:
                web = f"https://servuswebshop.oesterreichinstitut.com/en/courses/{loc_id}/{cid}"
                item["web_url"] = web
                item["link_markdown"] = f"[{item.get('title', 'Course')}]({web})"
            items.append(item)
        country = ID_TO_COUNTRY_NAME.get(loc_id, "Unknown")
        with results_lock:
            grouped.setdefault(country, []).extend(items)

    threads = [threading.Thread(target=work, args=(loc_id,), daemon=True) for loc_id in ids]
    for t in threads: t.start()
    for t in threads: t.join()
    # Optionally sort by country and title
    for country, items in grouped.items():
        grouped[country] = sorted(items, key=lambda x: f"{x.get('location_city','')} {x.get('title','')}")
    return {"query": q, "results_by_country": grouped}


