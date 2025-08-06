export type ThemeType = {
  fontFamily: string;
  fontSize: string;
  textColor: string;
  popoverBgColor: string;
  popoverPadding: string;
  popoverBorderRadius: string;
  popoverBoxShadow: string;
  popoverBtnPadding: string;
  overlayColor: string;
  overlayOpacity: number;
  overlayRadius: string;
  overlayPadding: string;
  overlayStrokeWidth: number;
  ovelayStrokeColor: string;
  primaryBtnBgColor: string;
  primaryBtnColor: string;
  secondaryBtnColor: string;
  secondaryBtnBgColor: string;
  baseZIndex: number;
  overlayZIndex: number;
  arrowColor: string;
};

const defaultTheme: Partial<ThemeType> = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333',
  popoverBgColor: '#fff',
  popoverPadding: '10px',
  popoverBorderRadius: '8px',
  popoverBoxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  popoverBtnPadding: '5px 16px',
  overlayColor: 'rgba(0,0,0,0.5)',
  overlayRadius: '10px',
  overlayOpacity: 0.5,
  overlayPadding: '10px',
  ovelayStrokeColor: 'rgba(255, 0, 0, 0)',
  overlayStrokeWidth: 2,
  primaryBtnBgColor: '#007BFF',
  primaryBtnColor: '#FFFFFF',
  secondaryBtnColor: '#FFFFFF',
  secondaryBtnBgColor: '#6C757D',
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
    from {
      opacity:0;
      transform: translateY(10px);
    }\n
    to {
      opacity:1;  
      transform: translateY(0); /* End at original position */\n
    }\n
  }`,
};

class BaseStyleManager {
  private static instance: BaseStyleManager;
  private styleElement: HTMLStyleElement;
  private theme: Partial<ThemeType>;
  private styles: Map<string, Map<string, string>> = new Map();
  private styleSheetMap: Map<string, string> = new Map();
  private customProperties: Map<string, string> = new Map();
  private animations: Map<string, string> = new Map();
  private constructor(initialTheme: Partial<ThemeType>) {
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
  public static overrideTheme(theme: Partial<ThemeType>) {
    BaseStyleManager.getInstance(theme);
  }
  public static getInstance(
    initialTheme: Partial<ThemeType> = defaultTheme,
  ): BaseStyleManager {
    if (!BaseStyleManager.instance) {
      console.log(defaultTheme, initialTheme);
      BaseStyleManager.instance = new BaseStyleManager({
        ...defaultTheme,
        ...initialTheme,
      });
    }
    return BaseStyleManager.instance;
  }
  private generateBaseStyles() {
    this.addComponentStyles('mask', {
      base: `
        fill:var(--monkey-overlayColor);
        stroke:rgba(255, 0, 0, 0);
        stroke-width:2;
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
