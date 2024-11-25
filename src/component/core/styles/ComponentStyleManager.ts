import BaseStyleManager from "./BaseStyleManager";

class ComponentStyleManager {
  constructor(
    private styleManager: BaseStyleManager,
    private compnentName: string
  ) {}

  addStyles(styles: { [key: string]: string }) {
    this.styleManager.addComponentStyles(this.compnentName, styles);
  }

  getClassName(variant: string = "base") {
    return this.styleManager.getClassName(this.compnentName, variant);
  }
}
export default ComponentStyleManager;
