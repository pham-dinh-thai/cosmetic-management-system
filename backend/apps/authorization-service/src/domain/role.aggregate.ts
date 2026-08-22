export class Role {
  public constructor(
    private readonly id: string,
    private name: string,
  ) {}

  public static create(name: string): Role {
    const trimmedName = name.trim();

    const id = Role.formatId(trimmedName);
    const formattedName = Role.formatName(trimmedName);

    return new Role(id, formattedName);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  private static formatId(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }

  private static formatName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
