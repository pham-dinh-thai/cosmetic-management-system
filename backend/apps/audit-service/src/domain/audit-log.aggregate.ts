import {
  AuditAction,
  FromPersistentAuditLogProps,
  RecordAuditLogProps,
} from './types';

export class AuditLog {
  private readonly id: string;
  private readonly action: AuditAction;
  private readonly entityType: string;
  private readonly actorId: string | null;
  private readonly actorName: string | null;
  private readonly entityId: string | null;
  private readonly before: Record<string, unknown> | null;
  private readonly after: Record<string, unknown> | null;
  private readonly metadata: Record<string, unknown> | null;
  private readonly ipAddress: string | null;
  private readonly userAgent: string | null;
  private readonly createdAt: Date;

  private constructor(
    id: string,
    action: AuditAction,
    entityType: string,
    actorId: string | null | undefined,
    actorName: string | null | undefined,
    entityId: string | null | undefined,
    before: Record<string, unknown> | null | undefined,
    after: Record<string, unknown> | null | undefined,
    metadata: Record<string, unknown> | null | undefined,
    ipAddress: string | null | undefined,
    userAgent: string | null | undefined,
    createdAt?: Date,
  ) {
    this.id = id;
    this.action = action;
    this.entityType = entityType;
    // Normalize undefined -> null once here so getters never return undefined.
    this.actorId = actorId !== undefined ? actorId : null;
    this.actorName = actorName !== undefined ? actorName : null;
    this.entityId = entityId !== undefined ? entityId : null;
    this.before = before !== undefined ? before : null;
    this.after = after !== undefined ? after : null;
    this.metadata = metadata !== undefined ? metadata : null;
    this.ipAddress = ipAddress !== undefined ? ipAddress : null;
    this.userAgent = userAgent !== undefined ? userAgent : null;
    this.createdAt = createdAt !== undefined ? createdAt : new Date();
  }

  public static create(props: RecordAuditLogProps): AuditLog {
    return new AuditLog(
      undefined as unknown as string,
      props.action,
      props.entityType,
      props.actorId,
      props.actorName,
      props.entityId,
      props.before,
      props.after,
      props.metadata,
      props.ipAddress,
      props.userAgent,
    );
  }

  public static fromPersistent(props: FromPersistentAuditLogProps): AuditLog {
    return new AuditLog(
      props.id,
      props.action,
      props.entityType,
      props.actorId,
      props.actorName,
      props.entityId,
      props.before,
      props.after,
      props.metadata,
      props.ipAddress,
      props.userAgent,
      props.createdAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getAction(): AuditAction {
    return this.action;
  }

  public getEntityType(): string {
    return this.entityType;
  }

  public getActorId(): string | null {
    return this.actorId;
  }

  public getActorName(): string | null {
    return this.actorName;
  }

  public getEntityId(): string | null {
    return this.entityId;
  }

  public getBefore(): Record<string, unknown> | null {
    return this.before;
  }

  public getAfter(): Record<string, unknown> | null {
    return this.after;
  }

  public getMetadata(): Record<string, unknown> | null {
    return this.metadata;
  }

  public getIpAddress(): string | null {
    return this.ipAddress;
  }

  public getUserAgent(): string | null {
    return this.userAgent;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
