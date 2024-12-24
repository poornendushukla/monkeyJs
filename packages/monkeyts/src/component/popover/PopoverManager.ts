import {
  bringInView,
  POPOVER_POSITION_CONSTANT,
  popover_positions,
  POPOVERIDS,
  TPopoverPosition,
} from '../../utils/utils';
import OverlayBuilder from '../overlay/OverlayBuilder';
import { TourController } from '../tour/TourController';
import PopoverBuilder, { PopoverBuilderConfig } from './PopoverBuilder';
import MonkeyEvent from '../../event/MonkeyEvent';
import { debounce } from '../../utils/utils';
class PopoverManager {
  private popover: PopoverBuilder;
  private overlay: OverlayBuilder;
  private emitter: MonkeyEvent;
  private eventListeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  constructor(config: PopoverBuilderConfig) {
    this.popover = new PopoverBuilder(config);
    this.overlay = new OverlayBuilder(config.overlayConfig);
    this.emitter = new MonkeyEvent();
    this.setupWindowEventListners();
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
  private async updatePopover() {
    const tourInstance = TourController.getInstance();
    const popoverContent = tourInstance.getCurrentStepContent();
    const targetElement = await tourInstance.getCurrentActiveStepElement();
    if (popoverContent && targetElement) {
      bringInView(targetElement);
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
    this.emitter.onNextEvent();
    this.updatePopover();
  }
  private handlePrevBtnClick() {
    this.emitter.onPrevEvent();
    this.updatePopover();
  }
  private handleEndTour() {
    this.distroy();
  }
  private setupPopoverBtnListeners() {
    const nextBtn = document.querySelector(
      `#${POPOVERIDS.NEXT_BTN}`,
    ) as HTMLElement;
    const prevBtn = document.querySelector(
      `#${POPOVERIDS.PREV_BTN}`,
    ) as HTMLElement;
    const closeBtn = document.querySelector(
      `#${POPOVERIDS.POPOVER_CLOSE_BTN}`,
    ) as HTMLButtonElement;

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
      this.addEventListenerWithCleanup(nextBtn, 'click', () => {
        this.handleNextBtnClick();
      });
    }

    // prev button click event
    if (prevBtn) {
      this.addEventListenerWithCleanup(prevBtn, 'click', () =>
        this.handlePrevBtnClick(),
      );
    }
    if (closeBtn) {
      this.addEventListenerWithCleanup(closeBtn, 'click', () =>
        this.handleEndTour(),
      );
    }
  }
  private setupWindowEventListners() {
    const deboucedUpdatePopover = debounce(this.updatePopover.bind(this));
    //window resize event
    this.addEventListenerWithCleanup(window, 'resize', () =>
      deboucedUpdatePopover(),
    );
    //scroll into view incase of scroll
    this.addEventListenerWithCleanup(window, 'scroll', () =>
      deboucedUpdatePopover(),
    );
    // endTour Listner on window
    this.addEventListenerWithCleanup(window, 'onEnd', () => {
      this.handleEndTour();
    });
    // startTour Listner on window
    this.addEventListenerWithCleanup(window, 'onStart', () => this.start());
  }
  private start() {
    this.overlay.mount();
    this.popover.mount();
    this.setupPopoverBtnListeners();
    this.updatePopover();
  }
  private distroy() {
    if (this.popover) this.popover.destroy();
    if (this.overlay) this.overlay.distroy();
    this.removeEventListeners();
  }
}

export default PopoverManager;
