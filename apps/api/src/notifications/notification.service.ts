// src/notifications/notification.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User, Title, Review } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendReviewNotification(user: User, review: Review, title: Title) {
    await this.sendEmail(
      user.email,
      'New Review on Your Title',
      'review-notification',
      {
        username: user.name,
        titleName: title.primaryTitle,
        reviewContent: review.content,
      },
    );
  }

  async sendNewFollowerNotification(user: User, follower: User) {
    await this.sendEmail(user.email, 'New Follower', 'new-follower', {
      username: user.name,
      followerName: follower.name,
    });
  }

  async sendWatchlistReminderNotification(user: User, titles: Title[]) {
    await this.sendEmail(
      user.email,
      'Your Watchlist Update',
      'watchlist-reminder',
      {
        username: user.name,
        titles,
      },
    );
  }

  async sendNewReleasesNotification(user: User, titles: Title[]) {
    await this.sendEmail(
      user.email,
      'New Releases You Might Like',
      'new-releases',
      {
        username: user.name,
        titles,
      },
    );
  }
}
