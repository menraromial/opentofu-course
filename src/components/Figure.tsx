import React, {type ComponentType, type ReactNode, type SVGProps} from 'react';

type Props = {
  // component imported from src/figures (source: figures/src/<name>.tex):
  //   import loop from '@site/src/figures/iac-loop.svg';
  //   <Figure svg={loop} num="1.1" alt="...">caption</Figure>
  svg: ComponentType<SVGProps<SVGSVGElement> & {title?: string}>;
  num: string;
  alt: string;
  // maximum width in pixels, for small figures that would look oversized
  // at full column width
  max?: number;
  children: ReactNode;
};

// SVGs are inlined (not <img>) so that their colours, written as CSS
// variables, follow the light or dark theme.
export default function Figure({svg: Svg, num, alt, max, children}: Props): ReactNode {
  return (
    <figure className="figure">
      <div className="figure__plate">
        <Svg role="img" aria-label={alt} style={max ? {maxWidth: `${max}px`} : undefined} />
      </div>
      <figcaption>
        <span className="figure__num">Figure {num}</span>
        {children}
      </figcaption>
    </figure>
  );
}
