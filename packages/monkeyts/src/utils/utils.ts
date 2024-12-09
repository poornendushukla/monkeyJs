export function bringInView(element: Element) {
  if (!element || isElementInView(element)) {
    return;
  }
  element.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'center',
  });
}
export function isElementInView(element: Element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
export function hasVerticalScroll() {
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const windowHeight = window.innerHeight;
  return documentHeight > windowHeight;
}
export function hasHorizontalScroll() {
  const documentWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth,
  );
  const windowWidth = window.innerWidth;
  return documentWidth > windowWidth;
}
export enum POPOVERIDS {
  POPOVER_WRAPPER_ID = 'popover_wrapper_id',
  POPOVER_ELEMENT = 'popover_element',
  POPOVER_TITLE = 'popover_title',
  POPOVER_DESC = 'popover_desc',
  NEXT_BTN = 'next_btn',
  PREV_BTN = 'prev_btn',
  POPOVER_FOOTER = 'popover_footer',
  POPOVER_PROGRESSBAR = 'popover_progress',
}
export type TPopoverPosition =
  (typeof POPOVER_POSITION_CONSTANT)[keyof typeof POPOVER_POSITION_CONSTANT];
export enum POPOVER_POSITION_CONSTANT {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export const popover_positions = [
  POPOVER_POSITION_CONSTANT.TOP,
  POPOVER_POSITION_CONSTANT.BOTTOM,
  POPOVER_POSITION_CONSTANT.LEFT,
  POPOVER_POSITION_CONSTANT.RIGHT,
];
