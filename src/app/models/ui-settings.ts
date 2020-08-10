import { ViewMode } from './view-mode';

export interface UiSettings {
  viewMode: ViewMode;
  bestCount: number;
  fromDate: string;
  toDate: string;
}
