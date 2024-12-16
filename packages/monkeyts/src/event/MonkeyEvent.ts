export type EventType = 'onNext' | 'onPrev' | 'onEnd' | 'onStart';

export interface EventPayload {
  [key: string]: unknown;
}

class MonkeyEvent extends EventTarget {
  constructor() {
    super();
  }
  monkeyDispatch(eventType: EventType, payload: EventPayload): boolean {
    const event = new CustomEvent<EventPayload>(eventType, {
      detail: payload,
    });
    console.log('event dispatched', event);
    window.dispatchEvent(event);
    return super.dispatchEvent(event);
  }
}

export default MonkeyEvent;
