import MonkeyEvent from '../../event/MonkeyEvent';
import { waitForElement } from '../../main';
import { stepComponent, TourState } from './TourState';
export type TourControllerConfig = {
  steps: stepComponent[];
};
export class TourController {
  private tourState: TourState;
  private eventEmitter: MonkeyEvent;
  private eventListeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  private static instance: TourController | null;
  private constructor({ steps }: TourControllerConfig) {
    this.tourState = new TourState({ steps });
    this.eventEmitter = new MonkeyEvent();
  }
  private removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }
  private addEventListenerWithCleanup(
    element: HTMLElement | Window | Document,
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: EventListener | ((event: any) => void),
  ): void {
    element.addEventListener(type, handler);
    this.eventListeners.push({
      element: element as HTMLElement,
      type,
      handler,
    });
  }
  private handleKeydown(ev: KeyboardEvent) {
    if (ev.key == 'Escape') {
      this.endTour();
    }
  }
  private setupEventListners() {
    this.addEventListenerWithCleanup(window, 'keydown', (ev: KeyboardEvent) =>
      this.handleKeydown(ev),
    );
  }
  private distroy() {
    this.tourState.endTour();
    this.removeEventListeners();
    TourController.instance = null;
  }
  static initInstance({ steps }: TourControllerConfig) {
    if (!TourController.instance) {
      TourController.instance = new TourController({ steps });
      TourController.instance.setupEventListners();
    }
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
    this.eventEmitter.onEndEvent();
    this.distroy();
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
  get isTourActive(): boolean {
    return this.tourState.isTourActive;
  }
  getCurrentStepContent() {
    if (this.tourState._stepsComponent[this.tourState.currentStep])
      return this.tourState._stepsComponent[this.tourState.currentStep];
  }
  async getCurrentActiveStepElement(): Promise<HTMLElement | undefined> {
    if (this.tourState._stepsComponent[this.tourState.currentStep]) {
      const selector = `#${this.tourState._stepsComponent[this.tourState.currentStep].element}`;
      return await waitForElement(selector);
    }
  }
}
