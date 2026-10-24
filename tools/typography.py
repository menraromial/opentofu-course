"""French typography of the course pages, to run after each chapter.

- narrow no-break space (U+202F) between digit groups: 200 000;
- no-break space (U+00A0) before ":", inside « » quotes, and between a
  number and its unit (300 ms, 4 Go);
- narrow no-break space before ";", "?", "!";
- typographic apostrophe (U+2019) between two letters, also in the
  title and sidebar_label of the front matter.
Front matter (other keys), import lines, code blocks, inline code and link
targets are left untouched.

Usage: python3 tools/typography.py docs/part-0/infrastructure-as-code.mdx [...]
"""
import re
import sys
from pathlib import Path

NARROW, NBSP = " ", " "
UNITS = r"h|min|ms|s|%|o|Ko|Mo|Go|To|Gio|Mio|USD|€|\$"


def fix_text(t):
    t = re.sub(r"(?<=\d) (?=\d{3}(?!\d))", NARROW, t)
    t = re.sub(r"(?<=\d) (?=\d{3}(?!\d))", NARROW, t)  # 1 000 000: two passes
    t = re.sub(rf"(?<=\d) (?=(?:{UNITS})(?!\w))", NBSP, t)
    t = re.sub(r" :(?=\s|$)", NBSP + ":", t)
    t = re.sub(r" ([;?!])", NARROW + r"\1", t)
    t = re.sub(r"(?<=\w)'(?=\w)", "’", t)
    t = re.sub(r"« ", "«" + NBSP, t)
    t = re.sub(r" »", NBSP + "»", t)
    return t


def fix_line(line):
    pieces = re.split(r"(`[^`]*`|\]\([^)]*\))", line)
    return "".join(p if p.startswith("`") or p.startswith("](") else fix_text(p) for p in pieces)


def fix(path):
    lines = Path(path).read_text().split("\n")
    out, in_code, front = [], False, 0
    for i, line in enumerate(lines):
        if i == 0 and line == "---":
            front = 1
            out.append(line)
            continue
        if front == 1:
            if line == "---":
                front = 2
            elif line.startswith(("title:", "sidebar_label:")):
                line = re.sub(r"(?<=\w)'(?=\w)", "’", line)
            out.append(line)
            continue
        if line.lstrip().startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        if in_code or line.startswith("import "):
            out.append(line)
            continue
        out.append(fix_line(line))
    Path(path).write_text("\n".join(out))


if __name__ == "__main__":
    for p in sys.argv[1:]:
        fix(p)
