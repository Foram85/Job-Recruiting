import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EmployeeRole } from 'src/employees/interfaces/employee-role.interface';

@Injectable()
export class employeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (
      user.role !== EmployeeRole.Recruiter &&
      user.role !== EmployeeRole.HiringManager &&
      user.role !== EmployeeRole.Interviewer &&
      user.role !== EmployeeRole.HR &&
      user.role != EmployeeRole.Employee
    ) {
      throw new ForbiddenException('Only Employee can access this service.');
    }
    return true;
  }
}
