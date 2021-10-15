import {
  AccountTreeSharp,
  ArrowBack,
  ArrowForward,
  Input,
  Mouse,
  Refresh,
  Screenshot,
  Settings,
  Visibility,
} from '@mui/icons-material';
import { ScrapperAction } from '@scrapper-gate/shared/schema';

export const scrapperActionIcons = {
  [ScrapperAction.Click]: <Mouse />,
  [ScrapperAction.ReadText]: <Visibility />,
  [ScrapperAction.GoBack]: <ArrowBack />,
  [ScrapperAction.NavigateTo]: <ArrowForward />,
  [ScrapperAction.ReloadPage]: <Refresh />,
  [ScrapperAction.Type]: <Input />,
  [ScrapperAction.Condition]: <AccountTreeSharp />,
  [ScrapperAction.Screenshot]: <Screenshot />,
  [ScrapperAction.ChangeRunSettings]: <Settings />,
};
