import { Module } from '@nestjs/common';
import { JobPositionController } from './job-position.controller';
import { JobPositionService } from './job-position.service';
import { JobPosition } from './entities/job-position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from 'src/department/department.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'Shah$123',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([JobPosition]),
    DepartmentModule,
    EmployeesModule,
    CandidateModule,
  ],
  controllers: [JobPositionController],
  providers: [JobPositionService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JobPositionService],
})
export class JobPositionModule {}
