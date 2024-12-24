import { PopoverBuilderConfig } from '../component/popover/PopoverBuilder';
import PopoverManager from '../component/popover/PopoverManager';
import BaseStyleManager, { ThemeType } from '../styles/BaseStyleManager';
import {
  TourController,
  TourControllerConfig,
} from '../component/tour/TourController';
import { stepComponent } from '../main';

export type TourConfig = {
  controllerConfig: TourControllerConfig;
  tourConfig: PopoverBuilderConfig;
};

export class Tour {
  private tourConfig: PopoverBuilderConfig;
  private steps: stepComponent[];
  constructor(config: TourConfig, theme?: Partial<ThemeType>) {
    const {
      controllerConfig: { steps },
      tourConfig,
    } = config;
    if (theme) {
      BaseStyleManager.overrideTheme(theme);
    }
    this.steps = steps;
    this.tourConfig = tourConfig;
  }
  initTour() {
    TourController.initInstance({ steps: this.steps });
    new PopoverManager(this.tourConfig);
  }
  async start() {
    if (!TourController.getInstance().isTourStarted) {
      await TourController.getInstance().start();
    }
  }
  get isTourActive(): boolean {
    try {
      return TourController.getInstance().isTourActive;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return false;
    }
  }
  distroy() {
    TourController.getInstance().endTour();
  }
}
