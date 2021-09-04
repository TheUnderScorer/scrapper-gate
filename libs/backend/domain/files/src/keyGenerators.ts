export const generateScrapperScreenshotFileKey = (
  runId: string,
  stepId: string,
  index = 1
): ScrapperScreenshotFileKey =>
  `scrapper-run-${runId}/step-${stepId}/screenshot-${index}.png`;

export type ScrapperScreenshotFileKey =
  `scrapper-run-${string}/step-${string}/screenshot-${number}.png`;
