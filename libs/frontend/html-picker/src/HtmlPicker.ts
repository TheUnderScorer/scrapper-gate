/* eslint-disable @typescript-eslint/adjacent-overload-signatures,@typescript-eslint/explicit-module-boundary-types */
import { prefix } from '@scrapper-gate/shared/common';

interface ElementPickerProps {
  container?: HTMLElement;
  selectors?: string;
  background?: string;
  borderWidth?: number;
  transition?: string;
  ignoreElements?: Element[];
  action?: Action;
  onElementHover?: (element: HTMLElement) => unknown;
  ignoreElementsContainer?: HTMLElement;
  preventClick?: boolean;
}

type Action = {
  trigger: keyof DocumentEventMap;
  callback: (target: Element, e: Event) => unknown;
};

// TODO Refactor
export class HtmlPicker implements ElementPickerProps {
  readonly hoverBox: HTMLElement;

  private readonly detectMouseMove: (e: MouseEvent) => unknown;

  private previousEvent?: MouseEvent;

  private currentTarget?: HTMLElement;

  private triggered = false;

  private props: ElementPickerProps = {};

  private triggerListener?: () => unknown;

  private clickTimes = 0;

  private handleClick = (e: Event) => {
    if (this.preventClick) {
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }

      e.preventDefault();
      e.stopPropagation();
    }

    this.clickTimes += 1;

    if (this.action?.trigger === 'click') {
      this.action.callback(this.currentTarget, e);

      this.clickTimes = 0;

      return;
    }

    setTimeout(() => {
      if (this.clickTimes > 1 && this.action?.trigger === 'dblclick') {
        this.action.callback(this.currentTarget, e);
      }

      this.clickTimes = 0;
    }, 500);
  };

  constructor(options: ElementPickerProps) {
    this.hoverBox = document.createElement('div');
    this.hoverBox.style.position = 'absolute';
    this.hoverBox.style.pointerEvents = 'none';
    this.hoverBox.style.zIndex = '9999';
    this.hoverBox.style.maxWidth = '100%';
    this.hoverBox.classList.add(prefix('hover-box'));

    const defaultOptions: ElementPickerProps = {
      container: document.body,
      selectors: '*', // default to pick all elements
      background: 'rgba(153, 235, 255, 0.5)', // transparent light blue
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

    /* Object.keys(mergedOptions).forEach((key) => {
      this[key as keyof ElementPickerProps] = mergedOptions[
        key as keyof ElementPickerProps
      ]!;
    }); */

    this.detectMouseMove = async (e) => {
      this.previousEvent = e;
      let target = e.target as HTMLElement;

      if (
        !this.ignoreElements?.includes(target) &&
        target.matches(this.selectors) &&
        this.container?.contains(target) &&
        !this.ignoreElementsContainer?.contains(target)
      ) {
        // is NOT ignored elements
        if (target === this.hoverBox) {
          // the true hovered element behind the added hover box
          const hoveredElement = document.elementsFromPoint(
            e.clientX,
            e.clientY
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
          this.action?.callback(target, e);
          this.triggered = false;
        }
      } else {
        // console.log("hiding hover box...");
        this.hoverBox.style.width = '0';
      }
    };
    document.addEventListener('mousemove', this.detectMouseMove);
  }

  get container() {
    return this.props.container;
  }

  set container(value) {
    if (value instanceof HTMLElement) {
      this.props.container = value;
      this.container?.appendChild(this.hoverBox);
    } else {
      throw new Error('Please specify an HTMLElement as container!');
    }
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

  get action() {
    return this.props.action;
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

  get ignoreElementsContainer() {
    return this.props.ignoreElementsContainer;
  }

  set ignoreElementsContainer(el) {
    this.props.ignoreElementsContainer = el;
  }

  close() {
    this.hoverBox.remove();

    if (this.action?.trigger) {
      document.removeEventListener(this.action.trigger, this.triggerListener);
    }

    if (this.currentTarget) {
      this.currentTarget.removeEventListener('click', this.handleClick);
      this.currentTarget.removeEventListener('dblclick', this.handleClick);
    }

    document.removeEventListener('mousemove', this.detectMouseMove);
  }

  get onElementHover() {
    return this.props.onElementHover;
  }

  set onElementHover(callback) {
    this.props.onElementHover = callback;
  }

  private redetectMouseMove() {
    if (this.detectMouseMove && this.previousEvent) {
      this.detectMouseMove(this.previousEvent);
    }
  }
}
