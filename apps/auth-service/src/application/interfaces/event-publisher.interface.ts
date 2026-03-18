export const I_EVENT_PUBLISHER = 'IEventPublisher';

export interface IEventPublisher {
  publish(topic: string, data: any): void;
}
