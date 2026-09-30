import { Logger } from '@nestjs/common';
import { IMailSenderPort } from '../../ports/mail-sender.port';
import { ICustomerContactReaderPort } from '../../ports/customer-contact-reader.port';
import { EmailLogStatus } from '../../../domain/email-log';
import { IEmailLogsRepository } from '../../../domain/repositories/email-logs.repository';
import { OrderEventEnvelope } from '../../../domain/order-event';
import { renderOrderMail } from '../../../infrastructure/templates/order-mail.template';

export class SendOrderEventMailUseCase {
  private readonly logger = new Logger(SendOrderEventMailUseCase.name);

  public constructor(
    private readonly emailLogsRepository: IEmailLogsRepository,
    private readonly customerContactReader: ICustomerContactReaderPort,
    private readonly mailSender: IMailSenderPort,
  ) {}

  public async execute(event: OrderEventEnvelope): Promise<void> {
    const { eventType, payload } = event;
    const { orderId } = payload;

    const existing = await this.emailLogsRepository.findByOrderAndEvent(
      orderId,
      eventType,
    );

    if (existing) {
      this.logger.log(`Đã gửi ${eventType} cho đơn ${orderId}, bỏ qua`);
      return;
    }

    const rendered = renderOrderMail(eventType, payload);

    if (!rendered) {
      this.logger.warn(`Chưa có template cho ${eventType}, bỏ qua`);
      return;
    }

    const contact = await this.customerContactReader.getContact(
      payload.customerId,
    );

    if (!contact) {
      await this.emailLogsRepository.save({
        orderId,
        eventType,
        recipient: '',
        subject: rendered.subject,
        status: EmailLogStatus.SKIPPED,
        error: 'Khách không có email',
      });
      return;
    }

    try {
      const { providerId } = await this.mailSender.send({
        to: contact.email,
        subject: rendered.subject,
        html: rendered.html,
      });

      await this.emailLogsRepository.save({
        orderId,
        eventType,
        recipient: contact.email,
        subject: rendered.subject,
        status: EmailLogStatus.SENT,
        providerId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await this.emailLogsRepository.save({
        orderId,
        eventType,
        recipient: contact.email,
        subject: rendered.subject,
        status: EmailLogStatus.FAILED,
        error: message,
      });

      throw error;
    }
  }
}

export const sendOrderEventMailUseCaseFactory = (
  emailLogsRepository: IEmailLogsRepository,
  customerContactReader: ICustomerContactReaderPort,
  mailSender: IMailSenderPort,
): SendOrderEventMailUseCase =>
  new SendOrderEventMailUseCase(
    emailLogsRepository,
    customerContactReader,
    mailSender,
  );
