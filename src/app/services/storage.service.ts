import { Injectable } from '@angular/core';
import { UiSettings } from '../models/ui-settings';
import { ViewMode } from '../models/view-mode';
import * as moment from 'moment';
import { DATE_FORMAT } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static readonly STORAGE_KEY = 'UI_SETTINGS';

  public removeUiSettings(): void {
    localStorage.removeItem(StorageService.STORAGE_KEY);
  }

  public storeUiSettings(uiSettings: UiSettings): void {
    localStorage.setItem(StorageService.STORAGE_KEY, JSON.stringify(uiSettings));
  }

  public readUiSettings(): UiSettings {
    if (!localStorage.getItem(StorageService.STORAGE_KEY)) {
      this.initLocalStorage();
      console.log(this.readUiSettings());
    }
    const uiSettings: UiSettings = JSON.parse(localStorage.getItem(StorageService.STORAGE_KEY));
    for (const key of Object.keys(ViewMode)) {
      if (uiSettings.viewMode.apiName === ViewMode[key].apiName) {
        uiSettings.viewMode = ViewMode[key];
      }
    }
    return uiSettings;
  }

  private initLocalStorage(): void {
    this.storeUiSettings({
      viewMode: ViewMode.TOTAL,
      bestCount: 5,
      toDate: moment().subtract(1, 'day').format(DATE_FORMAT),
      fromDate: moment().subtract(1, 'month').format(DATE_FORMAT)
    });
  }
}
