import { OverlayBuilderConfig } from '../overlay/OverlayBuilder';
import { POPOVERIDS, TPopoverPosition } from '../../../utils/utils';
import Arrow from './Arrow';
import ComponentStyleManager from '../styles/ComponentStyleManager';
import BaseStyleManager from '../styles/BaseStyleManager';
import { TourController } from '../tour/TourController';
interface ILifeCycle {
  initialize(): void;
  mount(): void;
  unmount(): void;
  destroy(): void;
}
interface IPopoverState {
  isInitialized: boolean;
  isMounted: boolean;
  isVisible: boolean;
  currentStep?: number;
}

export type PopoverBuilderConfig = {
  overlayConfig: OverlayBuilderConfig;
  progressBar: boolean;
  progressBarSteps: number;
  nextBtnText: string;
  prevBtnText: string;
  position: TPopoverPosition;
  offsetX: number;
  offsetY: number;
  isArrowVisible: boolean;
};

class PopoverBuilder implements ILifeCycle {
  private state: IPopoverState = {
    isInitialized: false,
    isMounted: false,
    isVisible: false,
    currentStep: 0,
  };
  private eventListeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  private styleManager!: ComponentStyleManager;
  public popoverElement!: HTMLDivElement;
  private arrowInstance!: Arrow;

  constructor(private options: PopoverBuilderConfig) {
    const globalStyleManager = BaseStyleManager.getInstance();
    this.styleManager = new ComponentStyleManager(
      globalStyleManager,
      'popover',
    );
    this.initialize();
  }

  initialize() {
    if (this.state.isInitialized) {
      console.warn('Popover Builder is initialized');
      return;
    }

    try {
      this.initializeStyles();
      this.build();
      if (this.eventListeners.length == 0) {
        this.setupEventListeners();
      }
      this.state.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize popoverBuilder', error);
      throw new Error('Failed to initialize popoverBuilder');
    }
  }
  private initializeStyles() {
    this.styleManager.addStyles({
      base: `
        display:flex;
        flex-direction: column;
        position: fixed;
        background-color: var(--monkey-popoverBgColor);
        border: 1px solid #ccc;
        border-radius: var(--monkey-popoverBorderRadius);
        box-shadow: var(--monkey-popoverBoxShadow);
        z-index: var(--monkey-baseZIndex);
        color:var(--monkey-textColor);
        font-family: var(--monkey-fontFamily);
        padding:var(--monkey-popoverPadding);
        gap:10px;
        `,
      animate: `
        opacity: 0; /* Start hidden */
        transform: translateY(10px); /* Start slightly down */
        animation: monkey-fadeInUp 0.8s forwards; /* Apply animation */
        `,
      footer: `
        display:flex;
        justify-content:space-between;
      `,
      title: `
        font-weight:700
      `,
      description: `
        inline-size:300px
      `,
      ['progress-bar']: `
      
      `,
      ['next-btn']: `

      `,
      ['prev-btn']: `
      
      `,
      ['btn-wrap']: `
        display:flex;
        gap:10px;
      `,
    });
  }
  private build() {
    if (!this.state.isInitialized) {
      this.createPopover();
    }
  }
  /**
   * ? when should we remove popover from document
   */
  private removePopoverFromDocument() {
    if (!this.state.isMounted) {
      console.error('Popover not mounted, nothing to remove');
    }
    this.popoverElement.remove();
  }
  private createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Partial<HTMLElementTagNameMap[K]> & {
      style?: Partial<CSSStyleDeclaration>;
    } = {},
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    Object.assign(element, attributes);
    if (attributes.style) {
      Object.assign(element.style, attributes.style);
    }
    return element;
  }
  private createButton(
    textOption: string | undefined,
    defaultText: string,
    className: string,
    id: string,
  ): HTMLButtonElement {
    return this.createElement('button', {
      innerText: textOption || defaultText,
      className,
      id,
    }) as HTMLButtonElement;
  }
  private buildPopoverContent() {
    if (!this.popoverElement) return;
    const title = this.createElement('header', {
      id: POPOVERIDS.POPOVER_TITLE,
      className: this.styleManager.getClassName('title'),
    });
    const description = this.createElement('div', {
      id: POPOVERIDS.POPOVER_DESC,
      className: this.styleManager.getClassName('description'),
    });
    this.popoverElement.append(title, description);
  }
  private buildFooter() {
    if (!this.popoverElement) return;
    const tourInstance = TourController.getInstance();
    const footer = this.createElement('div', {
      id: POPOVERIDS.POPOVER_FOOTER,
    });
    footer.classList.add(this.styleManager.getClassName('footer'));
    if (this.options.progressBar) {
      const progressBar = this.createElement('div', {
        id: POPOVERIDS.POPOVER_PROGRESSBAR,
      });
      const totalSteps = tourInstance.totalSteps;
      const currentStep = tourInstance.currentStep;
      progressBar.innerHTML = `<span>${currentStep + 1} of ${totalSteps}</span>`;
      progressBar.classList.add(this.styleManager.getClassName('progress-bar'));
      footer.append(progressBar);
    }
    const btnWrapper = this.createElement('div');
    const btnWrapperClassName = this.styleManager.getClassName('btn-wrap');
    btnWrapper.classList.add(btnWrapperClassName);
    const nextBtnClassName = this.styleManager.getClassName('next-btn');
    const prevBtnClassName = this.styleManager.getClassName('prev-btn');

    btnWrapper.appendChild(
      this.createButton(
        this.options.prevBtnText,
        'Previous',
        prevBtnClassName,
        POPOVERIDS.PREV_BTN,
      ),
    );
    btnWrapper.appendChild(
      this.createButton(
        this.options.nextBtnText,
        'Next',
        nextBtnClassName,
        POPOVERIDS.NEXT_BTN,
      ),
    );
    footer.appendChild(btnWrapper);
    this.popoverElement.append(footer);
  }

  private addArrow() {
    this.arrowInstance = new Arrow({ position: this.options.position });
    // Add arrow to popover element
    if (this.popoverElement) {
      this.popoverElement.appendChild(this.arrowInstance.arrow);
    }
  }

  private createPopover() {
    this.popoverElement = this.createElement('div', {
      id: POPOVERIDS.POPOVER_WRAPPER_ID,
    });
    this.popoverElement.classList.add(this.styleManager.getClassName());
    const popoverWrapper = this.createElement('div', {
      id: POPOVERIDS.POPOVER_WRAPPER_ID,
      className: 'popover-wrapper',
    });
    popoverWrapper.appendChild(this.popoverElement);
    this.buildPopoverContent();
    this.buildFooter();
    if (this.options.isArrowVisible) {
      this.addArrow();
    }
  }

  private appendPopoverToDocument() {
    if (this.popoverElement) {
      document.body.appendChild(this.popoverElement!);
    }
  }
  private updatePopoverContent(
    title: string,
    description: string,
    step: number,
    totalSteps: number,
  ) {
    if (!this.popoverElement) return;
    // update title
    const popoverTitle = this.popoverElement.querySelector(
      `#${POPOVERIDS.POPOVER_TITLE}`,
    ) as HTMLDivElement;
    if (popoverTitle) {
      popoverTitle.classList.add(this.styleManager.getClassName('title'));
      popoverTitle.innerText = title;
    }
    //updating description
    const popoverDescription = this.popoverElement.querySelector(
      `#${POPOVERIDS.POPOVER_DESC}`,
    ) as HTMLDivElement;
    if (popoverDescription) {
      popoverDescription.innerText = description;
    }
    //updating footer
    const progressBar = this.popoverElement.querySelector(
      `#${POPOVERIDS.POPOVER_PROGRESSBAR}`,
    );
    if (progressBar) {
      progressBar.innerHTML = `<span>${step + 1} of ${totalSteps}</span>`;
    }
  }
  private markVisibiltyOfPopoverButtons(
    step: number,
    isLastStep: boolean,
    totalSteps: number,
  ) {
    console.log(totalSteps);
    if (!this.popoverElement) return;
    const nextBtn = this.popoverElement.querySelector(
      `#${POPOVERIDS.NEXT_BTN}`,
    ) as HTMLButtonElement;
    const prevBtn = this.popoverElement.querySelector(
      `#${POPOVERIDS.PREV_BTN}`,
    ) as HTMLButtonElement;
    if (isLastStep) {
      nextBtn.innerText = 'End';
    } else {
      nextBtn.innerText = this.options.nextBtnText || 'Next';
      nextBtn.style.display = 'block';
    }
    if (step === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }
  }
  private resetState() {
    this.state = {
      isInitialized: false,
      isMounted: false,
      isVisible: false,
      currentStep: 0,
    };
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
  private removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }
  private cleanupDomReferences() {
    //@ts-expect-error: expected null assignment
    this.popoverElement = null;
    //@ts-expect-error: expected null assignment
    this.arrowElement = null;
  }
  private handleResize() {
    if (this.state.isVisible) {
      this.updatePosition({
        left: 0,
        top: 0,
        popoverPosition: this.config.position,
        width: 0,
        height: 0,
      });
    }
  }
  private handleScroll() {
    if (this.state.isVisible) {
      this.updatePosition({
        left: 0,
        top: 0,
        popoverPosition: this.config.position,
        width: 0,
        height: 0,
      });
    }
  }
  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.state.isVisible) {
      this.unmount();
    }
  }
  private setupEventListeners() {
    // Window resize handler
    this.addEventListenerWithCleanup(
      window,
      'resize',
      this.handleResize.bind(this),
    );

    // Document scroll handler
    this.addEventListenerWithCleanup(
      document,
      'scroll',
      this.handleScroll.bind(this),
    );

    // ESC key handler
    this.addEventListenerWithCleanup(
      document,
      'keydown',
      this.handleKeydown.bind(this),
    );
  }
  get config() {
    return {
      position: this.options.position,
      offsetX: this.options.offsetX,
      offsetY: this.options.offsetY,
    };
  }
  updateContent(
    title: string,
    description: string,
    step: number,
    isLastStep: boolean,
    totalSteps: number,
  ) {
    this.updatePopoverContent(title, description, step, totalSteps);
    this.markVisibiltyOfPopoverButtons(step, isLastStep, totalSteps);
  }
  updatePosition(position: {
    left: number;
    top: number;
    width: number;
    height: number;
    popoverPosition: TPopoverPosition;
  }) {
    const { left, top, popoverPosition, width, height } = position;
    if (this.arrowInstance) {
      this.arrowInstance.update({
        position: popoverPosition,
        left,
        top,
        width,
        height,
      });
    }
    //* idea is to synchroneously apply the style, update position and then eventually remove the css
    // ? is there a other/better way for handling animation
    const animationClass = this.styleManager.getClassName('animate');
    this.popoverElement.classList.add(animationClass);
    this.popoverElement.style.left = `${left}px`;
    this.popoverElement.style.top = `${top}px`;
    setTimeout(() => {
      this.popoverElement.classList.remove(animationClass);
    }, 1000);
  }
  destroy() {
    try {
      if (this.state.isMounted) {
        this.unmount();
      }
      this.removeEventListeners();
      this.cleanupDomReferences();
      this.resetState();
    } catch (err) {
      console.error('Failed to distroy popoverBuilder', err);
      throw new Error('Failed to distroy PopoverBuilder');
    }
  }
  mount() {
    if (!this.state.isInitialized) {
      throw new Error('Cannot mount uninitialized PopoverBuilder');
    }

    if (this.state.isMounted) {
      console.warn('PopoverBuilder is already mounted');
      return;
    }
    try {
      this.appendPopoverToDocument();
      this.state.isMounted = true;
      this.state.isVisible = true;
    } catch (error) {
      console.error('Failed to mount the popover', error);
      throw new Error('Failed to mount the popover');
    }
  }
  unmount() {
    if (!this.state.isMounted) return;

    try {
      this.removePopoverFromDocument();
      this.state.isMounted = false;
      this.state.isVisible = false;
    } catch (error) {
      console.error('Failed to unmount the popover', error);
      throw new Error('Failed to unmount the popover');
    }
  }
}
export default PopoverBuilder;
