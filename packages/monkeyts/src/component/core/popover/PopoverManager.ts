import TourController from '../tour/TourController';
import PopoverBuilder, { PopoverBuilderConfig } from './PopoverBuilder';
import {
  POPOVER_POSITION_CONSTANT,
  popover_positions,
  TPopoverPosition,
} from '../../../utils/utils';
import OverlayBuilder from '../overlay/OverlayBuilder';

class PopoverManager {
  private tourInstance?: TourController;
  private popover!: PopoverBuilder;
  private overlay!: OverlayBuilder;
  constructor(config: PopoverBuilderConfig) {
    this.popover = new PopoverBuilder(config);
    this.overlay = new OverlayBuilder(config.overlayConfig);
  }
  private isPopoverOverFlowing(
    popoverRect: DOMRect,
    left: number,
    top: number,
  ) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return (
      left < 0 ||
      top < 0 ||
      left + popoverRect.width > windowWidth ||
      top + popoverRect.height > windowHeight
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
    if (!this.isPopoverOverFlowing(targetRect, org_left, org_top)) {
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
      if (!this.isPopoverOverFlowing(targetRect, left, top)) {
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
        left = targetRect.left - targetRect.width - padding.left;
        top =
          targetRect.top +
          targetRect.height / 4 -
          padding.top -
          padding.bottom +
          offsetY;
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
      this.popover.updatePosition({ left, top, popoverPosition });
    }
  }
  private updatePopover() {
    if (this.tourInstance) {
      const popoverContent = this.tourInstance?.getCurrentStepContent();
      const targetElement = this.tourInstance?.getCurrentActiveStepElement();
      if (popoverContent && targetElement) {
        const boundingRect = targetElement.getBoundingClientRect();
        const { description, title } = popoverContent;
        this.overlay.update(boundingRect);
        this.popover.updateContent(
          title,
          description,
          this.tourInstance.currentStep,
          this.tourInstance.isLastStep,
          this.tourInstance.totalSteps,
        );
        this.updatePopoverPosition(boundingRect);
      }
    }
  }
  private attachEventListners() {
    const nextBtn = document.querySelector('.popover-next-btn');
    const prevBtn = document.querySelector('.popover-prev-btn');
    window.addEventListener('resize', () => {
      this.updatePopover();
    });
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.tourInstance?.onPrev();
          this.updatePopover();
          break;
        case 'ArrowRight':
          this.tourInstance?.onNext();
          this.updatePopover();
          break;
        default:
          break;
      }
    });
    nextBtn?.addEventListener('click', () => {
      this.tourInstance?.onNext();
      this.updatePopover();
    });
    prevBtn?.addEventListener('click', () => {
      this.tourInstance?.onPrev();
      this.updatePopover();
    });
  }
  public init(tourController: TourController) {
    this.tourInstance = tourController;
    this.overlay.mount();
    this.popover.mount();
    this.attachEventListners();
  }
  public start() {
    this.updatePopover();
  }
  public distroy() {
    if (this.popover) this.popover.destroy();
  }
}

export default PopoverManager;
