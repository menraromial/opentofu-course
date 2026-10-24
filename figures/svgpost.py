"""Prepare an SVG produced by pdftocairo for inclusion in a page.

- every palette colour becomes a CSS variable (the figure follows the light
  or dark theme of the site); a colour outside the palette makes the script
  fail, so that no hard-coded hue slips into a figure;
- ids are prefixed with the figure name, so that two figures on the same
  page do not clash;
- coordinates are rounded to two decimals;
- fixed width and height are removed: the figure fits the text column and
  the viewBox keeps its proportions.

Usage: python3 svgpost.py input.svg output.svg
"""
import re
import sys
from pathlib import Path

from palette import read_palette

HEX = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
RGB = re.compile(r"rgb\(\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)")
COLOR_ATTR = re.compile(r'(fill|stroke)=[\'"](#[0-9a-fA-F]{3,6}|rgb\([^)]*\))[\'"]')


def normalize(h):
    h = h.upper()
    return "".join(c * 2 for c in h) if len(h) == 3 else h


def to_hex(color):
    """#abc, #aabbcc or rgb(x%, y%, z%) -> AABBCC"""
    m = RGB.fullmatch(color.strip())
    if m:
        return "".join(f"{round(float(v) * 2.55):02X}" for v in m.groups())
    return normalize(color.lstrip("#"))


def closest(h, table, filename):
    """The palette colour within rounding distance (<= 2 per channel)."""
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    for ref, var in table.items():
        rr, gg, bb = (int(ref[i:i + 2], 16) for i in (0, 2, 4))
        if max(abs(r - rr), abs(g - gg), abs(b - bb)) <= 2:
            return var
    sys.exit(f"{filename}: colour #{h} not in palette.tsv")


def main(src, dst):
    svg = Path(src).read_text()
    name = Path(dst).stem
    table = {c: v for _, c, v, _ in read_palette()}
    table["000000"] = "--fig-ink"  # TikZ default black: text without explicit colour
    table["FFFFFF"] = "--fig-paper"

    # fill="..." / stroke="..." attributes -> style, because var() is not
    # accepted everywhere in presentation attributes
    def attr(m):
        prop, var = m.group(1), closest(to_hex(m.group(2)), table, src)
        return f'style="{prop}:var({var})"'

    svg = COLOR_ATTR.sub(attr, svg)
    # remaining colours, inside existing style attributes
    svg = RGB.sub(lambda m: f"var({closest(to_hex(m.group(0)), table, src)})", svg)
    svg = HEX.sub(lambda m: f"var({closest(normalize(m.group(1)), table, src)})", svg)
    # two style attributes on the same element: merge them
    svg = re.sub(r'style="([^"]*)"((?:\s+[\w:-]+=[\'"][^\'"]*[\'"])*)\s+style="([^"]*)"',
                 r'style="\1;\3"\2', svg)

    ids = set(re.findall(r'\bid=[\'"]([^\'"]+)[\'"]', svg))
    for i in sorted(ids, key=len, reverse=True):
        new = f"{name}-{i}"
        svg = re.sub(rf'\bid=([\'"]){re.escape(i)}\1', f'id="{new}"', svg)
        svg = re.sub(rf'#{re.escape(i)}\b', f"#{new}", svg)

    # two decimals are plenty on screen and halve the size, except inside
    # transform matrices: truncating their scale (0.999026 -> 0.99) shifts
    # arrow heads away from their lines
    parts = re.split(r'(transform="[^"]*")', svg)
    svg = "".join(p if p.startswith('transform="') else re.sub(r"(\d+\.\d{2})\d+", r"\1", p)
                  for p in parts)

    svg = re.sub(r'<svg([^>]*?)\s+width=[\'"][^\'"]*[\'"]', r"<svg\1", svg, count=1)
    svg = re.sub(r'<svg([^>]*?)\s+height=[\'"][^\'"]*[\'"]', r"<svg\1", svg, count=1)
    Path(dst).write_text(svg)


if __name__ == "__main__":
    main(*sys.argv[1:3])
