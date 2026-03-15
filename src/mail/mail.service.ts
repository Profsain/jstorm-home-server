import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly settingsService: SettingsService) {}

  private async getTransporter() {
    const config = await this.settingsService.getSettings();

    if (!config || !config.smtpHost || !config.smtpUser || !config.smtpPass) {
      this.logger.warn('SMTP configuration is missing. Email skipped.');
      return null;
    }

    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  async sendBookingConfirmation(to: string, bookingDetails: any) {
    const transporter = await this.getTransporter();
    if (!transporter) return;

    const config = await this.settingsService.getSettings();

    const mailOptions = {
      from: config.smtpFrom || config.smtpUser,
      to,
      subject: `Booking Confirmed - ${bookingDetails.propertyId?.name}`,
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${bookingDetails.guestName},</p>
        <p>Your booking for <strong>${bookingDetails.propertyId?.name}</strong> has been confirmed.</p>
        <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
        <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
        <p>We look forward to hosting you!</p>
        <br>
        <p>Best regards,</p>
        <p>JStorm Homes Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      this.logger.log(`Confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }
}
