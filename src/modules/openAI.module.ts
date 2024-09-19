import { Module } from '@nestjs/common';
import { OpenAiService } from '../services/openAI.service';

@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
