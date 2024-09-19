import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from './modules/openAI.module';
import { ProductModule } from './modules/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/task'),
    ScheduleModule.forRoot(),
    ConfigModule,
    ProductModule,
    OpenAiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
