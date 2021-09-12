import { ScrapperRun } from '@scrapper-gate/frontend/domain/scrapper';
import {
  browserExtensionRoutes,
  ScrapperRunResultRouteParams,
} from '@scrapper-gate/shared/routing';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ContentDrawer } from '../../components/ContentDrawer/ContentDrawer';

export const ScrapperRunView = () => {
  const match = useRouteMatch<Pick<ScrapperRunResultRouteParams, 'runId'>>();
  const history = useHistory();

  return (
    <ContentDrawer queryKey="drawerOpen">
      <ScrapperRun
        runId={match.params.runId}
        onQueryError={() => history.push('/')}
        scrapperUrlCreator={browserExtensionRoutes.content.scrapper}
      />
    </ContentDrawer>
  );
};
