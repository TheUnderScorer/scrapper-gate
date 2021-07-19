import { useDialog } from '@scrapper-gate/frontend/dialogs';
import {
  createScrapperDialogId,
  CreateScrapperFormDialog,
} from '@scrapper-gate/frontend/domain/scrapper';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';

export const CreateScrapperView = () => {
  const { push } = useDialog();
  const history = useHistory();

  useMount(() => {
    push({
      id: createScrapperDialogId,
      content: (
        <CreateScrapperFormDialog
          onCreate={(data) => {
            history.push(
              browserExtensionRoutes.content.scrapper({
                scrapperId: data.id,
                drawerOpen: true,
              })
            );
          }}
        />
      ),
    });
  });

  return null;
};
