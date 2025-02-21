import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EmployeeRole } from 'src/employees/interfaces/employee-role.interface';

@Injectable()
export class RecruiterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (user.role !== EmployeeRole.Recruiter) {
      throw new ForbiddenException('Only Recruiter can access this service.');
    }
    return true;
  }
}
