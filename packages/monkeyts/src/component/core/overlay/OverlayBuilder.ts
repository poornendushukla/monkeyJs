import BaseStyleManager from '../styles/BaseStyleManager';
import ComponentStyleManager from '../styles/ComponentStyleManager';

type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
interface IOverlay {
  initialize(): void;
  mount(): void;
  unmount(): void;
  distroy(): void;
}
interface IOverlayState {
  isInitialized: boolean;
  isMounted: boolean;
  isVisible: boolean;
}
export type OverlayBuilderConfig = {
  backgroundColor?: string;
  strokeWidth?: string;
  strokeColor?: string;
  padding?: Padding;
  radius?: number;
};
/**
 * the sole perpose of this class is to build the overlay with either default configuration or with the given configuration
 */
class OverlayBuilder implements IOverlay {
  private _overlay?: SVGSVGElement;
  private _mask?: SVGPathElement;
  private _overlayBackground?: string;
  private _strokeWidth?: string;
  private _strokeColor?: string;
  protected _padding!: Padding;
  private _radius?: number;
  private styleManger!: ComponentStyleManager;
  private eventListners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  private state: IOverlayState = {
    isInitialized: false,
    isMounted: false,
    isVisible: false,
  };
  constructor(overlayConfig: OverlayBuilderConfig) {
    if (overlayConfig) {
      const {
        backgroundColor,
        strokeWidth,
        strokeColor,
        padding = { top: 10, left: 10, right: 10, bottom: 10 },
        radius,
      } = overlayConfig;
      const globalStyleManager = BaseStyleManager.getInstance();
      this.styleManger = new ComponentStyleManager(
        globalStyleManager,
        'overlay',
      );
      this._overlayBackground = backgroundColor;
      this._strokeWidth = strokeWidth;
      this._strokeColor = strokeColor;
      this._padding = padding;
      this._radius = radius;
    }
    this.initialize();
  }
  initialize(): void {
    if (this.state.isInitialized) {
      console.warn('Overlay already initialized');
      return;
    }
    try {
      this.initializeStyles();
      this.build();
      this.setupEventListners();
      this.state.isInitialized = true;
    } catch (err) {
      console.error('Failed to initialize overlay', err);
      throw new Error('Failed to initialize overlay');
    }
  }
  private initializeStyles() {
    this.styleManger.addStyles({
      mask: `
        fill:rgba(0,0,0,0.5);
        stroke:rgba(255, 0, 0, 0);
        stroke-width:2;
      `,
      [`mask-animate`]: `
        animation: monkey-overlayFadeInUp 0.2s ease-in-out;
      `,
    });
  }
  private build() {
    const overlay = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const overlayClassName = this.styleManger.getClassName();
    overlay.setAttribute('class', overlayClassName);
    overlay.setAttribute('id', 'overlayId');
    //overwrite in case of custom configuration provided
    if (this._overlayBackground)
      overlay.style.backgroundColor = this._overlayBackground;
    if (this._strokeWidth) overlay.style.strokeWidth = this._strokeWidth;
    if (this._strokeColor) overlay.style.fill = this._strokeColor;
    this._overlay = overlay;
    this.buildMask();
  }

  private buildMask() {
    const isMaskAlreadyAdded = document.querySelector(
      '#maskId',
    ) as SVGPathElement;
    if (isMaskAlreadyAdded) {
      this._mask = isMaskAlreadyAdded;
      return;
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'maskId');
    const maskClassName = this.styleManger.getClassName('mask');
    path.setAttribute('class', maskClassName);
    this._mask = path;
  }
  private cleanupAnimations() {
    const maskClassAnimations = this.styleManger.getClassName('mask-animate');
    setTimeout(() => {
      this._overlay?.classList.remove(maskClassAnimations);
    }, 1000);
  }
  private applyAnimations() {
    const maskClassAnimations = this.styleManger.getClassName('mask-animate');
    this._overlay?.classList.add(maskClassAnimations);
    this.cleanupAnimations();
  }
  private removeDocumentReferences() {
    //@ts-expect-error: should not to null
    this._mask = null;
    //@ts-expect-error: should not be null
    this._overlay = null;
  }
  private resetState() {
    this.state = {
      isInitialized: false,
      isMounted: false,
      isVisible: false,
    };
  }
  private appendOverlayToDocument() {
    if (this._overlay) {
      document.body.appendChild(this._overlay);
    }
  }
  private removeOvelayFromDocument() {
    if (this._overlay) {
      this._overlay.remove();
    }
  }
  private createSvgPathWithCutout(innerRect: Rect): string {
    const outerRect: Rect = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const { x: ox, y: oy, width: ow, height: oh } = outerRect;
    const { x: ix, y: iy, width: iw, height: ih } = innerRect;

    // Apply padding
    const { top = 0, right = 0, bottom = 0, left = 0 } = this._padding || {};
    const paddedInnerRect: Rect = {
      x: ix - left,
      y: iy - top,
      width: iw + left + right,
      height: ih + top + bottom,
    };
    // Outer rectangle path
    const outerPath = `M${ox},${oy}H${ow}V${oh}H${ox}V${oy}Z`;

    // Inner rectangle (cutout) path
    let innerPath: string;

    if (this._radius && this._radius > 0) {
      // Path with rounded corners
      innerPath =
        `M${paddedInnerRect.x},${paddedInnerRect.y + this._radius}` +
        `a${this._radius},${this._radius} 0 0 1 ${this._radius},${-this
          ._radius}` +
        `h${paddedInnerRect.width - 2 * this._radius}` +
        `a${this._radius},${this._radius} 0 0 1 ${this._radius},${this._radius}` +
        `v${paddedInnerRect.height - 2 * this._radius}` +
        `a${this._radius},${this._radius} 0 0 1 ${-this._radius},${
          this._radius
        }` +
        `h${-paddedInnerRect.width + 2 * this._radius}` +
        `a${this._radius},${this._radius} 0 0 1 ${-this._radius},${-this
          ._radius}` +
        `v${-paddedInnerRect.height + 2 * this._radius}` +
        `Z`;
    } else {
      // Path with sharp corners
      innerPath =
        `M${paddedInnerRect.x},${paddedInnerRect.y}` +
        `h${paddedInnerRect.width}v${paddedInnerRect.height}` +
        `h${-paddedInnerRect.width}Z`;
    }

    return `${outerPath}${innerPath}`;
  }
  private cleanupEventListners() {
    this.eventListners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListners = [];
  }
  private addEventListnersWithCleanup(
    element: HTMLElement | Window | Document,
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: EventListener | ((event: any) => void),
  ) {
    element.addEventListener(type, handler);
    this.eventListners.push({ element: element as HTMLElement, type, handler });
  }
  private handleResize() {}
  private handleScroll() {}
  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.state.isVisible) {
      this.unmount();
    }
  }
  private setupEventListners() {
    // window resize
    this.addEventListnersWithCleanup(
      window,
      'resize',
      this.handleResize.bind(this),
    );

    //Document scroll handler
    this.addEventListnersWithCleanup(
      document,
      'scroll',
      this.handleScroll.bind(this),
    );

    // Esc key handler
    this.addEventListnersWithCleanup(
      document,
      'keydown',
      this.handleKeyDown.bind(this),
    );
  }
  update(domRect: DOMRect) {
    const isOverlayVisible = this._overlay?.style.display;
    const maskPath: string = this.createSvgPathWithCutout(domRect);
    // *check if overlay is visible, if not enable
    if (isOverlayVisible && isOverlayVisible === 'none') this.mount();
    if (!this._mask) {
      this.buildMask();
    }
    if (this._overlay && this._mask) {
      let mask;
      const isMaskAlreadyAdded = this._overlay.querySelector('#maskId');
      if (!isMaskAlreadyAdded) {
        this._overlay.appendChild(this._mask);
        mask = this._overlay.querySelector('#maskId');
        if (mask) mask.setAttribute('d', maskPath);
      } else {
        mask = this._overlay.querySelector('#maskId');
        if (mask) mask.setAttribute('d', maskPath);
      }
      this.applyAnimations();
      //@ts-expect-error: should not be null
      this._mask = mask;
    }
  }
  mount() {
    if (!this.state.isInitialized) {
      console.error('Overlay not initialize');
      return;
    }
    try {
      if (this.state.isMounted) {
        console.warn('Overlay already mounted');
        return;
      }
      this.appendOverlayToDocument();
      this.state.isMounted = true;
      this.state.isVisible = true;
    } catch (err) {
      console.error('Failed to mount overlay', err);
      throw new Error('Failed to mount overlay');
    }
  }
  unmount() {
    if (!this.state.isInitialized) {
      console.error('Overlay is not initialized');
      return;
    }
    try {
      if (!this.state.isMounted) {
        console.warn('Overlay not mounted');
        return;
      }
      this.removeOvelayFromDocument();
      this.state.isMounted = false;
      this.state.isVisible = false;
    } catch (err) {
      console.error('Failed to unmount Overlay', err);
      throw new Error('Failed to unmoutn Overlay');
    }
  }
  distroy() {
    try {
      if (this.state.isMounted) {
        this.unmount();
      }
      this.resetState();
      this.cleanupEventListners();
      this.removeDocumentReferences();
    } catch (err) {
      console.error('Failed to distroy overlay.', err);
      throw new Error('Failed to destroy overlay');
    }
  }
  get config() {
    return {
      padding: this._padding,
      radius: this._radius,
      strokeColor: this._strokeColor,
      backgroundColor: this._overlayBackground,
    };
  }
}

export default OverlayBuilder;
