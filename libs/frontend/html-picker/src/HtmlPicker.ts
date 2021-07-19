/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposable, Maybe, prefix } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';

interface ElementPickerProps {
  container?: HTMLElement;
  selectors?: string;
  background?: string;
  zIndex?: number;
  borderWidth?: number;
  transition?: string;
  ignoreElements?: Element[];
  action?: Action;
  onElementHover?: (element: HTMLElement) => unknown;
  onElementSelect?: (element: HTMLElement | null) => unknown;
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

  private selectedElementInternal?: Maybe<HTMLElement>;

  private handleClick = (event: Event) => {
    if (!this.preventClick) {
      return;
    }

    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }

    event.preventDefault();
    event.stopPropagation();

    if (!this.selectedElementInternal) {
      this.selectedElement = this.currentTarget;

      return;
    }

    if (this.action?.trigger === 'click' && this.currentTarget) {
      this.action.callback(this.currentTarget, event);

      this.selectedElement = undefined;
    }
  };

  constructor(options: ElementPickerProps) {
    this.hoverBox = this.createHoverBox();

    const defaultOptions: ElementPickerProps = {
      container: document.body,
      selectors: '*', // default to pick all elements
      background: 'rgba(153, 235, 255, 0.5)',
      borderWidth: 5,
      transition: 'all 150ms ease', // set to "" (empty string) to disable
      ignoreElements: [document.body],
      action: undefined,
      preventClick: true,
      zIndex: 999999,
    };

    const mergedOptions: ElementPickerProps = {
      ...defaultOptions,
      ...options,
    };

    Object.assign(this, mergedOptions);

    this.createAndRegisterMouseMoveListener();
    this.createHandleOutsideClick();
  }

  private createHoverBox(prevHoverBox?: HTMLElement) {
    if (prevHoverBox) {
      prevHoverBox.remove();
    }

    const hoverBox = document.createElement('div');

    hoverBox.style.position = 'absolute';
    hoverBox.style.pointerEvents = 'none';
    hoverBox.style.zIndex = this.zIndex?.toString() ?? '99999';
    hoverBox.style.maxWidth = '100%';
    hoverBox.style.background = this.background!;
    hoverBox.style.transition = this.transition!;

    hoverBox.classList.add(prefix('hover-box'));

    return hoverBox;
  }

  private createHandleOutsideClick() {
    this.handleOutsideClick = (event) => {
      const target = event.target as HTMLElement;

      if (
        !this.selectedElementInternal ||
        this.selectedElementInternal === target ||
        this.selectedElementInternal.contains(target) ||
        (this.props.shouldHandleOutsideClick &&
          !this.props.shouldHandleOutsideClick(target))
      ) {
        return;
      }

      this.selectedElementInternal = null;
      this.props.onElementSelect?.(null);

      this.hoverBox.style.width = '0';

      this.detectMouseMove(event);
    };

    document.addEventListener('click', this.handleOutsideClick);
  }

  private createAndRegisterMouseMoveListener() {
    this.detectMouseMove = async (event) => {
      if (this.selectedElementInternal) {
        return;
      }

      this.previousEvent = event;
      const target = event.target as HTMLElement;

      if (this.isElementValid(target)) {
        this.setTarget(target, event);
      } else {
        this.hoverBox.style.width = '0';
      }
    };

    document.addEventListener('mousemove', this.detectMouseMove);
  }

  setTarget(target: HTMLElement, event?: MouseEvent) {
    if (target === this.hoverBox) {
      if (!event) {
        logger.error('Event is missing and target is an hover box.');

        return;
      }

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

    this.hoverBox.style.width = `${targetWidth + this.borderWidth! * 2}px`;
    this.hoverBox.style.height = `${targetHeight + this.borderWidth! * 2}px`;
    // need scrollX and scrollY to account for scrolling
    this.hoverBox.style.top = `${
      targetOffset.top + window.scrollY - this.borderWidth!
    }px`;
    this.hoverBox.style.left = `${
      targetOffset.left + window.scrollX - this.borderWidth!
    }px`;

    return target;
  }

  private isElementValid(target: HTMLElement) {
    return (
      !this.ignoreElements?.includes(target) &&
      target.matches(this.selectors!) &&
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

    this.hoverBox.style.background = this.background!;
  }

  get transition() {
    return this.props.transition;
  }

  set transition(value) {
    this.props.transition = value;

    this.hoverBox.style.transition = this.transition!;
  }

  set zIndex(value) {
    this.props.zIndex = value;

    this.hoverBox.style.zIndex = value?.toString() ?? '';
  }

  get zIndex() {
    return this.props.zIndex;
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

      document.addEventListener(this.action!.trigger, this.triggerListener);
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

  set selectedElement(element: HTMLElement | undefined) {
    this.selectedElementInternal = element;
    this.props?.onElementSelect?.(element ?? null);
  }

  get selectedElement() {
    return this.selectedElementInternal!;
  }

  dispose() {
    this.selectedElement = undefined;

    this.hoverBox.remove();

    if (this.action?.trigger && this.triggerListener) {
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
