#!/usr/bin/env python3
"""Extract website result tables from the paper's checked LaTeX sources."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


GENERATION_SPECS = {
    "QM9": {
        "file": "contents/blocks/tab_qm9.tex",
        "columns": ["Validity ↑", "Unique ↑", "Novelty ↑", "V.U.N. ↑", "FCD ↓", "NSPDK ↓", "κBF ↓", "κOR ↓"],
    },
    "MOSES": {
        "file": "contents/blocks/tab_moses.tex",
        "columns": ["Validity ↑", "Unique ↑", "Novelty ↑", "V.U.N. ↑", "FCD ↓", "Filters ↑", "SNN ↑", "Scaffold ↑", "κBF ↓", "κOR ↓"],
    },
    "GuacaMol": {
        "file": "contents/blocks/tab_guacamol.tex",
        "columns": ["Validity ↑", "Unique ↑", "Novelty ↑", "V.U.N. ↑", "FCD score ↑", "KL score ↑", "κBF ↓", "κOR ↓"],
    },
    "ZINC250k": {
        "file": "contents/blocks/tab_zinc250k.tex",
        "columns": ["Validity ↑", "Unique ↑", "Novelty ↑", "V.U.N. ↑", "FCD ↓", "NSPDK ↓", "κBF ↓", "κOR ↓"],
    },
    "RingDiv300k": {
        "file": "contents/blocks/tab_ringdiv300k.tex",
        "columns": ["Validity ↑", "Unique ↑", "Novelty ↑", "V.U.N. ↑", "KL score ↑", "FCD ↓", "NSPDK ↓", "SA dist. ↓", "κBF ↓", "κOR ↓"],
    },
}

FOUNDATION_FILE = "contents/blocks/tab_FM_transfer_combined.tex"
FOUNDATION_COLUMNS = ["BBBP", "Tox21", "ToxCast", "SIDER", "ClinTox", "HIV", "BACE", "Average ↑"]


def remove_comments(text: str) -> str:
    lines = []
    for line in text.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("%"):
            continue
        lines.append(line.split("%", 1)[0])
    return "\n".join(lines)


def row_segments(text: str) -> list[str]:
    clean = remove_comments(text)
    return [segment.strip() for segment in clean.split(r"\\") if segment.strip()]


def clean_tex(value: str) -> str:
    value = value.strip()
    value = re.sub(r"\\(?:midrule|bottomrule|toprule|hline)", "", value)
    value = re.sub(r"\\cmidrule(?:\([^)]*\))?\{[^}]*\}", "", value)
    value = re.sub(r"\\spm\{([^{}]*)\}", r" ± \1", value)
    for command in ("textbf", "textit", "mathrm", "mathbf", "operatorname"):
        value = re.sub(rf"\\{command}\{{([^{{}}]*)\}}", r"\1", value)
    value = re.sub(r"\\cite\{[^{}]*\}", "", value)
    value = re.sub(r"\\(?:bf|it)\b", "", value)
    value = value.replace(r"\uparrow", "↑").replace(r"\downarrow", "↓")
    value = value.replace(r"\text{BF}", "BF").replace(r"\text{OR}", "OR")
    value = value.replace("$", "").replace("~", " ")
    value = value.replace("{", "").replace("}", "")
    value = re.sub(r"\\[A-Za-z]+", "", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def parse_rows(text: str, expected_values: int) -> list[dict]:
    rows = []
    for segment in row_segments(text):
        if "&" not in segment or "multicolumn" in segment or "multirow" in segment:
            continue
        raw_cells = [cell.strip() for cell in segment.split("&")]
        method = clean_tex(raw_cells[0])
        if method in {"Method", "Model"} or method.endswith((" Method", " Model")) or not method:
            continue
        values = raw_cells[1:]
        if len(values) != expected_values:
            continue
        rows.append(
            {
                "method": method,
                "featured": method.startswith("HGR"),
                "values": [
                    {"value": clean_tex(cell), "best": r"\textbf" in cell}
                    for cell in values
                ],
            }
        )
    return rows


def parse_foundation(text: str) -> dict[str, list[dict]]:
    protocols: dict[str, list[dict]] = {"Probing": [], "Full fine-tuning": []}
    current: str | None = None
    for segment in row_segments(text):
        if "Probing with frozen encoder" in segment:
            current = "Probing"
            continue
        if "Full fine-tuning" in segment:
            current = "Full fine-tuning"
            continue
        if current is None or "&" not in segment or "multicolumn" in segment:
            continue
        raw_cells = [cell.strip() for cell in segment.split("&")]
        method = clean_tex(raw_cells[0])
        if method in {"Method", "Model"} or len(raw_cells[1:]) != len(FOUNDATION_COLUMNS):
            continue
        protocols[current].append(
            {
                "method": method,
                "featured": method.startswith("HGR"),
                "values": [
                    {"value": clean_tex(cell), "best": r"\textbf" in cell}
                    for cell in raw_cells[1:]
                ],
            }
        )
    return protocols


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--latex-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    generation = {}
    for name, spec in GENERATION_SPECS.items():
        source = args.latex_root / spec["file"]
        rows = parse_rows(source.read_text(), len(spec["columns"]))
        if not rows:
            raise RuntimeError(f"No rows extracted from {source}")
        generation[name] = {
            "columns": spec["columns"],
            "rows": rows,
            "source": spec["file"],
        }

    fm_source = args.latex_root / FOUNDATION_FILE
    protocols = parse_foundation(fm_source.read_text())
    if not all(protocols.values()):
        raise RuntimeError(f"Missing foundation-model rows in {fm_source}")

    result = {
        "generationOrder": ["QM9", "MOSES", "GuacaMol", "ZINC250k", "RingDiv300k"],
        "generation": generation,
        "foundation": {
            "columns": FOUNDATION_COLUMNS,
            "protocolOrder": ["Probing", "Full fine-tuning"],
            "protocols": protocols,
            "source": FOUNDATION_FILE,
        },
    }
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
