export type NotificationPayloadType = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string>;
};
