import React, {type ReactNode} from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import AdmonitionLayout from '@theme/Admonition/Layout';
import type {Props} from '@theme/Admonition';

// Course-specific boxes, on top of note, tip, info, warning, danger:
//   :::trap     a frequent mistake
//   :::cost     what an AWS resource costs while it runs
//   :::cloud    the equivalent resources on other providers (not executed)
//   :::cleanup  how to remove everything the lab created
//   :::summary  the chapter's revision sheet
function makeBox(type: string, defaultTitle: string) {
  return function Box(props: Props): ReactNode {
    return (
      <AdmonitionLayout {...props} type={type} icon={null} title={props.title ?? defaultTitle}>
        {props.children}
      </AdmonitionLayout>
    );
  };
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  trap: makeBox('trap', 'Erreur fréquente'),
  cost: makeBox('cost', 'Coût'),
  cloud: makeBox('cloud', 'Sur un autre cloud'),
  cleanup: makeBox('cleanup', 'Nettoyage'),
  summary: makeBox('summary', 'Fiche de révision'),
};

export default AdmonitionTypes;
