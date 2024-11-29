import { PopoverBuilderConfig } from '../component/core/popover/PopoverBuilder';
import PopoverManager from '../component/core/popover/PopoverManager';
import {
  TourController,
  TourControllerConfig,
} from '../component/core/tour/TourController';

export type TourConfig = {
  controllerConfig: TourControllerConfig;
  tourConfig: PopoverBuilderConfig;
};

/**
 * purpose of this class would be to integrate the process of creating the state for the tour
 * and integrate the process of updating the ui along with state
 */
export class Tour {
  private _tour: TourController;
  private _popover?: PopoverManager;
  constructor(config: TourConfig) {
    const {
      controllerConfig: { steps },
      tourConfig,
    } = config;
    this._tour = new TourController({ steps });
    this._popover = new PopoverManager(tourConfig);
  }

  init() {
    if (this._popover) this._popover.init(this._tour);
  }
  start() {
    this._popover?.start();
  }
  distroy() {
    if (this._popover) this._popover.distroy();
    this._tour.distroyTour();
  }
}
