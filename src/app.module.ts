import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from './department/department.module';
import { JobPositionModule } from './job-position/job-position.module';
import { CandidateModule } from './candidate/candidate.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { InterviewModule } from './interview/interview.module';
import { ReviewModule } from './review/review.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    EmployeesModule,
    DepartmentModule,
    JobPositionModule,
    CandidateModule,
    JobApplicationModule,
    InterviewModule,
    ReviewModule,
  ],
})
export class AppModule {}
