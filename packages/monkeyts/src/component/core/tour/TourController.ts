import MonkeyEvent from '../../../event/MonkeyEvent';
import { stepComponent, TourState } from './TourState';
export type TourControllerConfig = {
  steps: stepComponent[];
};
export class TourController {
  private tourState: TourState;
  private eventEmitter: MonkeyEvent;
  private static instance: TourController | null;
  private constructor({ steps }: TourControllerConfig) {
    this.tourState = new TourState({ steps });
    this.eventEmitter = new MonkeyEvent();
  }
  static initInstance({ steps }: TourControllerConfig) {
    if (!TourController.instance)
      TourController.instance = new TourController({ steps });
  }
  static getInstance() {
    if (!TourController.instance) {
      throw new Error('Tour is not initialized yet! try refreshing🤞');
    }
    return TourController.instance;
  }
  onNext() {
    if (
      this.tourState.currentStep <
      this.tourState._stepsComponent.length - 1
    ) {
      this.tourState.incrementSteps();
    } else {
      console.log('coming here');
      this.endTour();
    }
  }
  start() {
    if (this.tourState.isTourActive) {
      throw new Error(
        'Tour is active, are you trying to start same tour multiple times🤷‍♂️....',
      );
    }
    const targetElement = this.getCurrentActiveStepElement();
    if (!targetElement) {
      this.endTour();
      console.error('No target element found');
      return;
    }
  }
  onPrev() {
    this.tourState.decrementSteps();
    if (this.tourState.currentStep < 0) {
      this.endTour();
    }
  }
  onCancel() {
    this.endTour();
  }
  onEnd() {}
  endTour() {
    this.tourState.endTour();
    this.eventEmitter.monkeyDispatch('onEnd', {});
    TourController.instance = null;
  }
  get totalSteps(): number {
    return this.tourState._stepsComponent.length;
  }
  get currentStep(): number {
    return this.tourState.currentStep;
  }
  get isLastStep(): boolean {
    return this.tourState.currentStep === this.totalSteps - 1;
  }
  getCurrentStepContent() {
    if (this.tourState._stepsComponent[this.tourState.currentStep])
      return this.tourState._stepsComponent[this.tourState.currentStep];
  }
  getCurrentActiveStepElement() {
    if (this.tourState._stepsComponent[this.tourState.currentStep])
      return document.querySelector(
        `#${this.tourState._stepsComponent[this.tourState.currentStep].element}`,
      );
  }
}
