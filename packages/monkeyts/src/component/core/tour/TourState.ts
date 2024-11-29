export type stepComponent = {
  element: string;
  title: string;
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
  constructor({ steps }: TourBuilderConfig) {
    this._stepsComponent = steps;
  }
  init() {
    if (this._stepsComponent && this._stepsComponent.length === 0) {
      console.warn('No steps defined');
      return;
    }
  }

  protected refreshTour(targetElement: Element) {
    const boundingRect = targetElement.getBoundingClientRect();
    console.log('refreshed tour', boundingRect);
  }
  addStepsEnd(steps: stepComponent[]) {
    this._stepsComponent.push(...steps);
  }
  endTour() {
    this._stepsComponent = [];
  }
}

export default TourState;
