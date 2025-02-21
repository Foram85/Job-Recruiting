import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DepartmentModule } from 'src/department/department.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { JwtStrategy } from 'src/jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'Shah$123',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Employee]),
    DepartmentModule,
    CandidateModule,
    EmailModule,
    TokenModule,
  ],
  providers: [EmployeesService, JwtStrategy],
  controllers: [EmployeesController],
  exports: [JwtStrategy, PassportModule, EmployeesService],
})
export class EmployeesModule {}
