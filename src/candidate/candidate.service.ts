import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { TokenService } from 'src/token/token.service';
import { TokenType } from 'src/token/token.entity';

export class JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  private async accessToken(
    candidate: Candidate,
  ): Promise<{ accessToken: string; applications: JobApplication[] }> {
    const payload: JwtPayload = { id: candidate.id, email: candidate.email };
    const accessToken = this.jwtService.sign(payload);

    const applications = await this.jobApplicationRepository.find({
      where: [
        { candidate: { id: candidate.id } },
        { candidateEmail: candidate.email },
      ],
      relations: ['position'],
    });

    return { accessToken, applications };
  }

  async setPassword(
    email: string,
    token: string,
    password: string,
  ): Promise<{ accessToken: string; applications: JobApplication[] }> {
    const validToken = await this.tokenService.findValidToken(token);

    if (!validToken) {
      const candidate = await this.candidateRepository.findOne({
        where: { email },
      });
      if (candidate?.password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          candidate.password,
        );
        if (isPasswordValid && candidate.email === email) {
          return this.accessToken(candidate);
        }
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    let candidate = await this.candidateRepository.findOne({
      where: { email: validToken.email },
    });

    if (!candidate) {
      candidate = this.candidateRepository.create({
        email: validToken.email,
        name: validToken.name,
      });
    }

    candidate.password = await bcrypt.hash(password, 10);
    candidate = await this.candidateRepository.save(candidate);

    // Link applications for new candidates
    await this.jobApplicationRepository
      .createQueryBuilder()
      .update(JobApplication)
      .set({ candidate })
      .where('candidateEmail = :email', { email: validToken.email })
      .execute();

    await this.tokenService.deleteToken(validToken.token);

    return this.accessToken(candidate);
  }

  async sendInvitation(email: string, name: string): Promise<void> {
    // Check if there's an active token
    const existingToken = await this.tokenService.findValidToken(email);
    if (existingToken) {
      return; // Don't send another invitation if one is active
    }

    const token = await this.tokenService.generateToken(
      email,
      name,
      TokenType.CANDIDATE,
      null,
      48,
    );

    await this.emailService.sendInvitation(email, name, token.token);
  }

  async forgotPassword(id: string): Promise<void> {
    const candidate = await this.findOneById(id);
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    const token = await this.tokenService.generateToken(
      candidate.email,
      candidate.name,
      TokenType.CANDIDATE,
      candidate,
      48,
    );

    await this.emailService.sendResetPasswordEmail(
      candidate.email,
      candidate.name,
      token.token,
    );
  }

  async save(candidate: Candidate): Promise<Candidate> {
    return this.candidateRepository.save(candidate);
  }

  async findOneById(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('candidate not found');
    }
    return candidate;
  }

  async findByEmail(email: string): Promise<Candidate> {
    const foundUser = await this.candidateRepository.findOne({
      where: { email },
    });
    if (!foundUser) {
      throw new NotFoundException('Unauthorized');
    }
    return foundUser;
  }

  async updateOneById(
    id: string,
    updateDto: UpdateCandidateDto,
  ): Promise<Candidate> {
    const existingCandidate = await this.findOneById(id);
    Object.assign(existingCandidate, updateDto);
    return this.candidateRepository.save(existingCandidate);
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  async deleteById(id: string) {
    this.candidateRepository.delete({ id });
    return 'deleted successfully';
  }
}
