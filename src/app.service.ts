import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ProductService } from './services/product.service';
import { OpenAiService } from './services/openAI.service';
import { ProductCsvDto } from './dtos/product.dto';
import csv from 'csv-parser';

@Injectable()
export class AppService {
  private readonly MAX_AI_CALLS = 10;

  constructor(
    private readonly productService: ProductService,
    private readonly openAIService: OpenAiService,
  ) {}

  @Cron('0 15 * * *')
  handleCron() {
    const results: ProductCsvDto[] = [];

    const filePath = join(process.cwd(), 'src/data/images40.txt');
    const readStream = createReadStream(filePath);

    readStream
      .pipe(csv({ separator: '\t' }))
      .on('data', (data: ProductCsvDto) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log(`Attempting to save ${results.length} records`);
        try {
          await this.processData(results);
        } catch (err) {
          console.error('An error occurred:', err);
        }
      })
      .on('error', (err) => {
        console.error('An error occurred while reading the file:', err);
      });
  }

  private async processData(results: ProductCsvDto[]) {
    let count = 0;
    for (const data of results) {
      await this.productService.create(data);
      console.log(`Saved ${data.ProductID}`);

      if (count < this.MAX_AI_CALLS) {
        await this.updateWithAIDescription(data);
      }

      count++;
    }
  }

  private async updateWithAIDescription(data: ProductCsvDto) {
    const { description, success } =
      await this.openAIService.getNewAIDescription({
        productDescription: data.ProductDescription,
        productName: data.ProductName,
        category: data.CategoryName,
      });

    if (success) {
      await this.productService.updateProductDescription({
        productId: data.ProductID,
        description,
      });
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
