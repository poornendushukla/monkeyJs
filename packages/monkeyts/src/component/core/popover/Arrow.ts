import {
  popover_positions,
  TPopoverPosition,
  POPOVER_POSITION_CONSTANT,
} from '../../../utils/utils';
import BaseStyleManager from '../styles/BaseStyleManager';
import ComponentStyleManager from '../styles/ComponentStyleManager';
interface IArrow {
  initialize(): void;
  update(pos: { position: TPopoverPosition }): void;
  distroy(): void;
}
class Arrow implements IArrow {
  private arrowElement!: HTMLDivElement | null;
  private styleManager!: ComponentStyleManager;
  constructor(private config: { position: TPopoverPosition }) {
    const globalStyleManager = BaseStyleManager.getInstance();
    this.styleManager = new ComponentStyleManager(
      globalStyleManager,
      'popover-arrow',
    );
    this.initialize();
  }
  private initializeStyles() {
    this.styleManager.addStyles({
      base: ` width: 0;
        height: 0;
        position: absolute;
        border-style: solid;
        z-index: 1000;
        `,
      bottom: `border-width: 10px 10px 0 10px; /* Triangular shape pointing up */
        border-color: var(--monkey-arrowColor, white) transparent transparent transparent; /* Only top border is colored */
        bottom: -10px; /* Position at the top of the popover */
        left:  10px /* Center horizontally */`,
      top: ` border-width: 0 10px 10px 10px; /* Triangular shape pointing down */
        border-color: transparent transparent var(--monkey-arrowColor, white) transparent; /* Only bottom border is colored */
        top: -10px; /* Position at the bottom of the popover */
        left: 10px; /* Center horizontally */`,
      right: ` border-width: 10px 0 10px 10px; /* Triangular shape pointing right */
        border-color: transparent transparent transparent var(--monkey-arrowColor, white); /* Only left border is colored */
        right: -10px; /* Position at the right side of the popover */
        top: calc(50% - 10px); /* Center vertically */`,
      left: `  border-width: 10px 10px 10px 0; /* Triangular shape pointing left */
        border-color: transparent var(--monkey-arrowColor, white) transparent transparent; /* Only right border is colored */
        left: -10px; /* Position at the left side of the popover */
        top: 10px; /* Center vertically */`,
    });
  }
  private buildArrow() {
    const { position = POPOVER_POSITION_CONSTANT.RIGHT } = this.config;

    const arrow = document.createElement('div');
    const arrowPosition = this.arrowMapping(position);
    const baseArrowClass = this.styleManager.getClassName();
    const arrowPositionVariant = this.styleManager.getClassName(arrowPosition);
    arrow.className = `${baseArrowClass} ${arrowPositionVariant}`;
    this.arrowElement = arrow;
  }
  private arrowMapping(
    popoverPosition: TPopoverPosition,
  ): TPopoverPosition | undefined {
    switch (popoverPosition) {
      case POPOVER_POSITION_CONSTANT.TOP:
        return POPOVER_POSITION_CONSTANT.BOTTOM;
      case POPOVER_POSITION_CONSTANT.BOTTOM:
        return POPOVER_POSITION_CONSTANT.TOP;
      case POPOVER_POSITION_CONSTANT.LEFT:
        return POPOVER_POSITION_CONSTANT.RIGHT;
      case POPOVER_POSITION_CONSTANT.RIGHT:
        return POPOVER_POSITION_CONSTANT.LEFT;
      default:
    }
  }
  initialize(): void {
    this.initializeStyles();
    this.buildArrow();
  }

  distroy(): void {
    this.arrowElement = null;
  }

  update(pos: {
    position: TPopoverPosition;
    top: number;
    left: number;
    width: number;
    height: number;
  }) {
    if (!this.arrowElement) {
      console.error('Arrow not itialized');
      return;
    }
    //if provided with alternate positon renders that otherwise default to user config
    const { position } = pos || this.config;
    // ?  remove other positions if present
    popover_positions.forEach((el) => {
      const positionMappedClass = this.styleManager.getClassName(el);
      if (this.arrowElement?.classList.contains(positionMappedClass)) {
        this.arrowElement?.classList.remove(positionMappedClass);
      }
    });
    // ? add the provided or default position class
    const arrowPosition = this.arrowMapping(position);
    const arrowPositionClassName =
      this.styleManager.getClassName(arrowPosition);
    this.arrowElement.classList.add(arrowPositionClassName);
  }
  get arrow() {
    return this.arrowElement as HTMLDivElement;
  }
}

export default Arrow;
