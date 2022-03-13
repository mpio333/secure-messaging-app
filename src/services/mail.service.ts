import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '@config';
import { logger } from '@utils/logger';
import nodemailer, { TransportOptions } from 'nodemailer';

class MailService {
  private transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  } as TransportOptions);

  public async send(to: string, subject: string, message: string): Promise<void> {
    await this.transporter.sendMail({
      to: to,
      subject: subject,
      html: message,
    });

    logger.info(`Email sent to ${to}`);
  }
}

export default MailService;
