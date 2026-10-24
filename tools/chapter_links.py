"""Turn the "ch. N" references in the course pages into links to the chapters.

The list of written chapters comes from src/components/parts.ts (field doc).
A reference to a chapter not written yet stays plain text; it becomes a link
when the script runs again after that chapter is written. The script first
removes the links it created, then links everything again, so it is safe to
run it any number of times.

Recognised forms: "ch. 12", "ch. 24 et 25", "ch. 24 à 26", "ch. 8 ou 9"
(regular or no-break space after "ch."). Left untouched: the YAML front
matter, code blocks, inline code, headings, JSX lines (figure alt texts),
import and admonition lines, and references from a chapter to itself.
Usage: python3 tools/chapter_links.py   (from the repository root)
"""
import os
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SP = "[   ]"


def chapters():
    text = (ROOT / "src/components/parts.ts").read_text()
    table = {}
    for num, doc in re.findall(r"\{num: (\d+), title: '(?:[^'\\]|\\.)*', doc: '([^']+)'\}", text):
        for ext in (".mdx", ".md"):
            f = DOCS / f"{doc}{ext}"
            if f.exists():
                table[int(num)] = f
    return table


# a link created by this script: [ch. 12](...) or [25](...), to a .md(x) file
LINK = re.compile(rf"\[((?:ch\.{SP})?\d+)\]\(([^)\s]+\.mdx?)\)")
REF = re.compile(rf"\bch\.({SP})(\d+)((?:{SP}(?:et|à|ou){SP}\d+)*)")
NEXT = re.compile(rf"({SP}(?:et|à|ou){SP})(\d+)")
PROTECTED = re.compile(r"(`[^`]*`|\]\([^)]*\))")


def link_text(text, table, path):
    def target(n):
        f = table.get(n)
        if f is None or f == path:
            return None
        return os.path.relpath(f, path.parent)

    def replace(m):
        sp, n, rest = m.group(1), int(m.group(2)), m.group(3)
        t = target(n)
        head = f"[ch.{sp}{n}]({t})" if t else f"ch.{sp}{n}"

        def number(s):
            t2 = target(int(s.group(2)))
            return s.group(1) + (f"[{s.group(2)}]({t2})" if t2 else s.group(2))
        return head + NEXT.sub(number, rest)

    pieces = PROTECTED.split(text)
    for i in range(0, len(pieces), 2):  # even indices: outside code and link targets
        pieces[i] = REF.sub(replace, pieces[i])
    return "".join(pieces)


def process(path, table):
    targets = {f.resolve() for f in table.values()}
    lines = path.read_text().split("\n")
    out, in_code, in_header = [], False, lines[:1] == ["---"]
    for k, line in enumerate(lines):
        if in_header:
            out.append(line)
            if k > 0 and line == "---":
                in_header = False
            continue
        if line.lstrip().startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        raw = line.lstrip()
        if in_code or raw.startswith(("#", "<", "import ", ":::")):
            out.append(line)
            continue
        # undo existing links to a chapter before linking everything again
        line = LINK.sub(lambda m: m.group(1) if (path.parent / m.group(2)).resolve() in targets
                        else m.group(0), line)
        out.append(link_text(line, table, path))
    new = "\n".join(out)
    if new != path.read_text():
        path.write_text(new)
        return True
    return False


def main():
    table = chapters()
    changed = [f for f in sorted(DOCS.rglob("*.md*")) if process(f, table)]
    print(f"{len(table)} chapters written; {len(changed)} files changed")
    for f in changed:
        print("  ", f.relative_to(ROOT))


if __name__ == "__main__":
    main()
