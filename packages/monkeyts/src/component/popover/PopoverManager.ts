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
    let left = targetRect.left;
    let top = targetRect.top;
    
    // Standard gap between target and popover
    const gap = 10;
    
    // Apply padding from overlay config if available
    const padTop = padding?.top ?? 0;
    const padBottom = padding?.bottom ?? 0;
    const padLeft = padding?.left ?? 0;
    const padRight = padding?.right ?? 0;
    
    switch (position) {
      case POPOVER_POSITION_CONSTANT.TOP:
        // Center horizontally over the target
        left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
        // Position above the target with a gap plus padding
        top = targetRect.top - popoverRect.height - gap - padTop;
        // For TOP position, positive Y offset moves upward (away from target)
        offsetY = offsetY ? -Math.abs(offsetY) : 0;
        break;
      case POPOVER_POSITION_CONSTANT.RIGHT:
        // Position to the right of the target with a gap plus padding
        left = targetRect.right + gap + padRight;
        // Center vertically next to the target
        top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
        // For RIGHT position, positive X offset moves rightward (away from target)
        offsetX = offsetX ? Math.abs(offsetX) : 0;
        break;
      case POPOVER_POSITION_CONSTANT.LEFT:
        // Position to the left of the target with a gap plus padding
        left = targetRect.left - popoverRect.width - gap - padLeft;
        // Center vertically next to the target
        top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
        // For LEFT position, positive X offset moves leftward (away from target)
        offsetX = offsetX ? -Math.abs(offsetX) : 0;
        break;
      case POPOVER_POSITION_CONSTANT.BOTTOM:
        // Center horizontally under the target
        left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
        // Position below the target with a gap plus padding
        top = targetRect.bottom + gap + padBottom;
        // For BOTTOM position, positive Y offset moves downward (away from target)
        offsetY = offsetY ? Math.abs(offsetY) : 0;
        break;
      default:
        // fallback to top left if position is invalid
        left = targetRect.left;
        top = targetRect.top;
        break;
    }
    
    // Apply user-defined directional offsets
    left += (offsetX ?? 0);
    top += (offsetY ?? 0);
    
    
    
    return { top:Number(top), left:Number(left) };
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
  private async updateOverlayPosition() {
    const tourInstance = TourController.getInstance();
    const targetElement = await tourInstance.getCurrentActiveStepElement();
    if (targetElement) {
      const boundingRect = targetElement.getBoundingClientRect();
      this.overlay.update(boundingRect);
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
    ) as HTMLElement;

    const deboucedUpdatePopover = debounce(this.updatePopover.bind(this));
    const debouncedUpdateOverlay = debounce(
      this.updateOverlayPosition.bind(this),
    );
    //window resize event
    this.addEventListenerWithCleanup(window, 'resize', () =>
      deboucedUpdatePopover(),
    );
    //scroll into view incase of scroll
    this.addEventListenerWithCleanup(window, 'scroll', () =>
      debouncedUpdateOverlay(),
    );
    // endTour Listner on window
    this.addEventListenerWithCleanup(window, 'onEnd', () => {
      this.handleEndTour();
    });
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
    const debouncedUpdateOverlay = debounce(
      this.updateOverlayPosition.bind(this),
    );
    //window resize event
    this.addEventListenerWithCleanup(window, 'resize', () =>
      deboucedUpdatePopover(),
    );
    //scroll into view incase of scroll
    this.addEventListenerWithCleanup(window, 'scroll', () =>
      debouncedUpdateOverlay(),
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
