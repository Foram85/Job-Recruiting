import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
  private client: postmark.ServerClient;

  constructor(private configService: ConfigService) {
    this.client = new postmark.ServerClient(
      this.configService.get<string>('POSTMARK_API_TOKEN'),
    );
  }

  async sendNewApplicationNotification(
    hiringManagerEmail: string,
    candidateName: string,
    applicationId: string,
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: hiringManagerEmail,
      TemplateId: 39236877,
      TemplateModel: {
        candidateName,
        applicationLink: `http://localhost:3000/job-application/${applicationId}`,
      },
    });
  }

  async sendInterviewDetailsToCandidate(
    CandidateEmail: string,
    candidateName: string,
    interviewDetails: {
      schedule_start_date: string;
      schedule_end_date: string;
      meeting_link: string;
      round: number;
      type: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: CandidateEmail,
      TemplateId: 39236997,
      TemplateModel: {
        candidateName,
        ...interviewDetails,
      },
    });
  }

  async sendInterviewDetailsToInterviewer(
    InterviewerEmail: string,
    InterviewerName: string,
    CandidateName: string,
    resumeLink: string,
    interviewDetails: {
      schedule_start_date: string;
      schedule_end_date: string;
      meeting_link: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: InterviewerEmail,
      TemplateId: 39237023,
      TemplateModel: {
        InterviewerName,
        CandidateName,
        resumeLink,
        ...interviewDetails,
      },
    });
  }

  async sendOfferToCandidate(
    CandidateEmail: string,
    candidateName: string,
    offerDetails: {
      offerLetterLink: string;
      joiningDate: string;
      positionName: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: CandidateEmail,
      TemplateId: 39237055,
      TemplateModel: {
        candidateName,
        ...offerDetails,
      },
    });
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const resetLink = `http://localhost:3000/candidate/reset-password?token=${token}`;

    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: email,
      TemplateId: 39079303,
      TemplateModel: {
        name: name,
        link: resetLink,
      },
    });
  }

  async sendInvitation(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const invitationLink = `http://localhost:3000/employees?token=${token}`;

    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: email,
      TemplateId: 39112655,
      TemplateModel: {
        name,
        link: invitationLink,
      },
    });
  }
}
