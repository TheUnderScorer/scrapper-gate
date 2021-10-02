import { MyScrapperRunsList } from '@scrapper-gate/frontend/domain/scrapper';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { ScrapperRunListItemFragment } from '@scrapper-gate/shared/schema';
import { useHistory } from 'react-router-dom';
import { EmptyContentArt } from '../../../../../../libs/frontend/ui/src/molecules/EmptyContentArt/EmptyContentArt';
import { useActiveScrapperRunIdInContent } from '../hooks/useActiveScrapperRunIdInContent';
import { useContentEntityToggle } from '../hooks/useContentEntityToggle';

export const PopupScrapperRunsView = () => {
  const scrapperRunRouteParams = useActiveScrapperRunIdInContent();

  const history = useHistory();

  const handleScrapperRunClick =
    useContentEntityToggle<ScrapperRunListItemFragment>({
      activeEntityInContentId: scrapperRunRouteParams?.runId,
      showEntityInContent: (entity) => ({
        visible: true,
        path: browserExtensionRoutes.content.scrapperRun({
          runId: entity.id,
          drawerOpen: true,
        }),
      }),
    });

  return (
    <MyScrapperRunsList
      activeScrapperRunId={scrapperRunRouteParams?.runId}
      onRunClick={handleScrapperRunClick}
      emptyContent={
        <EmptyContentArt
          onCreate={() => history.push(browserExtensionRoutes.popup.scrappers)}
          createText="View scrappers"
          title="No runs found."
          subTitle="Your scrapper runs will be displayed here."
        />
      }
    />
  );
};
