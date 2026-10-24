# OpenTofu course

French course on infrastructure as code with OpenTofu (the open source fork of
Terraform), from the basics to advanced topics. Labs run on AWS and are
destroyed after each test. Published at https://menraromial.com/opentofu-course/.

## Layout

- `docs/` course pages (MDX), one folder per part
- `labs/chNN/` the code of each chapter, as tested
- `figures/` TikZ sources of the figures (`make -C figures` builds `src/figures/*.svg`)
- `tools/` `check-cleanup.sh` (lists AWS resources still tagged `course=opentofu`),
  `chapter_links.py` (turns "ch. N" references into links)
- `PLAN.md`, `PROMPT.md` outline and writing rules (in French)

## Local preview

```bash
npm ci
npm start
```
