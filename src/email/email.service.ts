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
    const message = {
      From: 'foram.s@solutelabs.com',
      To: hiringManagerEmail,
      Subject: 'New Job Application Submitted',
      TextBody: `A new job application from ${candidateName} has been submitted for your review.
      
View details at: http://localhost:3000/job-application/${applicationId}`,
    };
    await this.client.sendEmail(message);
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
    const message = {
      From: 'foram.s@solutelabs.com',
      To: CandidateEmail,
      Subject: 'Interview Scheduled',
      TextBody: `Hello ${candidateName},
      
Your interview has been scheduled.

Interview Details:
  - Start: ${interviewDetails.schedule_start_date}
  - End: ${interviewDetails.schedule_end_date}
  - Meeting Link: ${interviewDetails.meeting_link}
  - Round: ${interviewDetails.round}
  - Type: ${interviewDetails.type}

If you have questions, please contact us.

Best regards,
SoluteLabs`,
    };
    await this.client.sendEmail(message);
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
    const message = {
      From: 'foram.s@solutelabs.com',
      To: InterviewerEmail,
      Subject: 'Interview Scheduled',
      TextBody: `Hello ${InterviewerName},
      
You have an interview scheduled with ${CandidateName}.
Candidate's resume: ${resumeLink}

Interview Details:
  - Start: ${interviewDetails.schedule_start_date}
  - End: ${interviewDetails.schedule_end_date}
  - Meeting Link: ${interviewDetails.meeting_link}

Best regards,
SoluteLabs`,
    };
    await this.client.sendEmail(message);
  }

  async sendOfferToCandidate(
    CandidateEmail: string,
    candidateName: string,
    offerDetails: {
      offerLetterLink: string;
      salary?: number;
      joiningDate: string;
      positionName: string;
    },
  ): Promise<void> {
    const message = {
      From: 'foram.s@solutelabs.com',
      To: CandidateEmail,
      Subject: 'Job Offer',
      TextBody: `Hello ${candidateName},
      
Congratulations! We are pleased to offer you the position of ${offerDetails.positionName}.

Offer Details:
  - Salary: ${offerDetails.salary ? offerDetails.salary : 'To be discussed'}
  - Joining Date: ${offerDetails.joiningDate}
  - Offer Letter: ${offerDetails.offerLetterLink}

Best regards,
SoluteLabs`,
    };
    await this.client.sendEmail(message);
  }

  async sendResetPasswordEmail(
    candidateEmail: string,
    candidateName: string,
    token: string,
  ): Promise<void> {
    const resetLink = `http://localhost:3000/candidate/reset-password?token=${token}`;

    await this.client.sendEmailWithTemplate({
      From: 'foram.s@solutelabs.com',
      To: candidateEmail,
      TemplateId: 39079303,
      TemplateModel: {
        name: candidateName,
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
