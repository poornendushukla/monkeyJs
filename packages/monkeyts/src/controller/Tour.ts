import { PopoverBuilderConfig } from '../component/popover/PopoverBuilder';
import PopoverManager from '../component/popover/PopoverManager';
import BaseStyleManager, { ThemeType } from '../styles/BaseStyleManager';
import {
  TourController,
  TourControllerConfig,
} from '../component/tour/TourController';

export type TourConfig = {
  controllerConfig: TourControllerConfig;
  tourConfig: PopoverBuilderConfig;
};

export class Tour {
  private _popover?: PopoverManager;
  private tourConfig: PopoverBuilderConfig;
  constructor(config: TourConfig, theme?: ThemeType) {
    const {
      controllerConfig: { steps },
      tourConfig,
    } = config;
    if (theme) {
      BaseStyleManager.overrideTheme(theme);
    }
    TourController.initInstance({ steps });
    this.tourConfig = tourConfig;
  }
  init() {
    this._popover = new PopoverManager(this.tourConfig);
  }
  start() {
    if (!this._popover) this.init();
    this._popover?.start();
  }
  get isTourActive(): boolean {
    return TourController.getInstance().isTourActive;
  }
  distroy() {
    if (this._popover) this._popover.distroy();
    TourController.getInstance().endTour();
  }
}
