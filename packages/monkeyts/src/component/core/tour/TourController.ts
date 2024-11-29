import { stepComponent, TourState } from './TourState';
export type TourControllerConfig = {
  steps: stepComponent[];
};
export class TourController {
  private _currentStep: number;
  private tourState: TourState;
  private static instance: TourController;
  private constructor({ steps }: TourControllerConfig) {
    this.tourState = new TourState({ steps });
    this._currentStep = 0;
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
    if (this._currentStep < this.tourState._stepsComponent.length - 1) {
      this._currentStep++;
    } else {
      this.endTour();
    }
  }
  start() {
    const targetElement = this.getCurrentActiveStepElement();
    if (!targetElement) {
      this.endTour();
      console.error('No target element found');
      return;
    }
  }
  onPrev() {
    this._currentStep--;
    if (this._currentStep < 0) {
      this.endTour();
    }
  }
  onCancel() {
    this.endTour();
  }
  onEnd() {}
  endTour() {
    this.tourState.endTour();
  }
  get totalSteps(): number {
    return this.tourState._stepsComponent.length;
  }
  get currentStep(): number {
    return this._currentStep;
  }
  get isLastStep(): boolean {
    return this._currentStep === this.totalSteps - 1;
  }
  getCurrentStepContent() {
    if (this.tourState._stepsComponent[this._currentStep])
      return this.tourState._stepsComponent[this._currentStep];
  }
  getCurrentActiveStepElement() {
    if (this.tourState._stepsComponent[this._currentStep])
      return document.querySelector(
        this.tourState._stepsComponent[this._currentStep].element,
      );
  }
}
