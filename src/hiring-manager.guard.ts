import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EmployeeRole } from './employees/interfaces/employee-role.interface';

@Injectable()
export class HiringManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    if (user.role !== EmployeeRole.HiringManager) {
      throw new ForbiddenException('Access restricted to Hiring Managers only');
    }

    return true;
  }
}
