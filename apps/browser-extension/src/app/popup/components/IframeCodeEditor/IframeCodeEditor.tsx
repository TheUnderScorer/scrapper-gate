import { OpenInNew, Refresh } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import { ScrapperCodeEditorProps } from '@scrapper-gate/frontend/domain/scrapper';
import { Centered } from '@scrapper-gate/frontend/ui';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { getPopupUrl } from '../../../../extension/popup/getPopupUrl';
import { useIframeCodeEditor } from './useIframeCodeEditor';

const StyledIframe = styled('iframe')`
  box-shadow: none;
  border: none;
  height: 100%;
  min-height: 500px;
  width: 100%;

  &:not(.loaded) {
    opacity: 0;
    visibility: hidden;
  }
`;

export const IframeCodeEditor = (props: ScrapperCodeEditorProps) => {
  const { sessionId, reload } = useIframeCodeEditor(props);

  const [loaded, setLoaded] = useState(false);

  const url = useMemo(
    () =>
      getPopupUrl(
        browserExtensionRoutes.popup.codeEditor({
          sessionId,
        })
      ),
    [sessionId]
  );

  return (
    <>
      {!loaded && (
        <Centered>
          <Stack alignItems="center" spacing={2} direction="column">
            <CircularProgress />
            <Typography variant="body2">Loading editor...</Typography>
          </Stack>
        </Centered>
      )}
      <StyledIframe
        data-name={props.name}
        key={sessionId}
        onLoad={() => setLoaded(true)}
        className={classNames({ loaded }, 'iframe-code-editor')}
        src={url}
      />
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          marginTop: 0,
        }}
      >
        <Typography variant="body2">Having issues with editor?</Typography>
        <Tooltip title="Reload editor">
          <IconButton
            size="small"
            onClick={async () => {
              setLoaded(false);

              await reload();
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open editor in new tab">
          <IconButton href={url} target="_blank">
            <OpenInNew />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
};
