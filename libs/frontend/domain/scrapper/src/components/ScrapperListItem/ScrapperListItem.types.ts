import { MyScrappersQuery } from '@scrapper-gate/shared/schema';

export type ScrapperListItemScrapper = MyScrappersQuery['getMyScrappers']['items'][0];

export interface ScrapperListItemProps {
  scrapper: ScrapperListItemScrapper;
}
