import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class OpenAiService {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      model: 'gpt-model',
      apiKey: 'open-api-key',
    });
  }

  async getNewAIDescription({
    productDescription,
    productName,
    category,
  }: {
    productDescription: string;
    productName: string;
    category: string;
  }): Promise<{ success: boolean; description: string }> {
    try {
      const messages = [
        new SystemMessage(`
        You are an expert in medical sales. 
        Your specialty is medical consumables used by hospitals on a daily basis. 
        Your task is to enhance the description of a product based on the information provided.`),
        new HumanMessage(`
        Product name: ${productName}
        Product description: ${productDescription}
        Category: ${category}
        `),
      ];

      const parser = new StringOutputParser();
      const result = await this.model.invoke(messages);
      const description = await parser.invoke(result);

      return { success: true, description };
    } catch (e) {
      console.error(e);
      return Promise.resolve({
        success: false,
        description: productDescription,
      });
    }
  }
}
