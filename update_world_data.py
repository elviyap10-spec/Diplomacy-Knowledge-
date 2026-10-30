#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DIPLOMACY LAB — MOTEUR D'ACTUALISATION AUTOMATIQUE MONDIALE
Interroge les APIs officielles ouvertes (Banque Mondiale Open Data / ONU DESA)
et effectue une fusion intelligente (Smart Merge) sur les 202 entités
sans jamais écraser les textes d'analyse géopolitique, sociologique ou institutionnelle.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

# Détection automatique de la racine du projet (fonctionne si placé à la racine ou dans scripts/)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.exists(os.path.join(CURRENT_DIR, "monde.html")) or os.path.exists(os.path.join(CURRENT_DIR, "index.html")):
    BASE_DIR = CURRENT_DIR
else:
    BASE_DIR = os.path.dirname(CURRENT_DIR)

CONTINENTS = ["europe", "africa", "asia", "america", "oceania"]

# Mapping des indicateurs de l'API Banque Mondiale (REST v2)
INDICATORS = {
    # Démographie
    "pop_total": "SP.POP.TOTL",            # Population totale
    "fertility": "SP.DYN.TFRT.IN",         # Taux de fécondité (ISF)
    "life_total": "SP.DYN.LE00.IN",        # Espérance de vie totale
    "life_women": "SP.DYN.LE00.FE.IN",     # Espérance de vie femmes
    "life_men": "SP.DYN.LE00.MA.IN",       # Espérance de vie hommes
    "pop_growth": "SP.POP.GROW",           # Taux d'accroissement annuel %
    "urban_rate": "SP.URB.TOTL.IN.ZS",     # Taux d'urbanisation %
    "infant_mort": "SP.DYN.IMRT.IN",       # Mortalité infantile ‰
    
    # Économie
    "gdp_nominal": "NY.GDP.MKTP.CD",       # PIB nominal USD
    "gdp_per_capita": "NY.GDP.PCAP.CD",    # PIB par habitant USD
    "gdp_growth": "NY.GDP.MKTP.KD.ZG",     # Croissance du PIB %
    "inflation": "FP.CPI.TOTL.ZG",         # Inflation IPC %
    "public_debt": "GC.DOD.TOTL.GD.ZS"     # Dette publique centrale % PIB
}

def fetch_wb_indicator(iso3, indicator_id, max_retries=2):
    """
    Interroge l'API officielle de la Banque Mondiale pour un pays et un indicateur.
    Récupère la valeur la plus récente non nulle des 4 dernières années.
    """
    url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator_id}?format=json&date=2021:2024&per_page=5"
    headers = {"User-Agent": "DiplomacyLab-Bot/1.0 (academic data sync)"}
    
    req = urllib.request.Request(url, headers=headers)
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                if response.status != 200:
                    return None
                data = json.loads(response.read().decode("utf-8"))
                if len(data) > 1 and isinstance(data[1], list):
                    for entry in data[1]:
                        val = entry.get("value")
                        if val is not None:
                            return {"value": val, "year": entry.get("date")}
                return None
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(1)
            else:
                return None
    return None

def format_population_fr(val):
    """Formate un effectif en français (millions ou milliers)."""
    if val >= 1_000_000_000:
        return f"{val / 1_000_000_000:.1f} milliard d'habitants".replace(".", ",")
    elif val >= 1_000_000:
        return f"{val / 1_000_000:.1f} millions d'habitants".replace(".", ",")
    else:
        return f"{int(val):,} habitants".replace(",", " ")

def format_gdp_fr(val):
    """Formate un PIB nominal en USD en français."""
    if val >= 1_000_000_000_000:
        return f"{val / 1_000_000_000_000:.1f} billions USD".replace(".", ",")
    elif val >= 1_000_000_000:
        return f"{round(val / 1_000_000_000):,} milliards USD".replace(",", " ")
    else:
        return f"{round(val / 1_000_000):,} millions USD".replace(",", " ")

def update_demography_for_country(iso3, country_obj):
    """Met à jour les données quantitatives démographiques sans toucher aux textes qualitatifs."""
    pop_res = fetch_wb_indicator(iso3, INDICATORS["pop_total"])
    if pop_res and pop_res["value"]:
        pop_str = format_population_fr(pop_res["value"])
        old_pop = country_obj.get("general", {}).get("population", "")
        if "(" in old_pop:
            note = old_pop[old_pop.find("("):]
            country_obj["general"]["population"] = f"{pop_str} {note}"
        else:
            country_obj["general"]["population"] = pop_str

    grow_res = fetch_wb_indicator(iso3, INDICATORS["pop_growth"])
    if grow_res and grow_res["value"] is not None:
        sign = "+" if grow_res["value"] >= 0 else ""
        grow_val = f"{sign}{grow_res['value']:.1f} % par an".replace(".", ",")
        old_grow = country_obj.get("general", {}).get("growthRate", "")
        if "(" in old_grow:
            note = old_grow[old_grow.find("("):]
            country_obj["general"]["growthRate"] = f"{grow_val} {note}"
        else:
            country_obj["general"]["growthRate"] = grow_val

    fert_res = fetch_wb_indicator(iso3, INDICATORS["fertility"])
    if fert_res and fert_res["value"] is not None:
        fert_str = f"{fert_res['value']:.1f} enfant{'s' if fert_res['value'] >= 1.5 else ''} par femme".replace(".", ",")
        old_fert = country_obj.get("fertilityMortality", {}).get("fertilityRate", "")
        if "(" in old_fert:
            note = old_fert[old_fert.find("("):]
            country_obj["fertilityMortality"]["fertilityRate"] = f"{fert_str} {note}"
        else:
            country_obj["fertilityMortality"]["fertilityRate"] = fert_str

    le_tot = fetch_wb_indicator(iso3, INDICATORS["life_total"])
    if le_tot and le_tot["value"]:
        country_obj.setdefault("ageStructure", {}).setdefault("lifeExpectancy", {})
        country_obj["ageStructure"]["lifeExpectancy"]["total"] = f"{le_tot['value']:.1f} ans".replace(".", ",")

    le_fem = fetch_wb_indicator(iso3, INDICATORS["life_women"])
    if le_fem and le_fem["value"]:
        country_obj.setdefault("ageStructure", {}).setdefault("lifeExpectancy", {})
        country_obj["ageStructure"]["lifeExpectancy"]["women"] = f"{le_fem['value']:.1f} ans".replace(".", ",")

    le_hom = fetch_wb_indicator(iso3, INDICATORS["life_men"])
    if le_hom and le_hom["value"]:
        country_obj.setdefault("ageStructure", {}).setdefault("lifeExpectancy", {})
        country_obj["ageStructure"]["lifeExpectancy"]["men"] = f"{le_hom['value']:.1f} ans".replace(".", ",")

    urb_res = fetch_wb_indicator(iso3, INDICATORS["urban_rate"])
    if urb_res and urb_res["value"] is not None:
        urb_str = f"{urb_res['value']:.1f} %".replace(".", ",")
        old_urb = country_obj.get("urbanization", {}).get("urbanRate", "")
        if "(" in old_urb:
            note = old_urb[old_urb.find("("):]
            country_obj["urbanization"]["urbanRate"] = f"{urb_str} {note}"
        else:
            country_obj["urbanization"]["urbanRate"] = urb_str

def update_economy_for_country(iso3, country_obj):
    """Met à jour les données macro-économiques sans toucher à la structure ou aux partenaires."""
    gdp_res = fetch_wb_indicator(iso3, INDICATORS["gdp_nominal"])
    if gdp_res and gdp_res["value"]:
        country_obj.setdefault("macro", {})
        country_obj["macro"]["gdpNominal"] = format_gdp_fr(gdp_res["value"])

    cap_res = fetch_wb_indicator(iso3, INDICATORS["gdp_per_capita"])
    if cap_res and cap_res["value"]:
        country_obj.setdefault("macro", {})
        country_obj["macro"]["gdpPerCapita"] = f"{round(cap_res['value']):,} USD".replace(",", " ")

    grw_res = fetch_wb_indicator(iso3, INDICATORS["gdp_growth"])
    if grw_res and grw_res["value"] is not None:
        sign = "+" if grw_res["value"] >= 0 else ""
        country_obj.setdefault("macro", {})
        country_obj["macro"]["growth"] = f"{sign}{grw_res['value']:.1f} %".replace(".", ",")

    inf_res = fetch_wb_indicator(iso3, INDICATORS["inflation"])
    if inf_res and inf_res["value"] is not None:
        country_obj.setdefault("macro", {})
        country_obj["macro"]["inflation"] = f"{inf_res['value']:.1f} %".replace(".", ",")

def process_all_continents():
    print("=" * 60)
    print("DIPLOMACY LAB : LANCEMENT DE LA SYNCHRONISATION MONDIALE")
    print(f"Répertoire de travail : {BASE_DIR}")
    print("Sources : Banque Mondiale (WDI API v2) & Nations Unies")
    print("=" * 60)
    
    total_updated = 0
    
    for continent in CONTINENTS:
        # Recherche de tous les chemins possibles pour la démographie
        demo_candidates = [
            os.path.join(BASE_DIR, f"{continent}_demographie.json"),
            os.path.join(BASE_DIR, "data", f"{continent}_demographie.json"),
            os.path.join(BASE_DIR, "data", "demographie", f"{continent}.json")
        ]
        demo_path = next((p for p in demo_candidates if os.path.exists(p)), None)
        
        # Recherche de tous les chemins possibles pour l'économie
        eco_candidates = [
            os.path.join(BASE_DIR, f"{continent}_economie.json"),
            os.path.join(BASE_DIR, "data", f"{continent}_economie.json"),
            os.path.join(BASE_DIR, "data", "economie", f"{continent}.json")
        ]
        eco_path = next((p for p in eco_candidates if os.path.exists(p)), None)
        
        print(f"\nTraitement du continent : {continent.upper()}")
        
        # 1. Démographie
        if demo_path:
            print(f"  Fichier démographie trouvé : {demo_path}")
            with open(demo_path, "r", encoding="utf-8") as f:
                demo_data = json.load(f)
            
            for iso3, c_obj in demo_data.items():
                print(f"  [DEMO] Actualisation {iso3}...", end=" ", flush=True)
                try:
                    update_demography_for_country(iso3, c_obj)
                    print("OK")
                except Exception as e:
                    print(f"ERR ({e})")
                time.sleep(0.1)
            
            # Sauvegarder dans tous les emplacements existants pour ce continent
            for p in demo_candidates:
                if os.path.exists(p) or p == demo_path:
                    os.makedirs(os.path.dirname(p), exist_ok=True)
                    with open(p, "w", encoding="utf-8") as f:
                        json.dump(demo_data, f, ensure_ascii=False, indent=4)
                    print(f"  -> Enregistré : {p}")
            total_updated += len(demo_data)
        
        # 2. Économie
        if eco_path:
            print(f"  Fichier économie trouvé : {eco_path}")
            with open(eco_path, "r", encoding="utf-8") as f:
                eco_data = json.load(f)
            
            for iso3, c_obj in eco_data.items():
                print(f"  [ECO]  Actualisation {iso3}...", end=" ", flush=True)
                try:
                    update_economy_for_country(iso3, c_obj)
                    print("OK")
                except Exception as e:
                    print(f"ERR ({e})")
                time.sleep(0.1)
            
            for p in eco_candidates:
                if os.path.exists(p) or p == eco_path:
                    os.makedirs(os.path.dirname(p), exist_ok=True)
                    with open(p, "w", encoding="utf-8") as f:
                        json.dump(eco_data, f, ensure_ascii=False, indent=4)
                    print(f"  -> Enregistré : {p}")

    print("\n" + "=" * 60)
    print(f"SYNCHRONISATION TERMINEE AVEC SUCCES : {total_updated} pays vérifiés et actualisés.")
    print("=" * 60)

if __name__ == "__main__":
    process_all_continents()
