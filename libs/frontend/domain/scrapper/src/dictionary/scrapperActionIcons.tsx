import {
  AccountTreeSharp,
  ArrowBack,
  ArrowForward,
  AvTimer,
  Code,
  Input,
  Mouse,
  ReadMore,
  Refresh,
  Screenshot,
  Settings,
  Visibility,
} from '@mui/icons-material';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { ReactNode } from 'react';

export const scrapperActionIcons: Record<ScrapperAction, ReactNode> = {
  [ScrapperAction.Click]: <Mouse />,
  [ScrapperAction.ReadText]: <Visibility />,
  [ScrapperAction.ReadAttribute]: <ReadMore />,
  [ScrapperAction.GoBack]: <ArrowBack />,
  [ScrapperAction.NavigateTo]: <ArrowForward />,
  [ScrapperAction.ReloadPage]: <Refresh />,
  [ScrapperAction.Type]: <Input />,
  [ScrapperAction.Condition]: <AccountTreeSharp />,
  [ScrapperAction.Screenshot]: <Screenshot />,
  [ScrapperAction.ChangeRunSettings]: <Settings />,
  [ScrapperAction.Wait]: <AvTimer />,
  [ScrapperAction.RunJavascript]: <Code />,
};
