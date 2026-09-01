import { InvalidPhoneNumberException } from '../exceptions/invalid-phone-number.exception';
import { CreatePhoneProps, FromPersistentPhoneProps } from './types';

export class Phone {
  /**
   * Vietnamese mobile phone number only (landline 02x not supported).
   * Must start with 03, 05, 07, 08, 09 and have exactly 10 digits total.
   */
  private static readonly VIETNAM_PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;

  public constructor(
    private readonly id: string,
    private readonly customerId: string,
    private phone: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreatePhoneProps): Phone {
    if (!this.VIETNAM_PHONE_REGEX.test(props.phone)) {
      throw new InvalidPhoneNumberException(props.phone);
    }

    return new Phone(
      undefined as unknown as string,
      props.customerId,
      props.phone,
    );
  }

  public static fromPersistent(props: FromPersistentPhoneProps): Phone {
    return new Phone(
      props.id,
      props.customerId,
      props.phone,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
