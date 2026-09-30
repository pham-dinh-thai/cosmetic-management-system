export enum EmailLogStatus {
  SENT = 'sent',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

export type EmailLogProps = {
  orderId: string;
  eventType: string;
  recipient: string;
  subject: string;
  status: EmailLogStatus;
  providerId?: string | null;
  error?: string | null;
};

export class EmailLog {
  public constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly eventType: string,
    public readonly recipient: string,
    public readonly subject: string,
    public readonly status: EmailLogStatus,
    public readonly providerId: string | null,
    public readonly error: string | null,
    public readonly createdAt: Date,
  ) {}

  public static fromPersistent(props: {
    id: string;
    orderId: string;
    eventType: string;
    recipient: string;
    subject: string;
    status: EmailLogStatus;
    providerId: string | null;
    error: string | null;
    createdAt: Date;
  }): EmailLog {
    return new EmailLog(
      props.id,
      props.orderId,
      props.eventType,
      props.recipient,
      props.subject,
      props.status,
      props.providerId,
      props.error,
      props.createdAt,
    );
  }
}
