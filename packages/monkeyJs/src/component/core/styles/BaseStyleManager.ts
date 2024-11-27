type ThemeType = {
  fontFamily: string;
  fontSize: string;
  textColor: string;
  popoverBgColor: string;
  popoverPadding: string;
  popoverBorderRadius: string;
  popoverBoxShadow: string;
  overlayColor: string;
  overlayOpacity: number;
  baseZIndex: number;
  overlayZIndex: number;
  arrowColor: string;
};

const defaultTheme: ThemeType = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333',
  popoverBgColor: '#fff',
  popoverPadding: '10px',
  popoverBorderRadius: '4px',
  popoverBoxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  overlayColor: 'rgba(0,0,0,0.5)',
  overlayOpacity: 0.5,
  baseZIndex: 1000,
  overlayZIndex: 99,
  arrowColor: 'white',
};

const globalAnimations: Record<string, string> = {
  fadeInUp: `{\n
    0%{
      opacity:0;
    }\n
    to{
      opacity: 1; /* End fully visible */
      transform: translateY(0); /* End at original position */
    }  
  }\n`,
  overlayFadeInUp: `{\n
    0%{
      opacity:0;
    }\n
    50%{
      opacity:0.5;
    }\n
    75%{
      opacity:.75;
    }\n
    100%{
      opacity:1;
    }\n
  }`,
};

/**
 *
 */
class BaseStyleManager {
  private static instance: BaseStyleManager;
  private styleElement: HTMLStyleElement;
  private theme: ThemeType;
  private styles: Map<string, Map<string, string>> = new Map();
  private styleSheetMap: Map<string, string> = new Map();
  private customProperties: Map<string, string> = new Map();
  private animations: Map<string, string> = new Map();
  constructor(initialTheme: ThemeType) {
    this.theme = initialTheme;
    this.styleElement = this.createStyle();
    this.initializeCustomProperties();
    this.initializeGlobalAnimations();
    this.generateBaseStyles();
  }

  private createStyle(): HTMLStyleElement {
    const style = document.createElement('style');
    document.head.append(style);
    return style;
  }
  public static getInstance(
    initialTheme: ThemeType = defaultTheme,
  ): BaseStyleManager {
    if (!BaseStyleManager.instance) {
      BaseStyleManager.instance = new BaseStyleManager(initialTheme);
    }
    return BaseStyleManager.instance;
  }
  private generateBaseStyles() {
    this.addComponentStyles('popover', {
      base: `
        display:flex;
        flex-direction: column;
        position: absolute;
        background-color: var(--monkey-popoverBgColor);
        border: 1px solid #ccc;
        border-radius: var(--monkey-popoverBorderRadius);
        box-shadow: var(--monkey-popoverBoxShadow);
        z-index: var(--monkey-baseZIndex);
        font-family: var(--monkey-fontFamily);
        padding:var(--monkey-popoverPadding);
        `,
    });

    this.addComponentStyles('overlay', {
      base: `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: var(--monkey-overlayZIndex);
        overflow: hidden;
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        `,
    });
    this.addComponentStyles('mask', {
      base: `
        fill:var(--monkey-overlayColor);
        stroke:rgba(255, 0, 0, 0);
        stroke-width:2;
        `,
    });
    this.addComponentStyles('popover-arrow', {
      base: ` width: 0;
        height: 0;
        position: absolute;
        border-style: solid;
        z-index: 1000;
        `,
    });
  }
  private initializeCustomProperties() {
    for (const [key, value] of Object.entries(this.theme)) {
      this.customProperties.set(`--monkey-${key}`, value.toString());
    }
    this.updateCustomProperties();
  }
  private updateCustomProperties() {
    let cssText = `:root{\n`;
    for (const [prop, value] of this.customProperties) {
      cssText += ` ${prop}: ${value};\n`;
    }
    cssText += `}\n`;
    this.styleElement.textContent = cssText + this.styleElement.textContent;
  }
  private initializeGlobalAnimations() {
    for (const [key, value] of Object.entries(globalAnimations)) {
      this.animations.set(`monkey-${key}`, value);
    }
    this.updateCustomAnimations();
  }
  private updateCustomAnimations() {
    let cssText = ``;
    for (const [name, value] of this.animations) {
      cssText += ` @keyframes ${name} ${value}`;
    }
    this.styleElement.textContent = cssText + this.styleElement.textContent;
  }
  public addComponentStyles(
    componentName: string,
    styles: { [key: string]: string },
  ) {
    if (!this.styles.has(componentName)) {
      this.styles.set(componentName, new Map<string, string>());
    }
    const componentStyles = this.styles.get(componentName);
    for (const [key, value] of Object.entries(styles)) {
      componentStyles?.set(key, value);
    }
    if (componentStyles) {
      this.styles.set(componentName, componentStyles);
    }
    this.updateStyles();
  }
  /**
   * @description
   * @todo need to check if it would effect the consumers ability to update the styles
   */
  public updateStyles() {
    let cssText = '';
    for (const [component, styles] of this.styles) {
      for (const [key, rules] of styles) {
        const className = key === 'base' ? component : `${component}-${key}`;
        const monkeyClassName = `.monkey-${className}`;
        if (!this.styleSheetMap.has(monkeyClassName)) {
          cssText += `${monkeyClassName} { ${rules} }\n`;
          this.styleSheetMap.set(monkeyClassName, rules);
        }
      }
    }
    const updatedStyleElement = this.styleElement.textContent + cssText;
    this.styleElement.textContent = updatedStyleElement;
  }
  public updateTheme(newTheme: Partial<ThemeType>) {
    this.theme = { ...newTheme, ...this.theme };
    for (const [key, value] of Object.entries(newTheme)) {
      this.customProperties.set(`--monkey-${key}`, value.toString());
    }
    this.updateCustomProperties();
  }
  public getClassName(componentName: string, variant: string = 'base'): string {
    return `monkey-${componentName}${variant === 'base' ? '' : '-' + variant}`;
  }
  public getStaticCSS(): string {
    return this.styleElement.textContent || '';
  }
}

export default BaseStyleManager;