import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from '../../model/person.entity';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonEntity]),
    JwtModule.register({
      global: true,
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
