export const EVENT_TYPES = ['puja', 'flower_offering', 'havan', 'public_program'] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  puja: 'Puja',
  flower_offering: 'Flower Offering',
  havan: 'Havan',
  public_program: 'Public Program',
};

export function isEventType(value: string): value is EventType {
  return EVENT_TYPES.includes(value as EventType);
}
