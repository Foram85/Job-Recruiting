import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CandidateService } from './candidate/candidate.service';

@Injectable()
export class CandidateGuard implements CanActivate {
  constructor(private candidateService: CandidateService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Candidate is not authenticated');
    }

    try {
      const candidate = await this.candidateService.findOneById(userId);

      if (!candidate) {
        throw new UnauthorizedException(
          'Only candidates can perform this action',
        );
      }

      request.candidate = candidate; // Attach candidate to request
      return true;
    } catch (error) {
      console.error('Error in CandidateGuard:', error);
      throw new UnauthorizedException('Candidate not found or unauthorized');
    }
  }
}
