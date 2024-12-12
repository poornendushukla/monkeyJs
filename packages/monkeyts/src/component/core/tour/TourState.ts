export type stepComponent = {
  element: string;
  title: string;
  isAsync?: boolean;
  description: string;
};

export type TourBuilderConfig = {
  steps: stepComponent[];
};
/**
 * this should exculsivly have the responsibility of building the tour, ie
 * initializing, adding steps, and ending the tour. registering key events
 */
export class TourState {
  public _stepsComponent: stepComponent[] = [];
  public currentStep: number = 0;
  public isTourActive: boolean = false;
  constructor({ steps }: TourBuilderConfig) {
    this._stepsComponent = steps;
    this.isTourActive = true;
  }
  init() {
    if (this._stepsComponent && this._stepsComponent.length === 0) {
      console.warn('No steps defined');
      return;
    }
  }
  incrementSteps() {
    this.currentStep = this.currentStep + 1;
  }
  decrementSteps() {
    this.currentStep = this.currentStep - 1;
  }
  refreshTour(targetElement: Element) {
    const boundingRect = targetElement.getBoundingClientRect();
    // this is just to avoid the warning from pre-commit hook
    console.log(boundingRect);
  }
  addStepsEnd(steps: stepComponent[]) {
    this._stepsComponent.push(...steps);
  }
  endTour() {
    this.isTourActive = false;
    this._stepsComponent = [];
  }
}

export default TourState;
