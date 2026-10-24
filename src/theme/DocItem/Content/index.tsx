import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {findPart, chapterNumber} from '@site/src/components/parts';

type Props = WrapperProps<typeof ContentType>;

type Header = {part?: number; chapter?: number; label?: string};

// Header line above the title, written like a resource address in a plan:
// part on the left, chapter number on the right.
// Front matter: part (0 to 8) and chapter (1 to 41), or label for free text
// ("Annexe B").
export default function ContentWrapper(props: Props): ReactNode {
  const {frontMatter} = useDoc();
  const {part, chapter, label} = frontMatter as Header;
  const p = findPart(part);
  const right = label ?? (chapter !== undefined ? `ch. ${chapterNumber(chapter)}` : undefined);
  return (
    <>
      {(p || right) && (
        <div className="doc-header">
          {p && (
            <span className="doc-header__part">
              <span className="doc-header__tag">part {p.num}</span>
              {p.title}
            </span>
          )}
          {right && <span className="doc-header__chapter">{right}</span>}
        </div>
      )}
      <Content {...props} />
    </>
  );
}
