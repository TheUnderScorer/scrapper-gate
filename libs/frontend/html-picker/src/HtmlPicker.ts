import { Disposable, prefix } from '@scrapper-gate/shared/common';

interface ElementPickerProps {
  container?: HTMLElement;
  selectors?: string;
  background?: string;
  borderWidth?: number;
  transition?: string;
  ignoreElements?: Element[];
  action?: Action;
  onElementHover?: (element: HTMLElement) => unknown;
  onElementSelect?: (element: HTMLElement) => unknown;
  ignoreElementsContainer?: HTMLElement;
  preventClick?: boolean;
  shouldHandleOutsideClick?: (element: HTMLElement) => boolean;
}

type Action = {
  trigger: keyof DocumentEventMap;
  callback: (target: Element, e: Event) => unknown;
};

// TODO Refactor
export class HtmlPicker implements ElementPickerProps, Disposable {
  readonly hoverBox: HTMLElement;

  private detectMouseMove: (e: MouseEvent) => unknown;

  private handleOutsideClick: (e: MouseEvent) => unknown;

  private previousEvent?: MouseEvent;

  private currentTarget?: HTMLElement;

  private triggered = false;

  private props: ElementPickerProps = {};

  private triggerListener?: () => unknown;

  selectedElement?: HTMLElement;

  private handleClick = (event: Event) => {
    if (this.preventClick) {
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }

      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.selectedElement) {
      this.selectedElement = this.currentTarget;

      this.props.onElementSelect?.(this.selectedElement);

      return;
    }

    if (this.action?.trigger === 'click') {
      this.action.callback(this.currentTarget, event);

      this.selectedElement = undefined;
    }
  };

  constructor(options: ElementPickerProps) {
    this.hoverBox = HtmlPicker.createHoverBox();

    const defaultOptions: ElementPickerProps = {
      container: document.body,
      selectors: '*', // default to pick all elements
      background: 'rgba(153, 235, 255, 0.5)',
      borderWidth: 5,
      transition: 'all 150ms ease', // set to "" (empty string) to disable
      ignoreElements: [document.body],
      action: undefined,
    };

    const mergedOptions: ElementPickerProps = {
      ...defaultOptions,
      ...options,
    };

    Object.assign(this, mergedOptions);

    this.createAndRegisterMouseMoveListener();
    this.createHandleOutsideClick();
  }

  private static createHoverBox() {
    const hoverBox = document.createElement('div');
    hoverBox.style.position = 'absolute';
    hoverBox.style.pointerEvents = 'none';
    hoverBox.style.zIndex = '9999';
    hoverBox.style.maxWidth = '100%';
    hoverBox.classList.add(prefix('hover-box'));

    return hoverBox;
  }

  private createHandleOutsideClick() {
    this.handleOutsideClick = (event) => {
      const target = event.target as HTMLElement;

      if (
        !this.selectedElement ||
        this.selectedElement === target ||
        this.selectedElement.contains(target) ||
        (this.props.shouldHandleOutsideClick &&
          !this.props.shouldHandleOutsideClick(target))
      ) {
        return;
      }

      this.selectedElement = null;
      this.hoverBox.style.width = '0';

      this.detectMouseMove(event);
    };

    document.addEventListener('click', this.handleOutsideClick);
  }

  private createAndRegisterMouseMoveListener() {
    this.detectMouseMove = async (event) => {
      if (this.selectedElement) {
        return;
      }

      this.previousEvent = event;
      let target = event.target as HTMLElement;

      if (this.isElementValid(target)) {
        if (target === this.hoverBox) {
          // the true hovered element behind the added hover box
          const hoveredElement = document.elementsFromPoint(
            event.clientX,
            event.clientY
          )[1] as HTMLElement;

          if (
            this.currentTarget === hoveredElement ||
            this.ignoreElementsContainer?.contains(hoveredElement)
          ) {
            // avoid repeated calculation and rendering
            return;
          }

          target = hoveredElement;
        }

        if (this.props.onElementHover) {
          this.props.onElementHover(target);
        }

        if (this.currentTarget) {
          this.currentTarget.removeEventListener('click', this.handleClick);
          this.currentTarget.removeEventListener('dblclick', this.handleClick);
        }

        this.currentTarget = target;

        const targetOffset = target.getBoundingClientRect();
        const targetHeight = targetOffset.height;
        const targetWidth = targetOffset.width;

        target.addEventListener('click', this.handleClick);

        this.hoverBox.style.width = `${targetWidth + this.borderWidth * 2}px`;
        this.hoverBox.style.height = `${targetHeight + this.borderWidth * 2}px`;
        // need scrollX and scrollY to account for scrolling
        this.hoverBox.style.top = `${
          targetOffset.top + window.scrollY - this.borderWidth
        }px`;
        this.hoverBox.style.left = `${
          targetOffset.left + window.scrollX - this.borderWidth
        }px`;

        if (
          this.triggered &&
          !['click', 'dbclick'].includes(this.action?.trigger ?? '')
        ) {
          this.action?.callback(target, event);
          this.triggered = false;
        }
      } else {
        this.hoverBox.style.width = '0';
      }
    };

    document.addEventListener('mousemove', this.detectMouseMove);
  }

  private isElementValid(target: HTMLElement) {
    return (
      !this.ignoreElements?.includes(target) &&
      target.matches(this.selectors) &&
      this.container?.contains(target) &&
      !this.ignoreElementsContainer?.contains(target)
    );
  }

  get container() {
    return this.props.container;
  }

  set container(value) {
    if (value instanceof HTMLElement) {
      this.props.container = value;
      this.container?.appendChild(this.hoverBox);

      return;
    }

    throw new TypeError('Please specify an HTMLElement as container!');
  }

  get background() {
    return this.props.background;
  }

  set background(value) {
    this.props.background = value;

    this.hoverBox.style.background = this.background;
  }

  get transition() {
    return this.props.transition;
  }

  set transition(value) {
    this.props.transition = value;

    this.hoverBox.style.transition = this.transition;
  }

  get borderWidth() {
    return this.props.borderWidth;
  }

  set borderWidth(value) {
    this.props.borderWidth = value;

    this.redetectMouseMove();
  }

  get selectors() {
    return this.props.selectors;
  }

  set selectors(value) {
    this.props.selectors = value;

    this.redetectMouseMove();
  }

  get ignoreElements() {
    return this.props.ignoreElements;
  }

  set ignoreElements(value) {
    this.props.ignoreElements = value;

    this.redetectMouseMove();
  }

  get preventClick() {
    return this.props.preventClick;
  }

  set preventClick(prevent) {
    this.props.preventClick = prevent;
  }

  set action(value) {
    if (value?.trigger && value?.callback) {
      if (this.triggerListener && this.action?.trigger) {
        document.removeEventListener(this.action.trigger, this.triggerListener);
        this.triggered = false;
      }

      this.props.action = value;

      this.triggerListener = () => {
        this.triggered = true;
        this.redetectMouseMove();
      };

      document.addEventListener(this.action.trigger, this.triggerListener);
    }
  }

  get action() {
    return this.props.action;
  }

  get ignoreElementsContainer() {
    return this.props.ignoreElementsContainer;
  }

  set ignoreElementsContainer(el) {
    this.props.ignoreElementsContainer = el;
  }

  dispose() {
    this.selectedElement = undefined;

    this.hoverBox.remove();

    if (this.action?.trigger) {
      document.removeEventListener(this.action.trigger, this.triggerListener);
    }

    if (this.currentTarget) {
      this.currentTarget.removeEventListener('click', this.handleClick);
      this.currentTarget.removeEventListener('dblclick', this.handleClick);
    }

    document.removeEventListener('mousemove', this.detectMouseMove);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  get onElementHover() {
    return this.props.onElementHover;
  }

  set onElementHover(callback) {
    this.props.onElementHover = callback;
  }

  set onElementSelect(handler: ElementPickerProps['onElementSelect']) {
    this.props.onElementSelect = handler;
  }

  set shouldHandleOutsideClick(
    handler: ElementPickerProps['shouldHandleOutsideClick']
  ) {
    this.props.shouldHandleOutsideClick = handler;
  }

  getCurrentTarget() {
    return this.currentTarget;
  }

  private redetectMouseMove() {
    if (this.detectMouseMove && this.previousEvent) {
      this.detectMouseMove(this.previousEvent);
    }
  }
}
