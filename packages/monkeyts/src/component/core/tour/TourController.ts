import { stepComponent, TourBuilder } from './TourBuilder';
export type TourControllerConfig = {
  steps: stepComponent[];
};
export class TourController extends TourBuilder {
  private _currentStep: number;
  constructor({ steps }: TourControllerConfig) {
    super({ steps });
    this._currentStep = 0;
  }
  onNext() {
    if (this._currentStep > this._stepsComponent.length) {
      this.distroyTour();
    }
    this._currentStep++;
  }
  start() {
    const targetElement = this.getCurrentActiveStepElement();
    if (!targetElement) {
      this.distroyTour();
      console.error('No target element found');
      return;
    }
  }
  onPrev() {
    this._currentStep--;
    if (this._currentStep < 0) {
      this.distroyTour();
    }
  }
  onCancel() {
    this.distroyTour();
  }
  onEnd() {}
  distroyTour() {
    this.endTour();
  }
  get totalSteps(): number {
    return this._stepsComponent.length;
  }
  get currentStep(): number {
    return this._currentStep;
  }
  get isLastStep(): boolean {
    return this._currentStep === this.totalSteps - 1;
  }
  getCurrentStepContent() {
    if (this._stepsComponent[this._currentStep])
      return this._stepsComponent[this._currentStep];
  }
  getCurrentActiveStepElement() {
    if (this._stepsComponent[this._currentStep])
      return document.querySelector(
        this._stepsComponent[this._currentStep].element,
      );
  }
}
