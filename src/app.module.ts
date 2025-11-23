import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SexxModule } from './sexx/sexx.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SexxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
