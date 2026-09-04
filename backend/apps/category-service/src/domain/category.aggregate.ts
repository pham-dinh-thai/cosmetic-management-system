import { CreateCategoryProps, FromPersistentCategoryProps } from './types';

export class Category {
  public constructor(
    private readonly id: string,
    private name: string,
    private description: string | null,
    private isActive: boolean,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateCategoryProps): Category {
    return new Category(
      undefined as unknown as string,
      props.name,
      props.description,
      true,
    );
  }

  public static fromPersistent(props: FromPersistentCategoryProps): Category {
    return new Category(
      props.id,
      props.name,
      props.description,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
