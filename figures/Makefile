# Course figures: TikZ source (src/*.tex) -> PDF -> SVG inlined in the pages.
#   make          all figures
#   make preview  one PNG per figure in build/, to check the rendering
# diagramme.sty and papier.sty come from ~/texmf (folder diagramme/).
SRC   := $(wildcard src/*.tex)
NAMES := $(patsubst src/%.tex,%,$(SRC))
SVG   := $(patsubst %,../src/figures/%.svg,$(NAMES))
PNG   := $(patsubst %,build/%.png,$(NAMES))

all: $(SVG)

lib/tofu-colors.tex ../src/css/figures.css: palette.tsv palette.py
	python3 palette.py

build/%.pdf: src/%.tex lib/tofu.sty lib/tofu-colors.tex
	@mkdir -p build
	cd build && TEXINPUTS=../lib:../src: lualatex -interaction=nonstopmode -halt-on-error ../src/$*.tex > $*.log.txt || (tail -30 $*.log.txt; false)

../src/figures/%.svg: build/%.pdf svgpost.py palette.tsv
	pdftocairo -svg $< build/$*-raw.svg
	python3 svgpost.py build/$*-raw.svg $@

build/%.png: build/%.pdf
	pdftocairo -png -r 160 -singlefile $< build/$*

preview: $(PNG)

clean:
	rm -rf build

.PHONY: all preview clean
.SECONDARY:
