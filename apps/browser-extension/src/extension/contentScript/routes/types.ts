export interface ManageScrapperParams {
  id?: string;
  screen?: ManageScrapperScreen;
  drawerOpen?: boolean;
}

export interface ManageScrapperStepParams {
  scrapperId?: string;
  stepId?: string;
  drawerOpen?: boolean;
}

export interface ResultDetailsParams {
  resultId: string;
}

export interface ManageStepLocationParams {
  stepId?: string;
  scrapperId?: string;
}

export enum ManageScrapperScreen {
  Preview = 'preview',
  Settings = 'settings',
  Steps = 'steps',
}
