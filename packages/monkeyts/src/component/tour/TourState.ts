export type stepComponent = {
  element: string;
  title: string;
  description: string;
  action?: () => Promise<unknown>;
  condition?: () => boolean;
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
  async incrementSteps() {
    while (this.currentStep < this._stepsComponent.length) {
      this.currentStep = this.currentStep + 1;
      const currentStepConfig = this._stepsComponent[this.currentStep];
      let conditionValue: boolean = true;
      if (currentStepConfig.condition) {
        conditionValue = currentStepConfig.condition();
      }
      if (conditionValue) {
        break;
      }
    }
    if (this.currentStep >= this._stepsComponent.length) {
      throw new Error('Exhausted steps, endtour');
    }
    const action = this._stepsComponent[this.currentStep]?.action;
    if (action) {
      await action();
    }
    Promise.resolve(this.currentStep);
  }
  async decrementSteps() {
    while (this.currentStep > 0) {
      this.currentStep = this.currentStep - 1;
      const currentStepConfig = this._stepsComponent[this.currentStep];
      let conditionValue: boolean = true;
      if (currentStepConfig.condition) {
        conditionValue = currentStepConfig.condition();
      }
      if (conditionValue) {
        break;
      }
    }
    if (this.currentStep < 0) {
      throw new Error('Exhausted steps, endtour');
    }
    const action = this._stepsComponent[this.currentStep]?.action;
    if (action) {
      await action();
    }
    Promise.resolve(this.currentStep);
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
