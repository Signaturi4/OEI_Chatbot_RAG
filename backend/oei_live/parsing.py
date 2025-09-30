from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

CITY_TZ = {
    "Wrocław": "Europe/Warsaw",
    "Warszawa": "Europe/Warsaw",
    "Warsaw": "Europe/Warsaw",
    "Krakow": "Europe/Warsaw",
    "Kraków": "Europe/Warsaw",
    "Bratislava": "Europe/Bratislava",
    "Budapest": "Europe/Budapest",
    "Rome": "Europe/Rome",
    "Roma": "Europe/Rome",
    "Vienna": "Europe/Vienna",
    "Wien": "Europe/Vienna",
    "Belgrade": "Europe/Belgrade",
    "Beograd": "Europe/Belgrade",
    "Sarajevo": "Europe/Sarajevo",
    "Zagreb": "Europe/Zagreb",
}


def normalize_course_summary(c: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": c.get("id"),
        "title": c.get("title"),
        "level": c.get("levels"),
        "status": c.get("status"),
        "free_places": c.get("free_places_count"),
        "start_date": c.get("start_at"),
        "end_date": c.get("finish_at"),
        "price": c.get("price"),
        "currency": c.get("currency_symbol") or c.get("currency"),
        "format": c.get("format_text"),
        "target_group": c.get("target_group_text"),
        "location_city": (c.get("university", {}) or {}).get("location") or (c.get("university", {}) or {}).get("title"),
    }


def normalize_course_detail(d: Dict[str, Any]) -> Dict[str, Any]:
    # flatten course_weekdays
    weekdays = []
    for w in d.get("course_weekdays", []) or []:
        wv = w.get("course_weekdays", {}) or {}
        weekdays.append({
            "week_day": wv.get("week_day"),
            "start_time": wv.get("start_time"),
            "finish_time": wv.get("finish_time"),
        })
    # flatten teachers
    teachers = []
    for t in d.get("teachers", []) or []:
        tv = t.get("teachers", {}) or {}
        teachers.append({
            "id": tv.get("id"),
            "name": tv.get("full_name") or f"{tv.get('first_name','')} {tv.get('last_name','')}".strip(),
            "email": tv.get("email"),
            "city": tv.get("city"),
            "country": tv.get("country"),
        })
    uni = d.get("university", {}) or {}
    normalized = {
        "id": d.get("id"),
        "title": d.get("title"),
        "level": d.get("levels"),
        "status": d.get("status"),
        "description": d.get("description_plain") or d.get("description") or "",
        "start_date": d.get("start_at"),
        "end_date": d.get("finish_at"),
        "price": d.get("price"),
        "currency": d.get("currency_symbol") or d.get("currency"),
        "format": d.get("format_text"),
        "lesson_duration": d.get("lesson_duration_text"),
        "frequency": d.get("frequency_text"),
        "times_of_day": d.get("times_of_day"),
        "weekdays": weekdays,
        "teachers": teachers,
        "location_city": uni.get("location") or uni.get("title"),
        "location_country": (uni.get("country") or {}).get("country_name") if isinstance(uni.get("country"), dict) else None,
    }
    normalized["timezone"] = CITY_TZ.get(normalized.get("location_city") or "", None)
    return normalized


