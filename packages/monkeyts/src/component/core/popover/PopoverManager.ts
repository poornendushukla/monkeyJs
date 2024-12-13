import {
  POPOVER_POSITION_CONSTANT,
  popover_positions,
  POPOVERIDS,
  TPopoverPosition,
} from '../../../utils/utils';
import OverlayBuilder from '../overlay/OverlayBuilder';
import { TourController } from '../tour/TourController';
import PopoverBuilder, { PopoverBuilderConfig } from './PopoverBuilder';

class PopoverManager {
  private popover!: PopoverBuilder;
  private overlay!: OverlayBuilder;
  private eventListeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  constructor(config: PopoverBuilderConfig) {
    this.popover = new PopoverBuilder(config);
    this.overlay = new OverlayBuilder(config.overlayConfig);
  }
  private isPopoverOverFlowing(left: number, top: number) {
    const popoverRectCorrect =
      this.popover.popoverElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return (
      left < 0 ||
      top < 0 ||
      left + popoverRectCorrect.width > windowWidth ||
      top + popoverRectCorrect.height > windowHeight
    );
  }
  private repositionPopover(targetRect: DOMRect) {
    const { position, offsetX, offsetY } = this.popover.config;
    // check for overflow in default config
    const { left: org_left, top: org_top } = this.calulatePosition(
      targetRect,
      position,
      offsetX,
      offsetY,
    );
    if (!this.isPopoverOverFlowing(org_left, org_top)) {
      return { left: org_left, top: org_top, popoverPosition: position };
    }

    let leftCord!: number, topCord!: number, popoverPosition!: TPopoverPosition;

    popover_positions.forEach((el) => {
      const { left, top } = this.calulatePosition(
        targetRect,
        el,
        offsetX,
        offsetY,
      );
      if (!this.isPopoverOverFlowing(left, top)) {
        /**
         * ? based on the position add appropriate arrow
         */
        leftCord = left;
        topCord = top;
        popoverPosition = el;
        return;
      }
    });

    return { left: leftCord, top: topCord, popoverPosition };
  }

  /**
   *
   * @param targetRect
   * @param position
   * @param offsetX
   * @param offset
   * @description the idea is to return the a proper left and top for the popover,
   * and incase of overflow adjust the popover to a suitable alternative
   */
  private calulatePosition(
    targetRect: DOMRect,
    position: TPopoverPosition,
    offsetX: number,
    offsetY: number,
  ): {
    left: number;
    top: number;
  } {
    const popoverRect = this.popover.popoverElement.getBoundingClientRect();
    const { padding } = this.overlay.config;
    let left, top;
    switch (position) {
      case POPOVER_POSITION_CONSTANT.TOP:
        left = targetRect.left;
        top = targetRect.top - popoverRect.height - padding.top * 2 + offsetY;
        break;
      case POPOVER_POSITION_CONSTANT.RIGHT:
        left = targetRect.right + offsetX + padding.right * 2;
        top =
          targetRect.top +
          targetRect.height / 4 -
          padding.left -
          padding.right +
          offsetY;
        break;
      case POPOVER_POSITION_CONSTANT.LEFT:
        left = targetRect.left - popoverRect.width - padding.left;
        top = targetRect.top + offsetY;
        break;
      case POPOVER_POSITION_CONSTANT.BOTTOM:
        left =
          targetRect.left + targetRect.width / 4 - padding.right - padding.left;
        top = targetRect.bottom + padding.right + padding.left + offsetY;
        break;
    }
    return { top, left };
  }

  /**
   * * this should also accomodate the padding provided by the user
   * * calculation should be the bounding rectangle mid and padding away
   */
  private updatePopoverPosition(targetElement: DOMRect): void {
    if (this.popover.popoverElement) {
      const { left, top, popoverPosition } =
        this.repositionPopover(targetElement);
      this.popover.updatePosition({
        left,
        top,
        popoverPosition,
        width: targetElement.width,
        height: targetElement.height,
      });
    }
  }
  private updatePopover() {
    const tourInstance = TourController.getInstance();
    const popoverContent = tourInstance.getCurrentStepContent();
    const targetElement = tourInstance.getCurrentActiveStepElement();
    if (popoverContent && targetElement) {
      const boundingRect = targetElement.getBoundingClientRect();
      const { description, title } = popoverContent;
      this.overlay.update(boundingRect);
      this.popover.updateContent(
        title,
        description,
        tourInstance.currentStep,
        tourInstance.isLastStep,
        tourInstance.totalSteps,
      );
      this.updatePopoverPosition(boundingRect);
    }
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
  private handleNextBtnClick() {
    const tourInstance = TourController.getInstance();
    // last step, end tour and if there is a End page we'll show that
    if (tourInstance.isLastStep) {
      this.popover.unmount();
      this.overlay.unmount();
      tourInstance.onNext();
      return;
    }
    tourInstance.onNext();
    this.updatePopover();
  }
  private handlePrevBtnClick() {
    const tourInstance = TourController.getInstance();
    // first step, cant go back
    if (tourInstance.currentStep === 0) {
      this.popover.unmount();
      this.overlay.unmount();
      tourInstance.onPrev();
      return;
    }
    tourInstance.onPrev();
    this.updatePopover();
  }
  private setupEventListners() {
    const nextBtn = document.querySelector(
      `#${POPOVERIDS.NEXT_BTN}`,
    ) as HTMLElement;
    const prevBtn = document.querySelector(
      `#${POPOVERIDS.PREV_BTN}`,
    ) as HTMLElement;
    //window resize event
    this.addEventListenerWithCleanup(window, 'resize', () =>
      this.updatePopover(),
    );
    //scroll into view incase of scroll
    this.addEventListenerWithCleanup(window, 'scroll', () =>
      this.updatePopover(),
    );
    //keydown event
    this.addEventListenerWithCleanup(
      window,
      'keydown',
      (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
            this.handlePrevBtnClick();
            break;
          case 'ArrowRight':
            this.handleNextBtnClick();
            break;
          default:
            break;
        }
      },
    );

    // next button click event
    if (nextBtn) {
      this.addEventListenerWithCleanup(
        nextBtn,
        'click',
        this.handleNextBtnClick.bind(this),
      );
    }

    // prev button click event
    if (prevBtn) {
      this.addEventListenerWithCleanup(
        prevBtn,
        'click',
        this.handlePrevBtnClick.bind(this),
      );
    }
  }
  public start() {
    this.overlay.mount();
    this.popover.mount();
    if (this.eventListeners.length == 0) {
      this.setupEventListners();
    }
    this.updatePopover();
  }
  public distroy() {
    if (this.popover) this.popover.destroy();
    this.removeEventListeners();
  }
}

export default PopoverManager;
