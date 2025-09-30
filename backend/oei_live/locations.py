from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class City:
    id: int
    name: str
    timezone: str
    onsite_available: bool


@dataclass(frozen=True)
class Country:
    name: str
    code: str
    cities: List[City]
    onsite_note: Optional[str] = None


COUNTRIES: Dict[str, Country] = {
    "Serbia": Country("Serbia", "RS", [City(1, "Belgrade", "Europe/Belgrade", True)]),
    "Slovakia": Country("Slovakia", "SK", [City(2, "Bratislava", "Europe/Bratislava", True)]),
    "Czechia": Country("Czechia", "CZ", [City(3, "Brno", "Europe/Prague", True)]),
    "Hungary": Country("Hungary", "HU", [City(4, "Budapest", "Europe/Budapest", True)]),
    "Poland": Country("Poland", "PL", [
        City(5, "Krakow", "Europe/Warsaw", True),
        City(8, "Warsaw", "Europe/Warsaw", True),
        City(10, "Wroclaw", "Europe/Warsaw", True),
    ]),
    "Italy": Country("Italy", "IT", [City(6, "Rome", "Europe/Rome", True)]),
    "Bosnia and Herzegovina": Country("Bosnia and Herzegovina", "BA", [City(7, "Sarajevo", "Europe/Sarajevo", True)]),
    "Austria": Country(
        "Austria", "AT",
        [City(9, "Vienna", "Europe/Vienna", False)],
        onsite_note=(
            "Austria currently does not offer on-site courses. "
            "Please select a different country for on-site options."
        ),
    ),
}


ID_TO_CITY: Dict[int, City] = {city.id: city for country in COUNTRIES.values() for city in country.cities}

# Reverse lookup: location_id -> country name
ID_TO_COUNTRY_NAME: Dict[int, str] = {}
for cname, country in COUNTRIES.items():
    for c in country.cities:
        ID_TO_COUNTRY_NAME[c.id] = cname


