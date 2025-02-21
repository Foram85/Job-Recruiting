import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EmployeesService } from 'src/employees/employees.service';
import { CandidateService } from 'src/candidate/candidate.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly candidateService: CandidateService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Shah$123',
    });
  }
  async validate(payload: JwtPayload): Promise<Employee | Candidate> {
    const { email } = payload;
    let user: Employee | Candidate =
      await this.employeeService.findByEmail(email);
    if (!user) {
      user = await this.candidateService.findByEmail(email);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
