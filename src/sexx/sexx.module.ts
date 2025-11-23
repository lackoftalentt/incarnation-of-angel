import { Module } from '@nestjs/common';
import { SexxService } from './sexx.service';
import { SexxController } from './sexx.controller';

@Module({
  controllers: [SexxController],
  providers: [SexxService],
})
export class SexxModule {}
