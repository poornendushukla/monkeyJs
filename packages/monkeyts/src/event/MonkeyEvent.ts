export type EventType = 'onNext' | 'onPrev' | 'onEnd' | 'onStart';

export interface EventPayload {
  [key: string]: unknown;
}

class MonkeyEvent extends EventTarget {
  constructor() {
    super();
  }
  private monkeyDispatch(eventType: EventType, payload: EventPayload): boolean {
    const event = new CustomEvent<EventPayload>(eventType, {
      detail: payload,
    });
    return window.dispatchEvent(event);
  }
  onNextEvent(payload?: EventPayload) {
    this.monkeyDispatch('onNext', payload || {});
  }
  onPrevEvent(payload?: EventPayload) {
    this.monkeyDispatch('onPrev', payload || {});
  }
  onEndEvent(payload?: EventPayload) {
    this.monkeyDispatch('onEnd', payload || {});
  }
  onStartEvent(payload?: EventPayload) {
    this.monkeyDispatch('onEnd', payload || {});
  }
}

export default MonkeyEvent;
