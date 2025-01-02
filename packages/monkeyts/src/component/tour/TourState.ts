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

export class TourState {
  public _stepsComponent: stepComponent[] = [];
  public currentStep: number = 0;
  public isTourActive: boolean = false;
  public isTourStarted: boolean = false;
  constructor({ steps }: TourBuilderConfig) {
    this._stepsComponent = steps;
    this.isTourActive = true;
  }
  async init() {
    if (this._stepsComponent && this._stepsComponent.length === 0) {
      console.warn('No steps defined');
      return;
    }
    this.isTourStarted = true;
    /**
     * ? if the first step is conditional we want to go to next valid step
     * ? and return early since we check for action anyway in increament step
     */
    if (!this.checkConditionForCurrentStep()) {
      await this.incrementSteps();
      return;
    }
    /**
     * ? if the condition attached leads to true, we execute action attached
     */
    await this.executeCurrentStepAction();
  }
  async executeCurrentStepAction() {
    const action = this._stepsComponent[this.currentStep]?.action;
    if (action) {
      await action();
    }
  }
  checkConditionForCurrentStep() {
    const currentStepConfig = this._stepsComponent[this.currentStep];
    let conditionValue: boolean = true;
    if (currentStepConfig.condition) {
      conditionValue = currentStepConfig.condition();
    }
    return conditionValue;
  }
  async incrementSteps() {
    while (this.currentStep < this._stepsComponent.length) {
      this.currentStep = this.currentStep + 1;
      if (this.checkConditionForCurrentStep()) {
        break;
      }
    }
    if (this.currentStep >= this._stepsComponent.length) {
      throw new Error('Exhausted steps, endtour');
    }
    await this.executeCurrentStepAction();
    Promise.resolve(this.currentStep);
  }
  async decrementSteps() {
    while (this.currentStep >= 0) {
      this.currentStep = this.currentStep - 1;
      if (this.checkConditionForCurrentStep()) {
        break;
      }
    }
    if (this.currentStep < 0) {
      throw new Error('Exhausted steps, endtour');
    }
    await this.executeCurrentStepAction();
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
